// Data for Kama Traditional Ornament Generator (Генератор орнамента Прикамья)

const SYMBOL_ICONS = import.meta.glob('../assets/icons/symbol/*-v4.png', { eager: true, import: 'default' });
const COMPOSITION_ICONS = import.meta.glob('../assets/icons/composition/*.png', { eager: true, import: 'default' });

const SYMBOL_FILE_MAP = {
  rhombus: 'rhombus-v4',
  wave: 'river-v4',
  cross: 'cross-v4',
  spruce: 'lapas-v4',
  dual_rhombus: 'shudo-v4'
};

const COMPOSITION_FILE_MAP = {
  tile: 'composition-tile',
  border: 'composition-border',
  medallion: 'composition-medallion',
  frame: 'composition-corner-frame'
};

export function symbolIconSrc(id) {
  return SYMBOL_ICONS[`../assets/icons/symbol/${SYMBOL_FILE_MAP[id]}.png`];
}

export function compositionIconSrc(id) {
  return COMPOSITION_ICONS[`../assets/icons/composition/${COMPOSITION_FILE_MAP[id]}.png`];
}

export const KAMA_PALETTE = {
  ochre: { name: 'Охра', hex: '#C88A35', desc: 'Тепло уральской земли, золото и хлебные нивы' },
  white: { name: 'Белый', hex: '#FFFFFF', desc: 'Чистота помыслов, снега Прикамья и свет' },
  darkGreen: { name: 'Тёмно-зелёный', hex: '#1C4524', desc: 'Пермская тайга, хвойный лес и сила природы' },
  burgundy: { name: 'Бордовый', hex: '#7A1C2C', desc: 'Обережная жизненная сила и нити традиционной вышивки' }
};

export const MAIN_SYMBOLS = [
  {
    id: 'rhombus',
    name: 'Ромб',
    meaning: 'Плодородие, засеянное поле и земное благополучие',
    desc: 'Главный обережный знак пермских и финно-угорских народов. Символизирует щедрую землю, мать-природу и достаток в доме.',
    icon: symbolIconSrc('rhombus')
  },
  {
    id: 'wave',
    name: 'Волна / Река',
    meaning: 'Вода, течение жизни и чистота истоков',
    desc: 'Олицетворяет могучую Каму, движение времени, обновление и жизненную энергию воды.',
    icon: symbolIconSrc('wave')
  },
  {
    id: 'cross',
    name: 'Крест / Солнечный крест',
    meaning: 'Ось мира, четыре стороны света и солнце',
    desc: 'Древнейший солярный знак мироздания. Соединяет четыре стороны света, сохраняет равновесие и дарует жизненный свет.',
    icon: symbolIconSrc('cross')
  },
  {
    id: 'spruce',
    name: 'Елочка / Папас',
    meaning: 'Древо жизни и вечность таежного края',
    desc: 'Удмуртский и коми знак тайги. Ель — вечнозеленое древо, хранящее память предков.',
    icon: symbolIconSrc('spruce')
  },
  {
    id: 'dual_rhombus',
    name: 'Двойной ромб (Шудо)',
    meaning: 'Счастье, союз двух сердец и родовой оберег',
    desc: 'Вложенный ромб с лучами. Знак защиты семьи от недоброго глаза.',
    icon: symbolIconSrc('dual_rhombus')
  }
];

export const COMPOSITION_TYPES = [
  {
    id: 'tile',
    name: 'Сплошное полотно (Плитка)',
    desc: 'Повторяющийся геометрический раппорт для ткани, ковра или панно.',
    icon: compositionIconSrc('tile'),
    promptType: 'COMPOSITION TYPE: ALL-OVER REPEATING ORNAMENT.',
    promptLayout: `Create a continuous geometric ornament covering the entire square canvas.

The pattern must repeat evenly in both horizontal and vertical directions.
Maintain uniform density and scale across the whole image.

There must be no dominant central symbol and no isolated focal point.

The ornament should visually continue beyond all four canvas edges.

Create a seamless tileable pattern.
Left and right edges must connect visually.
Top and bottom edges must connect visually.

NO central medallion.
NO isolated emblem.
NO decorative frame.
NO large empty areas.
NO single oversized symbol.`,
    promptSymbolRule: 'Transform the selected symbols into repeatable ornamental modules.',
    promptNegatives: 'Do not interpret this as a medallion, border or frame.'
  },
  {
    id: 'border',
    name: 'Ленточный каймовый узор',
    desc: 'Обережная полоса для обрамления одежды, скатертей или наличников.',
    icon: compositionIconSrc('border'),
    promptType: 'COMPOSITION TYPE: HORIZONTAL ORNAMENTAL BORDER.',
    promptLayout: `Create one long horizontal decorative ornament band centered on the canvas.

The band should occupy approximately 20–30% of the image height and 80–90% of its width.

Leave large empty areas above and below the ornament.

Maintain a consistent band height.

The ornament must read as a decorative border or embroidered ribbon.

Use a clear upper and lower boundary line within the ornamental band.
Keep the rhythm continuous and symmetrical along the horizontal axis.

NO full-canvas pattern.
NO vertical repetition.
NO central medallion.
NO rectangular frame surrounding the image.
NO ornament filling the background.`,
    promptSymbolRule: 'Arrange the selected symbols into a rhythmic horizontal sequence.',
    promptNegatives: 'Do not expand the ornament vertically or turn it into a full-page pattern.'
  },
  {
    id: 'medallion',
    name: 'Центральная розетка (Медальон)',
    desc: 'Концентрический солярный круг с ромбической осью в центре.',
    icon: compositionIconSrc('medallion'),
    promptType: 'COMPOSITION TYPE: ISOLATED CENTRAL MEDALLION.',
    promptLayout: `Create exactly ONE self-contained ornamental medallion centered on the square canvas.

The medallion should occupy approximately 60–70% of the canvas.

Leave at least 15% clean empty space around it on every side.

Use a compact circular, octagonal, diamond-shaped or rosette-like silhouette.

Use strict radial or four-way symmetry.

The ornament must have a clearly visible outer silhouette and read as one independent emblem.

NO full-page ornament.
NO repeating background.
NO carpet pattern.
NO textile panel.
NO rectangular frame.
NO ornament touching the canvas edges.
NO multiple medallions.`,
    promptSymbolRule: 'Arrange the selected symbols hierarchically around a single central focal point.',
    promptNegatives: 'Do not create a surrounding border or repeating background.'
  },
  {
    id: 'frame',
    name: 'Рамка с узорным углом',
    desc: 'Геометрический контур для оформления грамот и памятных досок.',
    icon: compositionIconSrc('frame'),
    promptType: 'COMPOSITION TYPE: ORNAMENTAL FRAME WITH DECORATED CORNERS.',
    promptLayout: `Create a decorative geometric frame around the perimeter of the square canvas.

Keep the central 65–75% of the image completely empty and visually calm.

Place the main ornamental motifs in the four corners.

Connect the corner motifs with restrained repeating border elements along the four sides.

The corners should be visually stronger and more detailed than the side borders.

Maintain perfect symmetry between opposite corners and sides.

Keep the side borders thin and restrained.

NO central ornament.
NO central medallion.
NO full-canvas pattern.
NO decorative elements inside the central empty area.
NO carpet-like filling.`,
    promptSymbolRule: 'Use selected symbols primarily in corners and secondary border modules.',
    promptNegatives: 'Do not place a dominant symbol in the center.'
  }
];

const PALETTE_LINE = Object.values(KAMA_PALETTE)
  .map((c) => `${c.name} (${c.hex})`)
  .join(', ');

function symbolHierarchyBlock(compObj) {
  const integrate = 'Integrate the selected symbols into the composition rather than placing each of them as a separate standalone icon.';
  if (compObj.id === 'tile') {
    return `${integrate}\n${compObj.promptSymbolRule}`;
  }
  return `${integrate}
Establish a hierarchy: one symbol may serve as the dominant motif, while the others should act as secondary supporting motifs.
Do not repeat every selected symbol excessively.
${compObj.promptSymbolRule}`;
}

export function buildOpenRoadOrnamentPrompt({ symbols, composition }) {
  const symbolNames = symbols.map(s => {
    const found = MAIN_SYMBOLS.find(item => item.id === s);
    return found ? `${found.name} (${found.meaning})` : s;
  }).join(', ');

  const compObj = COMPOSITION_TYPES.find(c => c.id === composition) || COMPOSITION_TYPES[0];

  return `${compObj.promptType}

${compObj.promptLayout}

Selected symbols: ${symbolNames}.
${symbolHierarchyBlock(compObj)}

Style: traditional Kama-region (Прикамье) ornament, Perm ethnic geometric pattern.

Color palette strictly limited to: ${PALETTE_LINE}.
Use only the specified symbols and colors.

Visual style: flat 2D vector ornament, crisp geometric contours, simple closed shapes, controlled detail, clear geometry, clear visual hierarchy, balanced negative space, strong visual hierarchy.

Avoid: gradients, shadows, 3D, photorealism, people, humans, text, random decorative elements outside the selected composition, animals unless explicitly selected as a symbol.
${compObj.promptNegatives}`;
}
