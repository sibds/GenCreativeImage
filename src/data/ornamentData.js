// Data for Kama Traditional Ornament Generator (Генератор орнамента Прикамья)

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
    icon: '🔷',
    svgType: 'rhombus'
  },
  {
    id: 'wave',
    name: 'Волна / Река',
    meaning: 'Вода, течение жизни и чистота истоков',
    desc: 'Олицетворяет могучую Каму, движение времени, обновление и жизненную энергию воды.',
    icon: '🌊',
    svgType: 'wave'
  },
  {
    id: 'cross',
    name: 'Крест / Солнечный крест',
    meaning: 'Ось мира, четыре стороны света и солнце',
    desc: 'Древнейший солярный знак мироздания. Соединяет четыре стороны света, сохраняет равновесие и дарует жизненный свет.',
    icon: '✚',
    svgType: 'cross'
  },
  {
    id: 'spruce',
    name: 'Елочка / Папас',
    meaning: 'Древо жизни и вечность таежного края',
    desc: 'Удмуртский и коми знак тайги. Ель — вечнозеленое древо, хранящее память предков.',
    icon: '🌲',
    svgType: 'spruce'
  },
  {
    id: 'dual_rhombus',
    name: 'Двойной ромб (Шудо)',
    meaning: 'Счастье, союз двух сердец и родовой оберег',
    desc: 'Вложенный ромб с лучами. Знак защиты семьи от недоброго глаза.',
    icon: '💠',
    svgType: 'dual_rhombus'
  }
];

export const COMPOSITION_TYPES = [
  {
    id: 'tile',
    name: 'Сплошное полотно (Плитка)',
    desc: 'Повторяющийся геометрический раппорт для ткани, ковра или панно.'
  },
  {
    id: 'border',
    name: 'Ленточный каймовый узор',
    desc: 'Обережная полоса для обрамления одежды, скатертей или наличников.'
  },
  {
    id: 'medallion',
    name: 'Центральная розетка (Медальон)',
    desc: 'Концентрический солярный круг с ромбической осью в центре.'
  },
  {
    id: 'frame',
    name: 'Рамка с узорным углом',
    desc: 'Геометрический контур для оформления грамот и памятных досок.'
  }
];

export function buildOpenRoadOrnamentPrompt({ symbols, composition, density, strokeWidth }) {
  const symbolNames = symbols.map(s => {
    const found = MAIN_SYMBOLS.find(item => item.id === s);
    return found ? `${found.name} (${found.meaning})` : s;
  }).join(', ');

  const compObj = COMPOSITION_TYPES.find(c => c.id === composition) || COMPOSITION_TYPES[0];

  return `Traditional ornament of the Kama region (Прикамье), traditional Perm ethnic pattern, flat 2D graphic, vector style, crisp outline, clean contour, sharp geometric lines, strictly NO PEOPLE, NO HUMANS. Color palette strictly limited to: Ochre (#C88A35), White (#FFFFFF), Dark Green (#1C4524), Burgundy (#7A1C2C). Key geometric symbols: ${symbolNames}. Composition style: ${compObj.name}. High precision ethnic vector design, 2D clear graphics, crisp contours, perfectly balanced symmetry, 8k resolution.`;
}
