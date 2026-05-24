// Shared sprite data and renderer — 12 wide × 16 tall
// One base humanoid + equipment overlays driven by trait clusters.
// Face takes rows 2–6 (5 rows) so eyes and mouth have breathing room.

const PALETTE = {
  '.': null,
  'W': '#F1FAEE', // cream/white
  'S': '#F5C6A0', // skin
  'T': '#A8DADC', // teal
  'C': '#E63946', // coral
  'B': '#457B9D', // blue
  'N': '#1D3557', // navy (interior only)
  'G': '#9E9E9E', // gray/silver
  'L': '#CFD8DC', // light silver
  'O': '#FFB300', // gold
  'H': '#5D4037', // brown
  'K': '#222222', // dark
};

// ── BASE CHARACTER — 12 × 16 ──────────────────────────────────────────────
// Row 3 = eyebrow row (blank — expressions draw brows here)
// Row 4 = eyes
// Row 5 = separator (nose bridge — keeps eyes/mouth apart)
// Row 6 = mouth row (blank — expressions draw mouths here)
const BASE_CHARACTER = [
  '...WWWWWW...',  // row 0:  hair crown
  '..WWWWWWWW..',  // row 1:  hair
  '...SSSSSS...',  // row 2:  forehead
  '...SSSSSS...',  // row 3:  brow row (blank — expressions add brows)
  '...SKSSKS...',  // row 4:  K=dark eyes at cols 4 and 7
  '...SSSSSS...',  // row 5:  nose bridge / separator
  '...SSSSSS...',  // row 6:  mouth row (blank — expressions add mouth)
  '...BBBBBB...',  // row 7:  shirt collar
  '..BBBBBBBB..',  // row 8:  shirt
  '.BBBBBBBBBB.',  // row 9:  shirt body
  '.BBBBBBBBBB.',  // row 10
  '..BBBBBBBB..',  // row 11
  '...GGGGGG...',  // row 12: pants
  '...GGGGGG...',  // row 13: pants
  '...GG..GG...',  // row 14: legs
  '...GG..GG...',  // row 15: feet
];

// ── EXPRESSIONS — drawn last, keyed by dominant cluster ───────────────────
// Brows → row 3 | Eye mods → row 4 | Mouth → row 6
const EXPRESSIONS = {
  // GROUNDED: serene — slight upturned corners (K at mouth-cols 4 & 7)
  grounded: [
    '............','............','............','............',
    '............','............','....K..K....','............',
    '............','............','............','............',
    '............','............','............','............',
  ],
  // POWERFUL: intense — thick furrowed brows + firm bar mouth
  powerful: [
    '............','............','............','...KK..KK...',
    '............','............','....KKKK....','............',
    '............','............','............','............',
    '............','............','............','............',
  ],
  // HUMAN: happy — squint eyes + wide grin
  human: [
    '............','............','............','............',
    '...KK..KK...','............','...KKKKKK...','............',
    '............','............','............','............',
    '............','............','............','............',
  ],
  // SHARP: focused — single raised left brow + small precise mouth
  sharp: [
    '............','............','............','....K.......',
    '............','............','.....KK.....','............',
    '............','............','............','............',
    '............','............','............','............',
  ],
  // PROFESSIONAL: confident — even brows + left smirk
  professional: [
    '............','............','............','....K..K....',
    '............','............','....KK......','............',
    '............','............','............','............',
    '............','............','............','............',
  ],
};

// ── EQUIPMENT OVERLAYS — 5 clusters × 3 tiers ────────────────────────────
// All arrays are exactly 16 rows.
const EQUIPMENT = {

  // GROUNDED → Boots (rows 12–15, unchanged)
  grounded: [
    // tier 0: plain brown boots
    ['............','............','............','............',
     '............','............','............','............',
     '............','............','............','............',
     '...HHHHHH...','...HHHHHH...','..HHH..HHH..','..HHH..HHH..'],
    // tier 1: teal-trim boots
    ['............','............','............','............',
     '............','............','............','............',
     '............','............','............','............',
     '...THHHHT...','...HHHHHH...','..THH..HHT..','..HHH..HHH..'],
    // tier 2: gold-trim boots
    ['............','............','............','............',
     '............','............','............','............',
     '............','............','............','............',
     '..OHHHHHHO..','...HHHHHH...','..OHH..HHO..','..HHH..HHH..'],
  ],

  // POWERFUL → Weapon — 3 cols wide (cols 9–11), right side
  // Shifted 1 row down due to taller face
  powerful: [
    // tier 0: short dagger — rows 9–13
    ['............','............','............','............',
     '............','............','............','............',
     '............','.........LLL','.........LLL','.........OOO',
     '.........GGG','............','............','............'],
    // tier 1: sword — blade from row 5, crossguard at row 10
    ['............','............','............','............',
     '............','...........L','..........LL','.........LLL',
     '.........LLL','........GGGG','.........OOO','.........OOO',
     '.........GGG','............','............','............'],
    // tier 2: longsword — coral tip/pommel, wide guard at row 10
    ['............','...........C','..........LC','..........LL',
     '..........LL','..........LL','..........LL','.........LLL',
     '.........LLL','........CCGG','.........OOO','.........OOO',
     '.........CCC','............','............','............'],
  ],

  // HUMAN → Amulet — centered on chest, rows 8–12
  human: [
    // tier 0: coral heart
    ['............','............','............','............',
     '............','............','............','............',
     '...CC..CC...','...CCCCCC...','....CCCC....','....CCC.....',
     '.....C......','............','............','............'],
    // tier 1: teal gemstone
    ['............','............','............','............',
     '............','............','............','....TTTT....',
     '...TWWWT....','...TWWWT....','...TWWWT....','....TTTT....',
     '............','............','............','............'],
    // tier 2: radiant amulet
    ['............','............','............','............',
     '............','............','............','............',
     '.....WW.....','...CCWWCC...','..CCWWWWCC..','...CCWWCC...',
     '.....CC.....','............','............','............'],
  ],

  // SHARP → Off-hand — 3 cols wide (cols 0–2), left side
  sharp: [
    // tier 0: quill pen — coral tip, teal feather
    ['............','............','............','............',
     'CT..........','TTT.........','TTT.........', '.TT.........',
     '..T.........','..T.........','..T.........','............',
     '............','............','............','............'],
    // tier 1: scroll — gold caps, cream body
    ['............','............','............','............',
     '............','............','OOO.........','WWW.........',
     'WWW.........','WWW.........','OOO.........','............',
     '............','............','............','............'],
    // tier 2: crystal orb — teal/white sphere on gray stand
    ['............','............','............','............',
     '............','.TT.........','TTT.........','TWW.........',
     'TWW.........','TTT.........', '.GG.........','GGG.........',
     '............','............','............','............'],
  ],

  // PROFESSIONAL → Hat — rows 0–1 (above face, unaffected by face expansion)
  professional: [
    // tier 0: coral beret
    ['..CCCCCCCC..','...CCCCCC...',
     '............','............','............','............','............',
     '............','............','............','............','............',
     '............','............','............','............'],
    // tier 1: gray cap with silver band
    ['..GGGGGGGG..','...LLLLLL...',
     '............','............','............','............','............',
     '............','............','............','............','............',
     '............','............','............','............'],
    // tier 2: gold crown with coral gems
    ['..OCOCOCOC..','..OOOOOOOO..',
     '............','............','............','............','............',
     '............','............','............','............','............',
     '............','............','............','............'],
  ],
};

// ── TRAIT → CLUSTER MAPPING ───────────────────────────────────────────────
const TRAIT_CLUSTERS = {
  'Calm':'grounded','Grounded':'grounded','Steady':'grounded',
  'Measured':'grounded','Composed':'grounded','Unhurried':'grounded',
  'Still':'grounded','Centred':'grounded','Resilient':'grounded',
  'Assured':'grounded',
  'Bold':'powerful','Commanding':'powerful','Powerful':'powerful',
  'Direct':'powerful','Assertive':'powerful','Striking':'powerful',
  'Unapologetic':'powerful','Decisive':'powerful','Confident':'powerful',
  'Dynamic':'powerful','Challenging':'powerful','Magnetic':'powerful',
  'Warm':'human','Approachable':'human','Inviting':'human',
  'Playful':'human','Generous':'human','Energising':'human',
  'Joyful':'human','Light':'human','Inclusive':'human',
  'Collaborative':'human','Diplomatic':'human','Connecting':'human',
  'Vulnerable':'human','Authentic':'human','Empowering':'human',
  'Spontaneous':'human',
  'Clear':'sharp','Precise':'sharp','Purposeful':'sharp',
  'Focused':'sharp','Thoughtful':'sharp','Curious':'sharp',
  'Inspiring':'sharp','Expressive':'sharp','Concise':'sharp',
  'Strategic':'sharp',
  'Authoritative':'professional','Persuasive':'professional',
  'Credible':'professional','Influential':'professional',
  'Polished':'professional','Engaging':'professional',
  'Adaptable':'professional','Facilitative':'professional',
  'Trustworthy':'professional','Honest':'professional',
};

// ── RENDER FUNCTION ───────────────────────────────────────────────────────
function renderSprite(canvas, traits, px) {
  const rows = BASE_CHARACTER;
  canvas.width  = rows[0].length * px;
  canvas.height = rows.length * px;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  function drawGrid(grid) {
    grid.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        const color = PALETTE[ch];
        if (!color) return;
        ctx.fillStyle = color;
        ctx.fillRect(x * px, y * px, px, px);
      });
    });
  }

  const counts = { grounded:0, powerful:0, human:0, sharp:0, professional:0 };
  (traits || []).forEach(t => { const c = TRAIT_CLUSTERS[t]; if (c) counts[c]++; });

  drawGrid(rows);

  ['grounded','powerful','human','sharp','professional'].forEach(cl => {
    const n = counts[cl];
    if (!n) return;
    drawGrid(EQUIPMENT[cl][n >= 3 ? 2 : n - 1]);
  });

  // Expression: dominant cluster wins; ties stay neutral
  const maxCount = Math.max(...Object.values(counts));
  if (maxCount > 0) {
    const dominants = Object.keys(counts).filter(k => counts[k] === maxCount);
    if (dominants.length === 1) drawGrid(EXPRESSIONS[dominants[0]]);
  }
}
