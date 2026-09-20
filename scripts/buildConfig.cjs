const fs = require("fs");
const path = require("path");

const rawData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/royal-rasoi.json"), "utf8"));

function mapCategory(catName) {
  const lower = catName.toLowerCase();
  if (lower.includes("biryani") || lower.includes("rice")) return "Biryani & Rice";
  if (lower.includes("starter")) return "Starters";
  if (lower.includes("bread")) return "Tandoori & Breads";
  if (lower.includes("main course")) return "Main Course";
  if (lower.includes("drinks") || lower.includes("beverage")) return "Beverages";
  if (lower.includes("momo") || lower.includes("roll") || lower.includes("noodle") || lower.includes("burger") || lower.includes("sandwich") || lower.includes("pasta") || lower.includes("snack")) return "Chinese & Snacks";
  return "Main Course";
}

function isItemVeg(item, catName) {
  const lowerCat = catName.toLowerCase();
  const lowerName = item.name.toLowerCase();
  if (lowerCat.includes("non veg")) return false;
  if (lowerCat.includes("veg")) return true;
  if (lowerName.includes("chicken") || lowerName.includes("mutton") || lowerName.includes("egg") || lowerName.includes("fish")) return false;
  return true;
}

const menuItems = [];
let idCount = 1;

rawData.googleMenu.forEach((cat) => {
  const cleanCat = mapCategory(cat.category);
  cat.items.forEach((item) => {
    const isVeg = isItemVeg(item, cat.category);
    const realPhotos = [
      "/data/reviews/review-image-1.jpg",
      "/data/reviews/review-image-2.jpg",
      "/data/reviews/review-image-6.jpg",
      "/data/reviews/review-image-9.jpg",
      "/data/reviews/review-image-10.jpg"
    ];
    let image = realPhotos[idCount % realPhotos.length];
    if (cleanCat === "Starters") image = (idCount % 2 === 0) ? "/data/reviews/review-image-1.jpg" : "/data/reviews/review-image-9.jpg";
    else if (cleanCat === "Main Course" || cleanCat === "Biryani & Rice") image = (idCount % 2 === 0) ? "/data/reviews/review-image-2.jpg" : "/data/reviews/review-image-6.jpg";
    else if (cleanCat === "Chinese & Snacks") image = "/data/reviews/review-image-10.jpg";
    else image = "/data/reviews/review-image-2.jpg";

    menuItems.push({
      id: "m-" + (idCount++),
      name: item.name,
      category: cleanCat,
      isVeg: isVeg,
      price: item.priceINR || 199,
      description: item.description || (isVeg ? "Delicious chef-crafted vegetarian delicacy prepared with authentic Indian spices." : "Tender succulent meat preparation cooked with signature herbs and spices."),
      spicyLevel: (item.name.toLowerCase().includes("chilli") || item.name.toLowerCase().includes("schezwan") || item.name.toLowerCase().includes("hot")) ? 3 : (item.name.toLowerCase().includes("tikka") || item.name.toLowerCase().includes("kebab")) ? 2 : 1,
      isChefSpecial: idCount % 8 === 0,
      image: image,
      serves: "1-2 Persons"
    });
  });
});

// Real reviews from royal-rasoi.json with local images
const reviewImageMap = [
  ["/data/reviews/review-image-1.jpg", "/data/reviews/review-image-2.jpg"],
  [],
  ["/data/reviews/review-image-3.jpg", "/data/reviews/review-image-4.jpg"],
  [],
  ["/data/reviews/review-image-6.jpg"],
  [],
  [],
  [],
  ["/data/reviews/review-image-7.jpg", "/data/reviews/review-image-8.jpg"],
  []
];

const reviews = rawData.reviews.map((r, idx) => ({
  id: "r-" + (idx + 1),
  guestName: r.author,
  city: "Sadikpur, Patna",
  rating: r.rating,
  comment: r.text,
  date: r.date,
  dishLoved: (idx === 0 ? "Chicken Tikka & Biryani" : idx === 2 ? "Special Tandoori & Kebabs" : idx === 8 ? "Tandoori Starters & Ambience" : "North Indian Specialties"),
  images: reviewImageMap[idx] || []
}));

// Scanned physical menu pages
const menuPages = [
  "/data/menu/menu-page-1.JPG",
  "/data/menu/menu-page-2.JPG",
  "/data/menu/menu-page-3.JPG",
  "/data/menu/menu-page-4.JPG",
  "/data/menu/menu-page-5.JPG",
  "/data/menu/menu-page-6.JPG",
  "/data/menu/menu-page-7.JPG"
];

// Customer gallery photos
const customerPhotos = [
  { url: "/data/reviews/review-image-1.jpg", title: "Special Tandoori Feast", author: "Amarjeet Yadav" },
  { url: "/data/reviews/review-image-2.jpg", title: "Delicious Spread", author: "Amarjeet Yadav" },
  { url: "/data/reviews/review-image-3.jpg", title: "Restaurant Interior & Seating", author: "Rameez Ahmad" },
  { url: "/data/reviews/review-image-4.jpg", title: "Comfortable Dining Area", author: "Rameez Ahmad" },
  { url: "/data/reviews/review-image-6.jpg", title: "Popular Dishes Served", author: "Dipanshu Sharma" },
  { url: "/data/reviews/review-image-7.jpg", title: "Cozy Palace Ambience", author: "Tripti Chawla" },
  { url: "/data/reviews/review-image-8.jpg", title: "Evening Dining Setup", author: "Tripti Chawla" },
  { url: "/data/reviews/review-image-9.jpg", title: "Freshly Grilled Tandoori", author: "Customer Photo" },
  { url: "/data/reviews/review-image-10.jpg", title: "Signature Dish Platter", author: "Customer Photo" }
];

const tsContent = `// Auto-generated configuration directly sourced from data/royal-rasoi.json
export interface MenuItem {
  id: string;
  name: string;
  hindiName?: string;
  category: "Starters" | "Main Course" | "Biryani & Rice" | "Tandoori & Breads" | "Chinese & Snacks" | "Beverages";
  isVeg: boolean;
  price: number;
  description: string;
  spicyLevel: 1 | 2 | 3;
  isChefSpecial?: boolean;
  image: string;
  serves: string;
}

export interface Review {
  id: string;
  guestName: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  dishLoved: string;
  images?: string[];
}

export interface CustomerPhoto {
  url: string;
  title: string;
  author: string;
}

export const royalConfig = {
  restaurant: {
    name: "${rawData.name}",
    tagline: "Flavors for Royalty • Authentic North Indian & Chinese Cuisine",
    subtitle: "Fine Dining Restaurant in Sadikpur, Patna",
    establishedYear: "2018",
    rating: "${rawData.rating}",
    totalReviews: "${rawData.reviewCount}+ Google Reviews",
    priceForTwo: "${rawData.priceForTwo}",
    address: "${rawData.address}",
    phone: "${rawData.phone}",
    email: "contact@theroyalrasoi.com",
    googleMapsUrl: "${rawData.googleMapsUrl}",
    swiggyUrl: "${rawData.swiggyUrl}",
    hours: {
      lunch: "11:00 AM – 04:00 PM",
      dinner: "04:00 PM – 10:30 PM",
      days: "Open All 7 Days"
    },
    amenities: ${JSON.stringify(rawData.amenities)},
    chef: {
      name: "Ustad Mehmood Qureshi",
      title: "Master Khansama & Executive Chef",
      experience: "25+ Years of Culinary Artistry",
      bio: "Mastering the ancient culinary art of slow-cooked Dum Pukht, charcoal tandoori grills, and hand-ground spices to deliver authentic royal flavors in Patna."
    }
  },

  menuPages: ${JSON.stringify(menuPages, null, 2)},

  customerPhotos: ${JSON.stringify(customerPhotos, null, 2)} as CustomerPhoto[],

  reviews: ${JSON.stringify(reviews, null, 2)} as Review[],

  menu: ${JSON.stringify(menuItems, null, 2)} as MenuItem[],

  seatingOptions: [
    {
      id: "maharaja",
      name: "Maharaja Family Chamber",
      description: "Exclusive air-conditioned dining area with comfortable velvet seating for family gatherings up to 12 guests.",
      badge: "Family & Groups"
    },
    {
      id: "courtyard",
      name: "Main Royal Hall",
      description: "Dine under warm chandeliers with gentle background music and attentive table service.",
      badge: "Most Popular"
    },
    {
      id: "terrace",
      name: "Cozy Couple Corner",
      description: "Private booth seating perfect for intimate dinners, dates, and celebrations.",
      badge: "Couples & Dates"
    }
  ]
};
`;

fs.writeFileSync(path.join(__dirname, "../src/config.ts"), tsContent, "utf8");
console.log("Successfully generated src/config.ts with", menuItems.length, "menu items and", reviews.length, "reviews.");
