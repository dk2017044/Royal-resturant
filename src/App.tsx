import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { SpecialDishes } from "./components/SpecialDishes";
import { HomeSections } from "./components/HomeSections";
import { RoyalMenu } from "./components/RoyalMenu";
import { Footer } from "./components/Footer";
import { DishModal } from "./components/DishModal";
import { OrderModal, type CartItem } from "./components/OrderModal";
import { MobileBottomBar } from "./components/MobileBottomBar";
import { ShahiKhansamaAI } from "./components/ShahiKhansamaAI";
import type { MenuItem } from "./config";
import "./App.css";

export const App: React.FC = () => {
  // Page Routing State ('home' or 'menu')
  const [activePage, setActivePage] = useState<"home" | "menu">("home");

  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedDishModal, setSelectedDishModal] = useState<MenuItem | null>(null);

  // Easy Order Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Shahi Khansama AI Concierge State
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>("");

  // Listen to hash changes (#menu / #home)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("menu")) {
        setActivePage("menu");
      } else {
        setActivePage("home");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const handleNavigate = (page: "home" | "menu", anchorId?: string) => {
    setActivePage(page);
    if (page === "menu") {
      window.location.hash = "#menu";
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.hash = anchorId ? `#${anchorId}` : "#hero";
      if (anchorId) {
        setTimeout(() => {
          const el = document.getElementById(anchorId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleOpenAI = (query?: string) => {
    if (query) {
      setAiInitialQuery(query);
    }
    setIsAIOpen(true);
  };

  // Cart Management Functions
  const handleAddToCart = (dish: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [
          ...prev,
          {
            id: dish.id,
            name: dish.name,
            hindiName: dish.hindiName,
            price: dish.price,
            image: dish.image,
            quantity: 1,
            isVeg: dish.isVeg,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="app-container">
      {/* Clean White Navbar with Green Cart Icon */}
      <Navbar
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        cartCount={totalCartItems}
        activePage={activePage}
        onNavigate={handleNavigate}
        onOpenAI={() => handleOpenAI()}
      />

      {/* Main Content View */}
      <main className="main-content">
        {activePage === "home" ? (
          <>
            {/* 1. Clean Minimal Hero matching Screenshot 1 */}
            <Hero onExploreMenu={() => handleNavigate("menu")} />

            {/* 2. "Our Special Dish" Section with 3 Protruding Round Plates matching Screenshot 1 */}
            <SpecialDishes
              onAddToCart={handleAddToCart}
              onSelectItem={(dish) => setSelectedDishModal(dish)}
              onExploreMore={() => handleNavigate("menu")}
            />

            {/* 3. Story, 3-Step Process & Testimonials matching Screenshot 2 */}
            <HomeSections
              onExploreMenu={() => handleNavigate("menu")}
              onOpenOrderModal={() => setIsOrderModalOpen(true)}
            />
          </>
        ) : (
          /* Dedicated Menu Page (Off the Homepage as requested) */
          <RoyalMenu
            onSelectItem={(dish: MenuItem) => setSelectedDishModal(dish)}
            cart={cart}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            onOpenOrderModal={() => setIsOrderModalOpen(true)}
            onBackToHome={() => handleNavigate("home", "hero")}
          />
        )}
      </main>

      {/* Clean Light Theme Footer */}
      <Footer onOpenOrderModal={() => setIsOrderModalOpen(true)} />

      {/* Modals */}
      <DishModal
        item={selectedDishModal}
        onClose={() => setSelectedDishModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Easy Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Rasoi AI Concierge */}
      <ShahiKhansamaAI
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        initialQuery={aiInitialQuery}
        onClearInitialQuery={() => setAiInitialQuery("")}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        hasCartItems={totalCartItems > 0}
      />

      {/* Dedicated Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        orderCount={totalCartItems}
        orderTotal={totalCartPrice}
        onOpenOrder={() => setIsOrderModalOpen(true)}
        onOpenMenu={() => handleNavigate("menu")}
      />
    </div>
  );
};

export default App;
