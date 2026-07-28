(() => {
  'use strict';

  const BUILD_VERSION = '20260728.4';
  const chapters = {
    1: {
      title: 'A Token Enters the Dating World',
      source: 'src/chapter-01.md',
      assetFrom: ['chapter_1_graphics/', 'chapter-1-graphics/', '../assets/chapter-01/', '/assets/chapter-01/'],
      assetTo: 'assets/chapter-01/',
      assetAliases: {}
    },
    2: {
      title: 'Meet the Question Coach',
      source: 'src/chapter-02.md',
      assetFrom: ['chapter_2_graphics/', 'chapter-2-graphics/', '../assets/chapter-02/', '/assets/chapter-02/'],
      assetTo: 'assets/chapter-02/',
      assetAliases: {
        'assets/chapter-02/02_question_coach_story.png': 'assets/chapter-02/02_question_coach_pipeline.png',
        'assets/chapter-02/04_shared_coach.png': 'assets/chapter-02/04_shared_question_coach.png',
        'assets/chapter-02/06_handoff_to_keys.png': 'assets/chapter-02/07_handoff_to_keys.png'
      }
    },
    3: {
      title: 'Meet the Profile Writer',
      source: 'src/chapter-03.md',
      assetFrom: ['chapter_3_graphics/', 'chapter-3-graphics/', '../assets/chapter-03/', '/assets/chapter-03/'],
      assetTo: 'assets/chapter-03/',
      assetAliases: {}
    },
    4: { title: 'When Queries Meet Keys', source: 'src/chapter-04.md', assetFrom: ['../assets/chapter-04/', '/assets/chapter-04/'], assetTo: 'assets/chapter-04/', assetAliases: {} },
    5: { title: 'Meet the Information Courier', source: 'src/chapter-05.md', assetFrom: [], assetTo: '', assetAliases: {} },
    6: { title: 'Many Specialists at Work', source: 'src/chapter-06.md', assetFrom: [], assetTo: '', assetAliases: {} },
    7: { title: 'The Team Lead Combines the Reports', source: 'src/chapter-07.md', assetFrom: [], assetTo: '', assetAliases: {} },
    8: { title: 'The Private Thinking Room', source: 'src/chapter-08.md', assetFrom: [], assetTo: '', assetAliases: {} },
    9: { title: 'Every Token Needs an Address', source: 'src/chapter-09.md', assetFrom: [], assetTo: '', assetAliases: {} },
    10: { title: 'The Residual Stream Climbs the Stack', source: 'src/chapter-10.md', assetFrom: [], assetTo: '', assetAliases: {} },
    11: { title: 'The Final Audition', source: 'src/chapter-11.md', assetFrom: [], assetTo: '', assetAliases: {} },
    12: { title: 'The Answer Key Moves One Step Ahead', source: 'src/chapter-12.md', assetFrom: [], assetTo: '', assetAliases: {} },
    13: { title: 'Meet the Scorekeeper', source: 'src/chapter-13.md', assetFrom: [], assetTo: '', assetAliases: {} },
    14: { title: 'The Blame Travels Backward', source: 'src/chapter-14.md', assetFrom: [], assetTo: '', assetAliases: {} },
    15: { title: 'The Training Factory Never Sees the Whole Library', source: 'src/chapter-15.md', assetFrom: [], assetTo: '', assetAliases: {} },
    16: { title: 'The Model Outgrows One Machine', source: 'src/chapter-16.md', assetFrom: [], assetTo: '', assetAliases: {} },
    17: { title: 'From Completion Machine to Helpful Assistant', source: 'src/chapter-17.md', assetFrom: [], assetTo: '', assetAliases: {} }
  };

  const params = new URLSearchParams(location.search);
  const chapterNumber = Number(params.get('chapter') || 1);
  const chapter = chapters[chapterNumber];
  const loading = document.getElementById('loading');
  const article = document.getElementById('chapter');
  const errorBox = document.getElementById('error');
  const toc = document.getElementById('toc');
  const footerNav = document.getElementById('chapter-footer-nav');

  function fail(message) {
    loading.hidden = true;
    article.hidden = true;
    errorBox.hidden = false;
    errorBox.textContent = message;
  }

  if (!chapter) {
    fail('That chapter does not exist yet. Return to the chapter list and choose Chapters 1–17.');
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

    let protectedMarkdown = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (_match, tex) => {
      const token = `LLMIODISPLAYMATH${displayMath.length}TOKEN`;
      displayMath.push({ token, tex: tex.trim() });
      return `\n\n${token}\n\n`;
    });

    protectedMarkdown = protectedMarkdown.replace(/(^|[^\\])\$([^\n$]+?)\$/g, (_match, prefix, tex) => {
      const token = `LLMIOINLINEMATH${inlineMath.length}TOKEN`;
      inlineMath.push({ token, tex: tex.trim() });
      return `${prefix}${token}`;
    });

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
      link.textContent = heading.textContent;
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

    if (chapters[chapterNumber - 1]) {
      const previous = document.createElement('a');
      previous.href = chapterUrl(chapterNumber - 1);
      previous.textContent = `← Chapter ${chapterNumber - 1}: ${chapters[chapterNumber - 1].title}`;
      items.push(previous);
    } else {
      items.push(document.createElement('span'));
    }

    if (chapters[chapterNumber + 1]) {
      const next = document.createElement('a');
      next.href = chapterUrl(chapterNumber + 1);
      next.textContent = `Chapter ${chapterNumber + 1}: ${chapters[chapterNumber + 1].title} →`;
      items.push(next);
    }

    footerNav.replaceChildren(...items);
  }

  async function typesetMath() {
    try {
      if (window.MathJax?.startup?.promise) await window.MathJax.startup.promise;
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([article]);
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
