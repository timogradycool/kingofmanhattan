# CHOMP APPROVED!

The official list of places, people, and things Remy approves of.
No stars, no scores: if it's on the site, it's Chomp Approved.

Built with [Astro](https://astro.build) + [Tailwind CSS](https://tailwindcss.com). It's a plain static site with no database and no logins. Every approval is one small text file.

---

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
cd chomp-approved
npm install        # first time only
npm run dev
```

Open **http://localhost:4321** in your browser. The page reloads by itself whenever you save a file.

To view it on your phone (same Wi-Fi), run `npm run dev -- --host` and open the "Network" address it prints.

---

## Add a new approval

1. Copy `content/approval-template.md` into `content/approvals/` and rename it.
   The filename becomes the web address, so use lowercase letters and dashes:
   `content/approvals/joes-pizza.md` → `/approved/joes-pizza/`
2. Fill in the fields at the top:

   ```yaml
   ---
   name: "Joe's Pizza"                    # required
   category: restaurants                  # required: a slug from content/categories.json
   remyQuote: "The cheese stretches a mile."  # optional
   dateApproved: 2026-10-03               # required (YYYY-MM-DD)
   photo: ./photos/joes-pizza.jpg         # optional
   photoAlt: "Remy holding a giant slice" # optional
   location: "Springfield"                # optional
   link: https://instagram.com/joespizza  # optional (website or social link)
   stickerAwarded: true                   # true or false
   ---

   Optional extra notes go here, below the second --- line.
   ```

3. **Photo (optional):** drop the image into `content/approvals/photos/` and point `photo:` at it.
   Any size from your phone is fine. The site shrinks and converts it automatically.
   No photo? The card shows the category's emoji instead.
4. Save. Newest approvals (by `dateApproved`) appear first in "Recently Approved."

If you make a typo (e.g. a category that doesn't exist, or a date in the wrong format), `npm run dev` / `npm run build` stops with a message telling you which file and which field to fix.

### Remove the placeholder entries

All the sample entries are named `content/approvals/placeholder-*.md` and are marked `placeholder: true`, which shows a striped **PLACEHOLDER** tag on the site. When you're ready, delete them:

```bash
rm content/approvals/placeholder-*.md content/approvals/photos/placeholder-*
```

---

## Add or rename a category

Categories live in **`content/categories.json`**, in the order they appear on the home page:

```json
{ "slug": "restaurants", "name": "Restaurants", "emoji": "🍕", "color": "red", "blurb": "Places where..." }
```

- **`name`**: what people see. Rename it any time.
- **`slug`**: used in web addresses (`/category/restaurants/`) and in each approval's `category:` field. If you change a slug, update the `category:` line in that category's approval files too (the build will tell you if you miss one).
- **`emoji`**: any emoji.
- **`color`**: one of the logo colors, `red`, `blue`, `yellow`, `green`, `orange`, or any CSS color such as `"#8e44ad"`.
- **`blurb`**: the one-liner shown at the top of the category page (optional).

To add a category, add a new line to the list (mind the commas between entries). Its page and home-page tile appear automatically.

---

## Logo, badge, and icons

- The original logo is `src/assets/chomp-approved.png`. The big home-page logo and the little badge beside every entry are resized and converted to WebP/AVIF automatically at build time.
- Favicons, phone home-screen icons, the link-preview image (`og-image.jpg`), and web-sized copies of the logo (`public/logo/`) are already generated. If you ever change the logo, replace `src/assets/chomp-approved.png` and run:

  ```bash
  npm run icons
  ```

---

## Deploy

Run `npm run build` once on your computer first to make sure it builds. The finished site goes in `dist/`.

This site lives in the `chomp-approved/` folder of the repo, so tell your host to use that folder.

### Netlify
1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project →** pick the repo.
3. Set **Base directory** to `chomp-approved`. Build command (`npm run build`) and publish directory (`dist`) come from `netlify.toml`.
4. Deploy. Every push to GitHub redeploys automatically.

### Vercel
1. Push this repo to GitHub.
2. In Vercel: **Add New → Project →** import the repo.
3. Set **Root Directory** to `chomp-approved`. Vercel detects Astro automatically.
4. Deploy.

### After you have a domain
Change `site:` in `astro.config.mjs` to your real address (e.g. `https://chompapproved.com`). It's used for link previews when someone shares a page.

**Sticker QR code tip:** point it at `https://your-domain/got-a-sticker/`. That page congratulates them and lets them search for their listing.

---

## Where things are

```
chomp-approved/
├── content/
│   ├── approvals/           ← one .md file per approval (+ photos/)
│   ├── categories.json      ← the category list
│   └── approval-template.md ← copy this to add an approval
├── public/                  ← favicons, icons, share image, logo files
├── scripts/generate-icons.mjs
└── src/
    ├── assets/chomp-approved.png   ← the original logo
    ├── components/          ← cards, badge, search, etc.
    ├── layouts/Layout.astro ← header, footer, page shell
    ├── pages/               ← one file per page
    ├── styles/global.css    ← colors, fonts, sticker styles
    └── content.config.ts    ← the list of allowed fields
```
