# Sainte-Anne — Le village

A full-screen Smurf platform game that also serves as the robotics website. Walk through the village, jump onto platforms, collect twelve berries and enter its mushroom houses. There is no header, footer or separate old website.

```sh
npm install
npm run dev
```

Preview: http://127.0.0.1:4173.

## Controls

- Left/right arrows, A/D or Q/D: walk.
- Space or up arrow: jump.
- E near a house: enter. Clicking a house walks there and enters automatically.
- Escape: open the map, or return from a room.
- On touchscreens: hold the left/right buttons to move and tap the jump button. You can also tap the ground to walk or the sky to jump. Tap the Smurf to open the map.
- Click or tap ×1 beside the Smurf to switch to ×2 speed; tap again to walk.

The map provides direct access to every section and language switching. Collect the twelve purple berries for the village picnic. Berry collecting is optional; all website content remains accessible. The map also resets the harvest. Position, language and collected berries are saved on this device.

## Content

The new rooms include About, Team, Competition, Robot, Photos, Journal, Video/Tutorial and Credits. All rooms open inside the same page with transitions. Original section URLs remain usable and open the corresponding new room.

- `src/content.mjs`: both languages, the 22 team member slots and the team's content.
- `public/village/rooms.js`: room layouts, album pagination and tabs.
- `public/village/physics.js`: movement, jumping, platforms and collectible locations.
- `public/village/art.js`: canvas drawings of the village and Smurf.
- `public/village/game.js`: camera, controls, transitions, navigation and progress.
- `public/village/style.css`: house signs, room layouts and responsive controls.
- `scripts/build.mjs`: static build, content module and compatible URLs.

The team photos, member details, robot information and competition material remain pending where the source content is unfilled. The berry game is separate from CRC competition rules.

## Verify

```sh
npm run build
npm run check
```

Checks cover the full-screen entry points, eight sections in both languages, all 22 team slots, all twelve reachable berries, platform landings, jump limits and world boundaries. Browser testing covered gameplay, house entry, in-page navigation, team pagination, tabs, language switching, saved progress, mobile interaction, transitions and browser history.

Nothing was committed, pushed or deployed for this replacement.
