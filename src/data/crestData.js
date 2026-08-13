// Data for Family Crest Generator (Генератор семейного герба)

const CREST_ICONS = import.meta.glob('../assets/icons/*.png', { eager: true, import: 'default' });

export function crestIconSrc(id) {
  return CREST_ICONS[`../assets/icons/${id}.png`];
}

export const ANIMALS = [
  {
    id: 'bear',
    name: 'Медведь',
    trait: 'Сила, мудрость и хозяйственность',
    desc: 'Царь тайги, хранитель семейного очага и защитник рода.',
    icon: crestIconSrc('bear'),
    color: '#8B4513',
    heraldicTerm: 'Степенный Медведь'
  },
  {
    id: 'wolf',
    name: 'Волк',
    trait: 'Верность, сплоченность и храбрость',
    desc: 'Символ непреклонного духа, верности стае и своей семье.',
    icon: crestIconSrc('wolf'),
    color: '#708090',
    heraldicTerm: 'Верный Волк'
  },
  {
    id: 'eagle',
    name: 'Орел',
    trait: 'Зоркость, свобода и благородство',
    desc: 'Владыка небес, дарующий незримую защиту и великие цели.',
    icon: crestIconSrc('eagle'),
    color: '#DAA520',
    heraldicTerm: 'Парящий Орел'
  },
  {
    id: 'fox',
    name: 'Лис',
    trait: 'Ум, изворотливость и житейская мудрость',
    desc: 'Хранитель изобретательности, гибкого ума и семейного уюта.',
    icon: crestIconSrc('fox'),
    color: '#D2691E',
    heraldicTerm: 'Благородная Лисица'
  },
  {
    id: 'lynx',
    name: 'Рысь',
    trait: 'Зоркий взор, интуиция и невидимый страж',
    desc: 'Священный страж северных лесов, видящий сквозь тьму.',
    icon: crestIconSrc('lynx'),
    color: '#CD853F',
    heraldicTerm: 'Страж-Рысь'
  },
  {
    id: 'moose',
    name: 'Лось',
    trait: 'Дух тайги, достоинство и несокрушимость',
    desc: 'Лесной великан, несущий мир, силу и статность.',
    icon: crestIconSrc('moose'),
    color: '#5C4033',
    heraldicTerm: 'Величавый Лось'
  },
  {
    id: 'falcon',
    name: 'Сокол',
    trait: 'Стремительность, ясность мысли и честь',
    desc: 'Символ чести, благородных помыслов и стремительных побед.',
    icon: crestIconSrc('falcon'),
    color: '#4682B4',
    heraldicTerm: 'Ясный Сокол'
  },
  {
    id: 'owl',
    name: 'Сова',
    trait: 'Мудрость веков, познание и спокойствие',
    desc: 'Хранительница древних знаний, гармонии и взвешенных решений.',
    icon: crestIconSrc('owl'),
    color: '#483D8B',
    heraldicTerm: 'Мудрая Сова'
  },
  {
    id: 'deer',
    name: 'Благородный Олень',
    trait: 'Чистота помыслов, грация и духовность',
    desc: 'Светлый покровитель рода, символ древа жизни и возрождения.',
    icon: crestIconSrc('deer'),
    color: '#B8860B',
    heraldicTerm: 'Златорогий Олень'
  },
  {
    id: 'beaver',
    name: 'Бобр',
    trait: 'Трудолюбие, созидание и богатство дома',
    desc: 'Символ трудолюбивых зодчих, крепкого фундамента и уюта.',
    icon: crestIconSrc('beaver'),
    color: '#A0522D',
    heraldicTerm: 'Зодчий Бобр'
  }
];

export const NATIONALITIES = [
  {
    id: 'russian',
    name: 'Русские',
    subtitle: 'Богатырская традиция и златоглавая эстетика',
    desc: 'Растительные узоры хохломы и мезени, золотые колосья, лазурь и пунцовый бархат.',
    patterns: ['Хохлома', 'Мезень', 'Жостово'],
    accentColor: '#D4AF37',
    secondaryColor: '#B22222',
    symbolBg: 'Солнечный круг и колосья'
  },
  {
    id: 'tatar',
    name: 'Татары',
    subtitle: 'Восточный орнамент, тюльпаны и казанское золото',
    desc: 'Стилизованные тюльпаны (символ обновления), полумесяц, волнистые стебли и богатый малахит.',
    patterns: ['Казанский тюльпан', 'Восточный ромб', 'Изумрудная вязь'],
    accentColor: '#00A86B',
    secondaryColor: '#FFD700',
    symbolBg: 'Тюльпан и серебряная вязь'
  },
  {
    id: 'udmurt',
    name: 'Удмурты',
    subtitle: 'Восьмиконечная звезда «Толшэдо» и солярные знаки',
    desc: 'Удмуртский шудо кизили (звезда счастья), красно-черно-белая традиционная вышивка, пермский стиль.',
    patterns: ['Шудо Кизили', 'Ромб плодородия', 'Березовые ветви'],
    accentColor: '#CC0000',
    secondaryColor: '#000000',
    symbolBg: 'Восьмиконечная звезда Толшэдо'
  },
  {
    id: 'bashkir',
    name: 'Башкиры',
    subtitle: 'Степное солнце, солярная тамга и цветок курая',
    desc: 'Цветок курая из 7 соцветий, орнаментальные рога (кускар), яшма и уральское золото.',
    patterns: ['Курай', 'Кускар (рога)', 'Солярный диск'],
    accentColor: '#E65100',
    secondaryColor: '#1B5E20',
    symbolBg: 'Цветок курая и тамга'
  },
  {
    id: 'mari',
    name: 'Марийцы',
    subtitle: 'Древо жизни, красный геометрический орнамент',
    desc: 'Священные рощи, красная узорная вышивка, геометрическое древо рода и конские головы.',
    patterns: ['Марийский крест', 'Древо жизни', 'Обережный ромб'],
    accentColor: '#D32F2F',
    secondaryColor: '#1A237E',
    symbolBg: 'Марийский солнечный знак'
  },
  {
    id: 'komi',
    name: 'Коми',
    subtitle: 'Пермский звериный стиль и дух северной тайги',
    desc: 'Силуэты лосей, птицелюдей, еловый узор (папас), морозное серебро и таежная бирюза.',
    patterns: ['Пермский звериный стиль', 'Еловый орнамент', 'Северное сияние'],
    accentColor: '#0288D1',
    secondaryColor: '#455A64',
    symbolBg: 'Пермский звериный оберег'
  }
];

export const ELEMENTS = [
  {
    id: 'fire',
    name: 'Огонь',
    desc: 'Страсть, энергия, домашний очаг и устремленность вверх.',
    icon: crestIconSrc('fire'),
    colors: ['#FF4500', '#FFD700', '#8B0000'],
    motto: 'Пламень духа и неблекнущий очаг'
  },
  {
    id: 'water',
    name: 'Вода',
    desc: 'Чистота, глубина мысли, адаптивность и вечное движение.',
    icon: crestIconSrc('water'),
    colors: ['#1E90FF', '#00FFFF', '#00008B'],
    motto: 'Глубина истоков и чистота помыслов'
  },
  {
    id: 'earth',
    name: 'Земля',
    desc: 'Надежность, связь с предками, изобилие и устойчивость.',
    icon: crestIconSrc('earth'),
    colors: ['#2E8B57', '#8B5A2B', '#1C39BB'],
    motto: 'Крепость корней и изобилие плодов'
  },
  {
    id: 'air',
    name: 'Воздух',
    desc: 'Свобода духа, вдохновение, легкий ум и высота полета.',
    icon: crestIconSrc('air'),
    colors: ['#87CEEB', '#E0FFFF', '#4682B4'],
    motto: 'Высота полета и ясность мысли'
  }
];

export const SHIELD_STYLES = [
  { id: 'classic', name: 'Варяжский / Старинный', desc: 'Заостренный снизу классический щит' },
  { id: 'french', name: 'Французский прямоугольный', desc: 'Величавая форма с закруглением' },
  { id: 'spanish', name: 'Испанский каплевидный', desc: 'Закругленный книзу щит славянских князей' },
  { id: 'targe', name: 'Круглый Тарч', desc: 'Древний защитный диск с орнаментом' }
];

export function buildOpenRoadCrestPrompt({ animal, nationality, element, motto, shieldStyle }) {
  const animalObj = ANIMALS.find(a => a.id === animal) || ANIMALS[0];
  const natObj = NATIONALITIES.find(n => n.id === nationality) || NATIONALITIES[0];
  const elObj = ELEMENTS.find(e => e.id === element) || ELEMENTS[0];

  return `Family coat of arms, crest emblem, high detail heraldry. Central figure: majestic ${animalObj.name} (${animalObj.trait}). Culture & ethnic motifs: ${natObj.name} traditional ornamental patterns, ${natObj.symbolBg}. Elemental motif: ${elObj.name} (${elObj.colors.join(', ')} color aura). Shield style: ${shieldStyle}. Bottom gold banner ribbon with motto: "${motto || elObj.motto}". Masterpiece, regal heraldic art, intricate gold embroidery, crisp contours, 8k resolution, photorealistic digital painting.`;
}
