(() => {
  'use strict';

  const chapterNumber = Number(new URLSearchParams(window.location.search).get('chapter') || 1);
  if (chapterNumber !== 8) return;

  const article = document.getElementById('chapter');
  if (!article) return;

  const buildVersion = '20260728.13';
  const artwork = [
    {
      placement: 'start',
      src: 'assets/chapter-08/01_chapter_hero_private_thinking_room.png',
      alt: 'After a shared attention meeting, THE, CAT, and SAT enter separate but identical private MLP rooms that transform each token row independently using one shared parameter blueprint.'
    },
    {
      beforeHeading: 'Expand, activate, contract',
      src: 'assets/chapter-08/02_expand_activate_contract.png',
      alt: 'A cartoon MLP pipeline expands one four-feature token row through W1 into six intermediate features, applies ReLU coordinate by coordinate, and contracts the result through W2 into a four-feature update.'
    },
    {
      beforeHeading: "Calculate SAT's expanded representation",
      src: 'assets/chapter-08/03_exact_sat_expansion.png',
      alt: 'SAT’s four input features multiply the four-by-six W1 matrix and add b1, with the first expanded coordinate verified and all six pre-activation values displayed.'
    },
    {
      beforeHeading: 'Apply the activation',
      src: 'assets/chapter-08/04_activation_gate.png',
      alt: 'Six ReLU gates retain SAT’s positive intermediate features and replace the negative fourth coordinate with zero; THE and CAT show different activation patterns under the same rule.'
    },
    {
      beforeHeading: 'Contract SAT back to the model width',
      src: 'assets/chapter-08/05_exact_sat_contraction.png',
      alt: 'SAT’s six activated features multiply the six-by-four W2 matrix and add b2, producing a four-coordinate MLP update whose first coordinate is verified.'
    },
    {
      beforeHeading: 'Calculate the MLP for every token',
      src: 'assets/chapter-08/06_positionwise_shared_mlp.png',
      alt: 'THE, CAT, and SAT travel through separate copies of the same position-wise MLP, sharing W1, b1, W2, and b2 while producing different P, U, and F rows without cross-token mixing.'
    },
    {
      beforeHeading: 'The second residual connection',
      src: 'assets/chapter-08/07_mlp_residual_and_norm.png',
      alt: 'The three-by-four MLP update joins the residual highway at a second addition junction, and row-wise LayerNorm produces the completed three-by-four Transformer block output.'
    },
    {
      beforeHeading: 'Chapter takeaway',
      src: 'assets/chapter-08/08_complete_transformer_block_and_rewind.png',
      alt: 'A complete Transformer block floor plan shows attention, the first residual and normalisation, the private position-wise MLP, and the second residual and normalisation, followed by a rewind toward positional information.'
    }
  ];

  function normaliseHeading(text) {
    return text.replace(/\s+/g, ' ').trim().toLowerCase();
  }

  function createFigure(item, index) {
    const figure = document.createElement('figure');
    figure.className = 'chapter-artwork chapter-artwork-chapter-08';
    figure.dataset.chapter08ArtworkIndex = String(index + 1);

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
    if (article.dataset.chapter08Artwork === 'done') return true;

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
        console.warn(`Could not place Chapter 8 artwork before heading: ${item.beforeHeading}`);
        return;
      }

      target.parentNode.insertBefore(figure, target);
      insertedCount += 1;
    });

    if (insertedCount === artwork.length) {
      article.dataset.chapter08Artwork = 'done';
      return true;
    }

    article.querySelectorAll('figure.chapter-artwork-chapter-08').forEach(figure => figure.remove());
    return false;
  }

  if (integrateArtwork()) return;

  const observer = new MutationObserver(() => {
    if (integrateArtwork()) observer.disconnect();
  });

  observer.observe(article, { childList: true, subtree: true });
})();
