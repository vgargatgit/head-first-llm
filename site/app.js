(() => {
  const chapters = {
    1: {
      title: 'A Token Enters the Dating World',
      source: 'src/chapter-01.md',
      assetFrom: [
        'chapter_1_graphics/',
        'chapter-1-graphics/',
        '../assets/chapter-01/',
        '/assets/chapter-01/'
      ],
      assetTo: 'assets/chapter-01/'
    },
    2: {
      title: 'Meet the Question Coach',
      source: 'src/chapter-02.md',
      assetFrom: [
        'chapter_2_graphics/',
        'chapter-2-graphics/',
        '../assets/chapter-02/',
        '/assets/chapter-02/'
      ],
      assetTo: 'assets/chapter-02/'
    },
    3: {
      title: 'Meet the Profile Writer',
      source: 'src/chapter-03.md',
      assetFrom: [
        'chapter_3_graphics/',
        'chapter-3-graphics/',
        '../assets/chapter-03/',
        '/assets/chapter-03/'
      ],
      assetTo: 'assets/chapter-03/'
    }
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
    fail('That chapter does not exist yet. Return to the chapter list and choose Chapters 1–3.');
    return;
  }

  document.title = `Chapter ${chapterNumber}: ${chapter.title} — Head First LLMs`;
  document.querySelectorAll('.chapter-nav a').forEach(link => {
    if (link.getAttribute('href').endsWith(`chapter=${chapterNumber}`)) {
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

    return result;
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
    const headings = [...article.querySelectorAll('h1, h2, h3')];
    const links = [];

    headings.forEach((heading, index) => {
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
    });
  }

  function buildFooterNavigation() {
    const items = [];
    if (chapters[chapterNumber - 1]) {
      const previous = document.createElement('a');
      previous.href = `chapter.html?chapter=${chapterNumber - 1}`;
      previous.textContent = `← Chapter ${chapterNumber - 1}: ${chapters[chapterNumber - 1].title}`;
      items.push(previous);
    } else {
      items.push(document.createElement('span'));
    }

    if (chapters[chapterNumber + 1]) {
      const next = document.createElement('a');
      next.href = `chapter.html?chapter=${chapterNumber + 1}`;
      next.textContent = `Chapter ${chapterNumber + 1}: ${chapters[chapterNumber + 1].title} →`;
      items.push(next);
    }
    footerNav.replaceChildren(...items);
  }

  async function render() {
    try {
      const response = await fetch(chapter.source, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const markdown = prepareMarkdown(await response.text());

      if (!window.marked) throw new Error('The Markdown renderer did not load.');
      article.innerHTML = window.marked.parse(markdown, {
        gfm: true,
        breaks: false,
        mangle: false,
        headerIds: false
      });

      buildToc();
      handleMissingImages();
      buildFooterNavigation();
      loading.hidden = true;
      article.hidden = false;

      if (window.MathJax?.startup?.promise) {
        await window.MathJax.startup.promise;
      }
      if (window.MathJax?.typesetPromise) {
        await window.MathJax.typesetPromise([article]);
      }
    } catch (error) {
      console.error(error);
      fail(`Could not open Chapter ${chapterNumber}. ${error.message}`);
    }
  }

  render();
})();