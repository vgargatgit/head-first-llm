(() => {
  'use strict';

  const BUILD_VERSION = '20260728.12';
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
    5: { title: 'Meet the Information Courier', source: 'src/chapter-05.md', assetFrom: ['../assets/chapter-05/', '/assets/chapter-05/'], assetTo: 'assets/chapter-05/', assetAliases: {} },
    6: { title: 'Many Specialists at Work', source: 'src/chapter-06.md', assetFrom: ['../assets/chapter-06/', '/assets/chapter-06/'], assetTo: 'assets/chapter-06/', assetAliases: {} },
    7: { title: 'The Team Lead Combines the Reports', source: 'src/chapter-07.md', assetFrom: ['../assets/chapter-07/', '/assets/chapter-07/'], assetTo: 'assets/chapter-07/', assetAliases: {} },
    8: { title: 'The Private Thinking Room', source: 'src/chapter-08.md', assetFrom: [], assetTo: '', assetAliases: {} },
    9: { title: 'Every Token Needs an Address', source: 'src/chapter-09.md', assetFrom: [], assetTo: '', assetAliases: {} },
    10: {
      title: 'The Residual Stream Climbs the Stack',
      source: 'src/chapter-10.md',
      assetFrom: ['../assets/chapter-10/', '/assets/chapter-10/'],
      assetTo: 'assets/chapter-10/',
      assetAliases: {}
    },
    11: { title: 'The Final Audition', source: 'src/chapter-11.md', assetFrom: [], assetTo: '', assetAliases: {} },
    12: { title: 'The Answer Key Moves One Step Ahead', source: 'src/chapter-12.md', assetFrom: [], assetTo: '', assetAliases: {} },
    13: { title: 'Meet the Scorekeeper', source: 'src/chapter-13.md', assetFrom: [], assetTo: '', assetAliases: {} },
    14: { title: 'The Blame Travels Backward', source: 'src/chapter-14.md', assetFrom: [], assetTo: '', assetAliases: {} },
    15: { title: 'The Training Factory Never Sees the Whole Library', source: 'src/chapter-15.md', assetFrom: [], assetTo: '', assetAliases: {} },
    16: { title: 'The Model Outgrows One Machine', source: 'src/chapter-16.md', assetFrom: [], assetTo: '', assetAliases: {} },
    17: { title: 'From Completion Machine to Helpful Assistant', source: 'src/chapter-17.md', assetFrom: [], assetTo: '', assetAliases: {} },
    18: { title: 'Three Transformer Families Move In', source: 'src/chapter-18.md', assetFrom: [], assetTo: '', assetAliases: {} },
    19: { title: 'The Decoder Borrows the Encoder’s Notes', source: 'src/chapter-19.md', assetFrom: [], assetTo: '', assetAliases: {} },
    20: { title: 'From Pretraining to Specialisation', source: 'src/chapter-20.md', assetFrom: [], assetTo: '', assetAliases: {} },
    21: { title: 'Open Book, Closed Book, or Tool Belt?', source: 'src/chapter-21.md', assetFrom: [], assetTo: '', assetAliases: {} },
    22: { title: 'Pictures, Audio, and Other Modalities', source: 'src/chapter-22.md', assetFrom: [], assetTo: '', assetAliases: {} },
    23: { title: 'Smaller, Faster, Cheaper', source: 'src/chapter-23.md', assetFrom: [], assetTo: '', assetAliases: {} },
    24: { title: 'Trust, but Verify', source: 'src/chapter-24.md', assetFrom: [], assetTo: '', assetAliases: {} }
  };

  const chapterArtwork = {
    10: [
      {
        placement: 'start',
        src: 'assets/chapter-10/01_the_transformer_tower_explained.png',
        alt: 'SAT approaches a tower whose floors represent successive Transformer layers.'
      },
      {
        afterHeading: 'One block is one refinement step',
        src: 'assets/chapter-10/02_one_floor_at_a_time_transformer_layer.png',
        alt: 'One Transformer layer applies self-attention, residual connections, normalisation, and a feed-forward network.'
      },
      {
        afterHeading: "SAT's evolving case file",
        src: 'assets/chapter-10/03_sat_state_evolution_cartoon_diagram.png',
        alt: 'SAT keeps the same token identity while its hidden representation evolves through the layer stack.'
      },
      {
        afterHeading: 'Every layer owns different parameters',
        src: 'assets/chapter-10/04_layers_and_parameters_explained_visually.png',
        alt: 'Each Transformer layer has its own separately learned parameters despite sharing the same architecture.'
      },
      {
        afterHeading: 'What repeated contextualisation buys the model',
        src: 'assets/chapter-10/05_context_grows_with_visible_tokens.png',
        alt: 'SAT gathers information from all visible earlier tokens and develops a richer contextual representation.'
      },
      {
        afterHeading: 'One KV cache per layer',
        src: 'assets/chapter-10/06_key_value_memory_in_neural_layers.png',
        alt: 'Every Transformer layer stores its own cached Key and Value vectors for previous token positions.'
      },
      {
        afterHeading: 'Generation processes one new position at a time',
        src: 'assets/chapter-10/07_decoding_with_cached_keys_and_values.png',
        alt: 'Prompt prefill caches Keys and Values, while decoding computes the newest token using the existing cache.'
      },
      {
        afterHeading: 'Why model depth costs memory and computation',
        src: 'assets/chapter-10/08_token_generation_growth_in_transformers.png',
        alt: 'KV-cache storage grows across both sequence length and Transformer depth.'
      },
      {
        afterHeading: 'The final hidden state is still not a token',
        src: 'assets/chapter-10/09_final_output_path_diagram_with_mascot.png',
        alt: 'The final hidden state passes through final normalisation and vocabulary projection before becoming token probabilities.'
      },
      {
        afterHeading: 'Coming next: the final audition',
        src: 'assets/chapter-10/10_chapter_11_from_final_state_to_next_token.png',
        alt: 'Chapter 10 hands the final hidden state to Chapter 11 and the vocabulary head.'
      }
    ]
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

    // Protect MathJax's explicit delimiters before Markdown consumes the
    // backslashes as ordinary Markdown escapes.
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
    const artworkItems = chapterArtwork[chapterNumber] || [];
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
