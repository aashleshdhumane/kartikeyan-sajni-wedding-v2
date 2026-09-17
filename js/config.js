/* =============================================================================
   CENTRAL WEDDING CONFIGURATION
   -----------------------------------------------------------------------------
   This is the ONLY file you need to edit to customize the entire invitation.
   Change names, dates, venues, family members, contacts, gallery, etc. here.

   Notes:
   - Leave a value empty ("") or an array empty ([]) to automatically HIDE that
     section. Optional sections hide themselves when not configured.
   - Dates use ISO 8601 with an explicit timezone offset so the countdown and
     calendar work correctly across time zones.
   - Do NOT put private API keys or secret credentials in this file. It ships to
     the browser and is publicly readable.
   ========================================================================== */

const weddingConfig = {

  /* ---------------------------------------------------------------------------
     THE COUPLE
     ------------------------------------------------------------------------ */
  groom: {
    firstName: "Kartikeyan",
    name: "Kartikeyan Gupta",
  },
  bride: {
    firstName: "Sajni",
    name: "Sajni Suvarna",
  },

  // A short, tasteful wedding hashtag. Leave "" to hide it.
  hashtag: "#KartikeyanWedsSajni",

  /* ---------------------------------------------------------------------------
     THE WEDDING (used for hero, countdown, calendar, event summary)
     - `date` is the primary ceremony start (ISO 8601 with timezone offset).
     - `endDate` is used for the calendar event end time.
     - `timezone` label is shown to guests; offset is baked into the ISO string.
     ------------------------------------------------------------------------ */
  wedding: {
    // Placeholder date/time — replace with the real one when confirmed.
    date: "2027-02-14T19:00:00+05:30",
    endDate: "2027-02-14T23:00:00+05:30",
    timezone: "Asia/Kolkata",
    timezoneLabel: "IST",
    // Human-friendly strings shown in the hero / summary.
    displayDate: "Saturday, 14 February 2027",
    displayTime: "7:00 PM onwards",
  },

  /* ---------------------------------------------------------------------------
     THE HEADLINE VENUE (shown in the prominent "at a glance" summary card)
     Reference a venue key defined in `venues` below.
     ------------------------------------------------------------------------ */
  primaryVenueKey: "wedding",

  /* ---------------------------------------------------------------------------
     INVITATION MESSAGE
     ------------------------------------------------------------------------ */
  invitationMessage:
    "With the blessings of our elders and the love of our family and friends, " +
    "we warmly invite you to share in our joy as Kartikeyan and Sajni begin " +
    "a new life together. Your presence will make our celebration complete.",

  /* ---------------------------------------------------------------------------
     OUR STORY (optional) — leave story as "" to hide the section entirely.
     ------------------------------------------------------------------------ */
  story: {
    enabled: true,
    text:
      "What began as a quiet friendship grew, unhurried and sure, into a bond " +
      "our families now celebrate as one. Between shared cups of chai and long " +
      "conversations that lost track of time, Kartikeyan and Sajni found in each " +
      "other a home. With the blessings of our elders, that friendship now " +
      "becomes a lifetime.",
  },

  /* ---------------------------------------------------------------------------
     VENUES — centralized. Reference these keys from events.
     If `mapsUrl` is empty, the "Get Directions" button hides automatically.
     ------------------------------------------------------------------------ */
  venues: {
    wedding: {
      name: "The Grand Palace Banquets",
      address: "12 Heritage Road, Bandra West, Mumbai 400050",
      city: "Mumbai",
      mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Banquets+Mumbai",
    },
    mehendi: {
      name: "Gupta Residence Courtyard",
      address: "8 Rose Lane, Andheri West, Mumbai 400058",
      city: "Mumbai",
      mapsUrl: "https://maps.google.com/?q=Andheri+West+Mumbai",
    },
    reception: {
      name: "The Grand Palace Banquets",
      address: "12 Heritage Road, Bandra West, Mumbai 400050",
      city: "Mumbai",
      mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Banquets+Mumbai",
    },
  },

  /* ---------------------------------------------------------------------------
     EVENTS — add/remove freely. `venueKey` links to `venues` above.
     Set enabled:false or remove an entry to drop the event.
     `icon` accepts a short label used to pick a decorative SVG motif:
        "mehendi" | "haldi" | "sangeet" | "wedding" | "reception"
     ------------------------------------------------------------------------ */
  events: [
    {
      id: "mehendi",
      enabled: true,
      name: "Mehendi",
      icon: "mehendi",
      date: "Thursday, 12 February 2027",
      time: "4:00 PM onwards",
      venueKey: "mehendi",
      description: "An afternoon of henna, music and laughter with the ladies of both families.",
    },
    {
      id: "haldi",
      enabled: true,
      name: "Haldi",
      icon: "haldi",
      date: "Friday, 13 February 2027",
      time: "10:00 AM onwards",
      venueKey: "mehendi",
      description: "A joyful morning of turmeric, blessings and togetherness.",
    },
    {
      id: "sangeet",
      enabled: true,
      name: "Sangeet",
      icon: "sangeet",
      date: "Friday, 13 February 2027",
      time: "7:00 PM onwards",
      venueKey: "wedding",
      description: "An evening of song and dance as both families come together to celebrate.",
    },
    {
      id: "wedding",
      enabled: true,
      name: "Wedding Ceremony",
      icon: "wedding",
      date: "Saturday, 14 February 2027",
      time: "7:00 PM onwards",
      venueKey: "wedding",
      description: "The sacred ceremony uniting Kartikeyan and Sajni. Please join us for the muhurat.",
    },
    {
      id: "reception",
      enabled: true,
      name: "Reception",
      icon: "reception",
      date: "Sunday, 15 February 2027",
      time: "7:30 PM onwards",
      venueKey: "reception",
      description: "Dinner, blessings and celebration as we welcome the newlyweds.",
    },
  ],

  /* ---------------------------------------------------------------------------
     FAMILIES — "Two families, one celebration."
     Any empty group is hidden automatically.
     ------------------------------------------------------------------------ */
  groomFamily: {
    label: "Groom's Family",
    parents: ["Mr. Rajesh Gupta", "Mrs. Meena Gupta"],
    siblings: ["Aditya Gupta (Brother)", "Ananya Gupta (Sister)"],
    elders: ["Mr. Shyam Lal Gupta (Grandfather)", "Mrs. Kamla Gupta (Grandmother)"],
    others: ["Mr. Vinod Gupta (Uncle)", "Mrs. Sunita Gupta (Aunt)"],
  },
  brideFamily: {
    label: "Bride's Family",
    parents: ["Mr. Prakash Suvarna", "Mrs. Latha Suvarna"],
    siblings: ["Rohan Suvarna (Brother)"],
    elders: ["Mr. Ganesh Suvarna (Grandfather)", "Mrs. Saraswati Suvarna (Grandmother)"],
    others: ["Dr. Anil Suvarna (Uncle)", "Mrs. Rekha Suvarna (Aunt)"],
  },

  /* ---------------------------------------------------------------------------
     GIFT / BLESSINGS — tasteful & optional.
     ------------------------------------------------------------------------ */
  gift: {
    enabled: true,
    message:
      "Your presence and blessings are the greatest gifts we could ask for. " +
      "Should you wish to bless the couple further, we would be grateful for " +
      "your good wishes in the form of a token gift, entirely as you please.",
    // Replace with your real UPI QR at assets/gift-qr.png (a placeholder SVG
    // ships at assets/gift-qr.png.svg). If the image is missing, a tasteful
    // placeholder is shown automatically.
    qrImage: "assets/gift-qr.png.svg",
    upiId: "kartikeyan.sajni@upi",
    // Optional bank line; leave "" to hide.
    bankNote: "",
  },

  /* ---------------------------------------------------------------------------
     RSVP
     ------------------------------------------------------------------------ */
  rsvp: {
    enabled: true,
    // If you set an external form URL (Google Form, etc.), the Yes/No buttons
    // will link to it. Leave "" for local demo mode.
    formUrl: "",
    // WhatsApp number for quick RSVP (international format, no + or spaces).
    whatsappNumber: "919999999999",
  },

  /* ---------------------------------------------------------------------------
     CONTACTS — "Need Help?" Call / WhatsApp buttons.
     ------------------------------------------------------------------------ */
  contacts: [
    {
      label: "Groom's Family",
      name: "Aditya Gupta",
      phone: "+919999999991",
      whatsapp: "919999999991",
    },
    {
      label: "Bride's Family",
      name: "Rohan Suvarna",
      phone: "+919999999992",
      whatsapp: "919999999992",
    },
  ],

  /* ---------------------------------------------------------------------------
     GUEST INFORMATION (all optional — empty ones hide)
     ------------------------------------------------------------------------ */
  guestInfo: {
    dressCode: "Traditional Indian attire in festive tones",
    parking: "Valet parking available at the venue entrance.",
    accommodation: "Rooms blocked at Hotel Heritage, Bandra. Mention 'Gupta-Suvarna Wedding'.",
    travel: "Nearest airport: Chhatrapati Shivaji Intl (BOM), 30 min away. Nearest station: Bandra Terminus.",
    shuttle: "",
    notes: "",
  },

  /* ---------------------------------------------------------------------------
     PHOTO GALLERY (optional) — empty array hides the section.
     Place images under assets/gallery/. Use small, optimized files.
     ------------------------------------------------------------------------ */
  gallery: [
    // { src: "assets/gallery/01.jpg", alt: "Kartikeyan & Sajni" },
    // { src: "assets/gallery/02.jpg", alt: "Engagement" },
  ],

  /* ---------------------------------------------------------------------------
     MUSIC (optional) — never autoplays. Empty src hides the button.
     ------------------------------------------------------------------------ */
  music: {
    enabled: false,
    src: "", // e.g. "assets/music/theme.mp3"
    title: "Wedding Theme",
  },

  /* ---------------------------------------------------------------------------
     GUESTBOOK
     provider: "local" (localStorage) for now.
     Swap to "supabase" or "firebase" later without changing the UI.
     ------------------------------------------------------------------------ */
  guestbook: {
    enabled: true,
    provider: "local", // "local" | "supabase" | "firebase"
    maxLength: 280,
    // Only used when provider !== "local". Public keys only — never secrets.
    supabase: { url: "", anonKey: "", table: "guestbook" },
    firebase: { /* firebaseConfig object here */ },
  },

  /* ---------------------------------------------------------------------------
     SHARING — WhatsApp / Web Share API
     Set `url` to the final deployed link when available; leave "" to use the
     current page URL at runtime.
     ------------------------------------------------------------------------ */
  sharing: {
    url: "https://aashleshdhumane.github.io/kartikeyan-sajni-wedding-v2/",
    message:
      "With love and happiness, we invite you to celebrate the wedding of " +
      "Kartikeyan & Sajni \u2764\ufe0f\n\nWe would be delighted to have you with us.\n",
  },

  /* ---------------------------------------------------------------------------
     NAVIGATION — keep it short. Order controls display order.
     ------------------------------------------------------------------------ */
  nav: [
    { id: "home", label: "Home" },
    { id: "story", label: "Our Story" },
    { id: "events", label: "Events" },
    { id: "families", label: "Families" },
    { id: "guestbook", label: "Guestbook" },
    { id: "blessings", label: "Blessings" },
  ],
};

// Make available to modules (browser global + optional module export).
if (typeof window !== "undefined") window.weddingConfig = weddingConfig;
