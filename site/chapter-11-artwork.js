(() => {
  'use strict';

  const chapterNumber = Number(new URLSearchParams(window.location.search).get('chapter') || 1);
  if (chapterNumber !== 11) return;

  const article = document.getElementById('chapter');
  if (!article) return;

  const buildVersion = '20260728.15';
  const artwork = [
    {
      placement: 'start',
      src: 'assets/chapter-11/01_chapter_hero_final_audition.png',
      alt: 'SAT carries the final contextual hidden-state case file into the Final Audition, where vocabulary-token candidates wait to receive one raw score each from the vocabulary projection.'
    },
    {
      beforeHeading: 'The language-model output head',
      src: 'assets/chapter-11/02_vocabulary_projection.png',
      alt: 'SAT’s four hidden coordinates pass through a vocabulary projection with one column and bias per token candidate, producing a row containing one scalar logit for each vocabulary entry.'
    },
    {
      beforeHeading: 'Verify the period logit',
      src: 'assets/chapter-11/03_exact_period_logit.png',
      alt: 'The period token’s vocabulary column is dotted with SAT’s four-coordinate hidden state and its bias is added, producing the raw period logit of approximately 1.139041.'
    },
    {
      beforeHeading: 'Logits are scores, not probabilities',
      src: 'assets/chapter-11/04_logits_are_raw_scores.png',
      alt: 'Five vocabulary candidates hold positive and negative logit placards, showing that logits rank candidates but are raw scores rather than percentages or probabilities.'
    },
    {
      beforeHeading: 'Softmax over the vocabulary',
      src: 'assets/chapter-11/05_vocabulary_softmax.png',
      alt: 'All five vocabulary logits enter one vocabulary-wide softmax machine and return as candidate probabilities that sum to one, with an inset showing maximum-logit subtraction for numerical stability.'
    },
    {
      beforeHeading: 'Greedy decoding',
      src: 'assets/chapter-11/06_greedy_vs_sampling.png',
      alt: 'The same model probability distribution enters two decoding lanes: greedy decoding selects the highest-probability period, while sampling draws a token according to the probability shares.'
    },
    {
      beforeHeading: 'Temperature',
      src: 'assets/chapter-11/07_temperature_dial.png',
      alt: 'A temperature dial rescales the same vocabulary logits before softmax, creating a sharper distribution at low temperature and a flatter distribution at high temperature without changing model weights.'
    },
    {
      beforeHeading: 'Top-k sampling',
      src: 'assets/chapter-11/08_topk_and_topp.png',
      alt: 'Top-k admits a fixed number of highest-ranked candidates, while top-p admits the smallest leading set whose cumulative probability reaches its threshold; retained probabilities are then renormalised.'
    },
    {
      beforeHeading: 'Input embeddings and output weights can be tied',
      src: 'assets/chapter-11/09_weight_tying.png',
      alt: 'An input embedding lookup and the output vocabulary projection share one parameter ledger when weights are tied, while their arrows show that lookup and vocabulary scoring remain different computations.'
    },
    {
      beforeHeading: 'The autoregressive generation loop',
      src: 'assets/chapter-11/10_autoregressive_generation_loop.png',
      alt: 'A nine-stage autoregressive loop takes the current prefix through the Transformer tower, logits, probabilities and decoding, appends one selected token, assigns its next position, extends the KV cache and repeats until a stopping rule.'
    },
    {
      beforeHeading: 'Coming next: how the model learns',
      src: 'assets/chapter-11/11_tokens_and_training_handoff.png',
      alt: 'Whole-word, fragment, punctuation, whitespace-prefixed and special tokens appear beside the model’s probability distribution and a sealed correct-next-token answer card, handing the story to the Answer-Key Clerk for training.'
    }
  ];

  function normaliseHeading(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function createFigure(item, index) {
    const figure = document.createElement('figure');
    figure.className = 'chapter-artwork chapter-artwork-chapter-11';
    figure.dataset.chapter11ArtworkIndex = String(index + 1);

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
    if (article.dataset.chapter11Artwork === 'done') return true;

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
        console.warn(`Could not place Chapter 11 artwork before heading: ${item.beforeHeading}`);
        return;
      }

      target.parentNode.insertBefore(figure, target);
      insertedCount += 1;
    });

    if (insertedCount === artwork.length) {
      article.dataset.chapter11Artwork = 'done';
      return true;
    }

    article.querySelectorAll('figure.chapter-artwork-chapter-11').forEach(figure => figure.remove());
    return false;
  }

  if (integrateArtwork()) return;

  const observer = new MutationObserver(() => {
    if (integrateArtwork()) observer.disconnect();
  });

  observer.observe(article, { childList: true, subtree: true });
})();
