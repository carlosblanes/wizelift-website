/*
 * wizelift.com/app/* -> https://wizelift.app/* (4-nov-2026).
 *
 * The coach web app lived here, on the marketing site's origin, until it moved
 * to its own (wizelift.app: HSTS-preloaded, and no marketing scripts beside the
 * session). A coach who signed in here still has a refresh token in THIS
 * origin's localStorage: a standing permission to mint access tokens, readable
 * by any script the marketing site runs. So first remove everything the app
 * stored here, then forward to the same path, query and hash on the new origin.
 *
 * The keys are the app's (wizelift-webapp/src/renderer): supabase.ts AUTH_KEY
 * 'wizelift-web-auth' (+ supabase-js's '-code-verifier' / '-user' suffixes),
 * settings.ts 'wizelift-web-prefs', Plan.tsx 'wizelift-web-shortOnTime',
 * Settings.tsx 'wizelift-language', and any default supabase-js 'sb-*' key.
 * The website's own keys ('wizelift_lang', cart, promo, last order) use
 * underscores and are left alone.
 *
 * Also loaded by website/404.html for /app/<anything> (scripts/deploy-website.sh).
 */
(function () {
  'use strict';
  var NEW_ORIGIN = 'https://wizelift.app';

  try {
    var store = window.localStorage;
    for (var i = store.length - 1; i >= 0; i--) {
      var k = store.key(i);
      if (k && (k.indexOf('wizelift-web-') === 0 || k.indexOf('sb-') === 0 || k === 'wizelift-language')) {
        store.removeItem(k);
      }
    }
  } catch (e) { /* storage blocked: nothing we can read, nothing to remove */ }

  /* "/app/x" -> "/x"; also under the GitHub Pages project path "/wizelift-website/app/x". */
  var path = window.location.pathname.replace(/^.*?\/app(?=\/|$)/, '') || '/';
  var target;
  try {
    target = new URL(path + window.location.search + window.location.hash, NEW_ORIGIN);
    /* "//host" paths resolve to another host: never leave wizelift.app. */
    if (target.origin !== NEW_ORIGIN) target = new URL('/', NEW_ORIGIN);
  } catch (e) {
    target = new URL('/', NEW_ORIGIN);
  }
  window.location.replace(target.href);
})();
