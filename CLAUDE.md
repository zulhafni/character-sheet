# RhetoriQo Character Sheet

Flask + SQLite web app for public speaking training sessions. Learners scan a QR code, build a pixel art character (name + traits + intention), and the trainer projects a live stage showing the whole group.

## Live deployment
- URL: https://character-sheet-wdgw.onrender.com
- GitHub: https://github.com/zulhafni/character-sheet
- Deploy: `git push` → Render auto-deploys in ~1 min
- Render env var required: `BASE_URL=https://character-sheet-wdgw.onrender.com`

## Run locally
```
pip install -r requirements.txt
python app.py
```
Runs on port 8080. QR codes use local IP automatically when BASE_URL is not set.

## Key files
- `app.py` — all Flask routes
- `db.py` — SQLite helpers (sessions + characters)
- `static/sprites.js` — sprite renderer shared across all pages
- `templates/learner.html` — 4-screen learner flow
- `templates/trainer.html` — trainer dashboard
- `templates/stage.html` — live group stage (auto-refreshes every 10s)
- `sprite_preview.html` — dev tool, open directly in browser (not a Flask route)

## Sprite system (sprites.js)
- 12×16 pixel grid, rendered on `<canvas>` via `renderSprite(canvas, traits[], px)`
- BASE_CHARACTER = base humanoid (hair, skin, shirt, pants, legs)
- EQUIPMENT = 5 slots × 3 tiers, overlaid on base by trait cluster count
- EXPRESSIONS = 5 facial overlays, drawn last, keyed by dominant cluster
- TRAIT_CLUSTERS = 58 traits mapped to 5 clusters (grounded / powerful / human / sharp / professional)
- Tier logic: 1 trait in cluster → tier 0, 2 → tier 1, 3+ → tier 2

## Palette
`.`=transparent, `W`=cream, `S`=skin, `T`=teal, `C`=coral, `B`=blue, `N`=navy, `G`=gray, `L`=light silver, `O`=gold, `H`=brown, `K`=dark/black
