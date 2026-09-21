import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Flame,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { royalConfig, type MenuItem } from "../config";
import type { CartItem } from "./OrderModal";
import { sanitizeSearchQuery, PAYLOAD_LIMITS } from "../utils/security";
import "./RoyalMenu.css";

interface RoyalMenuProps {
  onSelectItem: (item: MenuItem) => void;
  cart: CartItem[];
  onAddToCart: (dish: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  onOpenOrderModal: () => void;
  onBackToHome?: () => void;
}

interface CategoryMeta {
  id: string;
  name: string;
  hindi: string;
  icon: string;
  count: number;
  subcategories: string[];
}

export const RoyalMenu: React.FC<RoyalMenuProps> = ({
  onSelectItem,
  cart = [],
  onAddToCart,
  onUpdateQuantity,
  onClearCart,
  onOpenOrderModal,
  onBackToHome,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("Combos & Thali");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("All");
  const [dietFilter, setDietFilter] = useState<"All" | "Veg" | "NonVeg">("All");
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("q")) return urlParams.get("q")!;
      if (urlParams.get("search")) return urlParams.get("search")!;
      const hash = window.location.hash;
      if (hash.includes("?")) {
        const hashParams = new URLSearchParams(hash.slice(hash.indexOf("?") + 1));
        if (hashParams.get("q")) return hashParams.get("q")!;
        if (hashParams.get("search")) return hashParams.get("search")!;
      }
    } catch {
      // ignore
    }
    return "";
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isSearching = searchQuery.trim() !== "";
  const itemsPerPage = isSearching ? 48 : 9; // Show all search results directly without tiny page limits

  const menuBookRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUrlSearch = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q") || urlParams.get("search");
        if (q !== null && q !== undefined) {
          setSearchQuery(q);
          return;
        }
        const hash = window.location.hash;
        if (hash.includes("?")) {
          const hashParams = new URLSearchParams(hash.slice(hash.indexOf("?") + 1));
          const hq = hashParams.get("q") || hashParams.get("search");
          if (hq !== null && hq !== undefined) {
            setSearchQuery(hq);
          }
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener("hashchange", handleUrlSearch);
    return () => window.removeEventListener("hashchange", handleUrlSearch);
  }, []);

  const categories: CategoryMeta[] = [
    {
      id: "Combos & Thali",
      name: "Combos & Thali",
      hindi: "शाही थाली व कॉम्बो",
      icon: "🍱",
      count: 5,
      subcategories: ["All", "Thali", "Budget Friendly Combo"],
    },
    {
      id: "Momos & Fast Food",
      name: "Momos & Fast Food",
      hindi: "मोमो, बर्गर, सैंडविच व रोल्स",
      icon: "🥟",
      count: 30,
      subcategories: ["All", "Momos", "Burger", "Sandwich", "Rolls"],
    },
    {
      id: "Starters & Snacks",
      name: "Starters & Snacks",
      hindi: "फ्राइज, पकौड़ा व स्नैक्स",
      icon: "🍟",
      count: 19,
      subcategories: ["All", "Pakoras", "Fries & Corn", "Chilli & Sizzlers"],
    },
    {
      id: "Tandoori & Kebabs",
      name: "Tandoori Kebabs",
      hindi: "तंदूरी कबाब व टिक्का",
      icon: "🍢",
      count: 20,
      subcategories: ["All", "Tandoori (Chicken)", "Tandoori (Veg)"],
    },
    {
      id: "Curries & Chinese",
      name: "Curries & Chinese",
      hindi: "चिकन सालन व चाइनीज",
      icon: "🍲",
      count: 20,
      subcategories: ["All", "Indian (Chicken)", "Chinese"],
    },
    {
      id: "Rice, Biryani & Noodles",
      name: "Rice & Biryani",
      hindi: "बिरयानी, फ्राइड राइस व नूडल्स",
      icon: "🍚",
      count: 29,
      subcategories: ["All", "Biryani", "Fried Rice & Pulao", "Noodles"],
    },
    {
      id: "Tandoori Breads",
      name: "Breads",
      hindi: "नान, रोटी व पराठा",
      icon: "🫓",
      count: 9,
      subcategories: ["All", "Naans", "Rotis & Parathas"],
    },
    {
      id: "Beverages & Soups",
      name: "Beverages & Soups",
      hindi: "शेक्स, मॉकटेल, सूप व रायता",
      icon: "🍹",
      count: 27,
      subcategories: ["All", "Mocktail", "Shake", "Soup", "Salad & Raita"],
    },
  ];

  // Dynamically calculate category dish counts based on the active diet filter
  const dynamicCategories = useMemo(() => {
    return categories.map((cat) => {
      const count = royalConfig.menu.filter((item) => {
        const inCat = item.category === cat.id;
        const inDiet =
          dietFilter === "All" ? true : dietFilter === "Veg" ? item.isVeg : !item.isVeg;
        return inCat && inDiet;
      }).length;
      return { ...cat, count };
    });
  }, [dietFilter]);

  const currentCategory =
    dynamicCategories.find((c) => c.id === activeCategory) || dynamicCategories[0];

  // Filter items with global search across all categories when search query is typed
  const filteredItems = useMemo(() => {
    const isSearching = searchQuery.trim() !== "";
    // Security: sanitize and cap search query length to prevent LPDoS & injection
    const qRaw = sanitizeSearchQuery(searchQuery).toLowerCase().trim();
    // Security: limit to 5 search tokens to prevent algorithmic complexity DoS
    const searchTokens = qRaw.split(/\s+/).filter(Boolean).slice(0, 5);

    // Check if query explicitly specifies diet
    const querySpecifiesVeg =
      searchTokens.some((t) => t === "veg" || t === "vegetarian" || t === "shakahari") &&
      !searchTokens.some((t) => t.includes("non"));
    const querySpecifiesNonVeg = searchTokens.some(
      (t) =>
        t === "non-veg" ||
        t === "nonveg" ||
        t === "chicken" ||
        t === "egg" ||
        t === "mutton" ||
        t === "fish"
    );

    return royalConfig.menu.filter((item) => {
      // When searching, search across the ENTIRE menu (all categories)!
      const matchesCategory = isSearching
        ? true
        : activeCategory === "All" || item.category === activeCategory;

      let matchesDiet = true;
      if (isSearching) {
        if (querySpecifiesVeg) {
          matchesDiet = item.isVeg;
        } else if (querySpecifiesNonVeg) {
          matchesDiet = !item.isVeg;
        } else {
          matchesDiet =
            dietFilter === "All" ? true : dietFilter === "Veg" ? item.isVeg : !item.isVeg;
        }
      } else {
        matchesDiet =
          dietFilter === "All" ? true : dietFilter === "Veg" ? item.isVeg : !item.isVeg;
      }

      let matchesSub = true;
      if (!isSearching && activeSubcategory !== "All") {
        const n = item.name.toLowerCase();
        const sub = item.subCategory || "";

        if (activeSubcategory === "Thali") matchesSub = sub === "Thali";
        else if (activeSubcategory === "Budget Friendly Combo") matchesSub = sub === "Budget Friendly Combo";
        else if (activeSubcategory === "Momos") matchesSub = sub === "Momos";
        else if (activeSubcategory === "Burger") matchesSub = sub === "Burger";
        else if (activeSubcategory === "Sandwich") matchesSub = sub === "Sandwich";
        else if (activeSubcategory === "Rolls") matchesSub = sub === "Rolls";
        else if (activeSubcategory === "Pakoras") matchesSub = n.includes("pakora") || n.includes("pakoda");
        else if (activeSubcategory === "Fries & Corn") matchesSub = n.includes("fries") || n.includes("corn");
        else if (activeSubcategory === "Chilli & Sizzlers")
          matchesSub = n.includes("chilli") || n.includes("pepper") || n.includes("popcorn") || n.includes("65") || n.includes("lollipop");
        else if (activeSubcategory === "Tandoori (Chicken)") matchesSub = sub === "Tandoori (Chicken)";
        else if (activeSubcategory === "Tandoori (Veg)") matchesSub = sub === "Tandoori (Veg)";
        else if (activeSubcategory === "Indian (Chicken)") matchesSub = sub === "Indian (Chicken)";
        else if (activeSubcategory === "Chinese") matchesSub = sub === "Chinese";
        else if (activeSubcategory === "Biryani") matchesSub = sub === "Biryani";
        else if (activeSubcategory === "Fried Rice & Pulao")
          matchesSub = n.includes("fried rice") || n.includes("pulao") || n.includes("steamed") || n.includes("jeera");
        else if (activeSubcategory === "Noodles") matchesSub = n.includes("noodle");
        else if (activeSubcategory === "Naans") matchesSub = n.includes("naan");
        else if (activeSubcategory === "Rotis & Parathas") matchesSub = n.includes("roti") || n.includes("paratha");
        else if (activeSubcategory === "Mocktail") matchesSub = sub === "Mocktail";
        else if (activeSubcategory === "Shake") matchesSub = sub === "Shake";
        else if (activeSubcategory === "Soup") matchesSub = sub === "Soup";
        else if (activeSubcategory === "Salad & Raita") matchesSub = sub === "Salad" || sub === "Raita";
      }

      if (!isSearching) {
        return matchesCategory && matchesDiet && matchesSub;
      }

      // Smart synonym / phonetic matching for search tokens
      const checkTokenMatch = (token: string) => {
        const itemN = item.name.toLowerCase();
        const itemD = item.description.toLowerCase();
        const itemC = item.category.toLowerCase();
        const itemH = item.hindiName || "";

        // Direct substring match
        if (
          itemN.includes(token) ||
          itemD.includes(token) ||
          itemC.includes(token) ||
          itemH.includes(token)
        ) {
          return true;
        }

        // Pakoda / Pakora / Bhaji
        if (token.includes("pakod") || token.includes("pakor") || token.includes("bhaji")) {
          return (
            itemN.includes("pakora") ||
            itemN.includes("pakoda") ||
            itemD.includes("pakora") ||
            itemD.includes("pakoda") ||
            itemN.includes("bhaji")
          );
        }

        // Momos / Momo / Dumpling
        if (token.includes("momo") || token.includes("dumpling")) {
          return itemN.includes("momo") || itemD.includes("momo");
        }

        // Chowmein / Chowmin / Chawmin / Noodles
        if (
          token.includes("chow") ||
          token.includes("chaw") ||
          token.includes("noodl") ||
          token.includes("chaumin")
        ) {
          return (
            itemN.includes("noodle") ||
            itemN.includes("chowmein") ||
            itemD.includes("noodle") ||
            itemD.includes("chowmein")
          );
        }

        // Burger / Burgers
        if (token.includes("burg")) {
          return itemN.includes("burger") || itemD.includes("burger");
        }

        // Sandwich / Sandwitch
        if (token.includes("sandw")) {
          return itemN.includes("sandwich") || itemD.includes("sandwich");
        }

        // Kebab / Kabab / Tikka
        if (token.includes("kebab") || token.includes("kabab")) {
          return itemN.includes("kebab") || itemN.includes("kabab") || itemD.includes("kebab");
        }

        // Biryani / Biryany / Briyani
        if (token.includes("biry") || token.includes("briy")) {
          return itemN.includes("biryani") || itemD.includes("biryani");
        }

        // Paneer / Panir
        if (token.includes("paneer") || token.includes("panir")) {
          return itemN.includes("paneer") || itemD.includes("paneer");
        }

        // Chicken / Chiken / Murgh
        if (token.includes("chick") || token.includes("chiken") || token.includes("murgh")) {
          return itemN.includes("chicken") || itemN.includes("murgh") || itemD.includes("chicken");
        }

        // Coke / Cold Drink / Soda / Beverage / Soft Drink
        if (
          token.includes("coke") ||
          token.includes("cola") ||
          token.includes("pepsi") ||
          token.includes("sprite") ||
          token.includes("thums") ||
          token.includes("fanta") ||
          token.includes("mirinda") ||
          token.includes("coldrink") ||
          token.includes("drink") ||
          token.includes("soda") ||
          token.includes("beverag")
        ) {
          return (
            itemN.includes("cold drink") ||
            itemN.includes("coke") ||
            itemN.includes("sprite") ||
            itemN.includes("soda") ||
            itemN.includes("mojito") ||
            itemN.includes("lemonade") ||
            itemN.includes("shake") ||
            itemD.includes("cold drink") ||
            itemD.includes("coke") ||
            itemD.includes("coca-cola") ||
            itemD.includes("drink") ||
            itemD.includes("soda") ||
            itemC.includes("beverages")
          );
        }

        // Roti / Naan / Paratha / Kulcha / Breads
        if (
          token.includes("roti") ||
          token.includes("naan") ||
          token.includes("nan") ||
          token.includes("paratha") ||
          token.includes("kulcha") ||
          token.includes("bread")
        ) {
          return (
            itemN.includes("roti") ||
            itemN.includes("naan") ||
            itemN.includes("paratha") ||
            itemN.includes("kulcha") ||
            itemC.includes("breads") ||
            itemD.includes("roti") ||
            itemD.includes("naan")
          );
        }

        // Thali / Combo
        if (token.includes("thali") || token.includes("combo")) {
          return itemN.includes("thali") || itemN.includes("combo") || itemC.includes("combos") || itemD.includes("thali");
        }

        // Mutton / Gosht
        if (token.includes("mutton") || token.includes("gosht")) {
          return itemN.includes("mutton") || itemD.includes("mutton");
        }

        // Egg / Anda
        if (token.includes("egg") || token.includes("anda")) {
          return itemN.includes("egg") || itemN.includes("anda") || itemD.includes("egg");
        }

        // Fish / Machli
        if (token.includes("fish") || token.includes("machli")) {
          return itemN.includes("fish") || itemD.includes("fish");
        }

        // Sweets / Gulab Jamun / Ice cream
        if (token.includes("sweet") || token.includes("jamun") || token.includes("gulab") || token.includes("dessert") || token.includes("ice cream") || token.includes("icecream")) {
          return itemN.includes("jamun") || itemN.includes("sweet") || itemD.includes("sweet") || itemN.includes("ice cream") || itemD.includes("ice cream");
        }

        return false;
      };

      const matchesSearch = searchTokens.every(checkTokenMatch);

      return matchesCategory && matchesDiet && matchesSub && matchesSearch;
    });
  }, [activeCategory, dietFilter, activeSubcategory, searchQuery]);

  // Total pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  // Clamp current page whenever totalPages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setActiveSubcategory("All");
    setCurrentPage(1);
    if (menuBookRef.current) {
      menuBookRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const handleSearchChange = (val: string) => {
    const clean = sanitizeSearchQuery(val);
    setSearchQuery(clean);
    setCurrentPage(1);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <section className="menu-book-section section-wrapper" id="menu" ref={menuBookRef}>
      <div className="container">
        {/* Back to Home Button */}
        {onBackToHome && (
          <div className="menu-top-nav-bar">
            <button
              type="button"
              className="btn-back-home"
              onClick={onBackToHome}
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
          </div>
        )}

        {/* Section Header */}
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="royal-pill-badge">
            <Sparkles size={14} />
            <span>AUTHENTIC CUISINE • 220+ DELICACIES</span>
          </div>
          <h2 className="section-title">The Royal Menu</h2>
          <p className="section-subtitle">
            Browse our delicacies category-by-category. Tap <strong className="text-green-accent">[+ ADD]</strong> to order for Dine-in, Takeaway, or Delivery.
          </p>
        </motion.div>

        {/* 1. INTERACTIVE CATEGORY SELECTOR DECK (Sticky & Horizontal Scroll on Mobile) */}
        <div className="category-book-tabs-container">
          <div className="category-book-tabs glass-panel">
            {dynamicCategories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  className={`cat-book-btn ${isActive ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  <div className="cat-text-wrap">
                    <span className="cat-title font-cinzel">{cat.name}</span>
                    <span className="cat-count font-serif">{cat.count} items</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. CONTROLS BAR: Subcategories, Diet Toggle & Search */}
        <div className="menu-controls-bar glass-panel">
          {/* Subcategory Pills */}
          <div className="subcat-pills-row">
            {currentCategory.subcategories.map((sub) => (
              <button
                key={sub}
                type="button"
                className={`subcat-pill ${activeSubcategory === sub ? "active" : ""}`}
                onClick={(e) => {
                  e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                  setActiveSubcategory(sub);
                  setCurrentPage(1);
                }}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Search & Veg/Non-Veg Filter */}
          <div className="search-diet-wrap">
            <div className="mini-search-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search delicacies (e.g. Momos, Burger, Pakoda, Biryani)..."
                maxLength={PAYLOAD_LIMITS.SEARCH_QUERY}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="mini-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="mini-clear-btn"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="diet-pills-group">
              <button
                type="button"
                className={`diet-pill ${dietFilter === "All" ? "active all-active" : ""}`}
                onClick={(e) => {
                  e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                  setDietFilter("All");
                  setCurrentPage(1);
                }}
              >
                All
              </button>
              <button
                type="button"
                className={`diet-pill ${dietFilter === "Veg" ? "active veg-active" : ""}`}
                onClick={(e) => {
                  e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                  setDietFilter("Veg");
                  setCurrentPage(1);
                }}
              >
                <span className="dot veg"></span>
                Veg
              </button>
              <button
                type="button"
                className={`diet-pill ${dietFilter === "NonVeg" ? "active nonveg-active" : ""}`}
                onClick={(e) => {
                  e.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                  setDietFilter("NonVeg");
                  setCurrentPage(1);
                }}
              >
                <span className="dot nonveg"></span>
                Non-Veg
              </button>
            </div>
          </div>
        </div>

        {/* 3. PAGINATED 9-DISH GRID */}
        <div className="menu-page-header">
          <span className="page-summary font-serif">
            {searchQuery.trim() ? (
              <>Found <strong>{filteredItems.length} delicacies</strong> matching &ldquo;<strong>{searchQuery}</strong>&rdquo; across all 8 categories{totalPages > 1 ? ` • Page ${currentPage} of ${totalPages}` : ""}</>
            ) : (
              <>Showing {currentCategory.name} ({dietFilter === "All" ? "All" : dietFilter === "Veg" ? "Pure Veg" : "Non-Veg"}) • Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredItems.length} dishes)</>
            )}
          </span>
        </div>

        <div className="paginated-dishes-grid">
          <AnimatePresence>
            {paginatedItems.map((dish) => {
              const inCart = cart.find((c) => c.id === dish.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <motion.div
                  key={dish.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`curated-dish-card glass-panel ${qty > 0 ? "feast-selected" : ""}`}
                  onClick={() => onSelectItem(dish)}
                >
                  {/* Photo with badges */}
                  <div className="dish-img-box">
                    <img src={dish.image} alt={dish.name} loading="lazy" decoding="async" />

                    {/* Veg/Non-Veg Pill */}
                    <div className={`diet-badge-pill ${dish.isVeg ? "veg" : "nonveg"}`}>
                      <span className="badge-dot"></span>
                    </div>

                    {/* Price Badge */}
                    <span className="dish-card-price font-cinzel">₹{dish.price}</span>

                    {/* Easy Order Quantity Controls right on card */}
                    <div className="dish-order-actions" onClick={(e) => e.stopPropagation()}>
                      {qty === 0 ? (
                        <button
                          type="button"
                          className="add-to-cart-btn font-cinzel"
                          onClick={() => onAddToCart(dish)}
                          aria-label={`Add ${dish.name} to order`}
                        >
                          <Plus size={14} />
                          <span>Add</span>
                        </button>
                      ) : (
                        <div className="card-qty-controller">
                          <button
                            type="button"
                            className="card-qty-btn minus"
                            onClick={() => onUpdateQuantity(dish.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="card-qty-val font-cinzel">{qty}</span>
                          <button
                            type="button"
                            className="card-qty-btn plus"
                            onClick={() => onUpdateQuantity(dish.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="dish-card-info">
                    <div className="dish-title-row">
                      <h4 className="dish-name-heading font-cinzel">{dish.name}</h4>
                      {dish.hindiName && (
                        <span className="dish-hindi-sub font-serif">{dish.hindiName}</span>
                      )}
                    </div>

                    <p className="dish-desc-text font-serif">{dish.description}</p>

                    <div className="dish-footer-row">
                      <div className="spice-indicator-badge">
                        <Flame size={12} className={`spice-flame level-${dish.spicyLevel || 1}`} />
                        <span className="spice-text">
                          {dish.spicyLevel === 3 ? "Extra Spicy" : dish.spicyLevel === 2 ? "Medium Spicy" : "Mild Spice"}
                        </span>
                      </div>

                      <span className="dish-serves-tag font-serif">
                        {dish.serves || "Serves 1-2"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="menu-empty-box glass-panel text-center">
            <h4 className="empty-heading font-cinzel">No Delicacies Found</h4>
            <p className="empty-sub font-serif">
              {searchQuery ? (
                <>
                  No delicacies found matching &ldquo;<strong>{searchQuery}</strong>&rdquo;. Try searching for another dish or choose from popular searches below.
                </>
              ) : (
                "Try adjusting your filters or category selection."
              )}
            </p>
            {searchQuery && (
              <div className="empty-quick-suggestions">
                <span className="quick-suggest-label">Popular Searches:</span>
                <div className="quick-suggest-pills">
                  {["Cold Drink", "Biryani", "Tandoori Chicken", "Momos", "Paneer Tikka", "Thali"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="quick-suggest-pill"
                      onClick={() => handleSearchChange(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="empty-actions-row">
              <button
                type="button"
                className="btn-green btn-reset-filters"
                onClick={() => {
                  setSearchQuery("");
                  setDietFilter("All");
                  setActiveSubcategory("All");
                }}
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}

        {/* 4. PAGINATION NUMBERS & CONTROLS */}
        {totalPages > 1 && (
          <div className="menu-pagination-bar">
            <button
              type="button"
              className="pagination-btn prev-btn font-cinzel"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>

            <div className="pagination-pages-list">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`page-num-btn ${pageNum === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="pagination-btn next-btn font-cinzel"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* 5. FLOATING QUICK ORDER CART BAR */}
        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div
              className="floating-order-cart-bar glass-panel"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <div className="cart-bar-content">
                <div className="cart-summary-clickable" onClick={onOpenOrderModal}>
                  <div className="cart-icon-ring">
                    <ShoppingBag size={22} />
                  </div>
                  <div className="cart-info-text">
                    <span className="cart-title font-cinzel">
                      {totalCartItems} {totalCartItems === 1 ? "Item" : "Items"} in Order
                    </span>
                    <span className="cart-est-total font-serif">
                      Estimated Bill: <strong className="gold-text">₹{cartTotal}</strong>
                    </span>
                  </div>
                </div>

                <div className="cart-actions-group">
                  <button
                    type="button"
                    className="btn-royal-primary view-order-btn"
                    onClick={onOpenOrderModal}
                  >
                    <span>View Order & Place</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    className="clear-feast-btn"
                    onClick={onClearCart}
                    title="Clear Cart"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
export default RoyalMenu;
