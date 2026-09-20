# Salam & Sara — Walima Reception Invite

A single, self-contained animated invitation for the Walima reception.
Black & gold theme, envelope-open intro, parallax scroll, live countdown,
an "I'm in!" confirmation button, and a toggleable ambient background tone.

## Files
- `index.html` — page structure and content
- `styles.css` — all styling (colours, layout, animation keyframes)
- `script.js` — animation timelines, countdown, interactions

## Before you deploy — things to edit

1. **RSVP link** — in `script.js`, set `RSVP_LINK` to your real WhatsApp
   link (or any RSVP form URL).
   ```js
   RSVP_LINK: "https://wa.me/91XXXXXXXXXX?text=..."
   ```
2. **Countdown target** — in `script.js`, `walimaDate` is set to
   `2026-12-26T19:00:00+05:30` (7 PM IST, 26 Dec 2026). Update if needed.
3. **Text** — names, date, venue, attire line, and the family/signature
   lines are all plain text inside `index.html` — search for the section
   you want to change (`<section id="reception">`, etc.) and edit directly.
4. **Music** — the note button plays a soft generated ambient tone (no
   file needed). If you'd rather use a real track, drop an `.mp3` into
   an `assets/` folder and swap the Web Audio code in `script.js` for a
   standard `<audio>` element pointing at it.

## Deploy on GitHub Pages

1. Create a new GitHub repository (e.g. `salam-sara-reception`).
2. Upload these three files (`index.html`, `styles.css`, `script.js`) to
   the root of the repo — either via the GitHub web UI ("Add file → Upload
   files") or:
   ```bash
   git init
   git add .
   git commit -m "Walima reception invite"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a
   branch**, set branch to `main` and folder to `/ (root)`, then **Save**.
5. GitHub will publish it at:
   `https://<your-username>.github.io/<repo-name>/`
   (takes 1–2 minutes the first time).
6. Share that link on WhatsApp — it works exactly like the preview you
   saw in chat, and you fully own and control this copy.

## Notes
- Fonts load from Google Fonts and the animation library (GSAP) loads
  from a public CDN (cdnjs) — both need an internet connection to
  render correctly, which is normal for any deployed website.
- No visitor counter is included — a reliable one requires a backend
  or database, which is outside what a static GitHub Pages site can do
  on its own.
