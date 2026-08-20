# VOID ROSTER — Vercel-ready static site

This is a single-page fictional roster showcase inspired by a dark cyber/pixel aesthetic.

## Run locally

No build step is required.

- Open `index.html` directly in a browser, or
- use a local server such as VS Code Live Server.

## Deploy to Vercel

### Option 1 — Vercel dashboard

1. Put this folder in a GitHub repository.
2. Open Vercel and choose **Add New → Project**.
3. Import the GitHub repository.
4. Framework preset: **Other**.
5. Build command: leave blank.
6. Output directory: leave blank.
7. Click **Deploy**.

Vercel will give you a URL similar to:

`https://your-project-name.vercel.app`

### Option 2 — Vercel CLI

Install the CLI:

`npm i -g vercel`

Then, inside this folder:

`vercel`

Follow the prompts. To deploy to production:

`vercel --prod`

## Customize the roster

Edit the `groups` array near the top of `script.js`.

Each member is:

`["Display Name", "Short description", "Initials"]`

Change the category colors by editing each group's `color` value.

## Add real images

For a local image, create an `assets` folder and replace the initials avatar in
`renderRoster()` with an `<img>` element whose `src` points to your image.

Only use images and personal information you have permission to publish.


## Music

The included `assets/music.mp3` starts after the visitor clicks **CLICK TO SEE ROSTER**. The floating **♫ MUSIC** button pauses/resumes it.
