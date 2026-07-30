(() => {
  'use strict';

  const chapterNumber = Number(new URLSearchParams(window.location.search).get('chapter') || 1);
  if (chapterNumber !== 12) return;

  const article = document.getElementById('chapter');
  if (!article) return;

  const buildVersion = '20260730.4';
  const artwork = [
    {
      placement: 'start',
      src: 'assets/chapter-12/01_chapter_hero_answer_key_clerk.png',
      alt: 'SAT brings a next-token probability distribution to the Answer-Key Clerk, who holds the known correct token used during training.'
    },
    {
      beforeHeading: 'Cold open: the sentence becomes a classroom',
      src: 'assets/chapter-12/02_building_training_examples.png',
      alt: 'One token sequence is divided into several training examples, each pairing the visible prefix with its known next token.'
    },
    {
      beforeHeading: 'Shift the sequence by one position',
      src: 'assets/chapter-12/03_shifted_targets.png',
      alt: 'The training sequence is aligned with a target sequence shifted one position ahead, so THE predicts CAT, CAT predicts SAT, and SAT predicts the period.'
    },
    {
      beforeHeading: 'A probability record for the next chapter',
      src: 'assets/chapter-12/04_what_cross_entropy_wants.png',
      alt: 'Good and bad next-token predictions are contrasted to show that training rewards assigning high probability to the known correct token.'
    },
    {
      beforeHeading: 'Common training-example mistakes',
      src: 'assets/chapter-12/05_exact_loss_one_position.png',
      alt: 'A preview calculation takes the negative logarithm of the probability assigned to the correct period token to obtain one-position cross-entropy loss.'
    },
    {
      beforeHeading: 'Checkpoint',
      src: 'assets/chapter-12/06_averaging_loss_across_positions.png',
      alt: 'Three next-token positions contribute separate losses that are averaged into one training objective.'
    },
    {
      beforeHeading: 'Chapter takeaway',
      src: 'assets/chapter-12/07_feedback_flows_back.png',
      alt: 'The forward prediction path produces probabilities and loss, while feedback arrows preview how gradients flow back through the vocabulary head and earlier layers.'
    },
    {
      beforeHeading: 'Coming next: meet the scorekeeper',
      src: 'assets/chapter-12/08_training_loop.png',
      alt: 'The complete training loop moves from a prefix through prediction, comparison with the known answer, loss, backpropagation and weight updates to an improved next pass.'
    }
  ];

  function normaliseHeading(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function createFigure(item, index) {
    const figure = document.createElement('figure');
    figure.className = 'chapter-artwork chapter-artwork-chapter-12';
    figure.dataset.chapter12ArtworkIndex = String(index + 1);

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
    if (article.dataset.chapter12Artwork === 'done') return true;

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
        console.warn(`Could not place Chapter 12 artwork before heading: ${item.beforeHeading}`);
        return;
      }

      target.parentNode.insertBefore(figure, target);
      insertedCount += 1;
    });

    if (insertedCount === artwork.length) {
      article.dataset.chapter12Artwork = 'done';
      return true;
    }

    article.querySelectorAll('figure.chapter-artwork-chapter-12').forEach(figure => figure.remove());
    return false;
  }

  if (integrateArtwork()) return;

  const observer = new MutationObserver(() => {
    if (integrateArtwork()) observer.disconnect();
  });

  observer.observe(article, { childList: true, subtree: true });
})();
