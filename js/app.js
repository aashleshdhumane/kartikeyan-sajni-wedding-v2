/* =============================================================================
   APP — renders the invitation from weddingConfig and wires up interactions.
   Every section reads from config and hides itself when not configured, so the
   invitation never looks broken.
   ========================================================================== */

(function (global) {
  "use strict";

  var cfg = global.weddingConfig || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text; // textContent => safe from injection
    return e;
  }
  function hideSection(id) { var s = document.getElementById(id); if (s) s.hidden = true; }
  function showSection(id) { var s = document.getElementById(id); if (s) s.hidden = false; }

  /* ----------------------------- Motif SVGs ---------------------------- */
  var ICONS = {
    mehendi: '<svg viewBox="0 0 24 24" fill="none" stroke="#5c1a2b" stroke-width="1.4"><path d="M12 3c2 3 5 4 5 8a5 5 0 0 1-10 0c0-4 3-5 5-8z"/><path d="M12 21v-5"/></svg>',
    haldi: '<svg viewBox="0 0 24 24" fill="none" stroke="#b58a3c" stroke-width="1.4"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    sangeet: '<svg viewBox="0 0 24 24" fill="none" stroke="#1f4436" stroke-width="1.4"><path d="M9 18V5l10-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></svg>',
    wedding: '<svg viewBox="0 0 24 24" fill="none" stroke="#5c1a2b" stroke-width="1.4"><circle cx="8" cy="15" r="5"/><circle cx="16" cy="15" r="5"/><path d="M8 10V4M16 10V4M6 4h4M14 4h4"/></svg>',
    reception: '<svg viewBox="0 0 24 24" fill="none" stroke="#b58a3c" stroke-width="1.4"><path d="M4 20h16M6 20v-6a6 6 0 0 1 12 0v6M12 8V4"/><path d="M9 4h6"/></svg>',
    default: '<svg viewBox="0 0 24 24" fill="none" stroke="#b58a3c" stroke-width="1.4"><path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z"/></svg>',
  };

  function venueOf(key) { return (cfg.venues && cfg.venues[key]) || null; }

  function mapsButton(venue) {
    if (!venue || !venue.mapsUrl) return null; // hide if no maps URL
    var a = el("a", "btn btn--outline");
    a.href = venue.mapsUrl;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = "\uD83D\uDCCD Get Directions";
    return a;
  }

  /* =============================== HERO ============================== */
  function renderHero() {
    if (cfg.groom && cfg.groom.name) $("#heroGroom").textContent = cfg.groom.name;
    if (cfg.bride && cfg.bride.name) $("#heroBride").textContent = cfg.bride.name;
    if (cfg.wedding && cfg.wedding.displayDate) $("#heroDate").textContent = cfg.wedding.displayDate;
    if (cfg.hashtag) $("#heroHashtag").textContent = cfg.hashtag;

    // Opening screen names (guard against markup changes)
    var op = $(".opening__names");
    if (op && op.children && op.children.length >= 3 && cfg.groom && cfg.bride) {
      op.children[0].textContent = cfg.groom.firstName || cfg.groom.name;
      op.children[2].textContent = cfg.bride.firstName || cfg.bride.name;
    }
    document.title = "The Wedding of " + (cfg.groom.firstName || "") + " \u0026 " + (cfg.bride.firstName || "");
    $("#footerNames").textContent = (cfg.groom.firstName || "") + " \u0026 " + (cfg.bride.firstName || "");
  }

  /* ---- Floating petals (respect reduced motion) ---- */
  function renderPetals() {
    var reduce = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    var host = $(".petals");
    if (!host) return;
    var count = 10;
    for (var i = 0; i < count; i++) {
      var p = el("span", "petal");
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDuration = 8 + Math.random() * 8 + "s";
      p.style.animationDelay = Math.random() * 8 + "s";
      var scale = 0.6 + Math.random() * 0.9;
      p.style.transform = "scale(" + scale + ")";
      host.appendChild(p);
    }
  }

  /* ============================= SUMMARY ============================= */
  function renderSummary() {
    var card = $("#summaryCard");
    var w = cfg.wedding || {};
    var venue = venueOf(cfg.primaryVenueKey);
    card.innerHTML = "";
    card.appendChild(el("p", "summary__label", "Wedding Ceremony"));
    if (w.displayDate) card.appendChild(el("p", "summary__date", w.displayDate));
    if (w.displayTime) card.appendChild(el("p", "summary__time", w.displayTime));
    if (venue) {
      if (venue.name) card.appendChild(el("p", "summary__venue", venue.name));
      var addr = [venue.address, venue.city].filter(Boolean).join(" \u2022 ");
      if (addr) card.appendChild(el("p", "summary__address", venue.address || addr));
      var mb = mapsButton(venue);
      if (mb) card.appendChild(mb);
    }
  }

  /* ============================ COUNTDOWN =========================== */
  function renderCountdown() {
    var w = cfg.wedding || {};
    global.WeddingCountdown.start(w.date, $("#countdownGrid"));
  }

  /* ============================= MESSAGE ============================= */
  function renderMessage() {
    if (cfg.invitationMessage) $("#invitationMessage").textContent = cfg.invitationMessage;
    else hideSection("message");
  }

  /* ============================== STORY ============================= */
  function renderStory() {
    var s = cfg.story || {};
    if (s.enabled && s.text && s.text.trim()) {
      $("#storyText").textContent = s.text;
      showSection("story");
    } else {
      hideSection("story");
    }
  }

  /* ============================= EVENTS ============================= */
  function renderEvents() {
    var list = $("#eventsList");
    var events = (cfg.events || []).filter(function (e) { return e && e.enabled !== false && e.name; });
    if (!events.length) { hideSection("events"); return; }
    list.innerHTML = "";
    events.forEach(function (ev) {
      var venue = venueOf(ev.venueKey);
      var card = el("article", "event anim");

      var head = el("div", "event__head");
      var icon = el("div", "event__icon");
      icon.innerHTML = ICONS[ev.icon] || ICONS.default;
      head.appendChild(icon);
      head.appendChild(el("h3", "event__name", ev.name));
      card.appendChild(head);

      var meta = el("div", "event__meta");
      function row(label, value) {
        if (!value) return;
        var r = el("div", "row");
        r.appendChild(el("b", null, label));
        r.appendChild(el("span", null, value));
        meta.appendChild(r);
      }
      row("Date", ev.date);
      row("Time", ev.time);
      if (venue) {
        row("Venue", venue.name);
        row("Where", venue.address);
      }
      card.appendChild(meta);

      if (ev.description) card.appendChild(el("p", "event__desc", ev.description));

      var mb = mapsButton(venue);
      if (mb) card.appendChild(mb);

      list.appendChild(card);
    });
  }

  /* ============================ FAMILIES ============================ */
  function renderFamilyCard(fam) {
    if (!fam) return null;
    var groups = [
      { key: "parents", label: "Parents" },
      { key: "siblings", label: "Brothers & Sisters" },
      { key: "elders", label: "Elders" },
      { key: "others", label: "With Best Wishes From" },
    ];
    var hasAny = groups.some(function (g) { return (fam[g.key] || []).length; });
    if (!hasAny) return null;

    var card = el("article", "family-card anim");
    card.appendChild(el("h3", "family-card__title", fam.label || "Our Family"));
    var div = el("div", "divider"); div.appendChild(el("span")); card.appendChild(div);

    groups.forEach(function (g) {
      var items = (fam[g.key] || []).filter(Boolean);
      if (!items.length) return;
      var group = el("div", "family-group");
      group.appendChild(el("p", "family-group__label", g.label));
      var ul = el("ul");
      items.forEach(function (name) { ul.appendChild(el("li", null, name)); });
      group.appendChild(ul);
      card.appendChild(group);
    });
    return card;
  }

  function renderFamilies() {
    var grid = $("#familiesGrid");
    grid.innerHTML = "";
    var g = renderFamilyCard(cfg.groomFamily);
    var b = renderFamilyCard(cfg.brideFamily);
    if (!g && !b) { hideSection("families"); return; }
    if (g) grid.appendChild(g);
    if (b) grid.appendChild(b);
  }

  /* ============================= GALLERY ============================ */
  var galleryImages = [];
  function renderGallery() {
    var imgs = (cfg.gallery || []).filter(function (x) { return x && x.src; });
    if (!imgs.length) { hideSection("gallery"); return; }
    galleryImages = imgs;
    var grid = $("#galleryGrid");
    grid.innerHTML = "";
    imgs.forEach(function (item, i) {
      var btn = el("button", "gallery__item");
      btn.type = "button";
      btn.setAttribute("aria-label", "Open photo " + (i + 1));
      var img = el("img");
      img.src = item.src;
      img.alt = item.alt || "Wedding photo";
      img.loading = "lazy";
      img.decoding = "async";
      btn.appendChild(img);
      btn.addEventListener("click", function () { openLightbox(i); });
      grid.appendChild(btn);
    });
    showSection("gallery");
  }

  /* ============================ GUEST INFO ========================== */
  function renderInfo() {
    var grid = $("#infoGrid");
    var gi = cfg.guestInfo || {};
    var map = [
      { key: "dressCode", icon: "\uD83D\uDC57", label: "Dress Code" },
      { key: "parking", icon: "\uD83C\uDD7F\uFE0F", label: "Parking" },
      { key: "accommodation", icon: "\uD83C\uDFE8", label: "Stay" },
      { key: "travel", icon: "\u2708\uFE0F", label: "Getting There" },
      { key: "shuttle", icon: "\uD83D\uDE90", label: "Shuttle" },
      { key: "notes", icon: "\uD83D\uDCDD", label: "Please Note" },
    ];
    grid.innerHTML = "";
    var any = false;
    map.forEach(function (m) {
      var val = gi[m.key];
      if (!val || !String(val).trim()) return;
      any = true;
      var card = el("div", "info-card anim");
      card.appendChild(el("span", "info-card__icon", m.icon));
      var body = el("div");
      body.appendChild(el("p", "info-card__label", m.label));
      body.appendChild(el("p", "info-card__value", val));
      card.appendChild(body);
      grid.appendChild(card);
    });
    if (!any) hideSection("info");
  }

  /* ============================== RSVP ============================== */
  function renderRSVP() {
    var r = cfg.rsvp || {};
    if (r.enabled === false) { hideSection("rsvp"); return; }
    var box = $("#rsvpBox");
    box.innerHTML = "";

    function actionButton(label, cls, positive) {
      var b;
      if (r.formUrl) {
        b = el("a", "btn " + cls);
        b.href = r.formUrl; b.target = "_blank"; b.rel = "noopener";
        b.textContent = label;
      } else if (r.whatsappNumber) {
        b = el("a", "btn " + cls);
        var msg = positive
          ? "We would love to attend the wedding of " + cfg.groom.firstName + " & " + cfg.bride.firstName + " \u2764\ufe0f"
          : "With regret, we are unable to attend the wedding of " + cfg.groom.firstName + " & " + cfg.bride.firstName + ".";
        b.href = global.WeddingShare.whatsappTo(r.whatsappNumber, msg);
        b.target = "_blank"; b.rel = "noopener";
        b.textContent = label;
      } else {
        b = el("button", "btn " + cls); b.type = "button";
        b.textContent = label;
        b.addEventListener("click", function () {
          $("#rsvpNote").textContent = "Thank you! RSVP is in demo mode — connect a form or WhatsApp number in config.js.";
        });
      }
      return b;
    }

    box.appendChild(actionButton("Yes, I'll be there \u2764\ufe0f", "btn--primary btn--block", true));
    box.appendChild(actionButton("Sorry, I can't make it", "btn--ghost btn--block", false));

    if (!r.formUrl && !r.whatsappNumber) {
      $("#rsvpNote").textContent = "RSVP is currently in demo mode.";
    }
  }

  /* ============================ BLESSINGS =========================== */
  function renderBlessings() {
    var g = cfg.gift || {};
    if (g.enabled === false) { hideSection("blessings"); return; }
    var box = $("#blessingsBox");
    box.innerHTML = "";
    if (g.message) box.appendChild(el("p", "blessings__msg", g.message));

    var img = el("img", "blessings__qr");
    img.alt = "Scan to send your blessings";
    img.loading = "lazy";
    img.src = g.qrImage || "assets/gift-qr.png";
    // Graceful placeholder if QR missing.
    img.onerror = function () {
      img.replaceWith(makeQRPlaceholder());
    };
    box.appendChild(img);
    box.appendChild(el("p", "blessings__scan", "Scan to send your blessings"));
    if (g.upiId) box.appendChild(el("p", "blessings__upi", g.upiId));
    if (g.bankNote) box.appendChild(el("p", "blessings__msg", g.bankNote));
  }

  function makeQRPlaceholder() {
    var d = el("div", "blessings__qr");
    d.style.display = "flex";
    d.style.alignItems = "center";
    d.style.justifyContent = "center";
    d.style.color = "#6b5a4f";
    d.style.fontSize = "0.8rem";
    d.style.textAlign = "center";
    d.textContent = "Add gift-qr.png";
    return d;
  }

  /* ============================= CONTACT ============================ */
  function renderContacts() {
    var grid = $("#contactGrid");
    var contacts = (cfg.contacts || []).filter(function (c) { return c && (c.phone || c.whatsapp); });
    if (!contacts.length) { hideSection("contact"); return; }
    grid.innerHTML = "";
    contacts.forEach(function (c) {
      var card = el("div", "contact-card anim");
      if (c.label) card.appendChild(el("p", "contact-card__label", c.label));
      if (c.name) card.appendChild(el("p", "contact-card__name", c.name));
      var btns = el("div", "contact-card__btns");
      if (c.phone) {
        var call = el("a", "btn btn--outline");
        call.href = "tel:" + c.phone;
        call.textContent = "Call";
        btns.appendChild(call);
      }
      if (c.whatsapp) {
        var wa = el("a", "btn btn--emerald");
        wa.href = global.WeddingShare.whatsappTo(c.whatsapp, "Hello! Regarding the wedding of " + cfg.groom.firstName + " & " + cfg.bride.firstName + ".");
        wa.target = "_blank"; wa.rel = "noopener";
        wa.textContent = "WhatsApp";
        btns.appendChild(wa);
      }
      card.appendChild(btns);
      grid.appendChild(card);
    });
  }

  /* ============================ GUESTBOOK =========================== */
  function timeAgo(ts) {
    var d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  }

  function renderGuestbookList() {
    var listEl = $("#guestbookList");
    return global.guestbookService.getMessages().then(function (msgs) {
      listEl.innerHTML = "";
      if (!msgs.length) {
        var empty = el("li", "guestbook__empty", "Be the first to leave your wishes.");
        listEl.appendChild(empty);
        return;
      }
      msgs.forEach(function (m) {
        var li = el("li", "gb-msg");
        // service already escaped; assign via textContent for extra safety.
        var name = el("p", "gb-msg__name");
        name.innerHTML = m.name;      // pre-escaped HTML entities
        var text = el("p", "gb-msg__text");
        text.innerHTML = m.message;   // pre-escaped HTML entities
        li.appendChild(name);
        li.appendChild(text);
        if (m.ts) li.appendChild(el("p", "gb-msg__date", timeAgo(m.ts)));
        listEl.appendChild(li);
      });
    });
  }

  function initGuestbook() {
    var gb = cfg.guestbook || {};
    if (gb.enabled === false) { hideSection("guestbook"); return; }

    var form = $("#guestbookForm");
    var nameEl = $("#gbName");
    var msgEl = $("#gbMessage");
    var countEl = $("#gbCount");
    var statusEl = $("#gbStatus");
    var max = gb.maxLength || 280;

    msgEl.setAttribute("maxlength", String(max));
    function updateCount() { countEl.textContent = (max - msgEl.value.length) + " characters left"; }
    updateCount();
    msgEl.addEventListener("input", updateCount);

    // Demo-mode hint
    if (global.guestbookService.isDemo) {
      statusEl.classList.remove("is-error");
      statusEl.textContent = "Demo mode: messages are saved on this device only.";
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.classList.remove("is-error");
      statusEl.textContent = "Sending…";
      global.guestbookService.addMessage(nameEl.value, msgEl.value).then(function (res) {
        if (res.ok) {
          form.reset();
          updateCount();
          statusEl.textContent = "Thank you for your wishes \u2764\ufe0f";
          renderGuestbookList();
        } else {
          statusEl.classList.add("is-error");
          statusEl.textContent = res.error || "Could not send.";
        }
      });
    });

    renderGuestbookList();
  }

  /* ============================ NAVIGATION ========================== */
  function renderNav() {
    var nav = $("#nav");
    var menu = $("#navMenu");
    var items = (cfg.nav || []).filter(function (n) {
      var sec = document.getElementById(n.id);
      return sec && !sec.hidden;
    });
    menu.innerHTML = "";
    items.forEach(function (n) {
      var li = el("li");
      var a = el("a", null, n.label);
      a.href = "#" + n.id;
      a.addEventListener("click", function () { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); });
      li.appendChild(a);
      menu.appendChild(li);
    });

    var toggle = $("#navToggle");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ============================== MUSIC ============================= */
  function initMusic() {
    var m = cfg.music || {};
    var btn = $("#musicBtn");
    if (!m.enabled || !m.src) { btn.hidden = true; return; }
    btn.hidden = false;

    var audio = new Audio(m.src);
    audio.loop = true;
    var playing = false;

    // Restore preference (never autoplay without a gesture though).
    try {
      if (localStorage.getItem("ks_music") === "on") {
        // Wait for first interaction to actually start (mobile policy).
      }
    } catch (e) {}

    btn.addEventListener("click", function () {
      if (playing) {
        audio.pause();
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "Play music");
        try { localStorage.setItem("ks_music", "off"); } catch (e) {}
      } else {
        audio.play().catch(function () {});
        btn.classList.add("is-playing");
        btn.setAttribute("aria-label", "Pause music");
        try { localStorage.setItem("ks_music", "on"); } catch (e) {}
      }
      playing = !playing;
    });
  }

  /* ============================ LIGHTBOX ============================ */
  var lbIndex = 0;
  function openLightbox(i) {
    lbIndex = i;
    var lb = $("#lightbox");
    lb.hidden = false;
    updateLightbox();
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    $("#lightbox").hidden = true;
    document.body.style.overflow = "";
  }
  function updateLightbox() {
    var item = galleryImages[lbIndex];
    if (!item) return;
    var img = $("#lbImg");
    img.src = item.src;
    img.alt = item.alt || "Wedding photo";
  }
  function lbStep(dir) {
    if (!galleryImages.length) return;
    lbIndex = (lbIndex + dir + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }
  function initLightbox() {
    $("#lbClose").addEventListener("click", closeLightbox);
    $("#lbPrev").addEventListener("click", function () { lbStep(-1); });
    $("#lbNext").addEventListener("click", function () { lbStep(1); });
    $("#lightbox").addEventListener("click", function (e) { if (e.target === this) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if ($("#lightbox").hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") lbStep(-1);
      if (e.key === "ArrowRight") lbStep(1);
    });
    // Swipe support
    var startX = 0;
    var lb = $("#lightbox");
    lb.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) lbStep(dx < 0 ? 1 : -1);
    });
  }

  /* ========================== ACTIONS / FABS ======================== */
  function initActions() {
    // Save the date
    $("#saveDateBtn").addEventListener("click", function () {
      var w = cfg.wedding || {};
      var venue = venueOf(cfg.primaryVenueKey) || {};
      global.WeddingCalendar.download({
        title: "Wedding: " + cfg.groom.firstName + " \u0026 " + cfg.bride.firstName,
        startISO: w.date,
        endISO: w.endDate,
        location: [venue.name, venue.address].filter(Boolean).join(", "),
        description: "Join us to celebrate the wedding of " + cfg.groom.name + " and " + cfg.bride.name + ". " + (cfg.hashtag || ""),
      }, "kartikeyan-sajni-wedding.ics");
    });

    // Share
    $("#shareBtn").addEventListener("click", function () {
      global.WeddingShare.share(function (msg) { alert(msg); });
    });

    // Back to top
    var topBtn = $("#topBtn");
    topBtn.addEventListener("click", function () {
      global.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================== OPENING SCREEN ======================= */
  function initOpening() {
    var opening = $("#opening");
    var begin = $("#beginBtn");
    var nav = $("#nav");
    // Prevent background scroll while opening is up.
    document.body.style.overflow = "hidden";

    function open() {
      if (opening) opening.classList.add("is-closing");
      document.body.style.overflow = "";
      if (nav) nav.hidden = false;
      setTimeout(function () { if (opening) opening.style.display = "none"; }, 700);
      // kick reveal now that content is visible (guarded)
      safe("reveal", revealInit);
    }
    if (begin) begin.addEventListener("click", open);
    // Safety net: if the button somehow never fires, don't trap the page.
    // Tapping anywhere on the overlay also opens the invitation.
    if (opening) opening.addEventListener("click", function (e) {
      if (e.target === opening) open();
    });
  }

  /* ======================= SCROLL REVEAL + PROGRESS ================= */
  function revealInit() {
    var els = $$(".reveal, .anim");
    if (!("IntersectionObserver" in global)) {
      els.forEach(function (e) { e.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  function initProgressAndTop() {
    var progress = $("#progress");
    var topBtn = $("#topBtn");
    function onScroll() {
      var h = document.documentElement;
      var scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      progress.style.width = (scrolled * 100) + "%";
      if (h.scrollTop > 600) topBtn.hidden = false; else topBtn.hidden = true;
    }
    global.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* =============================== INIT ============================= */
  // Run a step in isolation so one failure never breaks the whole page.
  function safe(label, fn) {
    try { fn(); } catch (e) { if (global.console) console.error("[invitation] " + label + " failed:", e); }
  }

  function init() {
    if (!cfg || !cfg.groom) {
      console.warn("weddingConfig missing — invitation content will use static fallbacks.");
      // Still make sure the opening overlay can be dismissed.
      safe("opening", initOpening);
      safe("reveal", revealInit);
      return;
    }
    safe("hero", renderHero);
    safe("petals", renderPetals);
    safe("summary", renderSummary);
    safe("countdown", renderCountdown);
    safe("message", renderMessage);
    safe("story", renderStory);
    safe("events", renderEvents);
    safe("families", renderFamilies);
    safe("gallery", renderGallery);
    safe("info", renderInfo);
    safe("rsvp", renderRSVP);
    safe("blessings", renderBlessings);
    safe("contacts", renderContacts);
    safe("guestbook", initGuestbook);
    safe("nav", renderNav);       // after sections so hidden ones are excluded
    safe("music", initMusic);
    safe("lightbox", initLightbox);
    safe("actions", initActions);
    safe("progress", initProgressAndTop);
    // Opening + reveal last, and guaranteed to run so the page is never trapped.
    safe("opening", initOpening);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window);
