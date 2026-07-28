(() => {
  'use strict';

  const chapterNumber = Number(new URLSearchParams(window.location.search).get('chapter') || 1);
  if (chapterNumber !== 10) return;

  const article = document.getElementById('chapter');
  if (!article) return;

  const buildVersion = '20260728.10';
  const artwork = [
    {
      beforeHeading: 'Modern pre-norm stack notation',
      src: 'assets/chapter-10/02b_why_residual_connections_help.png',
      alt: 'SAT carries its existing case file through a residual path while a sublayer contributes a learned amendment, contrasting this with rewriting the whole representation from scratch.'
    },
    {
      beforeHeading: 'Every layer owns different parameters',
      src: 'assets/chapter-10/02c_why_layernorm.png',
      alt: 'LayerNorm recentres and rescales each token position so a sublayer receives a better-behaved input representation.'
    },
    {
      beforeHeading: 'Every layer owns different parameters',
      src: 'assets/chapter-10/02d_pre_norm_vs_post_norm.png',
      alt: 'Post-norm applies normalisation after the residual addition, while pre-norm normalises the input before the sublayer and then adds the residual path.'
    },
    {
      beforeHeading: 'The final hidden state is still not a token',
      src: 'assets/chapter-10/08b_sat_final_layernorm_example.png',
      alt: 'SAT’s final Chapter 10 vector is normalised using the displayed mean, variance, epsilon, gamma, and beta to produce the final normalised hidden state.'
    }
  ];

  function normaliseHeading(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function createFigure(item, index) {
    const figure = document.createElement('figure');
    figure.className = 'chapter-artwork chapter-artwork-supplemental';
    figure.dataset.supplementalArtworkIndex = String(index + 1);

    const image = document.createElement('img');
    const source = new URL(item.src, window.location.href);
    source.searchParams.set('v', buildVersion);
    image.src = source.href;
    image.alt = item.alt;
    image.loading = 'lazy';
    image.decoding = 'async';

    image.addEventListener('error', () => {
      image.classList.add('image-missing');
      const placeholder = document.createElement('div');
      placeholder.className = 'image-placeholder';
      placeholder.textContent = `Illustration file is missing or empty: ${item.alt}`;
      image.insertAdjacentElement('afterend', placeholder);
    }, { once: true });

    figure.append(image);
    return figure;
  }

  function integrateArtwork() {
    if (article.dataset.chapter10SupplementalArtwork === 'done') return true;

    const headings = [...article.querySelectorAll('h1, h2, h3')];
    if (!headings.length) return false;

    let insertedCount = 0;

    artwork.forEach((item, index) => {
      const expected = normaliseHeading(item.beforeHeading);
      const target = headings.find(heading => normaliseHeading(heading.textContent) === expected);

      if (!target?.parentNode) {
        console.warn(`Could not place Chapter 10 supplemental artwork before heading: ${item.beforeHeading}`);
        return;
      }

      target.parentNode.insertBefore(createFigure(item, index), target);
      insertedCount += 1;
    });

    if (insertedCount === artwork.length) {
      article.dataset.chapter10SupplementalArtwork = 'done';
      return true;
    }

    return false;
  }

  if (integrateArtwork()) return;

  const observer = new MutationObserver(() => {
    if (integrateArtwork()) observer.disconnect();
  });

  observer.observe(article, { childList: true, subtree: true });
})();
