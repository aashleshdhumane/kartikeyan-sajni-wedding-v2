/* =============================================================================
   GUESTBOOK SERVICE
   -----------------------------------------------------------------------------
   A small abstraction so the UI never talks to a backend directly.
   Swap the provider in config.js (guestbook.provider) without touching the UI.

   Public API:
     guestbookService.getMessages()            -> Promise<[{name, message, ts}]>
     guestbookService.addMessage(name, message)-> Promise<{ok, error?, entry?}>

   Providers:
     "local"    -> localStorage (default; works offline, per-device only)
     "supabase" -> stub with clear instructions (see README)
     "firebase" -> stub with clear instructions (see README)

   Security: validation + sanitization live here so every provider benefits.
   ========================================================================== */

(function (global) {
  "use strict";

  var cfg = (global.weddingConfig && global.weddingConfig.guestbook) || {};
  var MAX = cfg.maxLength || 280;
  var STORAGE_KEY = "ks_guestbook_v1";
  var RATE_KEY = "ks_guestbook_last";

  /* ---- Helpers -------------------------------------------------------- */

  // Escape HTML to prevent injection. The UI also uses textContent, but we
  // sanitize at the data layer as defense-in-depth.
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function sanitize(str) {
    // Strip control chars, collapse whitespace, trim.
    return String(str).replace(/[\u0000-\u001F\u007F]/g, "").replace(/\s+/g, " ").trim();
  }

  function validate(name, message) {
    var n = sanitize(name);
    var m = sanitize(message);
    if (!n) return { ok: false, error: "Please enter your name." };
    if (!m) return { ok: false, error: "Please write a message." };
    if (n.length > 60) return { ok: false, error: "Name is too long." };
    if (m.length > MAX) return { ok: false, error: "Message is too long (max " + MAX + ")." };
    // Basic spam guard: reject URLs and obvious script tokens.
    if (/(https?:\/\/|www\.|<script|javascript:)/i.test(m + " " + n)) {
      return { ok: false, error: "Links are not allowed in messages." };
    }
    // Rate limit: one message per 8 seconds per device.
    try {
      var last = Number(localStorage.getItem(RATE_KEY) || 0);
      if (Date.now() - last < 8000) return { ok: false, error: "Please wait a moment before posting again." };
    } catch (e) { /* storage disabled — allow */ }
    return { ok: true, name: n, message: m };
  }

  /* ---- Local (localStorage) provider ---------------------------------- */

  var localProvider = {
    getMessages: function () {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        var list = raw ? JSON.parse(raw) : [];
        return Promise.resolve(Array.isArray(list) ? list : []);
      } catch (e) {
        return Promise.resolve([]);
      }
    },
    addMessage: function (entry) {
      try {
        var raw = localStorage.getItem(STORAGE_KEY);
        var list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) list = [];
        list.unshift(entry);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 200)));
        localStorage.setItem(RATE_KEY, String(Date.now()));
        return Promise.resolve({ ok: true, entry: entry });
      } catch (e) {
        return Promise.resolve({ ok: false, error: "Could not save on this device." });
      }
    },
    isDemo: true,
  };

  /* ---- Supabase provider (stub) --------------------------------------
     To enable: set guestbook.provider = "supabase" and fill supabase.url +
     supabase.anonKey in config.js. Include the supabase-js CDN in index.html.
     Uses ONLY the public anon key. See README for row-level-security rules. */
  var supabaseProvider = {
    _client: null,
    _init: function () {
      if (this._client) return this._client;
      var s = (global.weddingConfig.guestbook.supabase) || {};
      if (global.supabase && s.url && s.anonKey) {
        this._client = global.supabase.createClient(s.url, s.anonKey);
      }
      return this._client;
    },
    getMessages: function () {
      var c = this._init();
      var table = (global.weddingConfig.guestbook.supabase || {}).table || "guestbook";
      if (!c) return Promise.resolve([]);
      return c.from(table).select("name,message,ts").order("ts", { ascending: false }).limit(200)
        .then(function (r) { return r.data || []; })
        .catch(function () { return []; });
    },
    addMessage: function (entry) {
      var c = this._init();
      var table = (global.weddingConfig.guestbook.supabase || {}).table || "guestbook";
      if (!c) return Promise.resolve({ ok: false, error: "Guestbook is not connected yet." });
      return c.from(table).insert([entry]).then(function (r) {
        if (r.error) return { ok: false, error: "Could not send right now." };
        try { localStorage.setItem(RATE_KEY, String(Date.now())); } catch (e) {}
        return { ok: true, entry: entry };
      });
    },
    isDemo: false,
  };

  /* ---- Firebase provider (stub) --------------------------------------
     To enable: set provider="firebase", add Firestore SDK + firebaseConfig,
     and implement using collection "guestbook". See README. */
  var firebaseProvider = {
    getMessages: function () { return Promise.resolve([]); },
    addMessage: function () { return Promise.resolve({ ok: false, error: "Guestbook is not connected yet." }); },
    isDemo: false,
    notImplemented: true,
  };

  function pickProvider() {
    switch ((cfg.provider || "local").toLowerCase()) {
      case "supabase": return supabaseProvider;
      case "firebase": return firebaseProvider;
      default: return localProvider;
    }
  }

  var provider = pickProvider();

  /* ---- Public API ----------------------------------------------------- */
  global.guestbookService = {
    isDemo: !!provider.isDemo,

    getMessages: function () {
      return provider.getMessages().then(function (list) {
        // Ensure shape + escape at read time for safety.
        return (list || []).map(function (e) {
          return {
            name: escapeHTML(e.name || ""),
            message: escapeHTML(e.message || ""),
            ts: e.ts || Date.now(),
          };
        });
      });
    },

    addMessage: function (name, message) {
      var v = validate(name, message);
      if (!v.ok) return Promise.resolve({ ok: false, error: v.error });
      var entry = { name: v.name, message: v.message, ts: Date.now() };
      return provider.addMessage(entry);
    },

    // Exposed for reuse by the UI if needed.
    escapeHTML: escapeHTML,
  };
})(window);
