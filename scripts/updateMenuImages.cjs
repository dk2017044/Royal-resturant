const fs = require('fs');
const path = require('path');

function getDishImage(name, category, isVeg) {
  const n = name.toLowerCase();

  // Biryani & Rice
  if (n.includes('mutton biryani') || n.includes('gosht biryani')) return '/data/dishes/mutton-biryani.jpg';
  if (n.includes('chicken biryani') || n.includes('royal special biryani')) return '/data/dishes/chicken-biryani.jpg';
  if (n.includes('paneer biryani')) return '/data/dishes/paneer-biryani.jpg';
  if (n.includes('veg biryani') || n.includes('egg biryani')) return '/data/dishes/veg-biryani.jpg';
  if (n.includes('jeera rice')) return '/data/dishes/jeera-rice.jpg';
  if (n.includes('pulao')) return '/data/dishes/veg-pulao.jpg';
  if (n.includes('rice') && n.includes('fried') && n.includes('chicken')) return '/data/dishes/chicken-fried-rice.jpg';
  if (n.includes('rice') && n.includes('fried')) return '/data/dishes/veg-fried-rice.jpg';
  if (n.includes('rice')) return '/data/dishes/jeera-rice.jpg';

  // Noodles
  if (n.includes('schezwan') && n.includes('noodle')) return '/data/dishes/schezwan-noodles.jpg';
  if (n.includes('chicken') && n.includes('noodle')) return '/data/dishes/chicken-noodles.jpg';
  if (n.includes('noodle') || n.includes('chowmein')) return '/data/dishes/veg-hakka-noodles.jpg';

  // Pasta
  if (n.includes('pasta')) return '/data/dishes/pasta.jpg';

  // Burgers & Sandwiches
  if (n.includes('burger')) return '/data/dishes/burger.jpg';
  if (n.includes('sandwich')) return '/data/dishes/grilled-sandwich.jpg';

  // Momos
  if (n.includes('momo') && n.includes('chicken')) return '/data/dishes/chicken-momos.jpg';
  if (n.includes('momo')) return '/data/dishes/veg-momos.jpg';

  // Rolls
  if (n.includes('roll') && n.includes('chicken')) return '/data/dishes/chicken-roll.jpg';
  if (n.includes('roll')) return '/data/dishes/paneer-roll.jpg';

  // Snacks & Fries
  if (n.includes('french fries') || n.includes('fries')) return '/data/dishes/french-fries.jpg';
  if (n.includes('pakora')) return '/data/dishes/pakora.jpg';

  // Soups
  if (n.includes('manchow')) return '/data/dishes/manchow-soup.jpg';
  if (n.includes('sweet corn') || n.includes('corn soup')) return '/data/dishes/sweet-corn-soup.jpg';
  if (n.includes('hot and sour') || n.includes('hot & sour')) return '/data/dishes/hot-and-sour-soup.jpg';
  if (n.includes('soup')) return '/data/dishes/manchow-soup.jpg';

  // Starters - Non Veg
  if (n.includes('chicken 65')) return '/data/dishes/chicken-65.jpg';
  if (n.includes('chicken lollipop')) return '/data/dishes/chicken-lollipop.jpg';
  if (n.includes('seekh kebab')) return '/data/dishes/chicken-seekh-kebab.jpg';
  if (n.includes('hariyali')) return '/data/dishes/chicken-hariyali.jpg';
  if (n.includes('malai kebab') || n.includes('reshmi')) return '/data/dishes/chicken-malai-kebab.jpg';
  if (n.includes('tangdi')) return '/data/dishes/tangdi-kebab.jpg';
  if (n.includes('tandoori chicken')) return '/data/dishes/tandoori-chicken.jpg';
  if (n.includes('chicken tikka')) return '/data/dishes/chicken-tikka.jpg';
  if (n.includes('chicken manchurian')) return '/data/dishes/chicken-manchurian.jpg';
  if (n.includes('chicken chilli') || n.includes('chilli chicken')) return '/data/dishes/chicken-chilli.jpg';
  if (n.includes('chicken cutlet') || n.includes('chicken saty')) return '/data/dishes/chicken-tikka.jpg';

  // Starters - Veg
  if (n.includes('honey potato') || n.includes('chilli potato')) return '/data/dishes/honey-chilli-potato.jpg';
  if (n.includes('veg manchurian')) return '/data/dishes/veg-manchurian.jpg';
  if (n.includes('paneer chilli')) return '/data/dishes/paneer-chilli.jpg';
  if (n.includes('mushroom chilli') || n.includes('mushroom crispy')) return '/data/dishes/mushroom-chilli.jpg';
  if (n.includes('corn salt') || n.includes('baby corn')) return '/data/dishes/corn-salt-pepper.jpg';
  if (n.includes('paneer tikka')) return '/data/dishes/paneer-tikka.jpg';
  if (n.includes('hara bhara')) return '/data/dishes/hara-bhara-kabab.jpg';
  if (n.includes('paneer seekh')) return '/data/dishes/paneer-seekh-kebab.jpg';
  if (n.includes('paneer 65') || n.includes('paneer popcorn') || n.includes('paneer cutlet')) return '/data/dishes/paneer-tikka.jpg';

  // Main Course - Non Veg
  if (n.includes('butter chicken') || n.includes('chicken butter')) return '/data/dishes/butter-chicken.jpg';
  if (n.includes('tikka masala')) return '/data/dishes/chicken-tikka-masala.jpg';
  if (n.includes('kadhai chicken') || n.includes('kadai chicken')) return '/data/dishes/kadhai-chicken.jpg';
  if (n.includes('musallam') || n.includes('mughlai')) return '/data/dishes/murgh-musallam.jpg';
  if (n.includes('chicken curry') || n.includes('punjabi chicken') || n.includes('special chicken')) return '/data/dishes/chicken-curry.jpg';
  if (n.includes('egg')) return '/data/dishes/egg-curry.jpg';

  // Main Course - Veg
  if (n.includes('dal makhani')) return '/data/dishes/dal-makhani.jpg';
  if (n.includes('dal tadka') || n.includes('dal fry')) return '/data/dishes/dal-tadka.jpg';
  if (n.includes('paneer butter') || n.includes('paneer makhani') || n.includes('shahi paneer') || n.includes('paneer lababdar')) return '/data/dishes/paneer-butter-masala.jpg';
  if (n.includes('kadhai paneer')) return '/data/dishes/kadhai-paneer.jpg';
  if (n.includes('matar paneer')) return '/data/dishes/matar-paneer.jpg';
  if (n.includes('mix veg')) return '/data/dishes/mix-veg.jpg';
  if (n.includes('aloo dum') || n.includes('dum aloo') || n.includes('aloo matar')) return '/data/dishes/aloo-dum.jpg';
  if (n.includes('paneer')) return '/data/dishes/paneer-butter-masala.jpg';
  if (n.includes('mushroom')) return '/data/dishes/mushroom-chilli.jpg';

  // Breads
  if (n.includes('butter naan') || n.includes('stuffed naan')) return '/data/dishes/butter-naan.jpg';
  if (n.includes('garlic naan')) return '/data/dishes/garlic-naan.jpg';
  if (n.includes('laccha paratha') || n.includes('paratha')) return '/data/dishes/laccha-paratha.jpg';
  if (n.includes('tandoori roti') || n.includes('roti')) return '/data/dishes/tandoori-roti.jpg';
  if (n.includes('naan')) return '/data/dishes/butter-naan.jpg';

  // Beverages & Mocktails
  if (n.includes('mojito')) return '/data/dishes/virgin-mojito.jpg';
  if (n.includes('blue lagoon')) return '/data/dishes/blue-lagoon.jpg';
  if (n.includes('lemonade') || n.includes('fresh lime')) return '/data/dishes/lemonade.jpg';
  if (n.includes('mango')) return '/data/dishes/mango-mocktail.jpg';
  if (n.includes('mocktail') || n.includes('drink') || n.includes('soda')) return '/data/dishes/virgin-mojito.jpg';

  // Desserts
  if (n.includes('gulab jamun')) return '/data/dishes/gulab-jamun.jpg';
  if (n.includes('shahi tukda') || n.includes('dessert') || n.includes('kheer')) return '/data/dishes/gulab-jamun.jpg';

  // Fallbacks by category
  if (category === 'Starters') return isVeg ? '/data/dishes/paneer-tikka.jpg' : '/data/dishes/chicken-tikka.jpg';
  if (category === 'Main Course') return isVeg ? '/data/dishes/paneer-butter-masala.jpg' : '/data/dishes/butter-chicken.jpg';
  if (category === 'Biryani & Rice') return '/data/dishes/chicken-biryani.jpg';
  if (category === 'Tandoori & Breads') return '/data/dishes/butter-naan.jpg';
  if (category === 'Chinese & Snacks') return '/data/dishes/veg-hakka-noodles.jpg';
  if (category === 'Beverages') return '/data/dishes/virgin-mojito.jpg';

  return '/data/dishes/chicken-biryani.jpg';
}

const configPath = path.join(__dirname, '..', 'src', 'config.ts');
let configText = fs.readFileSync(configPath, 'utf8');

// Parse the menu array from config.ts
const menuStartMatch = configText.indexOf('menu: [');
const menuEndMatch = configText.indexOf('] as MenuItem[],');

if (menuStartMatch === -1 || menuEndMatch === -1) {
  console.error('Could not locate menu array in config.ts');
  process.exit(1);
}

const menuSubstr = configText.substring(menuStartMatch + 'menu: '.length, menuEndMatch + 1);
const menuItems = JSON.parse(menuSubstr);

console.log(`Processing ${menuItems.length} menu items...`);
let updatedCount = 0;

menuItems.forEach(item => {
  const newImg = getDishImage(item.name, item.category, item.isVeg);
  if (item.image !== newImg) {
    item.image = newImg;
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} items with distinct real dish images.`);

const updatedMenuStr = JSON.stringify(menuItems, null, 2);
configText = configText.substring(0, menuStartMatch + 'menu: '.length) +
             updatedMenuStr +
             configText.substring(menuEndMatch + 1);

fs.writeFileSync(configPath, configText, 'utf8');
console.log('Successfully updated src/config.ts with distinct dish images!');
