import type { CrosswordPuzzle, CrosswordEntry } from './types';

// 11×11 crossword template:
//   • Full black column at col 5 (all rows)
//   • Full black row at row 5 (all cols)
//   • Four independent 5×5 word squares:
//       TL: rows 0-4, cols 0-4
//       TR: rows 0-4, cols 6-10
//       BL: rows 6-10, cols 0-4
//       BR: rows 6-10, cols 6-10
//
// In every word square the row words and column words are identical (word-square property).
// All 40 entries per puzzle are exactly 5 letters.

interface WordSquare {
  words: [string, string, string, string, string];
  acrossClues: [string, string, string, string, string];
  downClues: [string, string, string, string, string];
}

function buildPuzzle(
  id: string,
  title: string,
  tl: WordSquare,
  tr: WordSquare,
  bl: WordSquare,
  br: WordSquare,
): CrosswordPuzzle {
  const SIZE = 11;

  // Build grid (null = black)
  const grid: (string | null)[][] = Array.from({ length: SIZE }, () =>
    new Array(SIZE).fill(null),
  );
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      grid[r][c] = tl.words[r][c];
      grid[r][c + 6] = tr.words[r][c];
      grid[r + 6][c] = bl.words[r][c];
      grid[r + 6][c + 6] = br.words[r][c];
    }
  }

  // Numbering (standard left-to-right, top-to-bottom):
  //  Row 0: 1(across+down), 2-5(down), [black], 6(across+down), 7-10(down)
  //  Row 1: 11(across), [black], 12(across)
  //  Row 2: 13, [black], 14
  //  Row 3: 15, [black], 16
  //  Row 4: 17, [black], 18
  //  Row 5: all black
  //  Row 6: 19(across+down), 20-23(down), [black], 24(across+down), 25-28(down)
  //  Row 7: 29, [black], 30
  //  Row 8: 31, [black], 32
  //  Row 9: 33, [black], 34
  //  Row 10: 35, [black], 36

  const entries: CrosswordEntry[] = [
    // ── ACROSS ──────────────────────────────────────────────────────────
    // TL across (rows 0-4, cols 0-4)
    { number: 1,  direction: 'across', row: 0,  col: 0, length: 5, answer: tl.words[0], clue: tl.acrossClues[0] },
    { number: 11, direction: 'across', row: 1,  col: 0, length: 5, answer: tl.words[1], clue: tl.acrossClues[1] },
    { number: 13, direction: 'across', row: 2,  col: 0, length: 5, answer: tl.words[2], clue: tl.acrossClues[2] },
    { number: 15, direction: 'across', row: 3,  col: 0, length: 5, answer: tl.words[3], clue: tl.acrossClues[3] },
    { number: 17, direction: 'across', row: 4,  col: 0, length: 5, answer: tl.words[4], clue: tl.acrossClues[4] },
    // TR across (rows 0-4, cols 6-10)
    { number: 6,  direction: 'across', row: 0,  col: 6, length: 5, answer: tr.words[0], clue: tr.acrossClues[0] },
    { number: 12, direction: 'across', row: 1,  col: 6, length: 5, answer: tr.words[1], clue: tr.acrossClues[1] },
    { number: 14, direction: 'across', row: 2,  col: 6, length: 5, answer: tr.words[2], clue: tr.acrossClues[2] },
    { number: 16, direction: 'across', row: 3,  col: 6, length: 5, answer: tr.words[3], clue: tr.acrossClues[3] },
    { number: 18, direction: 'across', row: 4,  col: 6, length: 5, answer: tr.words[4], clue: tr.acrossClues[4] },
    // BL across (rows 6-10, cols 0-4)
    { number: 19, direction: 'across', row: 6,  col: 0, length: 5, answer: bl.words[0], clue: bl.acrossClues[0] },
    { number: 29, direction: 'across', row: 7,  col: 0, length: 5, answer: bl.words[1], clue: bl.acrossClues[1] },
    { number: 31, direction: 'across', row: 8,  col: 0, length: 5, answer: bl.words[2], clue: bl.acrossClues[2] },
    { number: 33, direction: 'across', row: 9,  col: 0, length: 5, answer: bl.words[3], clue: bl.acrossClues[3] },
    { number: 35, direction: 'across', row: 10, col: 0, length: 5, answer: bl.words[4], clue: bl.acrossClues[4] },
    // BR across (rows 6-10, cols 6-10)
    { number: 24, direction: 'across', row: 6,  col: 6, length: 5, answer: br.words[0], clue: br.acrossClues[0] },
    { number: 30, direction: 'across', row: 7,  col: 6, length: 5, answer: br.words[1], clue: br.acrossClues[1] },
    { number: 32, direction: 'across', row: 8,  col: 6, length: 5, answer: br.words[2], clue: br.acrossClues[2] },
    { number: 34, direction: 'across', row: 9,  col: 6, length: 5, answer: br.words[3], clue: br.acrossClues[3] },
    { number: 36, direction: 'across', row: 10, col: 6, length: 5, answer: br.words[4], clue: br.acrossClues[4] },

    // ── DOWN ─────────────────────────────────────────────────────────────
    // TL down (cols 0-4, rows 0-4) — word-square: col c = tl.words[c]
    { number: 1, direction: 'down', row: 0, col: 0, length: 5, answer: tl.words[0], clue: tl.downClues[0] },
    { number: 2, direction: 'down', row: 0, col: 1, length: 5, answer: tl.words[1], clue: tl.downClues[1] },
    { number: 3, direction: 'down', row: 0, col: 2, length: 5, answer: tl.words[2], clue: tl.downClues[2] },
    { number: 4, direction: 'down', row: 0, col: 3, length: 5, answer: tl.words[3], clue: tl.downClues[3] },
    { number: 5, direction: 'down', row: 0, col: 4, length: 5, answer: tl.words[4], clue: tl.downClues[4] },
    // TR down (cols 6-10, rows 0-4)
    { number: 6,  direction: 'down', row: 0, col: 6,  length: 5, answer: tr.words[0], clue: tr.downClues[0] },
    { number: 7,  direction: 'down', row: 0, col: 7,  length: 5, answer: tr.words[1], clue: tr.downClues[1] },
    { number: 8,  direction: 'down', row: 0, col: 8,  length: 5, answer: tr.words[2], clue: tr.downClues[2] },
    { number: 9,  direction: 'down', row: 0, col: 9,  length: 5, answer: tr.words[3], clue: tr.downClues[3] },
    { number: 10, direction: 'down', row: 0, col: 10, length: 5, answer: tr.words[4], clue: tr.downClues[4] },
    // BL down (cols 0-4, rows 6-10)
    { number: 19, direction: 'down', row: 6, col: 0, length: 5, answer: bl.words[0], clue: bl.downClues[0] },
    { number: 20, direction: 'down', row: 6, col: 1, length: 5, answer: bl.words[1], clue: bl.downClues[1] },
    { number: 21, direction: 'down', row: 6, col: 2, length: 5, answer: bl.words[2], clue: bl.downClues[2] },
    { number: 22, direction: 'down', row: 6, col: 3, length: 5, answer: bl.words[3], clue: bl.downClues[3] },
    { number: 23, direction: 'down', row: 6, col: 4, length: 5, answer: bl.words[4], clue: bl.downClues[4] },
    // BR down (cols 6-10, rows 6-10)
    { number: 24, direction: 'down', row: 6, col: 6,  length: 5, answer: br.words[0], clue: br.downClues[0] },
    { number: 25, direction: 'down', row: 6, col: 7,  length: 5, answer: br.words[1], clue: br.downClues[1] },
    { number: 26, direction: 'down', row: 6, col: 8,  length: 5, answer: br.words[2], clue: br.downClues[2] },
    { number: 27, direction: 'down', row: 6, col: 9,  length: 5, answer: br.words[3], clue: br.downClues[3] },
    { number: 28, direction: 'down', row: 6, col: 10, length: 5, answer: br.words[4], clue: br.downClues[4] },
  ];

  return { id, title, size: SIZE, grid, entries };
}

// ─── PUZZLE 1 ────────────────────────────────────────────────────────────────
// Grid:
//   A P P L E # B L I S S
//   P L A I N # L U N C H
//   P A I N T # I N F E R
//   L I N E R # S C E N E
//   E N T R Y # S H R E W
//   # # # # # # # # # # #
//   C A R G O # C L A S S
//   A B O R T # L I G H T
//   R O B O T # A G R E E
//   G R O V E # S H E A R
//   O T T E R # S T E R N
const puzzle1 = buildPuzzle('p1', 'Fresh Start', {
  words: ['APPLE', 'PLAIN', 'PAINT', 'LINER', 'ENTRY'],
  acrossClues: [
    'Red or green fruit; iPhone maker\'s logo',
    'Simple and unadorned; not fancy',
    'Apply pigment with a brush',
    'Ocean-going passenger ship',
    'Point of access; a submitted contest form',
  ],
  downClues: [
    'Fruit that keeps the doctor away',
    'Flat open land; without decoration',
    'Artist\'s medium applied to canvas',
    'One who lines; an eyeliner pencil',
    'Hallway or foyer leading inside',
  ],
}, {
  words: ['BLISS', 'LUNCH', 'INFER', 'SCENE', 'SHREW'],
  acrossClues: [
    'Perfect happiness; pure joy',
    'Midday meal',
    'Conclude from evidence; deduce',
    'Setting of a story or dramatic moment',
    'Small aggressive mammal; a scolding woman',
  ],
  downClues: [
    'State of total delight and contentment',
    'Noon repast; a brown-bag ___',
    'Draw a logical conclusion',
    'Where the action takes place in a film',
    'Shakespeare\'s "Taming of the ___"',
  ],
}, {
  words: ['CARGO', 'ABORT', 'ROBOT', 'GROVE', 'OTTER'],
  acrossClues: [
    'Freight carried by a ship or plane',
    'Cancel a mission or operation',
    'Automated mechanical worker; sci-fi icon',
    'Small cluster of trees; an orchard',
    'Playful aquatic mammal that floats on its back',
  ],
  downClues: [
    'Goods loaded onto a vessel',
    'Call off a launch; terminate early',
    'Factory machine; R2-D2, for one',
    'Orange ___ ; a mini-forest',
    'River creature that cracks shells with rocks',
  ],
}, {
  words: ['CLASS', 'LIGHT', 'AGREE', 'SHEAR', 'STERN'],
  acrossClues: [
    'Group of students; category; elegance',
    'Illumination; also not heavy',
    'Reach consensus; see eye to eye',
    'Cut with large scissors; clip a sheep',
    'Rear of a ship; also strict and severe',
  ],
  downClues: [
    'A school lesson period',
    'The sun provides this; opposite of dark',
    'Come to the same opinion',
    'Trim wool from a sheep',
    'Back end of a vessel; unsmiling',
  ],
});

// ─── PUZZLE 2 ────────────────────────────────────────────────────────────────
// Grid:
//   F E A S T # G U S T O
//   E M B E R # U P P E R
//   A B O V E # S P E N D
//   S E V E N # T E N S E
//   T R E N D # O R D E R
//   # # # # # # # # # # #
//   H A R S H # M U S I C
//   A M I N O # U L T R A
//   R I V A L # S T E A M
//   S N A I L # I R A T E
//   H O L L Y # C A M E L
const puzzle2 = buildPuzzle('p2', 'High Spirits', {
  words: ['FEAST', 'EMBER', 'ABOVE', 'SEVEN', 'TREND'],
  acrossClues: [
    'Lavish banquet; a celebratory meal',
    'Glowing remnant of a dying fire',
    'Higher than; overhead',
    'Number after six; days in a week',
    'Current popular direction or style',
  ],
  downClues: [
    'Grand holiday meal; indulge in ___',
    'Hot ash that still glows',
    'Up and ___ ; higher in position',
    'Deadly sins count; lucky number',
    'Fashion direction; what\'s popular now',
  ],
}, {
  words: ['GUSTO', 'UPPER', 'SPEND', 'TENSE', 'ORDER'],
  acrossClues: [
    'Enthusiastic enjoyment; relish; zest',
    'Higher in position; the top part',
    'Use money; pay out; shell out',
    'Anxious; or a verb form like past ___',
    'A command; organized arrangement',
  ],
  downClues: [
    'Do something with great ___; enthusiasm',
    'Above; of greater rank',
    'Lay out cash; disburse',
    'Uptight and anxious',
    'A directive; to put in sequence',
  ],
}, {
  words: ['HARSH', 'AMINO', 'RIVAL', 'SNAIL', 'HOLLY'],
  acrossClues: [
    'Rough and severe; unkind in nature',
    '___ acid; protein\'s building block',
    'Competitor; one vying for the same goal',
    'Slow-moving mollusk with a shell',
    'Evergreen shrub with red berries; a Christmas plant',
  ],
  downClues: [
    'Unpleasantly strict or grating',
    'Like ___ acids found in all living things',
    'Opponent; adversary in a contest',
    'Creature that leaves a slime trail',
    'Holiday decoration; a festive plant',
  ],
}, {
  words: ['MUSIC', 'ULTRA', 'STEAM', 'IRATE', 'CAMEL'],
  acrossClues: [
    'Art of organized sound; melodies and rhythms',
    'Beyond extreme; prefix meaning very',
    'Water vapor from boiling; also to iron clothes',
    'Very angry; furious',
    'Desert animal with a hump',
  ],
  downClues: [
    'What you hear on the radio',
    '___ violet; beyond extreme',
    'Power source of 19th-century engines',
    'Extremely upset and agitated',
    'Caravanning beast; ship of the desert',
  ],
});

// ─── PUZZLE 3 ────────────────────────────────────────────────────────────────
// Grid:
//   S H E L F # S P E A R
//   H U M O R # P I X I E
//   E M O T E # E X T R A
//   L O T U S # A I R E D
//   F R E S H # R E A D Y
//   # # # # # # # # # # #
//   V I L L A # C A R E T
//   I D E A L # A L I V E
//   L E A P T # R I V E R
//   L A P S E # E V E N S
//   A L T E R # T E R S E
const puzzle3 = buildPuzzle('p3', 'Nature & Mind', {
  words: ['SHELF', 'HUMOR', 'EMOTE', 'LOTUS', 'FRESH'],
  acrossClues: [
    'Horizontal storage surface on a wall',
    'Quality of being funny; wit',
    'Express emotion dramatically, like an actor',
    'Water lily sacred in Buddhism',
    'Newly made; not stale; cool and crisp',
  ],
  downClues: [
    'Board on a wall for books or items',
    'Comic sense; one of the four bodily ___s',
    'Convey feeling on stage or screen',
    'Flower sacred in ancient Egypt',
    'Just baked or picked; crisp',
  ],
}, {
  words: ['SPEAR', 'PIXIE', 'EXTRA', 'AIRED', 'READY'],
  acrossClues: [
    'Long pointed hunting weapon; to pierce',
    'Mischievous little fairy in folklore',
    'More than needed; a bonus; surplus',
    'Broadcast on television; also ventilated',
    'Fully prepared and set to go',
  ],
  downClues: [
    'Pointed throwing weapon; a javelin',
    'Small magical fairy creature',
    'Surplus; a background actor in a film',
    'Put on TV; made public; ventilated a room',
    'All set; good to go',
  ],
}, {
  words: ['VILLA', 'IDEAL', 'LEAPT', 'LAPSE', 'ALTER'],
  acrossClues: [
    'Luxurious country or Mediterranean house',
    'A perfect standard or model; flawless',
    'Past tense of leap; sprang suddenly',
    'A brief failure or memory slip',
    'Change or modify; adjust',
  ],
  downClues: [
    'Grand holiday residence by the sea',
    'Best possible; a perfect concept',
    'Jumped suddenly over something',
    'A gap or temporary failure',
    'Revise; make different',
  ],
}, {
  words: ['CARET', 'ALIVE', 'RIVER', 'EVENS', 'TERSE'],
  acrossClues: [
    'Proofreading insertion mark (^)',
    'Living; full of energy and life',
    'The Nile or Amazon, e.g.',
    'Makes equal; also the even numbers',
    'Brief and to the point; blunt',
  ],
  downClues: [
    'Editor\'s symbol for inserting text',
    'Not dead; still going strong',
    'Flowing watercourse to the sea',
    'Settles the score; balances out',
    'Curt and concise in speech',
  ],
});

// ─── PUZZLE 4 ────────────────────────────────────────────────────────────────
// Grid:
//   H E A R T # V I L L A
//   E M B E R # I D E A L
//   A B U S E # L E A P T
//   R E S I N # L A P S E
//   T R E N D # A L T E R
//   # # # # # # # # # # #
//   M U S I C # G U S T O
//   U L T R A # U P P E R
//   S T E A M # S P E N D
//   I R A T E # T E N S E
//   C A M E L # O R D E R
const puzzle4 = buildPuzzle('p4', 'Passion & Drive', {
  words: ['HEART', 'EMBER', 'ABUSE', 'RESIN', 'TREND'],
  acrossClues: [
    'Vital pump of the body; seat of emotion',
    'Glowing hot ash from a fire',
    'Misuse or mistreat; cruel treatment',
    'Sticky tree secretion used in varnishes',
    'Current fashionable direction',
  ],
  downClues: [
    'Organ that pumps blood; courage',
    'Lingering fire remnant that still glows',
    'Take advantage of cruelly',
    'Amber is fossilized ___',
    'Growing fashion; a viral movement',
  ],
}, {
  words: ['VILLA', 'IDEAL', 'LEAPT', 'LAPSE', 'ALTER'],
  acrossClues: [
    'Grand Mediterranean residence or country house',
    'Perfect model or standard',
    'Jumped; sprang over an obstacle',
    'A memory gap; a brief period of time',
    'Revise or modify; tailor a garment',
  ],
  downClues: [
    'Luxury holiday home in the countryside',
    'The best possible version; an aspiration',
    'Past tense of leap',
    'A slip or temporary failure',
    'Adjust; change course',
  ],
}, {
  words: ['MUSIC', 'ULTRA', 'STEAM', 'IRATE', 'CAMEL'],
  acrossClues: [
    'Harmony of sounds; what plays on the radio',
    'Extreme; beyond normal limits',
    'Vapor rising from boiling water',
    'Extremely angry and agitated',
    'Hump-backed desert animal',
  ],
  downClues: [
    'Art form combining melody and rhythm',
    'Prefix for beyond extreme; as in ___ sonic',
    '19th-century locomotive power; iron clothes with this',
    'Furious; seething with anger',
    'Ship of the desert; a pack animal',
  ],
}, {
  words: ['GUSTO', 'UPPER', 'SPEND', 'TENSE', 'ORDER'],
  acrossClues: [
    'Zest and enthusiasm; great relish',
    'Above; higher in rank or position',
    'Lay out money; pay for something',
    'Stressed and anxious; a verb tense',
    'A command; a sequence; tidiness',
  ],
  downClues: [
    'Do it with ___; passionate enthusiasm',
    'Top deck; above average',
    'Shell out cash; disburse funds',
    'Uptight; on edge',
    'In ___ ; a directive or instruction',
  ],
});

// ─── PUZZLE 5 ────────────────────────────────────────────────────────────────
// Grid:
//   C L A S S # C A R G O
//   L I G H T # A B O R T
//   A G R E E # R O B O T
//   S H E A R # G R O V E
//   S T E R N # O T T E R
//   # # # # # # # # # # #
//   A P P L E # B L I S S
//   P L A I N # L U N C H
//   P A I N T # I N F E R
//   L I N E R # S C E N E
//   E N T R Y # S H R E W
const puzzle5 = buildPuzzle('p5', 'Order & Wonder', {
  words: ['CLASS', 'LIGHT', 'AGREE', 'SHEAR', 'STERN'],
  acrossClues: [
    'Category; group of students; style',
    'Illumination; featherweight; a lamp\'s output',
    'Concur; come to the same conclusion',
    'Clip a sheep\'s wool; cut with large blades',
    'Rear of a ship; also unyielding and strict',
  ],
  downClues: [
    'A lesson at school; elegance',
    'Not heavy; the opposite of darkness',
    'See eye to eye; say yes to a proposal',
    'Trim with shears; a wool-cutting tool',
    'Back of a boat; a firm, serious manner',
  ],
}, {
  words: ['CARGO', 'ABORT', 'ROBOT', 'GROVE', 'OTTER'],
  acrossClues: [
    'Goods carried by a ship or aircraft',
    'Call off a mission; terminate a launch',
    'Programmed mechanical worker',
    'A small stand of trees; a fruit orchard',
    'Whiskered river mammal known for play',
  ],
  downClues: [
    'Freight or shipment on a vessel',
    'Cancel a space mission mid-launch',
    'Automated machine; a sci-fi staple',
    'Orange ___; a mini-forest clearing',
    'Aquatic animal that holds hands while sleeping',
  ],
}, {
  words: ['APPLE', 'PLAIN', 'PAINT', 'LINER', 'ENTRY'],
  acrossClues: [
    'A fruit; also a tech company\'s symbol',
    'Not decorated; flat treeless land',
    'Coat a surface with pigment',
    'A scheduled cruise ship',
    'An opening; a submitted application',
  ],
  downClues: [
    'Newton\'s inspiration; a fruit',
    'Without frills; a vast flat landscape',
    'Use a brush to color',
    'Eyeliner; an ocean-going vessel',
    'Doorway; a form submission',
  ],
}, {
  words: ['BLISS', 'LUNCH', 'INFER', 'SCENE', 'SHREW'],
  acrossClues: [
    'Utter happiness; a state of joy',
    'The noon meal; a midday break',
    'Draw a conclusion from clues',
    'A dramatic setting; a location in a film',
    'A small, sharp-nosed mammal; a nagging person',
  ],
  downClues: [
    'Heavenly happiness; pure delight',
    'A packed sandwich meal; midday food',
    'Deduce from available evidence',
    'Where the action happens; backdrop',
    'Shakespeare\'s ill-tempered character type',
  ],
});

export const PUZZLES: CrosswordPuzzle[] = [
  puzzle1,
  puzzle2,
  puzzle3,
  puzzle4,
  puzzle5,
];

export function getPuzzleForDate(dateStr: string): CrosswordPuzzle {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0;
  }
  return PUZZLES[hash % PUZZLES.length];
}
