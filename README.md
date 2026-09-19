# Sainte-Anne — Smurf village

A bilingual robotics website with a circular village of clickable mushroom houses and a separate timed chase game.

## Local preview

```sh
npm ci
npm run dev
```

Village: http://127.0.0.1:4312/en/village/
Game: http://127.0.0.1:4312/en/play/

Move with WASD, ZQSD, arrows, click-to-walk or the touch joystick. Rescuing a Smurf adds 100 points and four seconds. Blue mushrooms give a short speed boost; gold mushrooms give a shield. Escape pauses the game. The difficulty button starts a new run in the selected mode.

Hard mode has two cats: one pursues, the other anticipates movement and flanks. Cats accelerate with elapsed time and score, capped at 335 units/second; boosted movement is 400. Mushroom pickups return after a cooldown. Only hard-mode scores can enter the shared leaderboard; inappropriate usernames become Player.

## Checks

```sh
npm run build
npm run check
```

Checks cover movement, pursuit, separation, speed limits, escape with a boost, pickup reachability, username filtering, hard-only scores, concurrent storage writes, and bilingual routes.

## Vercel

The existing `robotics` project deploys `main` from `skibidiJCS/robotics` to https://csarobotics.vercel.app.

The `api/leaderboard.js` Vercel Function stores scores in private Vercel Blob storage. Connect the `robotics-leaderboard` store to Production and Preview. Vercel supplies `BLOB_STORE_ID` and `VERCEL_OIDC_TOKEN`; never put credentials in browser code. Conditional writes preserve simultaneous score submissions. Local development uses `.data/leaderboard.json`, which is ignored by Git. Production does not use a temporary local file for persistence.

## Source

- `src/content.mjs`: French and English content.
- `scripts/build-website.mjs`: website pages and house navigation.
- `public/village/hub.js`, `hub.css`: circular village using the game's artwork.
- `public/village/roam-state.js`: chase and pickup rules.
- `public/village/game.js`, `roam.css`: game display and controls.
- `scripts/leaderboard.mjs`: name filtering and local score storage.
- `scripts/cloud-leaderboard.mjs`: persistent Vercel score storage.

The remaining team, robot and competition placeholders should be filled in `src/content.mjs`.
