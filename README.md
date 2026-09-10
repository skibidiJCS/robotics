# Sainte-Anne robotics

A bilingual, click-through Smurf village. Built specifically for the team with plain HTML, CSS, and JavaScript; no website template.

## Preview

```sh
npm install
npm run dev
```

Open http://127.0.0.1:4173. Knock to enter, then choose a house. The artwork fills the screen; choose a house to open a section and use its village link to return. French and English have separate pages; switching language keeps the current destination.

After editing, run `npm run build` and refresh. Tests: `npm run check`.

## Edit the site

- `src/content.mjs`: both languages and all 22 member placeholders. Fill `name`, `photo`, and `contribution.fr` / `contribution.en`. Put photos in `public/assets/` and use paths such as `/assets/member-01.jpg`. Add teachers and mentors to the same list when known; pagination adjusts automatically.
- `scripts/build.mjs`: page layouts and content panels.
- `public/styles.css`: all styling, including the positions of the clickable houses.
- `public/app.js`: entrance, page turning, and keyboard-accessible tabs.

Game rules, team identities, real robot details, photos, journal entries, video, and tutorial still need the team's material. The album contains 22 slots, four per page. No achievements or robot specifications are invented.

## Replace the sketch with hand-drawn art

Replace `public/assets/village.jpg` with a 1536 × 1024 drawing. Keep six houses roughly in these positions, or adjust `.house-0` through `.house-5` in the stylesheet:

| House | Position     | Destination |
| ----- | ------------ | ----------- |
| 1     | Upper left   | About       |
| 2     | Upper middle | Game        |
| 3     | Upper right  | Team        |
| 4     | Lower left   | Robot       |
| 5     | Lower middle | Photos      |
| 6     | Lower right  | Journal     |

Keep the middle clearing empty for the village title. Draw scenery without a robot. The robot has its own page. Mobile uses the same scenery with larger, readable sign buttons.

Current sketch: generated with the built-in image tool. Brief: six mushroom houses around a clearing, simple colored-pencil/ink lines, paths, sparse woodland and tiny Smurfs; no text, UI, or robots. The site credits Peyo. The original PNG for your artist is `artwork/village-sketch.png`; this is the only generated illustration currently used by the website.

## Your existing GitHub repository → Vercel

Your repository is named `robotics`. Replace `YOUR_USERNAME` below with your GitHub username. These instructions assume the repository is empty.

```sh
cd "/Users/jiacai/Documents/ChatGPT/robotics"
git add .
git commit -m "build smurf village website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/robotics.git
git push -u origin main
```

If the repository already contains files, don't force-push: reconcile those files first. If Git asks for authentication, use GitHub's browser sign-in or an authentication token; account passwords don't work for Git over HTTPS.

In Vercel:

1. **Add New → Project** → import `robotics` from GitHub.
2. Framework: **Other**.
3. Build command: **npm run build**.
4. Output directory: **dist**.
5. Click **Deploy**. No environment variables are needed.

`vercel.json` includes the build settings. Later pushes to `main` will deploy updates. Documentation: https://vercel.com/docs/git

Nothing has been committed, pushed, or deployed by this task.

## Checks and submission

The generated pages pass HTML validation. `npm run check` verifies links, assets, locale navigation, all 22 reachable member slots, page turning, tab selection, keyboard Home, and entrance navigation in a DOM simulation. It does not claim browser rendering tests. Check the finished artwork and content on mobile/desktop Chrome, Firefox, and Safari before submission.

The supplied 2026 rubric requires CRC-server hosting for the final submission. Vercel can host the working site. Confirm the current season's rules and deadline, fill all placeholders, and freeze the submitted version at the deadline.

The previous design is backed up outside this repository at `/Users/jiacai/Documents/ChatGPT/robotics-backups/before-village-redesign.tar.gz`.

## School identity assets

The crest is the official `logo-sainte-anne-blazon` vector from https://sainteanne.ca/wp-content/themes/csa-common/dist/sprite-B7WiA5rO.svg, without the wordmark. Manrope Bold is used for the school name and robotics label as a close match to the supplied lettering; it is not a claim that the wordmark uses this exact font. Font source: https://sainteanne.ca/wp-content/themes/csa-common/dist/fonts/Manrope-Bold.woff2.
