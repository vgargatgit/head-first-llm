(() => {
  'use strict';

  const SESSION_KEY = 'llms-inside-out-preview-session';
  const SESSION_VERSION = 1;
  const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
  const CREDENTIAL_SALT = 'llms-inside-out-preview-v1';
  const EXPECTED_CREDENTIAL_HASH = '6712a0aefbdd48d8a2331943699ad213a936b20b773d19fcbc32a2410b040989';

  function readSession() {
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (!rawSession) return null;

      const session = JSON.parse(rawSession);
      const isValid = session.version === SESSION_VERSION
        && Number.isFinite(session.expiresAt)
        && session.expiresAt > Date.now();

      if (!isValid) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }

      return session;
    } catch (_error) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
  }

  function isAuthenticated() {
    return Boolean(readSession());
  }

  function toHex(buffer) {
    return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async function sha256(value) {
    if (!window.crypto?.subtle) {
      throw new Error('This browser does not support the required authentication API.');
    }

    const bytes = new TextEncoder().encode(value);
    return toHex(await window.crypto.subtle.digest('SHA-256', bytes));
  }

  function constantTimeEqual(left, right) {
    if (left.length !== right.length) return false;

    let difference = 0;
    for (let index = 0; index < left.length; index += 1) {
      difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
    }
    return difference === 0;
  }

  async function authenticate(username, password) {
    const normalizedUsername = String(username || '').trim();
    const suppliedPassword = String(password || '');
    const credential = `${CREDENTIAL_SALT}\0${normalizedUsername}\0${suppliedPassword}`;
    const suppliedHash = await sha256(credential);
    const authenticated = constantTimeEqual(suppliedHash, EXPECTED_CREDENTIAL_HASH);

    if (authenticated) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        version: SESSION_VERSION,
        expiresAt: Date.now() + SESSION_DURATION_MS
      }));
    }

    return authenticated;
  }

  function buildLoginUrl() {
    const loginUrl = new URL('login.html', window.location.href);
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    loginUrl.searchParams.set('returnTo', returnTo);
    return loginUrl.href;
  }

  function requireAuthentication() {
    if (!isAuthenticated()) {
      window.location.replace(buildLoginUrl());
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.replace(new URL('login.html', window.location.href).href);
  }

  window.BookAuth = Object.freeze({
    authenticate,
    isAuthenticated,
    logout,
    requireAuthentication
  });

  const isLoginPage = /\/login\.html$/.test(window.location.pathname);
  if (!isLoginPage) {
    requireAuthentication();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-logout]').forEach(button => {
      button.addEventListener('click', logout);
    });
  });
})();
