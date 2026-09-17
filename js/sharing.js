/* =============================================================================
   SHARING
   -----------------------------------------------------------------------------
   Uses the Web Share API where available (native share sheet on mobile).
   Falls back to a WhatsApp share link, then to copying the link.
   ========================================================================== */

(function (global) {
  "use strict";

  var WeddingShare = {
    _url: function () {
      var cfg = global.weddingConfig.sharing || {};
      return cfg.url || global.location.href;
    },
    _message: function () {
      var cfg = global.weddingConfig.sharing || {};
      var base = cfg.message || "You're invited to our wedding!";
      return base + "\n" + this._url();
    },

    /** Attempt native share, then WhatsApp, then clipboard. */
    share: function (onFallbackMsg) {
      var text = this._message();
      var url = this._url();

      if (navigator.share) {
        return navigator
          .share({ title: document.title, text: text, url: url })
          .catch(function () { /* user cancelled — no-op */ });
      }

      // WhatsApp web/app fallback.
      var wa = "https://wa.me/?text=" + encodeURIComponent(text);
      var win = global.open(wa, "_blank");
      if (!win) {
        // Popup blocked — try clipboard.
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            if (onFallbackMsg) onFallbackMsg("Invitation link copied to clipboard.");
          });
        } else if (onFallbackMsg) {
          onFallbackMsg("Copy this link: " + url);
        }
      }
      return Promise.resolve();
    },

    /** Direct WhatsApp link to a specific number (used for RSVP). */
    whatsappTo: function (number, extra) {
      var text = (extra || "") + "\n" + this._url();
      return "https://wa.me/" + number + "?text=" + encodeURIComponent(text);
    },
  };

  global.WeddingShare = WeddingShare;
})(window);
