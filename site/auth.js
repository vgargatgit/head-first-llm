(() => {
  'use strict';

  const SESSION_KEY = 'llms-inside-out-preview-session';
  const SESSION_VERSION = 2;
  const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
  const CONFIG = Object.freeze({
    hash: 'SHA-256',
    iterations: 1200000,
    salt: 'PuFKJcg5B6IFHZd9eqEKs1AAB0yGXLC0KQkvTUlfdWE=',
    verifier: '7F/CURC/Ommq1ugtkSfgGjCeWifK3JFQWtV3zwiS/vg='
  });

  let failures = 0;

  const fromBase64 = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));

  function constantTimeEqual(left, right) {
    let difference = left.length ^ right.length;
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
      difference |= (left[index] || 0) ^ (right[index] || 0);
    }
    return difference === 0;
  }

  function readSession() {
    try {
      const rawSession = sessionStorage.getItem(SESSION_KEY);
      if (!rawSession) return null;

      const session = JSON.parse(rawSession);
      const valid = session.version === SESSION_VERSION
        && Number.isFinite(session.expiresAt)
        && session.expiresAt > Date.now();

      if (!valid) {
        sessionStorage.removeItem(SESSION_KEY);
        return null;
      }

      return session;
    } catch (_error) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function isAuthenticated() {
    return Boolean(readSession());
  }

  async function deriveVerifier(userValue, secretValue) {
    if (!window.crypto?.subtle || !window.isSecureContext) {
      throw new Error('A secure browser context with Web Crypto is required.');
    }

    const normalizedUser = String(userValue || '').trim().toLowerCase();
    const normalizedSecret = String(secretValue || '');
    const material = new TextEncoder().encode(`${normalizedUser}\0${normalizedSecret}`);
    const keyMaterial = await crypto.subtle.importKey('raw', material, 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({
      name: 'PBKDF2',
      hash: CONFIG.hash,
      salt: fromBase64(CONFIG.salt),
      iterations: CONFIG.iterations
    }, keyMaterial, 256);

    return new Uint8Array(bits);
  }

  async function authenticate(userValue, secretValue) {
    const supplied = await deriveVerifier(userValue, secretValue);
    const authenticated = constantTimeEqual(supplied, fromBase64(CONFIG.verifier));

    if (!authenticated) {
      failures += 1;
      const delay = Math.min(5000, 500 * (2 ** Math.min(failures, 4)));
      await new Promise(resolve => setTimeout(resolve, delay));
      return false;
    }

    failures = 0;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      version: SESSION_VERSION,
      expiresAt: Date.now() + SESSION_DURATION_MS
    }));
    return true;
  }

  function buildLoginUrl() {
    const loginUrl = new URL('login.html', window.location.href);
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    loginUrl.searchParams.set('returnTo', returnTo);
    return loginUrl.href;
  }

  function requireAuthentication() {
    if (!isAuthenticated()) window.location.replace(buildLoginUrl());
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_KEY);
    window.location.replace(new URL('login.html', window.location.href).href);
  }

  window.BookAuth = Object.freeze({ authenticate, isAuthenticated, logout, requireAuthentication });

  const isLoginPage = /(?:^|\/)login\.html$/.test(window.location.pathname);
  if (!isLoginPage) requireAuthentication();

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-logout]').forEach(button => {
      button.addEventListener('click', logout);
    });
  });
})();