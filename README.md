# Kartikeyan & Sajni — Royal Wedding Invitation

A premium, mobile-first digital wedding invitation built for sharing on WhatsApp.
Pure HTML, CSS and vanilla JavaScript — no build step, no frameworks, no backend
required. Everything is driven by a single configuration file.

---

## ✨ What's inside

- **Animated opening** ("Open Invitation") leading into a royal hero with the couple's names
- **At-a-glance summary** — date, time, venue and one-tap Google Maps
- **Live countdown** to the big day (timezone-correct)
- **Warm invitation message** and optional **"Our Story"**
- **The Wedding Celebrations** — Mehendi, Haldi, Sangeet, Ceremony, Reception (fully configurable)
- **"With the Blessings of Our Families"** — both families presented elegantly
- **Guest info** — dress code, parking, stay, travel
- **RSVP** (WhatsApp / form / demo modes)
- **Guestbook** with a swappable data layer (local now, Supabase/Firebase later)
- **Blessings / gift** section with a QR placeholder (tasteful, optional)
- **Contact** cards with Call + WhatsApp
- **Save the Date** (generates an `.ics` calendar file) and **Share Invitation** (Web Share API + WhatsApp fallback)
- Optional **photo gallery** with lightbox + swipe, optional **music** (never autoplays)
- Accessibility, reduced-motion support, SEO/Open Graph metadata, PWA manifest

Every optional section **hides itself automatically** when it isn't configured,
so the page never looks broken.

---

## 📁 Project structure

```
wedding-invitation/
├── index.html
├── manifest.json
├── README.md
├── assets/
│   ├── gift-qr.png.svg          # placeholder QR (replace with real gift-qr.png)
│   ├── gallery/                 # your photos go here
│   └── images/
│       ├── favicon.svg
│       └── share-preview.svg    # replace with share-preview.jpg (1200x630) for WhatsApp
├── css/
│   └── styles.css
├── data/
│   └── guestbook.json           # sample guestbook data (for reference / seeding)
└── js/
    ├── config.js                # ← EDIT THIS to customize everything
    ├── app.js                   # renders the page from config
    ├── countdown.js
    ├── guestbookService.js
    ├── calendar.js
    └── sharing.js
```

---

## 🚀 Run locally

You need any static file server. The simplest, using Python:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

> Opening `index.html` directly via `file://` mostly works, but a local server
> avoids browser restrictions on some features. Prefer the server.

---

## 🛠️ Customize (the important part)

**Almost everything lives in `js/config.js`.** Open it and edit the values.

### 1. Names, date, hashtag
```js
groom: { firstName: "Kartikeyan", name: "Kartikeyan Gupta" },
bride: { firstName: "Sajni",      name: "Sajni Suvarna" },
hashtag: "#KartikeyanWedsSajni",

wedding: {
  date: "2027-02-14T19:00:00+05:30",   // ISO 8601 WITH timezone offset
  endDate: "2027-02-14T23:00:00+05:30",
  timezoneLabel: "IST",
  displayDate: "Saturday, 14 February 2027",
  displayTime: "7:00 PM onwards",
},
```
> The `+05:30` offset makes the countdown and calendar correct for guests in **any** timezone. Change it if your wedding is elsewhere (e.g. `-05:00` for US Eastern).

### 2. Venues + Google Maps
Venues are centralized and referenced by key:
```js
venues: {
  wedding: {
    name: "The Grand Palace Banquets",
    address: "12 Heritage Road, Bandra West, Mumbai 400050",
    city: "Mumbai",
    mapsUrl: "https://maps.google.com/?q=The+Grand+Palace+Banquets+Mumbai",
  },
},
```
Get a `mapsUrl`: search the venue on Google Maps → Share → Copy link. Paste it in.
**If `mapsUrl` is empty, the "Get Directions" button hides automatically.**

### 3. Events
Add, remove or reorder freely. Link each to a venue via `venueKey`. Set
`enabled: false` (or delete the entry) to drop an event.
```js
events: [
  { id: "wedding", enabled: true, name: "Wedding Ceremony",
    icon: "wedding", date: "Saturday, 14 February 2027",
    time: "7:00 PM onwards", venueKey: "wedding",
    description: "The sacred ceremony uniting Kartikeyan and Sajni." },
]
```
`icon` accepts: `mehendi`, `haldi`, `sangeet`, `wedding`, `reception`.

### 4. Families
Fill the four groups for each side. Empty groups hide themselves.
```js
groomFamily: {
  label: "Groom's Family",
  parents:  ["Mr. Rajesh Gupta", "Mrs. Meena Gupta"],
  siblings: ["Aditya Gupta (Brother)"],
  elders:   ["Mr. Shyam Lal Gupta (Grandfather)"],
  others:   ["Mr. Vinod Gupta (Uncle)"],
},
```

### 5. RSVP & Contacts
```js
rsvp: { enabled: true, formUrl: "", whatsappNumber: "919999999999" },
contacts: [
  { label: "Groom's Family", name: "Aditya Gupta",
    phone: "+919999999991", whatsapp: "919999999991" },
],
```
- Set `formUrl` to a Google Form to route RSVP there, **or**
- Set `whatsappNumber` to collect RSVPs over WhatsApp, **or**
- Leave both empty for a visual **demo mode**.

### 6. Story, gallery, music, guest info
- `story.text: ""` → hides the "Our Story" section.
- `gallery: []` → hides the gallery. Add `{ src, alt }` items to show it.
- `music: { enabled: true, src: "assets/music/theme.mp3" }` → shows a manual play button (never autoplays).
- `guestInfo` fields left empty are hidden individually.

---

## 🖼️ Replace the QR code (blessings)

1. Generate your UPI/bank QR (e.g. from your banking app or a UPI QR generator).
2. Save it as **`assets/gift-qr.png`**.
3. In `config.js` set `gift.qrImage: "assets/gift-qr.png"` and your `gift.upiId`.

A placeholder (`assets/gift-qr.png.svg`) ships so the section looks complete.
If the image is missing, a tasteful placeholder is shown automatically.

> Do not put private bank credentials or secrets in the code. A QR + UPI ID is enough.

---

## 📷 Add photos

1. Drop images into `assets/gallery/` (resize to ~1200px, keep under ~300 KB each).
2. List them in `config.js`:
   ```js
   gallery: [
     { src: "assets/gallery/01.jpg", alt: "Kartikeyan & Sajni" },
     { src: "assets/gallery/02.jpg", alt: "Engagement" },
   ],
   ```
Images lazy-load and open in a swipeable lightbox. See `assets/gallery/README.md`.

---

## 🌐 Recommended images to replace (for polished sharing)

These placeholders are SVG so the project is complete out of the box. For the best
WhatsApp/social preview and home-screen install, add real raster files:

| Replace with            | Size       | Used for                         |
|-------------------------|------------|----------------------------------|
| `assets/images/share-preview.jpg` | 1200×630 | WhatsApp / Open Graph preview |
| `assets/images/icon-192.png`      | 192×192  | PWA / home screen icon        |
| `assets/images/icon-512.png`      | 512×512  | PWA splash / large icon       |
| `assets/gift-qr.png`              | ~500×500 | Gift QR                       |

After adding them, update the paths in `index.html` (`og:image`, `twitter:image`,
`apple-touch-icon`) and `manifest.json` (`icons`).

---

## ☁️ Deploy for free

The site is fully static, so any static host works. No code changes needed.

### Option A — GitHub Pages
1. Create a GitHub repo and push these files.
   ```bash
   git init
   git add .
   git commit -m "Wedding invitation"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
2. Repo → **Settings → Pages** → Source: `Deploy from a branch` → Branch: `main` / `root`.
3. Your link: `https://<you>.github.io/<repo>/`.

### Option B — Cloudflare Pages
1. Push to GitHub (as above).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repo. **Build command:** *(leave empty)*. **Output directory:** `/`.
4. Deploy. You get a `*.pages.dev` link (custom domains supported free).

### Also works on
- **Netlify** — drag the folder onto <https://app.netlify.com/drop>.
- **Vercel** — `vercel` CLI or import the repo; framework preset "Other".

> After deploying, set `sharing.url` in `config.js` to your live link so the
> Share button always points to the right place (otherwise it uses the current URL).

---

## 💬 Connect a real guestbook later

The UI talks only to `guestbookService.js`. Today it uses **localStorage**
(`provider: "local"`) — messages are saved per device (great for a demo, but not
shared between guests). To make messages shared across everyone, connect a backend.
**Recommended simplest free option: Supabase** (generous free tier, no server code).

### Supabase (recommended)
1. Create a project at <https://supabase.com>.
2. Create a table `guestbook` with columns:
   `name (text)`, `message (text)`, `ts (int8)`.
3. Enable **Row Level Security** and add policies:
   - **Insert**: allow `anon` to insert.
   - **Select**: allow `anon` to select.
   > Only ever use the **anon public** key in the browser — never the service-role key.
4. In `index.html`, add before the other scripts:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   ```
5. In `config.js`:
   ```js
   guestbook: {
     enabled: true,
     provider: "supabase",
     maxLength: 280,
     supabase: {
       url: "https://YOUR-PROJECT.supabase.co",
       anonKey: "YOUR-ANON-PUBLIC-KEY",
       table: "guestbook",
     },
   },
   ```
The Supabase provider is already implemented in `guestbookService.js` — no UI changes needed.

### Firebase (alternative)
1. Create a Firebase project + Firestore database.
2. Add the Firebase SDK to `index.html` and your `firebaseConfig` (public web config is fine).
3. Set `provider: "firebase"` and implement the two methods in the `firebaseProvider`
   stub inside `guestbookService.js` (`getMessages`, `addMessage`) against a
   `guestbook` collection. Lock writes with Firestore security rules.

### Serverless (lightweight)
Point the provider at any tiny API (Cloudflare Worker, Netlify Function) exposing
`GET /messages` and `POST /messages`. Swap the two methods in the service — the UI stays identical.

---

## 🔒 Security notes

- Guestbook input is validated and HTML-escaped (no script injection); links and
  overly long messages are rejected, with a simple per-device rate limit.
- No secrets in the frontend. Only public/anon keys belong here.
- All external links use `rel="noopener"`.

---

## ♿ Accessibility & performance

- Semantic HTML, labelled controls, keyboard-friendly lightbox, visible focus states.
- Honors `prefers-reduced-motion` (animations and petals are disabled).
- No frameworks; fonts load asynchronously with system-serif/sans fallbacks so
  the invitation is readable instantly and works offline.

---

## ✅ What to change when real details arrive

1. `wedding.date` / `endDate` / `displayDate` / `displayTime`
2. `venues.*` names, addresses and `mapsUrl`
3. `events[]` (dates, times, which functions actually happen)
4. `groomFamily` / `brideFamily` names
5. `contacts[]` real phone/WhatsApp numbers, `rsvp.whatsappNumber` or `rsvp.formUrl`
6. `gift.upiId` and the real `assets/gift-qr.png`
7. `sharing.url` (your deployed link) and `assets/images/share-preview.jpg`
8. Photos in `assets/gallery/` + `gallery[]`
9. (Optional) connect the guestbook to Supabase

---

With love and gratitude — *Kartikeyan & Sajni*
