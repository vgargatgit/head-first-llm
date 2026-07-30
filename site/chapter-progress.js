(() => {
  'use strict';

  const BUILD_VERSION = '20260730.7';
  const container = document.getElementById('part-progress');
  const footerNav = document.getElementById('chapter-footer-nav');
  const bookData = window.BOOK_DATA;
  const chapterNumber = Number(new URLSearchParams(window.location.search).get('chapter') || 1);

  if (!container || !bookData || bookData.valid !== true) return;

  const chapter = bookData.getChapter(chapterNumber);
  const part = bookData.getPartForChapter(chapterNumber);
  if (!chapter || !part) return;

  const partChapters = bookData.getPartChapters(part.id);
  const previousChapter = bookData.getPreviousChapter(chapterNumber);
  const nextChapter = bookData.getNextChapter(chapterNumber);

  function chapterUrl(number) {
    return `chapter.html?chapter=${number}&v=${encodeURIComponent(BUILD_VERSION)}`;
  }

  function makeLink(className, href, text, ariaLabel) {
    const link = document.createElement('a');
    link.className = className;
    link.href = href;
    link.textContent = text;
    if (ariaLabel) link.setAttribute('aria-label', ariaLabel);
    return link;
  }

  function buildIdentity() {
    const identity = document.createElement('div');
    identity.className = 'part-progress-identity';

    const eyebrow = document.createElement('span');
    eyebrow.className = 'part-progress-eyebrow';
    eyebrow.textContent = `Part ${part.numeral} of ${bookData.parts.length}`;

    const title = document.createElement('strong');
    title.className = 'part-progress-title';
    title.textContent = part.title;

    const count = document.createElement('span');
    count.className = 'part-progress-count';
    count.textContent = `Chapter ${chapter.partPosition} of ${partChapters.length}`;

    identity.append(eyebrow, title, count);
    return identity;
  }

  function buildDesktopNavigation() {
    const desktop = document.createElement('div');
    desktop.className = 'part-progress-desktop';

    const topRow = document.createElement('div');
    topRow.className = 'part-progress-top-row';
    topRow.append(
      makeLink('part-progress-all', './#book-parts', '← All parts', 'Return to all five book parts'),
      buildIdentity()
    );

    const list = document.createElement('ol');
    list.className = 'part-chapter-progress';
    list.setAttribute('aria-label', `Chapters in Part ${part.numeral}: ${part.title}`);

    partChapters.forEach(item => {
      const listItem = document.createElement('li');
      const link = makeLink(
        'part-chapter-progress-link',
        chapterUrl(item.number),
        `${item.number} ${item.navLabel}`,
        `Chapter ${item.number}: ${item.title}`
      );

      if (item.number === chapterNumber) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }

      listItem.append(link);
      list.append(listItem);
    });

    desktop.append(topRow, list);
    return desktop;
  }

  function pagerLabel(target, direction) {
    if (!target) return null;
    const targetPart = bookData.getPartForChapter(target.number);
    if (targetPart?.id !== part.id) {
      return `${direction === 'next' ? 'Next' : 'Previous'} part: ${targetPart.title}`;
    }
    return `${direction === 'next' ? 'Next' : 'Previous'}: ${target.navLabel}`;
  }

  function buildMobileNavigation() {
    const mobile = document.createElement('div');
    mobile.className = 'part-progress-mobile';

    const mobileTop = document.createElement('div');
    mobileTop.className = 'part-progress-mobile-top';
    mobileTop.append(
      makeLink('part-progress-all', './#book-parts', '← All parts', 'Return to all five book parts'),
      buildIdentity()
    );

    const field = document.createElement('div');
    field.className = 'part-chapter-select-field';

    const label = document.createElement('label');
    label.htmlFor = 'part-chapter-select';
    label.textContent = `Jump within Part ${part.numeral}`;

    const select = document.createElement('select');
    select.id = 'part-chapter-select';
    select.className = 'part-chapter-select';
    partChapters.forEach(item => {
      const option = document.createElement('option');
      option.value = String(item.number);
      option.textContent = `Chapter ${item.number}: ${item.navLabel}`;
      option.selected = item.number === chapterNumber;
      select.append(option);
    });
    select.addEventListener('change', () => {
      window.location.assign(chapterUrl(Number(select.value)));
    });

    field.append(label, select);

    const pager = document.createElement('div');
    pager.className = 'part-mobile-pager';

    if (previousChapter) {
      pager.append(makeLink(
        'part-mobile-pager-link previous',
        chapterUrl(previousChapter.number),
        `← ${pagerLabel(previousChapter, 'previous')}`,
        `Go to Chapter ${previousChapter.number}: ${previousChapter.title}`
      ));
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'part-mobile-pager-spacer';
      pager.append(spacer);
    }

    const current = document.createElement('span');
    current.className = 'part-mobile-current';
    current.textContent = `${chapter.partPosition} / ${partChapters.length}`;
    current.setAttribute('aria-label', `Chapter ${chapter.partPosition} of ${partChapters.length} in this part`);
    pager.append(current);

    if (nextChapter) {
      pager.append(makeLink(
        'part-mobile-pager-link next',
        chapterUrl(nextChapter.number),
        `${pagerLabel(nextChapter, 'next')} →`,
        `Go to Chapter ${nextChapter.number}: ${nextChapter.title}`
      ));
    } else {
      const spacer = document.createElement('span');
      spacer.className = 'part-mobile-pager-spacer';
      pager.append(spacer);
    }

    mobile.append(mobileTop, field, pager);
    return mobile;
  }

  function enhanceFooterTransitions() {
    if (!footerNav) return false;
    const links = [...footerNav.querySelectorAll('a')];
    if (!links.length) return false;

    links.forEach(link => {
      const targetNumber = Number(new URL(link.href, window.location.href).searchParams.get('chapter'));
      const target = bookData.getChapter(targetNumber);
      const targetPart = target ? bookData.getPartForChapter(target.number) : null;
      if (!target || !targetPart || targetPart.id === part.id || link.dataset.partTransition === 'done') return;

      const isNext = target.number > chapterNumber;
      const context = document.createElement('span');
      context.className = 'footer-nav-context';
      context.textContent = `${isNext ? 'Next' : 'Previous'} part — Part ${targetPart.numeral}: ${targetPart.title}`;

      const destination = document.createElement('strong');
      destination.textContent = `${isNext ? '' : '← '}Chapter ${target.number}: ${target.title}${isNext ? ' →' : ''}`;

      link.replaceChildren(context, destination);
      link.classList.add('part-transition');
      link.dataset.partTransition = 'done';
    });

    return true;
  }

  document.body.dataset.partId = part.id;
  document.body.dataset.chapterNumber = String(chapter.number);
  container.setAttribute('aria-label', `Part ${part.numeral}: ${part.title}. Chapter ${chapter.partPosition} of ${partChapters.length}.`);
  container.replaceChildren(buildDesktopNavigation(), buildMobileNavigation());
  container.hidden = false;

  if (!enhanceFooterTransitions() && footerNav) {
    const observer = new MutationObserver(() => {
      if (enhanceFooterTransitions()) observer.disconnect();
    });
    observer.observe(footerNav, { childList: true, subtree: true });
  }
})();
