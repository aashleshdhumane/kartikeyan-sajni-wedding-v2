/* =============================================================================
   CALENDAR (.ics generation)
   -----------------------------------------------------------------------------
   Generates a downloadable .ics file client-side so guests can save the date
   to Apple Calendar, Google Calendar or Outlook. No dependencies.
   ========================================================================== */

(function (global) {
  "use strict";

  // Convert a JS Date to UTC iCalendar timestamp: YYYYMMDDTHHMMSSZ
  function toICSDate(date) {
    function p(n) { return n < 10 ? "0" + n : String(n); }
    return (
      date.getUTCFullYear() +
      p(date.getUTCMonth() + 1) +
      p(date.getUTCDate()) +
      "T" +
      p(date.getUTCHours()) +
      p(date.getUTCMinutes()) +
      p(date.getUTCSeconds()) +
      "Z"
    );
  }

  // Escape special chars per RFC 5545.
  function esc(text) {
    return String(text || "")
      .replace(/\\/g, "\\\\")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,")
      .replace(/\n/g, "\\n");
  }

  var WeddingCalendar = {
    /**
     * Build an .ics string.
     * @param {Object} opts {title, startISO, endISO, location, description}
     */
    build: function (opts) {
      var start = new Date(opts.startISO);
      var end = opts.endISO ? new Date(opts.endISO) : new Date(start.getTime() + 3 * 3600000);
      var uid = "ks-" + start.getTime() + "@wedding.invite";
      var stamp = toICSDate(new Date());

      return [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Kartikeyan & Sajni//Wedding Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:" + uid,
        "DTSTAMP:" + stamp,
        "DTSTART:" + toICSDate(start),
        "DTEND:" + toICSDate(end),
        "SUMMARY:" + esc(opts.title),
        "LOCATION:" + esc(opts.location),
        "DESCRIPTION:" + esc(opts.description),
        "STATUS:CONFIRMED",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");
    },

    /** Trigger a download of the generated .ics file. */
    download: function (opts, filename) {
      var ics = this.build(opts);
      var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename || "wedding.ics";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    },
  };

  global.WeddingCalendar = WeddingCalendar;
})(window);
