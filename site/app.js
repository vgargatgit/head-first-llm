(() => {
  'use strict';

  const BUILD_VERSION = '20260730.3';
  const loading = document.getElementById('loading');
  const article = document.getElementById('chapter');
  const errorBox = document.getElementById('error');
  const toc = document.getElementById('toc');
  const footerNav = document.getElementById('chapter-footer-nav');

  function fail(message) {
    if (loading) loading.hidden = true;
    if (article) article.hidden = true;
    if (errorBox) {
      errorBox.hidden = false;
      errorBox.textContent = message;
    }
  }

  const bookData = window.BOOK_DATA;
  if (!bookData || bookData.valid !== true) {
    const metadataErrors = bookData?.errors?.length
      ? ` ${bookData.errors.join(' ')}`
      : '';
    console.error('Book metadata is unavailable or invalid.', bookData?.errors || []);
    fail(`Could not open the book because its chapter metadata is invalid.${metadataErrors}`);
    return;
  }

  const params = new URLSearchParams(location.search);
  const chapterNumber = Number(params.get('chapter') || 1);
  const chapter = bookData.getChapter(chapterNumber);

  if (!chapter) {
    fail('That chapter does not exist yet. Return to the chapter list and choose Chapters 1–24.');
    return;
  }

  document.title = `Chapter ${chapterNumber}: ${chapter.title} — LLMs from the Inside Out`;
  document.querySelectorAll('.chapter-nav a').forEach(link => {
    const linkedChapter = Number(new URL(link.href, window.location.href).searchParams.get('chapter'));
    if (linkedChapter === chapterNumber) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  function prepareMarkdown(markdown) {
    let result = markdown
      .replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
      .replace(/\{(?:\.[\w-]+|#[\w-]+)(?:\s+(?:\.[\w-]+|#[\w-]+))*\}\s*$/gm, '');

    chapter.assetFrom.forEach(prefix => {
      result = result.split(prefix).join(chapter.assetTo);
    });

    Object.entries(chapter.assetAliases).forEach(([source, destination]) => {
      result = result.split(source).join(destination);
    });

    return result;
  }

  function escapeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function protectMath(markdown) {
    const displayMath = [];
    const inlineMath = [];

    const stashDisplayMath = tex => {
      const token = `LLMIODISPLAYMATH${displayMath.length}TOKEN`;
      displayMath.push({ token, tex: tex.trim() });
      return `\n\n${token}\n\n`;
    };

    const stashInlineMath = tex => {
      const token = `LLMIOINLINEMATH${inlineMath.length}TOKEN`;
      inlineMath.push({ token, tex: tex.trim() });
      return token;
    };

    let protectedMarkdown = markdown.replace(/\\\[([\s\S]*?)\\\]/g, (_match, tex) =>
      stashDisplayMath(tex)
    );

    protectedMarkdown = protectedMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex) =>
      stashDisplayMath(tex)
    );

    protectedMarkdown = protectedMarkdown.replace(/\\\(([\s\S]*?)\\\)/g, (_match, tex) =>
      stashInlineMath(tex)
    );

    protectedMarkdown = protectedMarkdown.replace(/(^|[^\\])\$([^\n$]+?)\$/g, (_match, prefix, tex) =>
      `${prefix}${stashInlineMath(tex)}`
    );

    return { markdown: protectedMarkdown, displayMath, inlineMath };
  }

  function restoreMath(html, protectedMath) {
    let restored = html;

    protectedMath.displayMath.forEach(({ token, tex }) => {
      const mathHtml = `<div class="math-display">\\[${escapeHtml(tex)}\\]</div>`;
      const wrappedToken = new RegExp(`<p>\\s*${token}\\s*</p>`, 'g');
      restored = restored.replace(wrappedToken, mathHtml).split(token).join(mathHtml);
    });

    protectedMath.inlineMath.forEach(({ token, tex }) => {
      const mathHtml = `<span class="math-inline">\\(${escapeHtml(tex)}\\)</span>`;
      restored = restored.split(token).join(mathHtml);
    });

    return restored;
  }

  function normaliseHeadingText(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function createArtworkFigure(artwork, index) {
    const figure = document.createElement('figure');
    figure.className = 'chapter-artwork';
    figure.dataset.artworkIndex = String(index + 1);

    const image = document.createElement('img');
    image.src = artwork.src;
    image.alt = artwork.alt;

    if (artwork.placement === 'start') image.classList.add('hero');

    figure.append(image);
    return figure;
  }

  function injectChapterArtwork() {
    const artworkItems = bookData.getArtworkForChapter(chapterNumber);
    if (!artworkItems.length) return;

    const headings = [...article.querySelectorAll('h1, h2, h3')];

    artworkItems.forEach((artwork, index) => {
      const figure = createArtworkFigure(artwork, index);

      if (artwork.placement === 'start') {
        article.insertBefore(figure, article.firstChild);
        return;
      }

      const expectedHeading = normaliseHeadingText(artwork.afterHeading || '');
      const targetHeading = headings.find(heading =>
        normaliseHeadingText(heading.textContent) === expectedHeading
      );

      if (targetHeading) {
        targetHeading.insertAdjacentElement('afterend', figure);
      } else {
        console.warn(`Could not place Chapter ${chapterNumber} artwork after heading: ${artwork.afterHeading}`);
      }
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/&[^;]+;/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  function buildToc() {
    const used = new Map();
    const links = [];

    [...article.querySelectorAll('h1, h2, h3')].forEach((heading, index) => {
      const base = slugify(heading.textContent);
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      heading.id = count ? `${base}-${count + 1}` : base;

      if (index === 0 && heading.tagName === 'H1') return;
      if (heading.tagName === 'H3') return;

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.innerHTML = heading.innerHTML;
      link.className = heading.tagName === 'H2' ? 'level-1' : 'level-2';
      links.push(link);
    });

    toc.replaceChildren(...links);
  }

  function handleMissingImages() {
    article.querySelectorAll('img').forEach(image => {
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('error', () => {
        image.classList.add('image-missing');
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = image.alt
          ? `Illustration file is missing or empty: ${image.alt}`
          : 'Illustration file is missing or empty.';
        image.insertAdjacentElement('afterend', placeholder);
      }, { once: true });

      const source = image.getAttribute('src');
      if (source && !source.startsWith('data:')) {
        const versionedSource = new URL(source, window.location.href);
        if (versionedSource.origin === window.location.origin) {
          versionedSource.searchParams.set('v', BUILD_VERSION);
          image.src = versionedSource.href;
        }
      }
    });
  }

  function chapterUrl(number) {
    return `chapter.html?chapter=${number}&v=${encodeURIComponent(BUILD_VERSION)}`;
  }

  function buildFooterNavigation() {
    const items = [];
    const previousChapter = bookData.getPreviousChapter(chapterNumber);
    const nextChapter = bookData.getNextChapter(chapterNumber);

    if (previousChapter) {
      const previous = document.createElement('a');
      previous.href = chapterUrl(previousChapter.number);
      previous.textContent = `← Chapter ${previousChapter.number}: ${previousChapter.title}`;
      items.push(previous);
    } else {
      items.push(document.createElement('span'));
    }

    if (nextChapter) {
      const next = document.createElement('a');
      next.href = chapterUrl(nextChapter.number);
      next.textContent = `Chapter ${nextChapter.number}: ${nextChapter.title} →`;
      items.push(next);
    }

    footerNav.replaceChildren(...items);
  }

  async function typesetMath() {
    try {
      if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([article, toc]);
      } else {
        console.warn('The equation renderer did not load; showing raw equation delimiters.');
      }
    } catch (error) {
      console.error('MathJax could not typeset this chapter. The text remains available.', error);
    }
  }

  async function render() {
    try {
      const sourceUrl = new URL(chapter.source, window.location.href);
      sourceUrl.searchParams.set('v', BUILD_VERSION);
      const response = await fetch(sourceUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error(`chapter source returned HTTP ${response.status}`);

      const preparedMarkdown = prepareMarkdown(await response.text());
      const protectedMath = protectMath(preparedMarkdown);

      if (!window.marked) throw new Error('The Markdown renderer did not load.');
      const renderedMarkdown = window.marked.parse(protectedMath.markdown, {
        gfm: true,
        breaks: false,
        mangle: false,
        headerIds: false
      });

      article.innerHTML = restoreMath(renderedMarkdown, protectedMath);
      injectChapterArtwork();
      buildToc();
      handleMissingImages();
      buildFooterNavigation();
      loading.hidden = true;
      errorBox.hidden = true;
      article.hidden = false;
      await typesetMath();
    } catch (error) {
      console.error(error);
      fail(`Could not open Chapter ${chapterNumber}. ${error.message}`);
    }
  }

  render();
})();
