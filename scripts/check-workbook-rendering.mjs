#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EDITION_VERSION = '20260730.3';

function fail(message) {
  throw new Error(message);
}

function expect(content, pattern, message) {
  if (!pattern.test(content)) fail(message);
}

function evaluateModel(bookSource, cardSource) {
  const runtimeErrors = [];
  const sandbox = {
    window: {},
    document: { getElementById: () => null },
    console: {
      log: () => {},
      warn: () => {},
      error: (...values) => runtimeErrors.push(values.map(String).join(' '))
    },
    URLSearchParams
  };

  vm.createContext(sandbox);
  new vm.Script(bookSource, { filename: 'site/book-data.js' }).runInContext(sandbox, { timeout: 2_000 });
  new vm.Script(cardSource, { filename: 'site/workbook-card.js' }).runInContext(sandbox, { timeout: 2_000 });

  if (sandbox.window.BOOK_DATA?.valid !== true) {
    fail(`BOOK_DATA is invalid: ${runtimeErrors.join('; ') || sandbox.window.BOOK_DATA?.errors?.join('; ') || 'unknown error'}`);
  }
  if (typeof sandbox.window.WORKBOOK_CARD?.buildModel !== 'function') {
    fail('site/workbook-card.js must expose WORKBOOK_CARD.buildModel for integration checks.');
  }
  if (typeof sandbox.window.WORKBOOK_CARD?.inject !== 'function') {
    fail('site/workbook-card.js must expose WORKBOOK_CARD.inject for deterministic reader integration.');
  }

  return {
    bookData: sandbox.window.BOOK_DATA,
    buildModel: sandbox.window.WORKBOOK_CARD.buildModel
  };
}

function validateModels(bookData, buildModel) {
  for (let chapterNumber = 1; chapterNumber <= 11; chapterNumber += 1) {
    const model = buildModel(bookData, chapterNumber);
    if (!model) fail(`Chapter ${chapterNumber} did not produce a workbook card model.`);
    if (model.chapterNumber !== chapterNumber) fail(`Chapter ${chapterNumber} model has the wrong chapter number.`);
    if (model.stageNumber !== chapterNumber) fail(`Chapter ${chapterNumber} model has stage ${model.stageNumber}.`);
    if (model.totalStages !== 11) fail(`Chapter ${chapterNumber} model must report 11 total stages.`);
    if (!model.stageName || !model.operation || !model.checkpoint || !model.nextQuestion) {
      fail(`Chapter ${chapterNumber} model is missing reader-facing copy.`);
    }
    if (!Array.isArray(model.available) || !Array.isArray(model.creates) || model.creates.length === 0) {
      fail(`Chapter ${chapterNumber} model must expose available and created objects.`);
    }
    if (!model.detailHref?.startsWith('#')) fail(`Chapter ${chapterNumber} detail link must be an in-page anchor.`);
    if (!Array.isArray(model.progress) || model.progress.length !== 11) {
      fail(`Chapter ${chapterNumber} progress must contain all 11 inference stages.`);
    }

    for (const item of [...model.available, ...model.creates]) {
      if (item.kind === 'tensor' && !item.tex) {
        fail(`Chapter ${chapterNumber} tensor ${item.id} is missing a TeX display mapping.`);
      }
    }

    const current = model.progress.filter(stage => stage.state === 'current');
    const complete = model.progress.filter(stage => stage.state === 'complete');
    const upcoming = model.progress.filter(stage => stage.state === 'upcoming');
    if (current.length !== 1 || current[0].number !== chapterNumber) {
      fail(`Chapter ${chapterNumber} progress does not identify exactly one current stage.`);
    }
    if (complete.length !== chapterNumber - 1 || upcoming.length !== 11 - chapterNumber) {
      fail(`Chapter ${chapterNumber} progress state counts are inconsistent.`);
    }
  }

  for (const chapterNumber of [12, 17, 24, 0, 999]) {
    if (buildModel(bookData, chapterNumber) !== null) {
      fail(`Chapter ${chapterNumber} must not produce a workbook card model.`);
    }
  }
}

function expectVersion(content, asset, context) {
  const escapedAsset = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  expect(
    content,
    new RegExp(`${escapedAsset}\\?v=${EDITION_VERSION.replace(/\./g, '\\.')}`),
    `${context} must load ${asset} with edition ${EDITION_VERSION}.`
  );
}

async function main() {
  const paths = {
    bookData: path.join(ROOT, 'site/book-data.js'),
    cardJs: path.join(ROOT, 'site/workbook-card.js'),
    cardCss: path.join(ROOT, 'site/workbook-card.css'),
    cardFixesCss: path.join(ROOT, 'site/workbook-card-fixes.css'),
    cacheJs: path.join(ROOT, 'site/cache-version.js'),
    chapterHtml: path.join(ROOT, 'site/chapter.html'),
    indexHtml: path.join(ROOT, 'site/index.html')
  };

  const [bookSource, cardSource, cardCss, cardFixesCss, cacheSource, chapterHtml, indexHtml] = await Promise.all([
    readFile(paths.bookData, 'utf8'),
    readFile(paths.cardJs, 'utf8'),
    readFile(paths.cardCss, 'utf8'),
    readFile(paths.cardFixesCss, 'utf8'),
    readFile(paths.cacheJs, 'utf8'),
    readFile(paths.chapterHtml, 'utf8'),
    readFile(paths.indexHtml, 'utf8')
  ]);

  const { bookData, buildModel } = evaluateModel(bookSource, cardSource);
  validateModels(bookData, buildModel);

  expect(cardSource, /insertAdjacentElement\(['"]afterend['"],\s*card\)/, 'Workbook card must be placed after the chapter title.');
  expect(cardSource, /aria-labelledby/, 'Workbook card must have an accessible labelled section.');
  expect(cardSource, /aria-current['"],\s*['"]step/, 'The active workbook stage must expose aria-current="step".');
  expect(cardSource, /Already available/, 'Workbook card must label the incoming objects.');
  expect(cardSource, /Created or made explicit here/, 'Workbook card must label this chapter’s outputs.');
  expect(cardSource, /MutationObserver/, 'Workbook card integration must wait for asynchronously rendered Markdown.');
  expect(cardSource, /MathJax\?\.typesetPromise/, 'Workbook symbols must be sent through MathJax.');
  expect(cardSource, /typesetPromise\(\[card\]\)/, 'MathJax must typeset the inserted workbook card.');
  expect(cardSource, /workbook-object-name is-math/, 'Tensor labels must use the workbook math presentation class.');
  if (/article\.hidden/.test(cardSource)) {
    fail('Workbook injection must not depend on the article visibility state.');
  }

  const metadataIndex = chapterHtml.indexOf('book-data.js');
  const appIndex = chapterHtml.indexOf('app.js');
  const cardIndex = chapterHtml.indexOf('workbook-card.js');
  const cacheIndex = chapterHtml.indexOf('cache-version.js');
  if (metadataIndex < 0 || appIndex < 0 || cardIndex < 0 || cacheIndex < 0 || !(metadataIndex < appIndex && appIndex < cardIndex && cardIndex < cacheIndex)) {
    fail('site/chapter.html must load book-data.js, app.js, workbook-card.js, then cache-version.js in that order.');
  }
  expect(chapterHtml, /workbook-card\.css/, 'site/chapter.html must load workbook-card.css.');
  expect(chapterHtml, /workbook-card-fixes\.css/, 'site/chapter.html must load workbook-card-fixes.css.');

  for (const asset of ['book-data.js', 'app.js', 'workbook-card.js', 'chapter-progress.js', 'cache-version.js']) {
    expectVersion(chapterHtml, asset, 'site/chapter.html');
  }
  for (const asset of ['book-data.js', 'home.js', 'cache-version.js']) {
    expectVersion(indexHtml, asset, 'site/index.html');
  }
  expect(indexHtml, new RegExp(`chapter\\.html\\?chapter=1&amp;v=${EDITION_VERSION.replace(/\./g, '\\.')}`), 'The homepage start link must use the current edition version.');

  expect(cacheSource, new RegExp(`EDITION_VERSION = ['"]${EDITION_VERSION.replace(/\./g, '\\.')}['"]`), 'cache-version.js must declare the current edition version.');
  expect(cacheSource, /searchParams\.set\(['"]v['"],\s*EDITION_VERSION\)/, 'cache-version.js must rewrite chapter links to the current edition.');
  expect(cacheSource, /MutationObserver/, 'cache-version.js must refresh dynamically inserted chapter links.');

  for (const selector of [
    '.workbook-card',
    '.workbook-available',
    '.workbook-creates',
    '.workbook-progress',
    '.workbook-operation',
    '.workbook-handoff'
  ]) {
    if (!cardCss.includes(selector)) fail(`site/workbook-card.css is missing ${selector}.`);
  }
  expect(cardFixesCss, /\.workbook-object-name\.is-math/, 'Workbook TeX labels must have explicit chip styling.');
  expect(cardFixesCss, /mjx-container/, 'Workbook MathJax output must have inline layout rules.');

  expect(
    cardCss,
    /\.workbook-progress\s*\{[\s\S]*?grid-template-columns:\s*repeat\(11,\s*minmax\(0,\s*1fr\)\)/,
    'Workbook progress must fit all 11 stages without forcing page-level horizontal scrolling.'
  );
  expect(cardCss, /@media\s*\(max-width:\s*620px\)/, 'Workbook card must define compact mobile styles.');
  expect(cardCss, /@media\s+print/, 'Workbook card must define print styles.');

  console.log('Workbook rendering check passed: all 11 cards inject independently of visibility, tensor notation is MathJax-backed, cache versions are current, and later chapters omit the card.');
}

main().catch(error => {
  console.error(`Workbook rendering check failed:\n${error.message}`);
  process.exit(1);
});
