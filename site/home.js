(() => {
  'use strict';

  const BUILD_VERSION = '20260730.10';
  const partsContainer = document.getElementById('book-parts');
  const errorBox = document.getElementById('home-error');
  const startBookLink = document.getElementById('start-book-link');

  function showError(message, details = []) {
    console.error(message, details);
    if (partsContainer) partsContainer.replaceChildren();
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = details.length ? `${message} ${details.join(' ')}` : message;
    }
  }

  function chapterUrl(number) {
    return `chapter.html?chapter=${number}&v=${encodeURIComponent(BUILD_VERSION)}`;
  }

  function createChapterCard(chapter) {
    const link = document.createElement('a');
    link.className = 'chapter-card';
    link.href = chapterUrl(chapter.number);
    link.setAttribute('aria-label', `Chapter ${chapter.number}: ${chapter.title}`);

    const number = document.createElement('span');
    number.className = 'chapter-number';
    number.textContent = String(chapter.number).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('div');
    copy.className = 'chapter-card-copy';

    const title = document.createElement('h4');
    title.textContent = chapter.title;

    const summary = document.createElement('p');
    summary.textContent = chapter.summary;

    const arrow = document.createElement('span');
    arrow.className = 'card-arrow';
    arrow.textContent = '→';
    arrow.setAttribute('aria-hidden', 'true');

    copy.append(title, summary);
    link.append(number, copy, arrow);
    return link;
  }

  function createPartSection(bookData, part) {
    const chapters = bookData.getPartChapters(part.id);
    if (!chapters.length) throw new Error(`Part ${part.id} has no chapters.`);

    const firstChapter = chapters[0];
    const lastChapter = chapters[chapters.length - 1];
    const headingId = `${part.id}-title`;
    const summaryId = `${part.id}-summary`;
    const outcomeId = `${part.id}-outcome`;

    const section = document.createElement('section');
    section.className = 'book-part';
    section.dataset.partId = part.id;
    section.dataset.partNumber = String(part.number);
    section.setAttribute('aria-labelledby', headingId);
    section.setAttribute('aria-describedby', `${summaryId} ${outcomeId}`);

    const heading = document.createElement('header');
    heading.className = 'part-heading';

    const meta = document.createElement('div');
    meta.className = 'part-meta';

    const label = document.createElement('span');
    label.className = 'part-label';
    label.textContent = `Part ${part.numeral}`;

    const range = document.createElement('span');
    range.className = 'part-range';
    range.textContent = `Chapters ${firstChapter.number}–${lastChapter.number}`;

    meta.append(label, range);

    const headingRow = document.createElement('div');
    headingRow.className = 'part-heading-row';

    const headingCopy = document.createElement('div');
    headingCopy.className = 'part-heading-copy';

    const title = document.createElement('h3');
    title.id = headingId;
    title.textContent = part.title;

    const summary = document.createElement('p');
    summary.id = summaryId;
    summary.className = 'part-summary';
    summary.textContent = part.summary;

    headingCopy.append(title, summary);

    const startLink = document.createElement('a');
    startLink.className = 'part-start';
    startLink.href = chapterUrl(firstChapter.number);
    startLink.textContent = `Start Part ${part.numeral} →`;
    startLink.setAttribute('aria-label', `Start Part ${part.numeral}: ${part.title}`);

    headingRow.append(headingCopy, startLink);
    heading.append(meta, headingRow);

    const grid = document.createElement('div');
    grid.className = 'chapter-grid part-chapter-grid';
    chapters.forEach(chapter => grid.append(createChapterCard(chapter)));

    const outcome = document.createElement('p');
    outcome.id = outcomeId;
    outcome.className = 'part-outcome';

    const outcomeLabel = document.createElement('strong');
    outcomeLabel.textContent = 'After this part: ';

    outcome.append(outcomeLabel, document.createTextNode(part.learningOutcome));
    section.append(heading, grid, outcome);
    return section;
  }

  const bookData = window.BOOK_DATA;
  if (!partsContainer) {
    console.error('The homepage is missing the #book-parts container.');
    return;
  }

  if (!bookData || bookData.valid !== true) {
    showError('Could not show the learning journey because the book metadata is unavailable.', bookData?.errors || []);
    return;
  }

  try {
    if (startBookLink) startBookLink.href = chapterUrl(1);

    const fragment = document.createDocumentFragment();
    bookData.parts.forEach(part => fragment.append(createPartSection(bookData, part)));
    partsContainer.replaceChildren(fragment);
  } catch (error) {
    showError('Could not build the learning journey.', [error.message]);
  }
})();
