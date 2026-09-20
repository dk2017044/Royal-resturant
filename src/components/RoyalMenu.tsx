import React, { useState, useMemo, useRef } from "react";
import {
  Flame,
  Search,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { royalConfig, type MenuItem } from "../config";
import type { CartItem } from "./OrderModal";
import "./RoyalMenu.css";

interface RoyalMenuProps {
  onSelectItem: (item: MenuItem) => void;
  cart: CartItem[];
  onAddToCart: (dish: MenuItem) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onClearCart: () => void;
  onOpenOrderModal: () => void;
  onOpenAIWithQuery?: (query: string) => void;
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
  onOpenAIWithQuery,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("Starters");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("All");
  const [dietFilter, setDietFilter] = useState<"All" | "Veg" | "NonVeg">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9; // Exactly 9 dishes per page for ZERO LAG

  // Official Scanned Menu modal state
  const [isOfficialMenuOpen, setIsOfficialMenuOpen] = useState<boolean>(false);
  const [menuPageViewerIndex, setMenuPageViewerIndex] = useState<number>(0);

  const menuBookRef = useRef<HTMLDivElement>(null);

  const categories: CategoryMeta[] = [
    {
      id: "Starters",
      name: "Starters",
      hindi: "शाही स्टार्टर्स व कबाब",
      icon: "🍢",
      count: 43,
      subcategories: ["All", "Non-Veg Starters", "Veg Starters", "Tandoori & Kebabs"],
    },
    {
      id: "Main Course",
      name: "Curries",
      hindi: "शाही सालन व दाल",
      icon: "🍲",
      count: 57,
      subcategories: ["All", "Non-Veg Curries", "Veg Curries", "Dal Specialties"],
    },
    {
      id: "Biryani & Rice",
      name: "Biryani & Rice",
      hindi: "दम पुख़्त बिरयानी व पुलाव",
      icon: "🍚",
      count: 29,
      subcategories: ["All", "Biryani Handis", "Pulao & Steamed", "Fried Rice"],
    },
    {
      id: "Chinese & Snacks",
      name: "Chinese & Snacks",
      hindi: "चाउमीन, मोमो व स्नैक्स",
      icon: "🥡",
      count: 62,
      subcategories: ["All", "Noodles & Chowmein", "Momos", "Rolls", "Burgers & Sandwiches"],
    },
    {
      id: "Tandoori & Breads",
      name: "Breads",
      hindi: "नान, कुलचा व पराठा",
      icon: "🫓",
      count: 13,
      subcategories: ["All", "Naans", "Rotis & Parathas"],
    },
    {
      id: "Beverages",
      name: "Beverages",
      hindi: "शरबत, मॉकटेल व मिष्ठान",
      icon: "🍹",
      count: 16,
      subcategories: ["All", "Mocktails & Sodas", "Desserts"],
    },
  ];

  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];

  // Filter all 220 items with instant reactivity
  const filteredItems = useMemo(() => {
    return royalConfig.menu.filter((item) => {
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;
      const matchesDiet =
        dietFilter === "All" ? true : dietFilter === "Veg" ? item.isVeg : !item.isVeg;

      let matchesSub = true;
      if (activeSubcategory !== "All") {
        const n = item.name.toLowerCase();
        if (activeSubcategory === "Non-Veg Starters") matchesSub = !item.isVeg;
        else if (activeSubcategory === "Veg Starters") matchesSub = item.isVeg;
        else if (activeSubcategory === "Tandoori & Kebabs") matchesSub = n.includes("kebab") || n.includes("tikka") || n.includes("tandoori");
        else if (activeSubcategory === "Non-Veg Curries") matchesSub = !item.isVeg;
        else if (activeSubcategory === "Veg Curries") matchesSub = item.isVeg && !n.includes("dal");
        else if (activeSubcategory === "Dal Specialties") matchesSub = n.includes("dal");
        else if (activeSubcategory === "Biryani Handis") matchesSub = n.includes("biryani");
        else if (activeSubcategory === "Pulao & Steamed") matchesSub = n.includes("pulao") || n.includes("rice") || n.includes("jeera");
        else if (activeSubcategory === "Fried Rice") matchesSub = n.includes("fried rice");
        else if (activeSubcategory === "Noodles & Chowmein") matchesSub = n.includes("noodle") || n.includes("chowmein");
        else if (activeSubcategory === "Momos") matchesSub = n.includes("momo");
        else if (activeSubcategory === "Rolls") matchesSub = n.includes("roll");
        else if (activeSubcategory === "Burgers & Sandwiches") matchesSub = n.includes("burger") || n.includes("sandwich");
        else if (activeSubcategory === "Naans") matchesSub = n.includes("naan") || n.includes("kulcha");
        else if (activeSubcategory === "Rotis & Parathas") matchesSub = n.includes("roti") || n.includes("paratha");
        else if (activeSubcategory === "Mocktails & Sodas") matchesSub = !n.includes("sweet") && !n.includes("dessert");
        else if (activeSubcategory === "Desserts") matchesSub = n.includes("sweet") || n.includes("ice") || n.includes("halwa");
      }

      const matchesSearch =
        searchQuery.trim() === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.hindiName && item.hindiName.includes(searchQuery));

      return matchesCategory && matchesDiet && matchesSub && matchesSearch;
    });
  }, [activeCategory, dietFilter, activeSubcategory, searchQuery]);

  // Total pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

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
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePrevMenuPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPageViewerIndex((prev) => (prev > 0 ? prev - 1 : royalConfig.menuPages.length - 1));
  };

  const handleNextMenuPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPageViewerIndex((prev) => (prev < royalConfig.menuPages.length - 1 ? prev + 1 : 0));
  };

  return (
    <section className="menu-book-section section-wrapper" id="menu" ref={menuBookRef}>
      <div className="container">
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
            <span>INTERACTIVE DASTARKHWAN • 220+ DELICACIES</span>
          </div>
          <h2 className="section-title font-cinzel">The Royal Menu Book</h2>
          <p className="section-subtitle font-serif">
            Browse our delicacies category-by-category. Tap <strong className="gold-text">[+ ADD]</strong> on any dish to order for Dine-in Table, Takeaway, or Delivery.
          </p>

          <div className="menu-header-actions">
            <button
              type="button"
              className="btn-royal-glass"
              onClick={() => setIsOfficialMenuOpen(true)}
            >
              <BookOpen size={16} />
              <span>View Official Scanned Menu (7 Pages)</span>
            </button>
          </div>
        </motion.div>

        {/* 1. INTERACTIVE CATEGORY SELECTOR DECK (Sticky & Horizontal Scroll on Mobile) */}
        <div className="category-book-tabs-container">
          <div className="category-book-tabs glass-panel">
            {categories.map((cat) => {
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
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryGlow"
                      className="cat-active-glow"
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
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
                onClick={() => {
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
                placeholder={`Search in ${currentCategory.name}...`}
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
                >
                  <X size={14} />
                </button>
              )}
              {searchQuery.trim().length > 1 && onOpenAIWithQuery && (
                <button
                  type="button"
                  onClick={() => onOpenAIWithQuery(searchQuery)}
                  className="mini-ai-ask-btn font-cinzel"
                  title="Ask Shahi Khansama AI about this"
                >
                  <Sparkles size={12} />
                  <span>Ask AI</span>
                </button>
              )}
            </div>

            <div className="diet-pills-group">
              <button
                type="button"
                className={`diet-pill ${dietFilter === "All" ? "active" : ""}`}
                onClick={() => {
                  setDietFilter("All");
                  setCurrentPage(1);
                }}
              >
                All
              </button>
              <button
                type="button"
                className={`diet-pill ${dietFilter === "Veg" ? "active" : ""}`}
                onClick={() => {
                  setDietFilter("Veg");
                  setCurrentPage(1);
                }}
              >
                <span className="dot veg"></span>
                Veg
              </button>
              <button
                type="button"
                className={`diet-pill ${dietFilter === "NonVeg" ? "active" : ""}`}
                onClick={() => {
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
            Showing {currentCategory.name} • Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({filteredItems.length} dishes total)
          </span>
        </div>

        <motion.div layout className="paginated-dishes-grid">
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
                  transition={{ duration: 0.25 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`curated-dish-card glass-panel ${qty > 0 ? "feast-selected" : ""}`}
                  onClick={() => onSelectItem(dish)}
                >
                  {/* Photo with badges */}
                  <div className="dish-img-box">
                    <img src={dish.image} alt={dish.name} loading="lazy" />

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
                      <div className="spice-tag">
                        <span className="spice-lbl">Spice:</span>
                        {[...Array(dish.spicyLevel)].map((_, i) => (
                          <Flame key={i} size={12} className="spice-flame" />
                        ))}
                      </div>

                      <span className="quick-view-link font-cinzel">
                        Details <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="menu-empty-box glass-panel text-center">
            <h4 className="empty-heading font-cinzel">No Delicacies Found</h4>
            <p className="empty-sub font-serif">
              {searchQuery ? (
                <>
                  Looking for &ldquo;<strong>{searchQuery}</strong>&rdquo;? Let our Shahi Khansama AI recommend the best feast for you!
                </>
              ) : (
                "Try adjusting your filters or search query."
              )}
            </p>
            <div className="empty-actions-row">
              {searchQuery && onOpenAIWithQuery && (
                <button
                  type="button"
                  className="btn-royal-gold-ai font-cinzel"
                  onClick={() => onOpenAIWithQuery(searchQuery)}
                >
                  <Sparkles size={15} />
                  <span>Ask Khansama AI for Recommendations</span>
                </button>
              )}
              <button
                type="button"
                className="btn-royal-primary"
                onClick={() => {
                  setSearchQuery("");
                  setDietFilter("All");
                  setActiveSubcategory("All");
                }}
              >
                Reset Filters
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

      {/* Official Scanned Menu Cards Lightbox */}
      <AnimatePresence>
        {isOfficialMenuOpen && (
          <motion.div
            className="official-menu-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOfficialMenuOpen(false)}
          >
            <button
              type="button"
              className="menu-lightbox-close"
              onClick={() => setIsOfficialMenuOpen(false)}
              aria-label="Close menu viewer"
            >
              <X size={26} />
            </button>

            <button
              type="button"
              className="menu-lightbox-nav prev"
              onClick={handlePrevMenuPage}
              aria-label="Previous menu page"
            >
              <ChevronLeft size={30} />
            </button>

            <button
              type="button"
              className="menu-lightbox-nav next"
              onClick={handleNextMenuPage}
              aria-label="Next menu page"
            >
              <ChevronRight size={30} />
            </button>

            <motion.div
              className="menu-lightbox-dialog glass-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="menu-scanned-page-wrap">
                <img
                  src={royalConfig.menuPages[menuPageViewerIndex]}
                  alt={`Official Menu Page ${menuPageViewerIndex + 1}`}
                  className="menu-scanned-img"
                />
              </div>

              <div className="menu-lightbox-footer">
                <span className="menu-page-indicator font-cinzel">
                  Official Menu • Page {menuPageViewerIndex + 1} of {royalConfig.menuPages.length}
                </span>
                <div className="menu-lightbox-dots">
                  {royalConfig.menuPages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`menu-dot ${idx === menuPageViewerIndex ? "active" : ""}`}
                      onClick={() => setMenuPageViewerIndex(idx)}
                      aria-label={`Go to page ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
export default RoyalMenu;
