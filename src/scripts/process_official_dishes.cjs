const fs = require('fs');
const path = require('path');

const officialPath = path.join(__dirname, '../../public/data/menu/official_dishes.json');
const rawData = JSON.parse(fs.readFileSync(officialPath, 'utf8'));

// Helper to determine if item is veg
function isVegItem(catName, itemName) {
  const n = itemName.toLowerCase();
  const c = catName.toLowerCase();

  if (n.includes('chicken') || n.includes('egg') || n.includes('non veg') || n.includes('tangdi') || n.includes('murgh')) {
    return false;
  }
  if (c.includes('chicken') || c.includes('non veg')) {
    return false;
  }
  return true;
}

// Helper to map authentic local image
function getDishImage(catName, itemName) {
  const n = itemName.toLowerCase();
  const c = catName.toLowerCase();

  // Thali & Combos
  if (n.includes('veg thali')) return '/data/dishes/showcase-curry-plate.jpg';
  if (n.includes('non veg thali')) return '/data/dishes/showcase-biryani-plate.jpg';
  if (n.includes('snacks combo')) return '/data/dishes/french-fries.jpg';
  if (n.includes('chinese combo')) return '/data/dishes/showcase-chinese-plate.jpg';

  // Mocktails
  if (n.includes('blue lagoon')) return '/data/dishes/blue-lagoon.jpg';
  if (n.includes('mojito') || n.includes('kiwi')) return '/data/dishes/virgin-mojito.jpg';
  if (n.includes('lemonade') || n.includes('lime') || n.includes('green apple')) return '/data/dishes/lemonade.jpg';
  if (n.includes('mango') || n.includes('orange')) return '/data/dishes/mango-mocktail.jpg';
  if (n.includes('strawberry')) return '/data/dishes/cold-coffee.jpg';

  // Shakes
  if (n.includes('oreo') || n.includes('chocolate') || n.includes('kitkat')) return '/data/dishes/chocolate-shake.jpg';
  if (n.includes('cold coffee')) return '/data/dishes/cold-coffee.jpg';
  if (n.includes('shake')) return '/data/dishes/cold-coffee.jpg';

  // Curries / Chicken
  if (n.includes('egg masala')) return '/data/dishes/egg-curry.jpg';
  if (n.includes('butter chicken') || n.includes('chicken butter masala')) return '/data/dishes/butter-chicken.jpg';
  if (n.includes('kadhai chicken')) return '/data/dishes/kadhai-chicken.jpg';
  if (n.includes('murgh musallam')) return '/data/dishes/murgh-musallam.jpg';
  if (n.includes('tikka masala')) return '/data/dishes/chicken-tikka-masala.jpg';
  if (c.includes('chicken') && (n.includes('do pyaza') || n.includes('handi') || n.includes('bharta') || n.includes('dehati') || n.includes('mughlai') || n.includes('punjabi') || n.includes('spl'))) {
    return '/data/dishes/chicken-curry.jpg';
  }

  // Roti & Bread
  if (n.includes('tandoori') && n.includes('roti')) return '/data/dishes/tandoori-roti.jpg';
  if (n.includes('naan')) return '/data/dishes/butter-naan.jpg';
  if (n.includes('paratha')) return '/data/dishes/laccha-paratha.jpg';

  // Rice & Noodles
  if (n.includes('steamed rice') || n.includes('jeera rice')) return '/data/dishes/jeera-rice.jpg';
  if (n.includes('pulao')) return '/data/dishes/veg-pulao.jpg';
  if (n.includes('schezwan noodles')) return '/data/dishes/schezwan-noodles.jpg';
  if (n.includes('noodle')) {
    if (n.includes('chicken') || n.includes('egg') || n.includes('mix')) return '/data/dishes/chicken-noodles.jpg';
    return '/data/dishes/veg-hakka-noodles.jpg';
  }
  if (n.includes('fried rice') || n.includes('rice')) {
    if (n.includes('chicken') || n.includes('egg') || n.includes('mixed')) return '/data/dishes/chicken-fried-rice.jpg';
    return '/data/dishes/veg-fried-rice.jpg';
  }

  // Biryani
  if (n.includes('biryani')) {
    if (n.includes('chicken') || n.includes('egg') || n.includes('royal')) return '/data/dishes/chicken-biryani.jpg';
    if (n.includes('paneer')) return '/data/dishes/paneer-biryani.jpg';
    return '/data/dishes/veg-biryani.jpg';
  }

  // Starters
  if (n.includes('french fries') || n.includes('fries')) return '/data/dishes/french-fries.jpg';
  if (n.includes('honey potato')) return '/data/dishes/honey-chilli-potato.jpg';
  if (n.includes('corn salt') || n.includes('sweet corn') || n.includes('baby corn')) return '/data/dishes/corn-salt-pepper.jpg';
  if (n.includes('onion') && n.includes('pakora')) return '/data/dishes/onion-pakora.jpg';
  if (n.includes('paneer pakora')) return '/data/dishes/paneer-pakora.jpg';
  if (n.includes('chicken pakora') || n.includes('chicken 65')) return '/data/dishes/chicken-65.jpg';
  if (n.includes('pakora')) return '/data/dishes/pakora.jpg';
  if (n.includes('chicken popcorn')) return '/data/dishes/chicken-popcorn.jpg';
  if (n.includes('lollipop')) return '/data/dishes/chicken-lollipop.jpg';
  if (n.includes('mushroom crispy') || n.includes('mushroom salt')) return '/data/dishes/mushroom-chilli.jpg';
  if (n.includes('paneer salt')) return '/data/dishes/paneer-chilli.jpg';

  // Momos
  if (n.includes('afghani')) return '/data/dishes/afghani-momos.jpg';
  if (n.includes('roasted') || n.includes('steamed')) return '/data/dishes/steamed-momos.jpg';
  if (n.includes('momo')) return '/data/dishes/fried-momos.jpg';

  // Burger
  if (n.includes('chicken cheese burger')) return '/data/dishes/chicken-burger.jpg';
  if (n.includes('paneer cheese burger')) return '/data/dishes/veg-burger.jpg';
  if (n.includes('burger')) return '/data/dishes/cheese-burger.jpg';

  // Sandwich
  if (n.includes('chicken grilled sandwich')) return '/data/dishes/chicken-sandwich.jpg';
  if (n.includes('egg grilled sandwich')) return '/data/dishes/egg-sandwich.jpg';
  if (n.includes('cheese corn')) return '/data/dishes/cheese-corn-sandwich.jpg';
  if (n.includes('paneer')) return '/data/dishes/paneer-sandwich.jpg';
  if (n.includes('sandwich')) return '/data/dishes/veg-grilled-sandwich.jpg';

  // Chinese
  if (n.includes('manchurian')) {
    if (n.includes('chicken')) return '/data/dishes/chicken-manchurian.jpg';
    return '/data/dishes/veg-manchurian.jpg';
  }
  if (n.includes('paneer chilli')) return '/data/dishes/paneer-chilli.jpg';
  if (n.includes('mushroom chilli')) return '/data/dishes/mushroom-chilli.jpg';
  if (n.includes('boneless chilli')) return '/data/dishes/chicken-boneless-chilli.jpg';
  if (n.includes('chicken bone chilli') || n.includes('chicken chilli')) return '/data/dishes/chicken-chilli.jpg';
  if (n.includes('chicken schezwan')) return '/data/dishes/chicken-schezwan.jpg';

  // Salad & Raita
  if (n.includes('salad')) return '/data/dishes/green-salad.jpg';
  if (n.includes('boondi raita')) return '/data/dishes/boondi-raita.jpg';
  if (n.includes('raita')) return '/data/dishes/raita.jpg';

  // Rolls
  if (n.includes('egg roll')) return '/data/dishes/egg-roll.jpg';
  if (n.includes('chicken')) return '/data/dishes/chicken-roll.jpg';
  if (n.includes('paneer') || n.includes('veg') || n.includes('cheese')) return '/data/dishes/paneer-roll.jpg';

  // Soup
  if (n.includes('sweet corn') || n.includes('corn soup')) return '/data/dishes/sweet-corn-soup.jpg';
  if (n.includes('hot & sour') || n.includes('hot and sour')) return '/data/dishes/hot-and-sour-soup.jpg';
  if (n.includes('manchow')) return '/data/dishes/manchow-soup.jpg';
  if (n.includes('tomato')) return '/data/dishes/sweet-corn-soup.jpg';

  // Tandoori (Veg)
  if (n.includes('harabhara') || n.includes('hara bhara')) return '/data/dishes/hara-bhara-kabab.jpg';
  if (n.includes('seekh') || n.includes('malai')) return '/data/dishes/paneer-seekh-kebab.jpg';
  if (n.includes('paneer')) return '/data/dishes/paneer-tikka.jpg';

  // Tandoori (Chicken)
  if (n.includes('tandoori chicken')) return '/data/dishes/tandoori-chicken.jpg';
  if (n.includes('tangdi')) return '/data/dishes/tangdi-kebab.jpg';
  if (n.includes('hariyali')) return '/data/dishes/chicken-hariyali.jpg';
  if (n.includes('malai') || n.includes('cheese') || n.includes('reshmi')) return '/data/dishes/chicken-malai-kebab.jpg';
  if (n.includes('seekh')) return '/data/dishes/chicken-seekh-kebab.jpg';
  if (n.includes('tikka') || n.includes('boti') || n.includes('garlic') || n.includes('kali mirch')) return '/data/dishes/chicken-tikka.jpg';
  if (n.includes('patiala')) return '/data/dishes/chicken-curry.jpg';

  return '/data/dishes/showcase-curry-plate.jpg';
}

// Generate description
function getDishDescription(catName, itemName, customDesc) {
  if (customDesc && customDesc.trim().length > 5) {
    return customDesc.trim();
  }
  const n = itemName;
  if (catName === 'Mocktail') return `Refreshing ${n} mocktail crafted with fruit essence, crushed ice, and bubbly soda.`;
  if (catName === 'Shake') return `Thick, creamy ${n} blended with rich milk and velvety cream, served chilled.`;
  if (catName === 'Indian (Chicken)') return `Authentic slow-cooked ${n} prepared with rich Mughlai spices, aromatics, and rich savory gravy.`;
  if (catName === 'Roti & Bread') return `Freshly baked ${n} hot from the clay tandoor, crisp on the edges and soft inside.`;
  if (catName === 'Biryani') return `Aromatic long-grain basmati ${n} slow-cooked Dum Pukht style with royal saffron, spices, and raita.`;
  if (catName === 'Starters') return `Crisp and flavorful ${n} tossed with aromatic herbs and house special seasoning.`;
  if (catName === 'Momos') return `Steamed or fried ${n} with savory stuffing, served with fiery momo chutney and creamy mayo.`;
  if (catName === 'Burger') return `Juicy patty layered in toasted sesame bun with melted cheese slice and special cafe sauce.`;
  if (catName === 'Sandwich') return `Golden toasted bread stuffed with flavorful seasoned filling and melted cheese.`;
  if (catName === 'Chinese') return `Wok-tossed ${n} in rich Indo-Chinese sauces with crunchy bell peppers and spring onions.`;
  if (catName === 'Salad') return `Freshly sliced ${n} with lemon wedges and green chillies.`;
  if (catName === 'Raita') return `Chilled spiced curd mixed with crunchy boondi and roasted cumin.`;
  if (catName === 'Rolls') return `Flaky crispy paratha wrap packed with seasoned filling, onions, and tangy chutneys.`;
  if (catName === 'Soup') return `Piping hot bowl of ${n} simmered with fresh herbs, vegetables, and warm spices.`;
  if (catName.includes('Tandoori')) return `Charcoal-grilled ${n} steeped in royal tandoori marinade and roasted over glowing coal embers.`;
  if (catName === 'Rice & Noodles') return `Wok-tossed ${n} flavored with delicate aromatics and seasoned vegetables.`;
  return `House specialty ${n} prepared fresh with authentic spices and finest ingredients.`;
}

// Map original JSON category to one of 8 main categories
function getMainCategory(catName) {
  if (catName === 'Thali' || catName === 'Budget Friendly Combo') return 'Combos & Thali';
  if (catName === 'Momos' || catName === 'Burger' || catName === 'Sandwich' || catName === 'Rolls') return 'Momos & Fast Food';
  if (catName === 'Starters') return 'Starters & Snacks';
  if (catName.includes('Tandoori')) return 'Tandoori & Kebabs';
  if (catName === 'Indian (Chicken)' || catName === 'Chinese') return 'Curries & Chinese';
  if (catName === 'Biryani' || catName === 'Rice & Noodles') return 'Rice, Biryani & Noodles';
  if (catName === 'Roti & Bread') return 'Tandoori Breads';
  if (catName === 'Mocktail' || catName === 'Shake' || catName === 'Soup' || catName === 'Salad' || catName === 'Raita') return 'Beverages & Soups';
  return 'Starters & Snacks';
}

// Process all items
let idCounter = 1;
const allDishes = [];

rawData.forEach(cat => {
  const catName = cat.category;
  const mainCat = getMainCategory(catName);

  cat.items.forEach(it => {
    const priceNum = parseInt(it.price.replace(/[^\d]/g, ''), 10) || 100;
    const isVeg = isVegItem(catName, it.name);
    const image = getDishImage(catName, it.name);
    const desc = getDishDescription(catName, it.name, it.description);
    const isSpl = it.name.toLowerCase().includes('spl') || it.name.toLowerCase().includes('special') || it.name.toLowerCase().includes('musallam') || it.name.toLowerCase().includes('lollipop');

    allDishes.push({
      id: `m-${idCounter++}`,
      name: it.name,
      category: mainCat,
      subCategory: catName,
      isVeg: isVeg,
      price: priceNum,
      description: desc,
      spicyLevel: (it.name.toLowerCase().includes('chilli') || it.name.toLowerCase().includes('schezwan')) ? 2 : 1,
      isChefSpecial: isSpl,
      image: image,
      serves: '1-2 Persons'
    });
  });
});

console.log('Processed total dishes:', allDishes.length);
fs.writeFileSync(path.join(__dirname, 'processed_dishes.json'), JSON.stringify(allDishes, null, 2), 'utf8');
console.log('Saved to src/scripts/processed_dishes.json');
