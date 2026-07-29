#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const LEDGER_PATH = path.join(ROOT, 'docs/running-example-ledger.md');
const SKIP_CHAPTER_TRACE = process.argv.includes('--skip-chapter-trace');

function fail(message) {
  throw new Error(message);
}

function extractDataset(markdown) {
  const match = markdown.match(
    /<!-- running-example-data:start -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- running-example-data:end -->/
  );
  if (!match) fail('Could not find the canonical running-example JSON block.');
  return JSON.parse(match[1]);
}

function normaliseValue(value) {
  if (value === '-Infinity') return Number.NEGATIVE_INFINITY;
  return value;
}

function matrix(name, data) {
  const object = data.objects[name];
  if (!object) fail(`Ledger object ${name} is missing.`);
  return object.value.map((row) => row.map(normaliseValue));
}

function shapeOf(value) {
  if (!Array.isArray(value)) return [];
  if (value.length === 0) return [0, 0];
  if (!value.every(Array.isArray)) return [1, value.length];
  const width = value[0].length;
  if (!value.every((row) => row.length === width)) {
    fail('Found a ragged matrix in the canonical dataset.');
  }
  return [value.length, width];
}

function transpose(a) {
  return a[0].map((_, column) => a.map((row) => row[column]));
}

function matmul(a, b) {
  const aShape = shapeOf(a);
  const bShape = shapeOf(b);
  if (aShape[1] !== bShape[0]) {
    fail(`Cannot multiply ${aShape.join('x')} by ${bShape.join('x')}.`);
  }
  const bt = transpose(b);
  return a.map((row) =>
    bt.map((column) => row.reduce((sum, value, index) => sum + value * column[index], 0))
  );
}

function add(a, b) {
  const aShape = shapeOf(a);
  const bShape = shapeOf(b);

  if (bShape[0] === 1 && aShape[1] === bShape[1]) {
    return a.map((row) => row.map((value, index) => value + b[0][index]));
  }
  if (aShape[0] !== bShape[0] || aShape[1] !== bShape[1]) {
    fail(`Shape mismatch in addition: ${aShape} versus ${bShape}.`);
  }
  return a.map((row, i) => row.map((value, j) => value + b[i][j]));
}

function scale(a, scalar) {
  return a.map((row) => row.map((value) => value / scalar));
}

function concatColumns(a, b) {
  if (a.length !== b.length) fail('Cannot concatenate matrices with different row counts.');
  return a.map((row, index) => [...row, ...b[index]]);
}

function causalMask(size) {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) =>
      column <= row ? 0 : Number.NEGATIVE_INFINITY
    )
  );
}

function softmaxRows(logits) {
  return logits.map((row) => {
    const finite = row.filter(Number.isFinite);
    const max = Math.max(...finite);
    const exponentials = row.map((value) =>
      Number.isFinite(value) ? Math.exp(value - max) : 0
    );
    const total = exponentials.reduce((sum, value) => sum + value, 0);
    return exponentials.map((value) => value / total);
  });
}

function relu(a) {
  return a.map((row) => row.map((value) => Math.max(0, value)));
}

function layerNormRows(a, epsilon) {
  return a.map((row) => {
    const mean = row.reduce((sum, value) => sum + value, 0) / row.length;
    const variance =
      row.reduce((sum, value) => sum + (value - mean) ** 2, 0) / row.length;
    const denominator = Math.sqrt(variance + epsilon);
    return row.map((value) => (value - mean) / denominator);
  });
}

function maxAbsDifference(actual, expected) {
  const actualShape = shapeOf(actual);
  const expectedShape = shapeOf(expected);
  if (
    actualShape[0] !== expectedShape[0] ||
    actualShape[1] !== expectedShape[1]
  ) {
    return Number.POSITIVE_INFINITY;
  }

  let maximum = 0;
  for (let row = 0; row < actual.length; row += 1) {
    for (let column = 0; column < actual[row].length; column += 1) {
      const left = actual[row][column];
      const right = expected[row][column];
      if (!Number.isFinite(left) || !Number.isFinite(right)) {
        if (left !== right) return Number.POSITIVE_INFINITY;
        continue;
      }
      maximum = Math.max(maximum, Math.abs(left - right));
    }
  }
  return maximum;
}

function assertClose(name, actual, data) {
  const expected = matrix(name, data);
  const tolerance = data.precision.verificationAbsoluteTolerance;
  const difference = maxAbsDifference(actual, expected);
  if (!(difference <= tolerance)) {
    fail(
      `${name} differs from the canonical ledger by ${difference}; tolerance is ${tolerance}.`
    );
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sectionForHeading(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const headingPattern = /^(#{1,6})\s+(.+?)\s*$/;
  let start = -1;
  let level = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(headingPattern);
    if (match && match[2] === heading) {
      start = index;
      level = match[1].length;
      break;
    }
  }

  if (start < 0) fail(`Could not find section heading "${heading}".`);

  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    const match = lines[index].match(headingPattern);
    if (match && match[1].length <= level) {
      end = index;
      break;
    }
  }
  return lines.slice(start, end).join('\n');
}

function numericTokens(text) {
  const matches = text.match(/[-+]?(?:\d+\.\d+|\d+)(?:[eE][-+]?\d+)?/g) ?? [];
  return matches.map(Number);
}

function verifyChapterTrace(data) {
  const chapterCache = new Map();
  const traceTolerance = 5e-7;

  for (const [name, object] of Object.entries(data.objects)) {
    const chapterPath = path.join(
      ROOT,
      'src',
      `chapter-${String(object.ownerChapter).padStart(2, '0')}.md`
    );
    if (!chapterCache.has(chapterPath)) {
      if (!fs.existsSync(chapterPath)) fail(`Missing owning chapter: ${chapterPath}.`);
      chapterCache.set(chapterPath, fs.readFileSync(chapterPath, 'utf8'));
    }

    const section = sectionForHeading(chapterCache.get(chapterPath), object.sourceHeading);
    const availableNumbers = numericTokens(section);
    const expectedValues = object.value
      .flat()
      .map(normaliseValue)
      .filter(Number.isFinite)
      .filter((value) => Math.abs(value) > 1e-12);

    const uniqueExpected = [...new Set(expectedValues)];
    for (const expected of uniqueExpected) {
      const found = availableNumbers.some(
        (actual) => Math.abs(actual - expected) <= traceTolerance
      );
      if (!found) {
        fail(
          `${name}: canonical value ${expected} is not present in Chapter ${object.ownerChapter}, section "${object.sourceHeading}".`
        );
      }
    }

    if (object.value.flat().includes('-Infinity') && !section.includes('\\infty')) {
      fail(
        `${name}: Chapter ${object.ownerChapter}, section "${object.sourceHeading}" does not contain the masked -Infinity notation.`
      );
    }
  }
}

function verifyDeclaredShapes(data) {
  for (const [name, object] of Object.entries(data.objects)) {
    const actualShape = shapeOf(object.value);
    if (
      actualShape[0] !== object.shape[0] ||
      actualShape[1] !== object.shape[1]
    ) {
      fail(
        `${name}: declared shape ${object.shape.join('x')} does not match stored value ${actualShape.join('x')}.`
      );
    }
    if (!Number.isInteger(object.ownerChapter) || object.ownerChapter < 1 || object.ownerChapter > 11) {
      fail(`${name}: ownerChapter must be an integer from 1 to 11.`);
    }
    if (!object.sourceHeading || !object.role) {
      fail(`${name}: sourceHeading and role are required.`);
    }
  }
}

function verifyCalculations(data) {
  const epsilon = data.configuration.epsilon;
  const sqrtDK = Math.sqrt(data.configuration.dK);

  const X = matrix('X', data);

  const Q1 = matmul(X, matrix('WQ1', data));
  const K1 = matmul(X, matrix('WK1', data));
  const V1 = matmul(X, matrix('WV1', data));
  assertClose('Q1', Q1, data);
  assertClose('K1', K1, data);
  assertClose('V1', V1, data);

  const S1 = matmul(Q1, transpose(K1));
  const scaledS1 = scale(S1, sqrtDK);
  const M = causalMask(data.configuration.n);
  const L1 = add(scaledS1, M);
  const A1 = softmaxRows(L1);
  const Z1 = matmul(A1, V1);
  assertClose('S1', S1, data);
  assertClose('scaledS1', scaledS1, data);
  assertClose('M', M, data);
  assertClose('L1', L1, data);
  assertClose('A1', A1, data);
  assertClose('Z1', Z1, data);

  const Q2 = matmul(X, matrix('WQ2', data));
  const K2 = matmul(X, matrix('WK2', data));
  const V2 = matmul(X, matrix('WV2', data));
  const S2 = matmul(Q2, transpose(K2));
  const scaledS2 = scale(S2, sqrtDK);
  const L2 = add(scaledS2, M);
  const A2 = softmaxRows(L2);
  const Z2 = matmul(A2, V2);
  assertClose('Q2', Q2, data);
  assertClose('K2', K2, data);
  assertClose('V2', V2, data);
  assertClose('S2', S2, data);
  assertClose('scaledS2', scaledS2, data);
  assertClose('L2', L2, data);
  assertClose('A2', A2, data);
  assertClose('Z2', Z2, data);

  // Editorial handoff: Chapter 7 starts from the displayed head outputs.
  const H = concatColumns(matrix('Z1', data), matrix('Z2', data));
  const Y = matmul(H, matrix('WO', data));
  const R1 = add(X, matrix('Y', data));
  const N = layerNormRows(matrix('R1', data), epsilon);
  assertClose('H', H, data);
  assertClose('Y', Y, data);
  assertClose('R1', R1, data);
  assertClose('N', N, data);

  // Editorial handoff: Chapter 8 starts from the displayed N.
  const Pmlp = add(matmul(matrix('N', data), matrix('W1', data)), matrix('b1', data));
  const U = relu(Pmlp);
  const F = add(matmul(U, matrix('W2', data)), matrix('b2', data));
  const R2 = add(matrix('N', data), matrix('F', data));
  const O = layerNormRows(matrix('R2', data), epsilon);
  assertClose('Pmlp', Pmlp, data);
  assertClose('U', U, data);
  assertClose('F', F, data);
  assertClose('R2', R2, data);
  assertClose('O', O, data);

  // Chapter 9 additive architecture illustration.
  assertClose('X', add(matrix('Epos', data), matrix('Ppos', data)), data);

  // Chapter 10 illustrative continuation starts from the displayed SAT row of O.
  const xSat1 = [matrix('O', data)[2]];
  const rSat2 = add(xSat1, matrix('deltaAttn2', data));
  const xSat2 = add(rSat2, matrix('deltaMlp2', data));
  const rSat3 = add(xSat2, matrix('deltaAttn3', data));
  const xSat3 = add(rSat3, matrix('deltaMlp3', data));
  const hFinalSat = layerNormRows(xSat3, epsilon);
  assertClose('rSat2', rSat2, data);
  assertClose('xSat2', xSat2, data);
  assertClose('rSat3', rSat3, data);
  assertClose('xSat3', xSat3, data);
  assertClose('hFinalSat', hFinalSat, data);

  // Chapter 11 vocabulary projection and probability distribution.
  const logitsSat = add(
    matmul(matrix('hFinalSat', data), matrix('Wvocab', data)),
    matrix('bvocab', data)
  );
  const probabilitiesSat = softmaxRows(logitsSat);
  assertClose('logitsSat', logitsSat, data);
  assertClose('probabilitiesSat', probabilitiesSat, data);

  const probabilitySum = matrix('probabilitiesSat', data)[0].reduce(
    (sum, value) => sum + value,
    0
  );
  if (Math.abs(probabilitySum - 1) > 1e-6) {
    fail(`Canonical vocabulary probabilities sum to ${probabilitySum}, not 1.`);
  }
}

try {
  const markdown = fs.readFileSync(LEDGER_PATH, 'utf8');
  const data = extractDataset(markdown);

  if (data.schemaVersion !== 1) fail(`Unsupported ledger schema version: ${data.schemaVersion}.`);
  if (data.sequence.join(' ') !== 'THE CAT SAT') fail('Canonical sequence must be THE CAT SAT.');

  verifyDeclaredShapes(data);
  verifyCalculations(data);
  if (!SKIP_CHAPTER_TRACE) verifyChapterTrace(data);

  console.log(
    `Running example verified: ${Object.keys(data.objects).length} objects, ` +
      `${data.sequence.length} tokens, tolerance ${data.precision.verificationAbsoluteTolerance}.`
  );
} catch (error) {
  console.error(`Running-example verification failed:\n${error.message}`);
  process.exit(1);
}
