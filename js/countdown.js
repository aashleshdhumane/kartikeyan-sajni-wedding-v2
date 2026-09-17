/* =============================================================================
   COUNTDOWN
   -----------------------------------------------------------------------------
   Ticks down to weddingConfig.wedding.date. Because the configured date carries
   an explicit timezone offset (e.g. +05:30), Date parsing is timezone-correct
   for every guest regardless of their local zone.

   When the date passes, renders "The celebration has begun".
   ========================================================================== */

(function (global) {
  "use strict";

  var WeddingCountdown = {
    _timer: null,

    start: function (targetISO, gridEl, onDone) {
      if (!gridEl) return;
      var target = new Date(targetISO).getTime();

      if (isNaN(target)) {
        // Invalid/missing date — hide gracefully.
        var section = document.getElementById("countdown");
        if (section) section.hidden = true;
        return;
      }

      var units = [
        { key: "days", label: "Days" },
        { key: "hours", label: "Hours" },
        { key: "minutes", label: "Minutes" },
        { key: "seconds", label: "Seconds" },
      ];

      // Build cells once, then just update numbers each tick.
      gridEl.innerHTML = "";
      var cells = {};
      units.forEach(function (u) {
        var cell = document.createElement("div");
        cell.className = "countdown__cell";
        var num = document.createElement("span");
        num.className = "countdown__num";
        num.textContent = "--";
        var unit = document.createElement("span");
        unit.className = "countdown__unit";
        unit.textContent = u.label;
        cell.appendChild(num);
        cell.appendChild(unit);
        gridEl.appendChild(cell);
        cells[u.key] = num;
      });

      function pad(n) { return n < 10 ? "0" + n : String(n); }

      function tick() {
        var diff = target - Date.now();
        if (diff <= 0) {
          clearInterval(WeddingCountdown._timer);
          gridEl.innerHTML = "";
          var done = document.createElement("p");
          done.className = "countdown__done";
          done.textContent = "The celebration has begun \u2764\ufe0f";
          gridEl.appendChild(done);
          if (typeof onDone === "function") onDone();
          return;
        }
        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        cells.days.textContent = pad(d);
        cells.hours.textContent = pad(h);
        cells.minutes.textContent = pad(m);
        cells.seconds.textContent = pad(s);
      }

      tick();
      this._timer = setInterval(tick, 1000);
    },
  };

  global.WeddingCountdown = WeddingCountdown;
})(window);
