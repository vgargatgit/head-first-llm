(() => {
  'use strict';

  const EDITION_VERSION = '20260730.5';

  function isChapterUrl(url) {
    return /\/chapter\.html$/.test(url.pathname) && url.searchParams.has('chapter');
  }

  function rewriteLink(link) {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    let url;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin || !isChapterUrl(url)) return;
    if (url.searchParams.get('v') === EDITION_VERSION) return;

    url.searchParams.set('v', EDITION_VERSION);
    link.href = url.href;
  }

  function refreshChapterLinks(root = document) {
    if (root instanceof HTMLAnchorElement) rewriteLink(root);
    root.querySelectorAll?.('a[href]').forEach(rewriteLink);
  }

  function refreshCurrentChapterUrl() {
    const current = new URL(window.location.href);
    if (!isChapterUrl(current) || current.searchParams.get('v') === EDITION_VERSION) return;
    current.searchParams.set('v', EDITION_VERSION);
    window.history.replaceState(window.history.state, '', current);
  }

  refreshCurrentChapterUrl();
  refreshChapterLinks();

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes') {
        refreshChapterLinks(mutation.target);
        return;
      }

      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) refreshChapterLinks(node);
      });
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });

  window.BOOK_EDITION_VERSION = EDITION_VERSION;
})();
