#!/usr/bin/env node

import { access, readFile } from 'node:fs/promises';
import { constants as fsConstants } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

function parseArguments(argv) {
  const options = {
    root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
    bookData: 'site/book-data.js',
    metadataOnly: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--root') {
      const value = argv[index + 1];
      if (!value) throw new Error('--root requires a directory path.');
      options.root = path.resolve(value);
      index += 1;
    } else if (argument === '--book-data') {
      const value = argv[index + 1];
      if (!value) throw new Error('--book-data requires a file path.');
      options.bookData = value;
      index += 1;
    } else if (argument === '--metadata-only') {
      options.metadataOnly = true;
    } else if (argument === '--help' || argument === '-h') {
      console.log(`Usage: node scripts/check-book-consistency.mjs [options]\n\nOptions:\n  --root <directory>       Repository root (defaults to the parent of scripts/)\n  --book-data <path>       Metadata file relative to the root (default: site/book-data.js)\n  --metadata-only          Skip HTML, JavaScript and responsive-CSS integration checks\n  -h, --help               Show this help`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function addError(errors, message) {
  if (!errors.includes(message)) errors.push(message);
}

function evaluateBookData(source, filename, errors) {
  const runtimeErrors = [];
  const sandbox = {
    window: {},
    console: {
      log: () => {},
      warn: () => {},
      error: (...values) => runtimeErrors.push(values.map(String).join(' '))
    }
  };

  try {
    vm.createContext(sandbox);
    const script = new vm.Script(source, { filename });
    script.runInContext(sandbox, { timeout: 2_000 });
  } catch (error) {
    addError(errors, `Could not evaluate ${filename}: ${error.message}`);
    return null;
  }

  const bookData = sandbox.window.BOOK_DATA;
  if (!bookData || typeof bookData !== 'object') {
    addError(errors, `${filename} did not expose window.BOOK_DATA.`);
    return null;
  }

  if (bookData.valid !== true) {
    const reported = Array.isArray(bookData.errors) ? [...bookData.errors] : [];
    if (reported.length) {
      reported.forEach(message => addError(errors, `Metadata validation: ${message}`));
    } else {
      addError(errors, `${filename} reported invalid metadata without an explanatory error.`);
    }
  }

  if (runtimeErrors.length && bookData.valid === true) {
    runtimeErrors.forEach(message => addError(errors, `Metadata runtime error: ${message}`));
  }

  return bookData;
}

function validatePartsAndChapters(bookData, errors) {
  const parts = Array.isArray(bookData?.parts) ? [...bookData.parts] : [];
  const chapters = Array.isArray(bookData?.chapters) ? [...bookData.chapters] : [];

  if (!parts.length) addError(errors, 'BOOK_DATA.parts must contain at least one part.');
  if (!chapters.length) addError(errors, 'BOOK_DATA.chapters must contain at least one chapter.');
  if (!parts.length || !chapters.length) return { parts, chapters };

  const partIds = new Set();
  const partNumbers = new Set();
  const chapterNumbers = new Set();
  const sourcePaths = new Set();
  const membershipCounts = new Map();
  const partById = new Map();

  parts.forEach((part, index) => {
    const location = `Part at index ${index}`;
    if (!part || typeof part !== 'object') {
      addError(errors, `${location} must be an object.`);
      return;
    }

    if (!isNonEmptyString(part.id)) addError(errors, `${location} is missing a non-empty id.`);
    if (partIds.has(part.id)) addError(errors, `Duplicate part id: ${part.id}.`);
    partIds.add(part.id);
    partById.set(part.id, part);

    if (!Number.isInteger(part.number) || part.number < 1) addError(errors, `${location} has an invalid part number.`);
    if (part.number !== index + 1) addError(errors, `${location} is out of order; expected part number ${index + 1} but found ${part.number}.`);
    if (partNumbers.has(part.number)) addError(errors, `Duplicate part number: ${part.number}.`);
    partNumbers.add(part.number);

    for (const field of ['numeral', 'title', 'summary', 'learningOutcome']) {
      if (!isNonEmptyString(part[field])) addError(errors, `${location} is missing ${field}.`);
    }

    if (!Array.isArray(part.chapterNumbers) || part.chapterNumbers.length === 0) {
      addError(errors, `${location} must define a non-empty chapterNumbers array.`);
      return;
    }

    const seenInPart = new Set();
    part.chapterNumbers.forEach((number, chapterIndex) => {
      if (!Number.isInteger(number) || number < 1) {
        addError(errors, `${location} contains an invalid chapter number: ${number}.`);
        return;
      }
      if (seenInPart.has(number)) addError(errors, `${location} lists Chapter ${number} more than once.`);
      seenInPart.add(number);
      membershipCounts.set(number, (membershipCounts.get(number) || 0) + 1);

      if (chapterIndex > 0 && number !== part.chapterNumbers[chapterIndex - 1] + 1) {
        addError(errors, `${location} does not define a contiguous chapter range near Chapter ${number}.`);
      }
    });
  });

  chapters.forEach((chapter, index) => {
    const location = `Chapter entry at index ${index}`;
    if (!chapter || typeof chapter !== 'object') {
      addError(errors, `${location} must be an object.`);
      return;
    }

    if (!Number.isInteger(chapter.number) || chapter.number < 1) {
      addError(errors, `${location} has an invalid chapter number.`);
    } else if (chapter.number !== index + 1) {
      addError(errors, `${location} is out of order; expected Chapter ${index + 1} but found Chapter ${chapter.number}.`);
    }

    if (Number.isInteger(chapter.number)) {
      if (chapterNumbers.has(chapter.number)) addError(errors, `Duplicate chapter number: ${chapter.number}.`);
      else chapterNumbers.add(chapter.number);
    }

    if (!isNonEmptyString(chapter.title)) addError(errors, `${location} is missing title.`);
    if (!isNonEmptyString(chapter.summary)) addError(errors, `${location} is missing summary.`);
    if (!isNonEmptyString(chapter.source)) {
      addError(errors, `${location} is missing source.`);
    } else if (sourcePaths.has(chapter.source)) {
      addError(errors, `Duplicate chapter source path: ${chapter.source}.`);
    } else {
      sourcePaths.add(chapter.source);
    }

    if (!isNonEmptyString(chapter.partId) || !partById.has(chapter.partId)) {
      addError(errors, `Chapter ${chapter.number ?? index + 1} references unknown part ${String(chapter.partId)}.`);
    }
    if (!Number.isInteger(chapter.partPosition) || chapter.partPosition < 1) {
      addError(errors, `Chapter ${chapter.number ?? index + 1} has an invalid partPosition.`);
    }
  });

  const sortedChapterNumbers = [...chapterNumbers].sort((left, right) => left - right);
  for (let expected = 1; expected <= chapters.length; expected += 1) {
    if (!chapterNumbers.has(expected)) addError(errors, `Missing Chapter ${expected}; chapter numbers must be contiguous from 1.`);
  }
  sortedChapterNumbers
    .filter(number => number > chapters.length)
    .forEach(number => addError(errors, `Unexpected Chapter ${number}; the chapter catalogue contains ${chapters.length} entries.`));

  const sortedParts = [...parts].sort((left, right) => left.number - right.number);
  sortedParts.forEach((part, index) => {
    if (part.number !== index + 1) {
      addError(errors, `Part numbers must be contiguous from 1; expected ${index + 1} but found ${part.number}.`);
    }

    if (!Array.isArray(part.chapterNumbers) || !part.chapterNumbers.length) return;
    const first = part.chapterNumbers[0];
    const last = part.chapterNumbers[part.chapterNumbers.length - 1];

    if (index === 0 && first !== 1) addError(errors, `The first part must begin with Chapter 1, not Chapter ${first}.`);
    if (index > 0) {
      const previous = sortedParts[index - 1];
      const previousLast = previous.chapterNumbers?.[previous.chapterNumbers.length - 1];
      if (Number.isInteger(previousLast) && first !== previousLast + 1) {
        addError(errors, `Part ${part.number} must begin after Chapter ${previousLast}; found Chapter ${first}.`);
      }
    }
    if (index === sortedParts.length - 1 && last !== chapters.length) {
      addError(errors, `The final part must end with Chapter ${chapters.length}, not Chapter ${last}.`);
    }

    part.chapterNumbers.forEach((number, partIndex) => {
      const chapter = chapters.find(item => item.number === number);
      if (!chapter) {
        addError(errors, `Part ${part.number} references missing Chapter ${number}.`);
        return;
      }
      if (chapter.partId !== part.id) {
        addError(errors, `Chapter ${number} is listed in ${part.id} but declares partId ${chapter.partId}.`);
      }
      if (chapter.partPosition !== partIndex + 1) {
        addError(errors, `Chapter ${number} has partPosition ${chapter.partPosition}; expected ${partIndex + 1}.`);
      }
    });
  });

  sortedChapterNumbers.forEach(number => {
    const count = membershipCounts.get(number) || 0;
    if (count !== 1) addError(errors, `Chapter ${number} must belong to exactly one part; found ${count} memberships.`);
  });

  return { parts, chapters };
}

function validateLookupHelpers(bookData, parts, chapters, errors) {
  const requiredHelpers = [
    'getChapter',
    'getPart',
    'getPartForChapter',
    'getPartChapters',
    'getPreviousChapter',
    'getNextChapter'
  ];

  requiredHelpers.forEach(name => {
    if (typeof bookData?.[name] !== 'function') addError(errors, `BOOK_DATA.${name} must be a function.`);
  });
  if (requiredHelpers.some(name => typeof bookData?.[name] !== 'function')) return;

  const sortedChapters = [...chapters].sort((left, right) => left.number - right.number);
  const sortedParts = [...parts].sort((left, right) => left.number - right.number);

  sortedParts.forEach(part => {
    const returnedPart = bookData.getPart(part.id);
    if (!returnedPart || returnedPart.id !== part.id) addError(errors, `getPart(${part.id}) did not return the expected part.`);

    const expectedNumbers = part.chapterNumbers.join(',');
    const returnedNumbers = [...bookData.getPartChapters(part.id)].map(chapter => chapter?.number).join(',');
    if (returnedNumbers !== expectedNumbers) {
      addError(errors, `getPartChapters(${part.id}) returned [${returnedNumbers}] instead of [${expectedNumbers}].`);
    }
  });

  sortedChapters.forEach((chapter, index) => {
    const returnedChapter = bookData.getChapter(chapter.number);
    if (!returnedChapter || returnedChapter.number !== chapter.number) {
      addError(errors, `getChapter(${chapter.number}) did not return the expected chapter.`);
    }

    const returnedPart = bookData.getPartForChapter(chapter.number);
    if (!returnedPart || returnedPart.id !== chapter.partId) {
      addError(errors, `getPartForChapter(${chapter.number}) did not return ${chapter.partId}.`);
    }

    const expectedPrevious = index === 0 ? null : sortedChapters[index - 1].number;
    const expectedNext = index === sortedChapters.length - 1 ? null : sortedChapters[index + 1].number;
    const actualPrevious = bookData.getPreviousChapter(chapter.number)?.number ?? null;
    const actualNext = bookData.getNextChapter(chapter.number)?.number ?? null;

    if (actualPrevious !== expectedPrevious) {
      addError(errors, `Chapter ${chapter.number} previous lookup returned ${actualPrevious}; expected ${expectedPrevious}.`);
    }
    if (actualNext !== expectedNext) {
      addError(errors, `Chapter ${chapter.number} next lookup returned ${actualNext}; expected ${expectedNext}.`);
    }
  });
}

async function validateSourceFiles(root, chapters, errors) {
  for (const chapter of chapters) {
    if (!isNonEmptyString(chapter?.source)) continue;
    const resolved = path.resolve(root, chapter.source);
    const relative = path.relative(root, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      addError(errors, `Chapter ${chapter.number} source escapes the repository root: ${chapter.source}.`);
      continue;
    }
    try {
      await access(resolved, fsConstants.R_OK);
    } catch {
      addError(errors, `Chapter ${chapter.number} source does not exist or is unreadable: ${chapter.source}.`);
    }
  }
}

function expectPattern(content, pattern, message, errors) {
  if (!pattern.test(content)) addError(errors, message);
}

async function validateSiteIntegration(root, errors) {
  const paths = {
    chapterHtml: path.join(root, 'site/chapter.html'),
    progressJs: path.join(root, 'site/chapter-progress.js'),
    progressCss: path.join(root, 'site/chapter-progress.css'),
    indexHtml: path.join(root, 'site/index.html')
  };

  let chapterHtml;
  let progressJs;
  let progressCss;
  let indexHtml;
  try {
    [chapterHtml, progressJs, progressCss, indexHtml] = await Promise.all([
      readFile(paths.chapterHtml, 'utf8'),
      readFile(paths.progressJs, 'utf8'),
      readFile(paths.progressCss, 'utf8'),
      readFile(paths.indexHtml, 'utf8')
    ]);
  } catch (error) {
    addError(errors, `Could not read part-navigation integration files: ${error.message}`);
    return;
  }

  expectPattern(chapterHtml, /id=["']part-progress["']/, 'site/chapter.html must contain the #part-progress navigation container.', errors);
  expectPattern(chapterHtml, /chapter-progress\.css/, 'site/chapter.html must load chapter-progress.css.', errors);
  expectPattern(chapterHtml, /chapter-progress\.js/, 'site/chapter.html must load chapter-progress.js.', errors);
  expectPattern(indexHtml, /id=["']book-parts["']/, 'site/index.html must expose the #book-parts destination used by reader navigation.', errors);

  const metadataIndex = chapterHtml.indexOf('book-data.js');
  const rendererIndex = chapterHtml.indexOf('app.js');
  const progressIndex = chapterHtml.indexOf('chapter-progress.js');
  if (metadataIndex < 0 || rendererIndex < 0 || progressIndex < 0 || !(metadataIndex < rendererIndex && rendererIndex < progressIndex)) {
    addError(errors, 'site/chapter.html must load book-data.js before app.js and chapter-progress.js after app.js.');
  }

  for (const token of ['getPartForChapter', 'getPartChapters', 'getPreviousChapter', 'getNextChapter', 'aria-current', 'part-progress-desktop', 'part-progress-mobile']) {
    if (!progressJs.includes(token)) addError(errors, `site/chapter-progress.js is missing required navigation behaviour: ${token}.`);
  }

  expectPattern(progressCss, /\.part-chapter-progress\s*\{[\s\S]*?overflow-x:\s*auto\s*;/, 'Desktop part navigation must remain horizontally reachable with overflow-x: auto.', errors);
  expectPattern(
    progressCss,
    /@media\s*\(max-width:\s*\d+px\)\s*\{[\s\S]*?\.part-progress-desktop\s*\{[^}]*display:\s*none\s*;[^}]*\}[\s\S]*?\.part-progress-mobile\s*\{[^}]*display:\s*block\s*;[^}]*\}/,
    'Responsive CSS must replace desktop progress with mobile progress inside a max-width media query.',
    errors
  );
}

async function main() {
  let options;
  try {
    options = parseArguments(process.argv.slice(2));
  } catch (error) {
    console.error(`Book consistency check could not start: ${error.message}`);
    process.exitCode = 2;
    return;
  }

  const errors = [];
  const metadataPath = path.resolve(options.root, options.bookData);
  let source;
  try {
    source = await readFile(metadataPath, 'utf8');
  } catch (error) {
    console.error(`Book consistency check failed: could not read ${metadataPath}: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const bookData = evaluateBookData(source, metadataPath, errors);
  const { parts, chapters } = validatePartsAndChapters(bookData, errors);
  if (bookData) validateLookupHelpers(bookData, parts, chapters, errors);
  await validateSourceFiles(options.root, chapters, errors);
  if (!options.metadataOnly) await validateSiteIntegration(options.root, errors);

  if (errors.length) {
    console.error(`Book consistency check failed with ${errors.length} error${errors.length === 1 ? '' : 's'}:`);
    errors.forEach((message, index) => console.error(`  ${index + 1}. ${message}`));
    process.exitCode = 1;
    return;
  }

  console.log(`Book consistency check passed: ${parts.length} parts, ${chapters.length} contiguous chapters, unique sources, valid lookups, and ${options.metadataOnly ? 'metadata-only checks' : 'responsive navigation integration'}.`);
}

await main();
