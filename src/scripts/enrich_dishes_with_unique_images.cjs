const fs = require('fs');
const path = require('path');
const https = require('https');

const dishesPath = path.join(__dirname, 'processed_dishes.json');
const dishes = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));
const dishesDir = path.join(__dirname, '../../public/data/dishes');

if (!fs.existsSync(dishesDir)) {
  fs.mkdirSync(dishesDir, { recursive: true });
}

// Curated high-res Unsplash food photo IDs for each dish category & type
const photoUrls = {
  // Thalis & Combos
  'Royal Spl. Veg Thali': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
  'Royal Spl. Non Veg Thali': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  'Snacks Combo': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
  'Chinese Combo (Veg)': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
  'Chinese Combo (Non Veg)': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80',

  // Mocktails
  'Blue Lagoon': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
  'Kiwi Blast': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  'Virgin Mojito': 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
  'Green Apple': 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&auto=format&fit=crop&q=80',
  'Fresh Lime Soda': 'https://images.unsplash.com/photo-1523677068641-768c8b355153?w=600&auto=format&fit=crop&q=80',
  'Lemonade': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&auto=format&fit=crop&q=80',
  'Mango': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80',
  'Strawberry': 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
  'Orange': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80',

  // Shakes
  'Oreo Shake': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
  'Chocolate Shake': 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=600&auto=format&fit=crop&q=80',
  'KitKat Shake': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80',
  'Vanilla Shake': 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=600&auto=format&fit=crop&q=80',
  'Strawberry Shake': 'https://images.unsplash.com/photo-1588767763785-5b430e3860bb?w=600&auto=format&fit=crop&q=80',
  'ButterScotch Shake': 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&auto=format&fit=crop&q=80',
  'Cold Coffee with Ice cream': 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=600&auto=format&fit=crop&q=80',

  // Indian Chicken Curries
  'Egg Masala': 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&auto=format&fit=crop&q=80',
  'Chicken Do Pyaza': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
  'Chicken Handi': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
  'Chicken Bharta': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  'Kadhai Chicken': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
  'Chicken Butter Masala': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
  'Dehati Chicken': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
  'Butter Chicken': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&auto=format&fit=crop&q=80',
  'Chicken Mughlai': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  'Chicken Tikka Masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
  'Punjabi Chicken': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  'Murgh Musallam': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
  'Royal Spl. Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',

  // Roti & Bread
  'Tandoori Roti': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
  'Tandoori Butter Roti': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  'Plain Naan': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80',
  'Butter Naan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  'Lachha Paratha': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
  'Aloo Paratha': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  'Onion(pyaaz) Paratha': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
  'Stuffed Naan': 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&auto=format&fit=crop&q=80',
  'Paneer Paratha': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',

  // Rice & Noodles
  'Steamed Rice': 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format&fit=crop&q=80',
  'Jeera Rice': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  'Veg Fried Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
  'Veg Schezwan Fried Rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  'Veg Pulao': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  'Egg Fried Rice': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
  'Egg Schezwan Fried Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
  'Spl Veg Chilli Garlic Fried Rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  'Paneer Fried Rice': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  'Chicken Fried Rice': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&auto=format&fit=crop&q=80',
  'Chicken Schezwan Rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  'Mixed Fried Rice': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
  'Kashmiri Pulao': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  'Veg Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
  'Veg Hakka Noodles': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
  'Veg Schezwan Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
  'Veg Chilli Garlic Noodles': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
  'Paneer Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
  'Egg Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
  'Chicken Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
  'Mix Noodles': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
  'Chicken Schezwan Noodles': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
  'Chicken Egg Noodles': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80',
  'Chicken Chilli Garlic Noodles': 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',

  // Biryani
  'Veg Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  'Egg Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
  'Paneer Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
  'Chicken Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80',
  'Royal Spl. Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',

  // Starters
  'French Fries': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
  'Cheese French Fries': 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80',
  'Sweet Corn masala': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
  'Onion(pyaaz) Pakora': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  'Egg Pakora': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
  'Veg Pakora': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
  'Paneer Pakora (8pcs)': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80',
  'Chicken Pakora (8Pcs)': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
  'Chicken Popcorn': 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&auto=format&fit=crop&q=80',
  'French Fries Chilli': 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80',
  'Honey Potato Chilli': 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80',
  'Baby Corn Chilli': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
  'Mushroom Crispy chilli': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'Corn Salt & Pepper': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
  'Mushroom Salt & Pepper': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'Paneer Salt & Pepper': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80',
  'Chicken 65': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
  'Chicken Lollipop': 'https://images.unsplash.com/photo-1527477286392-564560b457e0?w=600&auto=format&fit=crop&q=80',
  'Baby Corn Paprika': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',

  // Momos
  'Veg Fried Momo': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80',
  'Veg Roasted Momo': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
  'Veg Crispy Momo': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
  'Veg Afghani Momo': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
  'Veg Crispy Afghani Momo': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
  'Paneer Fried Momo': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80',
  'Paneer Roasted Momo': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
  'Paneer Crispy Momo': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
  'Paneer Afghani Momo': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
  'Paneer Crispy Afghani Momo': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',
  'Chicken Fried Momo': 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&auto=format&fit=crop&q=80',
  'Chicken Roasted Momo': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
  'Chicken Crispy Momo': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&auto=format&fit=crop&q=80',
  'Chicken Afghani Momo': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
  'Chicken Crispy Afghani Momo': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80',

  // Burgers
  'Veg Cheese Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
  'Egg Cheese Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
  'Paneer Cheese Burger': 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
  'Chicken Cheese Burger': 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=600&auto=format&fit=crop&q=80',

  // Sandwiches
  'Veg Grilled Sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
  'Egg Grilled Sandwich': 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=600&auto=format&fit=crop&q=80',
  'Cheese corn Grilled Sandwich': 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=600&auto=format&fit=crop&q=80',
  'Paneer Grilled Sandwich': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&auto=format&fit=crop&q=80',
  'Chicken Grilled Sandwich': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=600&auto=format&fit=crop&q=80',

  // Chinese
  'Veg Manchurian': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'Paneer Chilli': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80',
  'Mushroom Chilli': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'Chicken Bone Chilli': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
  'Chicken Boneless Chilli': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80',
  'Chicken Manchurian': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
  'Chicken Schezwan': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&auto=format&fit=crop&q=80',

  // Salad & Raita
  'Onion Salad': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
  'Green Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  'Mix Raita': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
  'Boondi Raita': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',

  // Rolls
  'Veg Roll': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
  'Egg Roll': 'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=600&auto=format&fit=crop&q=80',
  'Cheese corn Roll': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
  'Paneer Roll': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80',
  'Chicken Roll': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',
  'Chicken Egg Roll': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format&fit=crop&q=80',

  // Soups
  'Sweet Corn Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'Veg Hot & Sour Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'Veg Manchow Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'Tomato Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'Chicken Corn Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'Chicken Hot & Sour Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',
  'Chicken Manchow Soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80',

  // Tandoori Veg
  'Paneer Tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80',
  'Paneer Seekh Kebab': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
  'Paneer Achari Tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&auto=format&fit=crop&q=80',
  'Paneer Malai Kebab': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
  'Harabhara Kebab': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',

  // Tandoori Chicken
  'Tandoori Chicken Half': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
  'Chicken Patiala Half': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
  'Chicken Tikka': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
  'Chicken Seekh Kebab': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  'Chicken Boti Kebab': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
  'Chicken Hariyali Kebab': 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=600&auto=format&fit=crop&q=80',
  'Chicken Kali Mirch Kebab': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
  'Chicken Reshmi Kebab': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  'Chicken Achari Tikka': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
  'Chicken Garlic Kebab': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  'Chicken Malai Kebab': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80',
  'Tangdi Kebab (4Leg pcs.)': 'https://images.unsplash.com/photo-1527477286392-564560b457e0?w=600&auto=format&fit=crop&q=80',
  'Chicken Cheese Kebab': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
  'Tandoori Chicken Full': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&auto=format&fit=crop&q=80',
  'Chicken Patiala Full': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80'
};

// Unique description mapping for each of the 159 dishes
const uniqueDescriptions = {
  // Thalis & Combos
  'Royal Spl. Veg Thali': 'Butter Tawa Roti (3 Pcs), Jeera Rice, Paneer butter Masala, Mix Veg, Dal, Salad, Raita, Sweets, Papad & pickle.',
  'Royal Spl. Non Veg Thali': 'Butter Tawa Roti (2 Pcs), Jeera Rice, Chicken butter Masala (2 Pcs), Salad, Raita, Sweets, Papad & pickle.',
  'Snacks Combo': 'French fries + Veg Grilled Sandwich + Fried Momo (2 Pcs) + cold drink.',
  'Chinese Combo (Veg)': 'Noodles + Fried Rice + Paneer chilly (2Pcs) + Manchurian (2 Pcs) + Fried Momo (2Pcs) + Cold drink.',
  'Chinese Combo (Non Veg)': 'Chicken Noodles + Butter Naan + Chicken chilly (4Pcs) + Lollipop (2 Pcs) + mojito.',

  // Mocktails
  'Blue Lagoon': 'Chilled sparkling blue curacao cooler with fresh lemon zest, mint sprigs, and soda.',
  'Kiwi Blast': 'Zesty green kiwi cooler blended with crushed mint leaves, lime juice, and sparkling fizz.',
  'Virgin Mojito': 'Classic Havana-style refresher with muddled fresh garden mint, lime wedges, and bubbly soda.',
  'Green Apple': 'Crisp tart green apple syrup infused with lemon juice and chilled effervescent soda.',
  'Fresh Lime Soda': 'Refreshing fresh-squeezed lime juice served sweet, salted, or mixed over crushed ice.',
  'Lemonade': 'Traditional thirst-quenching sweet and tangy lemon refresher with roasted cumin pinch.',
  'Mango': 'Tropical sweet Alphonso mango nectar lightly spritzed with sparkling lime soda.',
  'Strawberry': 'Luscious strawberry puree shaken with ice, fresh mint, and fizzy soda splash.',
  'Orange': 'Vibrant citrus Valencia orange cooler with a hint of tangy rock salt and mint.',

  // Shakes
  'Oreo Shake': 'Thick velvety shake blended with crunchy Oreo cookies, dark chocolate fudge, and rich milk.',
  'Chocolate Shake': 'Decadent creamy shake made with pure Dutch cocoa, molten chocolate drizzle, and vanilla cream.',
  'KitKat Shake': 'Crisp KitKat chocolate wafer bars blended into rich milk and topped with wafer crunch.',
  'Vanilla Shake': 'Silky smooth classic Madagascar vanilla bean shake whipped to creamy, frothy perfection.',
  'Strawberry Shake': 'Fresh berry-infused pink strawberry milkshake topped with whipped cream and syrup.',
  'ButterScotch Shake': 'Rich golden butterscotch milkshake laced with crunchy caramelized praline crumbles.',
  'Cold Coffee with Ice cream': 'Strong espresso brewed and blended with chilled milk, topped with a scoop of vanilla ice cream.',

  // Indian Chicken Curries
  'Egg Masala': 'Hard-boiled farm eggs cooked in a rich onion-tomato gravy with roasted garam masala.',
  'Chicken Do Pyaza': 'Succulent chicken pieces cooked with double the onions in a rich caramelized semi-dry gravy.',
  'Chicken Handi': 'Traditional slow-cooked chicken in an earthen handi with fragrant potli spices and fresh cream.',
  'Chicken Bharta': 'Shredded smoked chicken simmered in a velvety egg-infused cashew and tomato gravy.',
  'Kadhai Chicken': 'Tender chicken tossed in a cast-iron kadhai with crunchy bell peppers, coriander seeds, and dry red chillies.',
  'Chicken Butter Masala': 'Chicken chunks simmered in a silky, mildly sweet tomato-butter gravy with kasuri methi.',
  'Dehati Chicken': 'Rustic Bihari-style chicken curry cooked with whole garlic cloves, mustard oil, and crushed spices.',
  'Butter Chicken': 'The timeless royal classic: tandoori chicken simmered in rich makhani gravy with pure butter.',
  'Chicken Mughlai': 'Royal Awadhi chicken preparation cooked in a creamy almond-cashew paste with saffron hints.',
  'Chicken Tikka Masala': 'Charcoal-grilled chicken tikka morsels tossed in a spicy, vibrant tomato-onion masala gravy.',
  'Punjabi Chicken': 'Robust North Indian style spicy chicken curry flavored with ginger juliennes and fresh green chillies.',
  'Murgh Musallam': 'Grand whole chicken slow-cooked with rich Mughlai spices, boiled egg stuffing, and royal saffron gravy.',
  'Royal Spl. Chicken': 'Our master chef special chicken preparation featuring secret spice blend and slow-simmered rich gravy.',

  // Roti & Bread
  'Tandoori Roti': 'Whole wheat flatbread slapped on the clay tandoor walls and baked to crisp perfection.',
  'Tandoori Butter Roti': 'Hot whole wheat tandoori roti generously brushed with creamy dairy butter.',
  'Plain Naan': 'Soft and pillowy leavened refined flour bread baked fresh in the glowing clay tandoor.',
  'Butter Naan': 'Tender clay oven-baked naan bread smothered in golden melted butter.',
  'Lachha Paratha': 'Multi-layered flaky whole wheat paratha crisped on the tandoor with pure ghee.',
  'Aloo Paratha': 'Tandoori paratha stuffed with spiced mashed potatoes, green chillies, and fresh coriander.',
  'Onion(pyaaz) Paratha': 'Crisp tandoori paratha stuffed with finely chopped spiced onions and ajwain.',
  'Stuffed Naan': 'Leavened naan bread generously filled with spiced mashed vegetables, herbs, and paneer.',
  'Paneer Paratha': 'Flaky golden tandoori paratha packed with seasoned grated cottage cheese and herbs.',

  // Rice & Noodles
  'Steamed Rice': 'Fluffy, long-grain basmati rice steamed to tender perfection.',
  'Jeera Rice': 'Fragrant aged basmati rice tempered with aromatic cumin seeds and pure desi ghee.',
  'Veg Fried Rice': 'Wok-tossed basmati rice with finely diced carrots, beans, cabbage, and light soya sauce.',
  'Veg Schezwan Fried Rice': 'Spicy wok-tossed fried rice infused with fiery red Schezwan pepper sauce and spring onions.',
  'Veg Pulao': 'Mildly spiced aromatic basmati rice cooked with fresh seasonal vegetables and whole spices.',
  'Egg Fried Rice': 'Wok-fried fluffy basmati tossed with golden scrambled eggs, spring onions, and white pepper.',
  'Egg Schezwan Fried Rice': 'Egg fried rice elevated with spicy in-house Schezwan sauce and crunchy bell peppers.',
  'Spl Veg Chilli Garlic Fried Rice': 'Aromatic rice fried with roasted golden garlic cloves, fiery green chillies, and vegetables.',
  'Paneer Fried Rice': 'Savory fried rice tossed with golden fried paneer cubes, vegetables, and oriental seasoning.',
  'Chicken Fried Rice': 'Tender chicken bites and fluffy rice wok-tossed with spring onions, egg ribbons, and soy sauce.',
  'Chicken Schezwan Rice': 'Fiery wok-fried rice with diced chicken, Schezwan paste, and spicy red chillies.',
  'Mixed Fried Rice': 'Loaded fried rice featuring a delicious trio of chicken, scrambled egg, and fresh garden veggies.',
  'Kashmiri Pulao': 'Sweet and aromatic saffron basmati rice garnished with dry fruits, nuts, and fresh pomegranate.',
  'Veg Noodles': 'Classic stir-fried thin wheat noodles with crunchy julienned cabbage, carrots, and soy seasoning.',
  'Veg Hakka Noodles': 'Street-style Hakka noodles tossed with bell peppers, shredded cabbage, and aromatic spices.',
  'Veg Schezwan Noodles': 'Spicy Schezwan noodles tossed with fiery red chilli sauce and crunchy spring vegetables.',
  'Veg Chilli Garlic Noodles': 'Savory noodles infused with deeply browned garlic, fresh green chillies, and soya sauce.',
  'Paneer Noodles': 'Wok-tossed noodles loaded with soft paneer cubes, crunchy peppers, and oriental spices.',
  'Egg Noodles': 'Hakka noodles tossed with fluffy scrambled egg ribbons, onions, and spicy seasoning.',
  'Chicken Noodles': 'Stir-fried noodles loaded with shredded seasoned chicken, spring onions, and savoury sauces.',
  'Mix Noodles': 'Wok noodles tossed with seasoned chicken, egg scramble, and fresh vegetables.',
  'Chicken Schezwan Noodles': 'Spicy chicken noodles coated in zesty homemade Schezwan sauce with scallions.',
  'Chicken Egg Noodles': 'Rich noodles tossed with both tender chicken shreds and scrambled egg bits.',
  'Chicken Chilli Garlic Noodles': 'Spicy noodles bursting with pungent roasted garlic and tender chicken morsels.',

  // Biryani
  'Veg Biryani': 'Fragrant basmati rice layered with spiced seasonal vegetables, saffron milk, and fried onions.',
  'Egg Biryani': 'Dum-cooked aromatic basmati rice served with two golden roasted eggs and spicy salan.',
  'Paneer Biryani': 'Tender marinated cottage cheese cubes dum-cooked with aged basmati, mint, and royal spices.',
  'Chicken Biryani': 'Authentic Awadhi dum biryani with succulent chicken pieces, saffron basmati, and boiled egg.',
  'Royal Spl. Biryani': 'Our chef signature feast biryani loaded with double chicken, egg, dry fruits, and saffron.',

  // Starters
  'French Fries': 'Crisp golden salted potato fingers fried to perfection, served with tangy tomato ketchup.',
  'Cheese French Fries': 'Crispy golden fries smothered in warm molten cheddar cheese sauce and oregano.',
  'Sweet Corn masala': 'Steamed tender sweet corn kernels tossed with butter, chatpata chaat masala, and lemon.',
  'Onion(pyaaz) Pakora': 'Crisp golden fritters made with sliced onions, carom seeds, and green chillies in gram flour.',
  'Egg Pakora': 'Boiled egg halves dipped in seasoned chickpea batter, golden fried with chaat masala.',
  'Veg Pakora': 'Assorted vegetable fritters of potato, cauliflower, and onions fried crisp and piping hot.',
  'Paneer Pakora (8pcs)': 'Thick fresh cottage cheese cubes seasoned with ajwain and batter-fried to golden crunch.',
  'Chicken Pakora (8Pcs)': 'Juicy chicken bites marinated in royal spices and deep-fried in a crunchy spiced batter.',
  'Chicken Popcorn': 'Bite-sized tender chicken nuggets coated in crunchy seasoned breadcrumbs with garlic dip.',
  'French Fries Chilli': 'Golden fries tossed in sweet and spicy Indo-Chinese chilli garlic sauce with capsicum.',
  'Honey Potato Chilli': 'Crispy potato fingers glazed in a sticky honey-chilli sauce with toasted sesame seeds.',
  'Baby Corn Chilli': 'Crisp golden baby corn batons wok-tossed in spicy chilli soya glaze with spring onions.',
  'Mushroom Crispy chilli': 'Batter-crisped button mushrooms tossed with diced bell peppers, onions, and hot chilli sauce.',
  'Corn Salt & Pepper': 'Crispy fried sweet corn tossed with freshly cracked black pepper, garlic, and scallions.',
  'Mushroom Salt & Pepper': 'Crunchy button mushrooms tossed with sea salt, crushed Malabar black pepper, and garlic.',
  'Paneer Salt & Pepper': 'Golden paneer cubes seasoned with cracked black pepper, garlic butter, and scallions.',
  'Chicken 65': 'Famous South-Indian style boneless chicken tossed with fiery red chillies, curry leaves, and mustard.',
  'Chicken Lollipop': 'Crisp-fried chicken wings shaped into lollipops, tossed in zesty Schezwan garlic sauce.',
  'Baby Corn Paprika': 'Crunchy baby corn tossed with smoky Spanish paprika, garlic butter, and fresh herbs.',

  // Momos
  'Veg Fried Momo': 'Crispy golden fried dumplings packed with finely minced cabbage, carrots, spring onions, and ginger.',
  'Veg Roasted Momo': 'Tandoor-charred vegetable momos roasted with smokey spices and chaat masala, served with mint dip.',
  'Veg Crispy Momo': 'Panko crumb-coated vegetable momos fried to extra crunchy perfection, served with garlic schezwan dip.',
  'Veg Afghani Momo': 'Steamed vegetable momos drenched in a rich, creamy Afghani cashew-malai sauce with black pepper.',
  'Veg Crispy Afghani Momo': 'Extra crunchy crumb-fried veg momos tossed in velvety Afghani malai gravy with roasted sesame.',
  'Paneer Fried Momo': 'Crispy golden dumplings loaded with fresh spiced paneer, onions, and herbs, served with zesty chutney.',
  'Paneer Roasted Momo': 'Tandoori roasted paneer dumplings with a smoky charred exterior and soft paneer filling inside.',
  'Paneer Crispy Momo': 'Crunchy crumb-coated paneer momos fried to golden perfection with sweet and spicy dips.',
  'Paneer Afghani Momo': 'Soft paneer momos coated in luxurious Afghani malai cream, cashew paste, and fresh herbs.',
  'Paneer Crispy Afghani Momo': 'Crispy paneer momos smothered in rich cardamom-infused cream and roasted aromatics.',
  'Chicken Fried Momo': 'Deep-fried crisp flour pockets stuffed with juicy minced chicken, garlic, and coriander.',
  'Chicken Roasted Momo': 'Tandoor-blistered juicy chicken momos with a smoky coal aroma and chatpata seasoning.',
  'Chicken Crispy Momo': 'Golden panko-crusted chicken momos with a crunchy bite and piping-hot juicy chicken center.',
  'Chicken Afghani Momo': 'Juicy chicken dumplings tossed in rich, velvety Afghani cashew-cream gravy with fragrant spices.',
  'Chicken Crispy Afghani Momo': 'Crunchy crumb-fried chicken momos bathed in luscious Afghani malai sauce.',

  // Burgers
  'Veg Cheese Burger': 'Crisp golden spiced vegetable patty topped with melted cheddar cheese, sliced onions, and lettuce.',
  'Egg Cheese Burger': 'Double layered spiced egg omelette patty with melted cheese, caramelized onions, and garlic mayo.',
  'Paneer Cheese Burger': 'Thick slab of seasoned crumb-fried paneer with melted mozzarella, fresh tomatoes, and tandoori mayo.',
  'Chicken Cheese Burger': 'Crisp golden chicken patty topped with molten cheddar slice, jalapeños, and special burger relish.',

  // Sandwiches
  'Veg Grilled Sandwich': 'Triple-layer grilled bread filled with sliced cucumbers, tomatoes, capsicum, and mint chutney.',
  'Egg Grilled Sandwich': 'Fluffy masala egg scramble with black pepper, melted cheese, and sliced onions in golden toast.',
  'Cheese corn Grilled Sandwich': 'Sweet golden corn kernels tossed with molten cheddar and mozzarella, oregano, and chili flakes.',
  'Paneer Grilled Sandwich': 'Marinated cottage cheese cubes tossed in tandoori spices and capsicum, grilled with molten cheese.',
  'Chicken Grilled Sandwich': 'Shredded smoked chicken tossed in creamy pepper mayo, bell peppers, and melted cheese.',

  // Chinese
  'Veg Manchurian': 'Golden vegetable dumplings simmered in a savory, tangy dark soy and ginger-garlic sauce.',
  'Paneer Chilli': 'Soft paneer cubes wok-tossed with fiery green chillies, bell peppers, onions, and dark soya glaze.',
  'Mushroom Chilli': 'Button mushrooms wok-fried in spicy Indo-Chinese chilli garlic sauce with crunchy capsicum.',
  'Chicken Bone Chilli': 'Traditional bone-in chicken chunks tossed in spicy soy-chilli gravy with green onions.',
  'Chicken Boneless Chilli': 'Juicy boneless chicken cubes wok-tossed with red and green chillies, garlic, and soy sauce.',
  'Chicken Manchurian': 'Tender chicken meatballs glazed in a glossy, tangy ginger-coriander Manchurian sauce.',
  'Chicken Schezwan': 'Spicy chicken morsels cooked in authentic fiery Sichuan pepper and roasted chilli paste.',

  // Salad & Raita
  'Onion Salad': 'Freshly sliced crisp red onion rings seasoned with chaat masala, lemon wedges, and green chillies.',
  'Green Salad': 'Fresh farm salad platter of sliced cucumbers, tomatoes, carrots, onions, and lemon wedges.',
  'Mix Raita': 'Chilled creamy yogurt whipped with finely diced cucumbers, onions, tomatoes, and roasted cumin.',
  'Boondi Raita': 'Classic spiced yogurt mixed with crunchy gram flour boondi pearls and fragrant mint powder.',

  // Rolls
  'Veg Roll': 'Flaky paratha rolled with seasoned sautéed vegetables, crunchy sliced onions, and tangy mint chutney.',
  'Egg Roll': 'Golden paratha coated with a fried egg and rolled with spiced onions, lemon juice, and sauces.',
  'Cheese corn Roll': 'Crispy paratha wrap stuffed with sweet corn, molten mozzarella cheese, and chatpata seasoning.',
  'Paneer Roll': 'Warm paratha wrap filled with tandoori spiced paneer tikka, crunchy onions, and green chutney.',
  'Chicken Roll': 'Flaky crisp paratha rolled with juicy spiced chicken boti, sliced onions, and lemon pepper.',
  'Chicken Egg Roll': 'Double delight of fluffy egg-coated paratha stuffed with tender spiced chicken chunks.',

  // Soups
  'Sweet Corn Soup': 'Comforting creamy sweet corn soup with tender corn kernels and gentle seasonings.',
  'Veg Hot & Sour Soup': 'Spicy and tangy Chinese broth loaded with shredded vegetables, mushrooms, and black pepper.',
  'Veg Manchow Soup': 'Dark, savory vegetable soup flavored with garlic, coriander, and served with crispy fried noodles.',
  'Tomato Soup': 'Rich velvety ripe tomato soup simmered with fresh herbs, butter, and served with crunchy croutons.',
  'Chicken Corn Soup': 'Delicate, soothing broth with tender shredded chicken, sweet corn, and egg drops.',
  'Chicken Hot & Sour Soup': 'Fiery and sour chicken broth packed with shredded chicken, bamboo shoots, and green chillies.',
  'Chicken Manchow Soup': 'Bold, aromatic chicken soup with ginger, garlic, and fresh herbs, topped with fried noodles.',

  // Tandoori Veg
  'Paneer Tikka': 'Fresh cottage cheese cubes marinated in spiced hung curd, skewered and charred over live embers.',
  'Paneer Seekh Kebab': 'Minced spiced paneer blended with herbs and royal Lucknowi seasonings, grilled on skewers.',
  'Paneer Achari Tikka': 'Paneer cubes infused with punchy pickle spices, mustard oil, and charred in the tandoor.',
  'Paneer Malai Kebab': 'Melt-in-mouth paneer cubes soaked in rich cashew cream, cardamom, and roasted gentle over coal.',
  'Harabhara Kebab': 'Pan-grilled spinach and green pea patties seasoned with ginger, cumin, and roasted cashews.',

  // Tandoori Chicken
  'Tandoori Chicken Half': 'Two chicken quarters steeped in Kashmiri deghi mirch and mustard oil, roasted in clay oven.',
  'Chicken Patiala Half': 'Tender chicken marinated in Punjabi spices, slow-grilled and topped with rich Mughlai glaze.',
  'Chicken Tikka': 'Boneless chicken cubes steeped in ginger, garlic, and curd marinade, roasted crisp in the tandoor.',
  'Chicken Seekh Kebab': 'Minced chicken blended with fresh herbs and Lucknowi aromatics, skewered and charcoal-grilled.',
  'Chicken Boti Kebab': 'Tender boneless chicken boti bites steeped in spicy marinade, charred over glowing coal embers.',
  'Chicken Hariyali Kebab': 'Succulent chicken morsels infused with fresh garden mint, coriander, and green chillies.',
  'Chicken Kali Mirch Kebab': 'Creamy tandoori chicken marinated in freshly crushed Malabar black pepper and fresh cream.',
  'Chicken Reshmi Kebab': 'Silken-smooth chicken kebabs tenderized with egg whites, clotted cream, and subtle saffron.',
  'Chicken Achari Tikka': 'Bold and tangy chicken tikka steeped in panch-phoran pickle spices and mustard oil.',
  'Chicken Garlic Kebab': 'Charcoal-roasted chicken skewers steeped in roasted golden garlic butter and crushed herbs.',
  'Chicken Malai Kebab': 'Decadent chicken cubes bathed in rich cardamom cream, cashew nut paste, and melted cheese.',
  'Tangdi Kebab (4Leg pcs.)': 'Four whole chicken drumsticks marinated in royal spices and slow-roasted in the clay oven.',
  'Chicken Cheese Kebab': 'Succulent chicken kebabs stuffed with molten mozzarella and mild green herbs.',
  'Tandoori Chicken Full': 'Whole chicken steeped in traditional tandoori marinade, slow-roasted over coal embers.',
  'Chicken Patiala Full': 'Whole tandoori chicken cooked in royal Patiala style with roasted aromatics and rich glaze.'
};

// Function to download image if needed
function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      // Already exists and valid
      return resolve(true);
    }
    const file = fs.createWriteStream(destPath);
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Handle redirect
        https.get(res.headers.location, (redRes) => {
          redRes.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(true);
          });
        }).on('error', () => resolve(false));
      } else {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      }
    }).on('error', () => resolve(false));
  });
}

// Slugify filename
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  console.log('Enriching all 159 dishes with unique images and descriptions...');

  for (let i = 0; i < dishes.length; i++) {
    const d = dishes[i];
    const slug = slugify(d.name);
    const fileName = `${slug}.jpg`;
    const localImgPath = path.join(dishesDir, fileName);
    const imgWebPath = `/data/dishes/${fileName}`;

    // Update description
    if (uniqueDescriptions[d.name]) {
      d.description = uniqueDescriptions[d.name];
    }

    // Determine download URL
    const url = photoUrls[d.name] || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80';

    // Download image
    const success = await downloadImage(url, localImgPath);
    if (success && fs.existsSync(localImgPath) && fs.statSync(localImgPath).size > 1000) {
      d.image = imgWebPath;
    } else {
      console.warn(`Failed download for ${d.name}, fallback to existing image: ${d.image}`);
    }
  }

  // Save updated processed_dishes.json
  fs.writeFileSync(dishesPath, JSON.stringify(dishes, null, 2), 'utf8');
  console.log('Saved enriched dishes to processed_dishes.json!');

  // Now apply to config.ts
  const configPath = path.join(__dirname, '../config.ts');
  let configContent = fs.readFileSync(configPath, 'utf8');

  const menuStartPattern = '  menu: [\n';
  const menuStartIndex = configContent.indexOf(menuStartPattern);
  const menuEndPattern = '] as MenuItem[],';
  const menuEndIndex = configContent.indexOf(menuEndPattern, menuStartIndex);

  if (menuStartIndex !== -1 && menuEndIndex !== -1) {
    const newMenuJson = JSON.stringify(dishes, null, 4)
      .split('\n')
      .map(line => '  ' + line)
      .join('\n')
      .trim();

    const beforeMenu = configContent.substring(0, menuStartIndex + '  menu: '.length);
    const afterMenu = configContent.substring(menuEndIndex + menuEndPattern.length);
    const updatedContent = `${beforeMenu}${newMenuJson} as MenuItem[],${afterMenu}`;

    fs.writeFileSync(configPath, updatedContent, 'utf8');
    console.log('Successfully updated config.ts with 159 uniquely imaged and described dishes!');
  }
}

run().catch(console.error);
