# Gallery images

Place your photos here (e.g. `01.jpg`, `02.jpg`, `engagement.jpg`).

Then list them in `js/config.js` under `gallery`:

```js
gallery: [
  { src: "assets/gallery/01.jpg", alt: "Kartikeyan & Sajni" },
  { src: "assets/gallery/02.jpg", alt: "Engagement" },
],
```

Tips:
- Keep files small (ideally under ~300 KB each). Resize to ~1200px on the long edge.
- Prefer `.jpg` for photos, `.webp` for best compression.
- Images lazy-load, so a handful of photos will not slow the first paint.
- Leave the `gallery` array empty to hide the gallery section entirely.
