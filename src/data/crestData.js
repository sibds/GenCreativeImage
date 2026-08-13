// Data for Family Crest Generator (Генератор семейного герба)

const CREST_ICONS = import.meta.glob('../assets/icons/*.png', { eager: true, import: 'default' });
const SHIELD_ICONS = import.meta.glob('../assets/icons/shields/*.png', { eager: true, import: 'default' });

export function crestIconSrc(id) {
  return CREST_ICONS[`../assets/icons/${id}.png`];
}

export function shieldIconSrc(id) {
  return SHIELD_ICONS[`../assets/icons/shields/${id}.png`];
}

export const ANIMALS = [
  {
    id: 'bear',
    name: 'Медведь',
    promptName: 'Медведь',
    en: 'bear',
    trait: 'Сила, мудрость и хозяйственность',
    desc: 'Царь тайги, хранитель семейного очага и защитник рода.',
    icon: crestIconSrc('bear'),
    color: '#8B4513',
    heraldicTerm: 'Степенный Медведь',
    folkFigure: 'a bulky folk bear, standing or seated, rounded snout, small ears, simplified masses, no realistic fur tufts'
  },
  {
    id: 'wolf',
    name: 'Волк',
    promptName: 'Волк',
    en: 'wolf',
    trait: 'Верность, сплоченность и храбрость',
    desc: 'Символ непреклонного духа, верности стае и своей семье.',
    icon: crestIconSrc('wolf'),
    color: '#708090',
    heraldicTerm: 'Верный Волк',
    folkFigure: 'an alert wolf in profile, pointed muzzle and ears, long tail as one simple curve, pack-animal emblem, not a realistic wolf'
  },
  {
    id: 'eagle',
    name: 'Орел',
    promptName: 'Орел',
    en: 'eagle',
    trait: 'Зоркость, свобода и благородство',
    desc: 'Владыка небес, дарующий незримую защиту и великие цели.',
    icon: crestIconSrc('eagle'),
    color: '#DAA520',
    heraldicTerm: 'Парящий Орел',
    folkFigure: 'a single folk eagle in profile or three-quarter view, wings as flat geometric planes — not an imperial double-headed eagle, not a royal displayed eagle'
  },
  {
    id: 'fox',
    name: 'Лис',
    promptName: 'Лис',
    en: 'fox',
    trait: 'Ум, изворотливость и житейская мудрость',
    desc: 'Хранитель изобретательности, гибкого ума и семейного уюта.',
    icon: crestIconSrc('fox'),
    color: '#D2691E',
    heraldicTerm: 'Благородная Лисица',
    folkFigure: 'a sly fox in profile, pointed snout, bushy tail as one decorative leaf-like shape, not realistic fur'
  },
  {
    id: 'lynx',
    name: 'Рысь',
    promptName: 'Рысь',
    en: 'lynx',
    trait: 'Зоркий взор, интуиция и невидимый страж',
    desc: 'Священный страж северных лесов, видящий сквозь тьму.',
    icon: crestIconSrc('lynx'),
    color: '#CD853F',
    heraldicTerm: 'Страж-Рысь',
    folkFigure: 'a lynx in frontal or three-quarter view, tufted ears as two geometric ticks, short tail; a lynx, not a housecat or tiger'
  },
  {
    id: 'moose',
    name: 'Лось',
    promptName: 'Лось',
    en: 'moose',
    trait: 'Дух тайги, достоинство и несокрушимость',
    desc: 'Лесной великан, несущий мир, силу и статность.',
    icon: crestIconSrc('moose'),
    color: '#5C4033',
    heraldicTerm: 'Величавый Лось',
    folkFigure: 'a large folk moose in profile, palmate antlers as geometric branching ornament, humped shoulder; a moose, not a deer'
  },
  {
    id: 'falcon',
    name: 'Сокол',
    promptName: 'Сокол',
    en: 'falcon',
    trait: 'Стремительность, ясность мысли и честь',
    desc: 'Символ чести, благородных помыслов и стремительных побед.',
    icon: crestIconSrc('falcon'),
    color: '#4682B4',
    heraldicTerm: 'Ясный Сокол',
    folkFigure: 'a compact hunting falcon in profile, folded wings, hooked beak — a falcon, not an eagle'
  },
  {
    id: 'owl',
    name: 'Сова',
    promptName: 'Сова',
    en: 'owl',
    trait: 'Мудрость веков, познание и спокойствие',
    desc: 'Хранительница древних знаний, гармонии и взвешенных решений.',
    icon: crestIconSrc('owl'),
    color: '#483D8B',
    heraldicTerm: 'Мудрая Сова',
    folkFigure: 'a frontal folk owl, large circular eyes, simple triangular beak, no realistic feathers'
  },
  {
    id: 'deer',
    name: 'Благородный Олень',
    promptName: 'Олень',
    en: 'deer',
    trait: 'Чистота помыслов, грация и духовность',
    desc: 'Светлый покровитель рода, символ древа жизни и возрождения.',
    icon: crestIconSrc('deer'),
    color: '#B8860B',
    heraldicTerm: 'Златорогий Олень',
    folkFigure: 'a folk deer in profile, slender neck, antlers as tree-of-life branching ornament — not a rampant heraldic stag, not gold antlers'
  },
  {
    id: 'beaver',
    name: 'Бобр',
    promptName: 'Бобр',
    en: 'beaver',
    trait: 'Трудолюбие, созидание и богатство дома',
    desc: 'Символ трудолюбивых зодчих, крепкого фундамента и уюта.',
    icon: crestIconSrc('beaver'),
    color: '#A0522D',
    heraldicTerm: 'Зодчий Бобр',
    folkFigure: 'a folk beaver in profile, flat paddle tail as a clear geometric oval, small rounded ears'
  }
];

export const NATIONALITIES = [
  {
    id: 'russian',
    name: 'Русские',
    en: 'Russian',
    subtitle: 'Богатырская традиция и златоглавая эстетика',
    desc: 'Растительные узоры хохломы и мезени, золотые колосья, лазурь и пунцовый бархат.',
    patterns: ['Хохлома', 'Мезень', 'Жостово'],
    accentColor: '#D4AF37',
    secondaryColor: '#B22222',
    symbolBg: 'Солнечный круг и колосья',
    ornamentCraft: 'traditional embroidery, carved wood decoration and folk ornament'
  },
  {
    id: 'tatar',
    name: 'Татары',
    en: 'Tatar',
    subtitle: 'Восточный орнамент, тюльпаны и казанское золото',
    desc: 'Стилизованные тюльпаны (символ обновления), полумесяц, волнистые стебли и богатый малахит.',
    patterns: ['Казанский тюльпан', 'Восточный ромб', 'Изумрудная вязь'],
    accentColor: '#00A86B',
    secondaryColor: '#FFD700',
    symbolBg: 'Тюльпан и орнаментальная вязь',
    ornamentCraft: 'Tatar tulip embroidery, architectural vine ornament and geometric medallions'
  },
  {
    id: 'udmurt',
    name: 'Удмурты',
    en: 'Udmurt',
    subtitle: 'Восьмиконечная звезда «Толшэдо» и солярные знаки',
    desc: 'Удмуртский шудо кизили (звезда счастья), красно-черно-белая традиционная вышивка, пермский стиль.',
    patterns: ['Шудо Кизили', 'Ромб плодородия', 'Березовые ветви'],
    accentColor: '#CC0000',
    secondaryColor: '#000000',
    symbolBg: 'Восьмиконечная звезда Толшэдо',
    ornamentCraft: 'Udmurt red-black-white embroidery, solar signs and Perm-style geometry'
  },
  {
    id: 'bashkir',
    name: 'Башкиры',
    en: 'Bashkir',
    subtitle: 'Степное солнце, солярная тамга и цветок курая',
    desc: 'Цветок курая из 7 соцветий, орнаментальные рога (кускар), яшма и уральское золото.',
    patterns: ['Курай', 'Кускар (рога)', 'Солярный диск'],
    accentColor: '#E65100',
    secondaryColor: '#1B5E20',
    symbolBg: 'Цветок курая и тамга',
    ornamentCraft: 'Bashkir kuskar horn ornament, kurai flower motifs and solar tamga'
  },
  {
    id: 'mari',
    name: 'Марийцы',
    en: 'Mari',
    subtitle: 'Древо жизни, красный геометрический орнамент',
    desc: 'Священные рощи, красная узорная вышивка, геометрическое древо рода и конские головы.',
    patterns: ['Марийский крест', 'Древо жизни', 'Обережный ромб'],
    accentColor: '#D32F2F',
    secondaryColor: '#1A237E',
    symbolBg: 'Марийский солнечный знак',
    ornamentCraft: 'Mari red geometric embroidery, sacred grove tree-of-life and horse-head motifs'
  },
  {
    id: 'komi',
    name: 'Коми',
    en: 'Komi',
    subtitle: 'Пермский звериный стиль и дух северной тайги',
    desc: 'Силуэты лосей, птицелюдей, еловый узор (папас), морозное серебро и таежная бирюза.',
    patterns: ['Пермский звериный стиль', 'Еловый орнамент', 'Северное сияние'],
    accentColor: '#0288D1',
    secondaryColor: '#455A64',
    symbolBg: 'Пермский звериный оберег',
    ornamentCraft: 'Perm animal-style silhouettes, spruce (papas) ornament and northern geometry'
  },
  {
    id: 'chuvash',
    name: 'Чуваши',
    en: 'Chuvash',
    subtitle: 'Древо жизни, три солнца и красная вышивка кеске',
    desc: 'Геометрическая нагрудная вышивка кеске, мировое древо Йĕпĕ, три солнца и пурпурно-золотая палитра чувашского знамени.',
    patterns: ['Кеске', 'Древо жизни', 'Три солнца'],
    accentColor: '#8E244D',
    secondaryColor: '#FFD700',
    symbolBg: 'Древо жизни и три солнца',
    ornamentCraft: 'Chuvash keske embroidery, world-tree geometry and triple-sun signs'
  }
];

export const ELEMENTS = [
  {
    id: 'fire',
    name: 'Огонь',
    desc: 'Страсть, энергия, домашний очаг и устремленность вверх.',
    icon: crestIconSrc('fire'),
    colors: ['#FF4500', '#C88A35', '#8B0000'],
    folkRender: 'stylized decorative flame shapes and ornamental fire symbols, not realistic flames',
    motto: 'Пламень духа и неблекнущий очаг'
  },
  {
    id: 'water',
    name: 'Вода',
    desc: 'Чистота, глубина мысли, адаптивность и вечное движение.',
    icon: crestIconSrc('water'),
    colors: ['#1E90FF', '#00FFFF', '#00008B'],
    folkRender: 'stylized decorative wave and river ornaments, not realistic water',
    motto: 'Глубина истоков и чистота помыслов'
  },
  {
    id: 'earth',
    name: 'Земля',
    desc: 'Надежность, связь с предками, изобилие и устойчивость.',
    icon: crestIconSrc('earth'),
    colors: ['#2E8B57', '#8B5A2B', '#1C39BB'],
    folkRender: 'geometric field, rhombus and plant-growth folk symbols, not a realistic landscape',
    motto: 'Крепость корней и изобилие плодов'
  },
  {
    id: 'air',
    name: 'Воздух',
    desc: 'Свобода духа, вдохновение, легкий ум и высота полета.',
    icon: crestIconSrc('air'),
    colors: ['#87CEEB', '#E0FFFF', '#4682B4'],
    folkRender: 'stylized wind lines and bird-flight ornaments, not realistic sky or clouds',
    motto: 'Высота полета и ясность мысли'
  }
];

export const SHIELD_STYLES = [
  {
    id: 'classic',
    name: 'Варяжский / Старинный',
    desc: 'Заостренный снизу классический щит',
    promptShape: 'a heater/kite shield: wide rounded top, clearly pointed lower tip',
    promptLayout: 'Place the animal centered in the shield field. Put the motto ribbon under the pointed tip. Keep this pointed heater silhouette; do not round it into a disc.',
    icon: shieldIconSrc('classic')
  },
  {
    id: 'french',
    name: 'Французский прямоугольный',
    desc: 'Величавая форма с закруглением',
    promptShape: 'a vertical rectangle with slightly rounded top corners and a tiny point at the bottom center — geometry only',
    promptLayout: 'Place the animal centered in the rectangular field. Put the motto ribbon under the bottom edge. Shape only: no fleurs-de-lis, no ermine, no French royal heraldry.',
    icon: shieldIconSrc('french')
  },
  {
    id: 'slavic',
    name: 'Славянский',
    desc: 'Закругленный книзу щит славянских князей',
    promptShape: 'a tall U-shaped shield, rounded at the bottom, no sharp point',
    promptLayout: 'Place the animal in the upper two-thirds of the field. Put the motto ribbon under the rounded base. Do not add a pointed heater tip.',
    icon: shieldIconSrc('slavic')
  },
  {
    id: 'spanish',
    name: 'Испанский каплевидный',
    desc: 'Вытянутый боевой щит с округлым верхом и острым основанием',
    promptShape: 'an elongated almond/teardrop: rounded top, long pointed base — geometry only',
    promptLayout: 'Place the animal in the upper half so the long tip stays ornamental. Put the motto ribbon under the pointed base. Shape only: no Spanish royal heraldry, no castles-and-lions.',
    icon: shieldIconSrc('spanish')
  },
  {
    id: 'targe',
    name: 'Круглый Тарч',
    desc: 'Древний защитный диск с орнаментом',
    promptShape: 'a perfect circle, a round disc, not a pointed heater shield',
    promptLayout: 'Place the animal as a central medallion. Surround it with concentric folk-ornament rings. Put the motto ribbon as an arc below the disc, not under a pointed shield. Do not draw a heater or kite outline.',
    icon: shieldIconSrc('targe')
  }
];

export function buildOpenRoadCrestPrompt({ animal, nationality, element, motto, shieldStyle }) {
  const animalObj = ANIMALS.find(a => a.id === animal) || ANIMALS[0];
  const natObj = NATIONALITIES.find(n => n.id === nationality) || NATIONALITIES[0];
  const elObj = ELEMENTS.find(e => e.id === element) || ELEMENTS[0];
  const shieldObj = SHIELD_STYLES.find(s => s.id === shieldStyle) || SHIELD_STYLES[0];
  const mottoText = motto || elObj.motto;
  const animalLabel = `${animalObj.en} (${animalObj.promptName})`;

  return `Family emblem, ethnographic folk crest in a flat 2D ethnographic folk-art style, inspired by traditional ${natObj.en} ornamental graphics and decorative arts.

Central figure: a stylized ${animalLabel}, symbolizing ${animalObj.trait}. ${animalObj.folkFigure}. The animal is the primary subject and must occupy most of the shield field, with a strong readable silhouette, clear proportions, and minimal internal details. Folk ornament belongs on the border and as small supporting motifs only — do not replace the animal with abstract ornament.

Culture & ethnic motifs: ${natObj.name} traditional ornamental patterns, including ${natObj.symbolBg}, integrated symmetrically into the composition. Use geometric, floral and botanical motifs inspired by ${natObj.ornamentCraft}. Named patterns: ${natObj.patterns.join(', ')}.

Elemental motif: ${elObj.name}, represented as ${elObj.folkRender}.

Color palette: warm ivory / linen background, deep forest green, dark terracotta / burgundy, muted ochre, plus ${elObj.name} accents based on ${elObj.colors.join(', ')}. All colors should appear muted, natural and pigment-like, without glowing, metallic or neon effects.

Shield style: ${shieldObj.name} — ${shieldObj.promptShape}. ${shieldObj.promptLayout}. Keep the shield silhouette simple, clean and visually dominant.

Decorate the shield border with symmetrical ${natObj.en} folk ornament, using diamonds, leaves, branches, rosettes, waves and simple geometric forms.

Motto ribbon: «${mottoText}». Place it as described in the shield layout, in the same flat illustrated folk style, without realistic metallic gold.

Visual style: flat 2D folk illustration, ethnographic decorative graphic, vector-like clean shapes, strong readable silhouette, crisp contours, subtle handmade paper or painted texture, restrained symmetry, traditional ${natObj.en} folk-art aesthetic, minimal depth, no realistic lighting.

Avoid: photorealism, realistic fur, realistic feathers, imperial eagle, rampant stag, heraldic supporters, 3D rendering, glossy surfaces, metallic gold, baroque filigree, royal fantasy heraldry, cinematic lighting, realistic fire, gradients, volumetric shadows, excessive ornamentation.`;
}
