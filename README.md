# Sainte-Anne — Smurf village

Run `npm ci`, then `npm run dev`. Open http://127.0.0.1:4312/en/village/ or the French `/fr/village/`.

`npm run build` generates the static site in `dist`. `npm run check` checks navigation, game rules and leaderboard storage.

The site uses Three.js with local textures. First-time visitors choose French or English. The phone contains the overhead warp map, keyboard layout, language, credits and game. Walk with WASD, ZQSD or arrow keys, hold Shift to run outdoors, and drag to turn. Touch devices have a joystick. Enter a house at its doorway with E or the on-screen button. Inside, walk to a content station, click its label, or choose a section from the phone. Each house has spacious alcoves with animated exhibits. The exit returns to that house's entrance. Azrael’s chase takes place in an oversized house with a kitchen, library and workshop. Direct house URLs and language changes preserve the destination.

`world-scene.js` owns the renderer and cameras, `world-models.js` builds geometry, `world-interior.js` owns room movement and cached furnishings, and `world-pond.js` builds reflective water and its shoreline. `world.js` coordinates navigation and gameplay. `world-ui.js` owns readable sections and game dialogs; `world-phone.js` owns the phone. `world-data.js` defines house positions used by both rendering and collision. `roam-state.js` keeps chase rules; `world-navigation.js` caches paths separately for the village and arena. `arena-layout.js` defines the arena bounds, furniture collisions and spawn points used by `world-arena.js`. `world-furniture.js` builds animated displays shared by both interiors. `world-garden.js` provides the green ground texture and planting. Text lives in `src/content.mjs`; missing team profiles and media remain marked as forthcoming.

WebGL2 is required for the 3D world. If unavailable, the site keeps its readable content and section links. Reduced-motion preferences disable phone animation, water motion, character bobbing and camera interpolation. Opening the phone or map, or losing focus, pauses the game. Closing a game menu shows an explicit resume action.

Forest ground, bark, plaster and leaf textures are CC0 assets from [Poly Haven](https://polyhaven.com/). The robot model is illustrative. The existing leaderboard API stores hard-mode scores; client-submitted scores are not cheat-proof.
