(() => {
  'use strict';

  const chapterNumber = Number(new URLSearchParams(window.location.search).get('chapter') || 1);
  if (chapterNumber !== 14) return;

  const article = document.getElementById('chapter');
  if (!article) return;

  const buildVersion = '20260730.10';
  const artwork = [
    {
      placement: 'start',
      src: 'assets/chapter-14/01_chapter_hero_gradient_courier.png',
      alt: 'A Gradient Courier travels backward through the familiar Transformer departments carrying derivative reports while the Optimizer Engineer waits to apply updates.'
    },
    {
      beforeHeading: 'A computational graph',
      src: 'assets/chapter-14/02_forward_graph_backward_reports.png',
      alt: 'A computational graph stores forward values and sends local derivative messages backward from the loss to every contributing input.'
    },
    {
      beforeHeading: 'Back through the vocabulary projection',
      src: 'assets/chapter-14/03_exact_vocabulary_gradients.png',
      alt: 'The logit gradient combines with SAT’s hidden state and vocabulary matrix to create weight, bias and hidden-state gradients.'
    },
    {
      beforeHeading: 'Back through a residual connection',
      src: 'assets/chapter-14/04_residual_gradient_fork.png',
      alt: 'At a residual addition, the incoming gradient is sent unchanged to both the direct path and the sublayer path, then accumulated where routes share an input.'
    },
    {
      beforeHeading: 'Back through the MLP',
      src: 'assets/chapter-14/05_mlp_backward_path.png',
      alt: 'The Gradient Courier moves backward through the MLP’s contraction, activation and expansion stages, leaving parameter-gradient reports at each learned layer.'
    },
    {
      beforeHeading: 'Back through attention retrieval',
      src: 'assets/chapter-14/06_attention_backward_routes.png',
      alt: 'Attention gradients branch through Value mixing, softmax, Query–Key scores and the separate Query, Key and Value projection parameters.'
    },
    {
      beforeHeading: 'Embedding gradients accumulate by token ID',
      src: 'assets/chapter-14/07_embedding_and_tied_gradients.png',
      alt: 'Token occurrences send gradients to their embedding rows, and tied input-output weights accumulate contributions from both computational uses.'
    },
    {
      beforeHeading: 'Gradient clipping',
      src: 'assets/chapter-14/08_accumulation_unscaling_and_clipping.png',
      alt: 'Microbatch gradients accumulate, are unscaled and checked, and may be proportionally clipped before one optimiser step.'
    },
    {
      beforeHeading: 'Coming next: training at scale and changing behaviour',
      src: 'assets/chapter-14/09_exact_weight_update_and_handoff.png',
      alt: 'The Gradient Courier delivers a report, and the Optimizer Engineer uses it with the learning rate to change one weight from 0.2 to approximately 0.255974 before the training-factory handoff.'
    }
  ];

  function normaliseHeading(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function createFigure(item, index) {
    const figure = document.createElement('figure');
    figure.className = 'chapter-artwork chapter-artwork-chapter-14';
    figure.dataset.chapter14ArtworkIndex = String(index + 1);

    const image = document.createElement('img');
    const source = new URL(item.src, window.location.href);
    source.searchParams.set('v', buildVersion);
    image.src = source.href;
    image.alt = item.alt;
    image.loading = item.placement === 'start' ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (item.placement === 'start') image.classList.add('hero');

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
    if (article.dataset.chapter14Artwork === 'done') return true;

    const headings = [...article.querySelectorAll('h1, h2, h3')];
    if (!headings.length) return false;

    let insertedCount = 0;

    artwork.forEach((item, index) => {
      const figure = createFigure(item, index);

      if (item.placement === 'start') {
        article.insertBefore(figure, article.firstChild);
        insertedCount += 1;
        return;
      }

      const expected = normaliseHeading(item.beforeHeading);
      const target = headings.find(heading => normaliseHeading(heading.textContent) === expected);

      if (!target?.parentNode) {
        console.warn(`Could not place Chapter 14 artwork before heading: ${item.beforeHeading}`);
        return;
      }

      target.parentNode.insertBefore(figure, target);
      insertedCount += 1;
    });

    if (insertedCount === artwork.length) {
      article.dataset.chapter14Artwork = 'done';
      return true;
    }

    article.querySelectorAll('figure.chapter-artwork-chapter-14').forEach(figure => figure.remove());
    return false;
  }

  if (integrateArtwork()) return;

  const observer = new MutationObserver(() => {
    if (integrateArtwork()) observer.disconnect();
  });

  observer.observe(article, { childList: true, subtree: true });
})();
