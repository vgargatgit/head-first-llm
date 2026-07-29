#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BOOK_DATA_PATH = path.join(ROOT, 'site/book-data.js');
const LEDGER_PATH = path.join(ROOT, 'docs/running-example-ledger.md');

function fail(message) {
  throw new Error(message);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function shapeEquals(left, right) {
  return Array.isArray(left)
    && Array.isArray(right)
    && left.length === right.length
    && left.every((value, index) => value === right[index]);
}

function slugifyHeading(value) {
  return `#${value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function evaluateBookData(source) {
  const runtimeErrors = [];
  const sandbox = {
    window: {},
    console: {
      log: () => {},
      warn: () => {},
      error: (...values) => runtimeErrors.push(values.map(String).join(' '))
    }
  };

  vm.createContext(sandbox);
  new vm.Script(source, { filename: BOOK_DATA_PATH }).runInContext(sandbox, { timeout: 2_000 });
  const data = sandbox.window.BOOK_DATA;
  if (!data || data.valid !== true) {
    fail(`site/book-data.js did not expose valid BOOK_DATA: ${runtimeErrors.join('; ') || data?.errors?.join('; ') || 'unknown error'}`);
  }
  return data;
}

function extractLedger(markdown) {
  const match = markdown.match(
    /<!-- running-example-data:start -->\s*```json\s*([\s\S]*?)\s*```\s*<!-- running-example-data:end -->/
  );
  if (!match) fail('Could not find the canonical running-example JSON block.');
  return JSON.parse(match[1]);
}

function verifyItem(item, chapterNumber, listName, index, ledger) {
  const location = `Chapter ${chapterNumber} ${listName}[${index}]`;
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    fail(`${location} must be an object.`);
  }
  if (!isNonEmptyString(item.id) || !isNonEmptyString(item.label)) {
    fail(`${location} must define id and label.`);
  }
  if (!item.ledgerKey) return;

  const ledgerObject = ledger.objects[item.ledgerKey];
  if (!ledgerObject) fail(`${location} references unknown ledger key ${item.ledgerKey}.`);
  if (!shapeEquals(item.shape, ledgerObject.shape)) {
    fail(
      `${location} shape ${JSON.stringify(item.shape)} does not match `
      + `ledger ${item.ledgerKey} shape ${JSON.stringify(ledgerObject.shape)}.`
    );
  }
}

async function main() {
  const [bookSource, ledgerMarkdown] = await Promise.all([
    readFile(BOOK_DATA_PATH, 'utf8'),
    readFile(LEDGER_PATH, 'utf8')
  ]);
  const bookData = evaluateBookData(bookSource);
  const ledger = extractLedger(ledgerMarkdown);

  if (typeof bookData.getWorkbookStage !== 'function') {
    fail('BOOK_DATA.getWorkbookStage must be a function.');
  }

  const stageNumbers = new Set();
  for (const chapter of bookData.chapters) {
    const stage = chapter.stage;
    if (chapter.number <= 11) {
      if (!stage) fail(`Chapter ${chapter.number} is missing workbook stage metadata.`);
      if (stage.number !== chapter.number) {
        fail(`Chapter ${chapter.number} declares workbook stage ${stage.number}; expected ${chapter.number}.`);
      }
      if (stageNumbers.has(stage.number)) fail(`Duplicate workbook stage number ${stage.number}.`);
      stageNumbers.add(stage.number);

      for (const field of ['name', 'operation', 'checkpoint', 'nextQuestion', 'detailHeading', 'detailAnchor']) {
        if (!isNonEmptyString(stage[field])) fail(`Chapter ${chapter.number} stage is missing ${field}.`);
      }
      if (!Array.isArray(stage.available) || !Array.isArray(stage.creates) || stage.creates.length === 0) {
        fail(`Chapter ${chapter.number} stage must define available and at least one creates item.`);
      }

      const ids = new Set();
      for (const [listName, items] of [['available', stage.available], ['creates', stage.creates]]) {
        items.forEach((item, index) => {
          verifyItem(item, chapter.number, listName, index, ledger);
          if (ids.has(item.id)) fail(`Chapter ${chapter.number} repeats workbook item id ${item.id}.`);
          ids.add(item.id);
        });
      }

      const expectedAnchor = slugifyHeading(stage.detailHeading);
      if (stage.detailAnchor !== expectedAnchor) {
        fail(`Chapter ${chapter.number} detailAnchor ${stage.detailAnchor} does not match ${expectedAnchor}.`);
      }
      const chapterMarkdown = await readFile(path.join(ROOT, chapter.source), 'utf8');
      const headingPattern = new RegExp(
        `^#{1,6}\\s+${escapeRegExp(stage.detailHeading)}\\s*$`,
        'm'
      );
      if (!headingPattern.test(chapterMarkdown)) {
        fail(`Chapter ${chapter.number} source is missing heading: ${stage.detailHeading}.`);
      }
      if (bookData.getWorkbookStage(chapter.number) !== stage) {
        fail(`getWorkbookStage(${chapter.number}) did not return the chapter stage.`);
      }
    } else {
      if (stage !== null) {
        fail(`Chapter ${chapter.number} must keep stage: null until later workbook metadata is designed.`);
      }
      if (bookData.getWorkbookStage(chapter.number) !== null) {
        fail(`getWorkbookStage(${chapter.number}) must return null when metadata is absent.`);
      }
    }
  }

  for (let number = 1; number <= 11; number += 1) {
    if (!stageNumbers.has(number)) fail(`Missing workbook stage number ${number}.`);
  }
  if (bookData.getWorkbookStage(0) !== null || bookData.getWorkbookStage(999) !== null) {
    fail('getWorkbookStage must fail gracefully for unknown chapters.');
  }

  console.log(
    `Workbook metadata check passed: 11 complete stages, ${Object.keys(ledger.objects).length} ledger objects, `
    + 'valid shapes, headings, anchors, and graceful null metadata.'
  );
}

main().catch(error => {
  console.error(`Workbook metadata check failed:\n${error.message}`);
  process.exit(1);
});
