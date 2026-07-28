(() => {
  'use strict';

  const chapterNumber = Number(new URLSearchParams(window.location.search).get('chapter') || 1);
  if (chapterNumber !== 7) return;

  const article = document.getElementById('chapter');
  if (!article) return;

  const buildVersion = '20260728.14';

  function useRefinedPngAssets() {
    const images = [...article.querySelectorAll('img')];
    let foundChapterArtwork = false;

    images.forEach(image => {
      const source = image.getAttribute('src') || '';
      if (!source.includes('assets/chapter-07/')) return;

      foundChapterArtwork = true;
      if (image.dataset.chapter07RefinedAsset === 'done') return;

      const refinedSource = new URL(source.replace(/\.webp(?=$|\?)/i, '.png'), window.location.href);
      refinedSource.searchParams.set('v', buildVersion);

      image.src = refinedSource.href;
      image.dataset.chapter07RefinedAsset = 'done';
      image.loading = image.classList.contains('hero') ? 'eager' : 'lazy';
      image.decoding = 'async';
    });

    return foundChapterArtwork;
  }

  if (useRefinedPngAssets()) return;

  const observer = new MutationObserver(() => {
    if (useRefinedPngAssets()) observer.disconnect();
  });

  observer.observe(article, { childList: true, subtree: true });
})();
