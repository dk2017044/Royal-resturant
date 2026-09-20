import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { RoyalMenu } from "./components/RoyalMenu";
import { PalaceHeritage } from "./components/PalaceHeritage";
import { Footer } from "./components/Footer";
import { DishModal } from "./components/DishModal";
import { OrderModal, type CartItem } from "./components/OrderModal";
import { MobileBottomBar } from "./components/MobileBottomBar";
import { ShahiKhansamaAI } from "./components/ShahiKhansamaAI";
import type { MenuItem } from "./config";
import "./App.css";

export const App: React.FC = () => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedDishModal, setSelectedDishModal] = useState<MenuItem | null>(null);

  // Easy Order Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Shahi Khansama AI Concierge State
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string>("");

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
      {/* Royal Topbar & Navigation */}
      <Navbar onOpenOrderModal={() => setIsOrderModalOpen(true)} />

      {/* Main Content Sections - Mobile-First Curated Luxury Experience */}
      <main className="main-content">
        {/* 1. Hero with Interactive Spinning White Plate Delicacy Showcase */}
        <Hero onOpenOrderModal={() => setIsOrderModalOpen(true)} />

        {/* 2. Zero-Lag Royal Menu Book with Easy 1-Tap [+ ADD] and [- qty +] Controls */}
        <RoyalMenu
          onSelectItem={(dish: MenuItem) => setSelectedDishModal(dish)}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onClearCart={handleClearCart}
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
          onOpenAIWithQuery={handleOpenAI}
        />

        {/* 3. Palace Heritage, Real Celebration Moments & Food Craft */}
        <PalaceHeritage />
      </main>

      {/* Royal Footer */}
      <Footer onOpenOrderModal={() => setIsOrderModalOpen(true)} />

      {/* Modals */}
      <DishModal
        item={selectedDishModal}
        onClose={() => setSelectedDishModal(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Easy Order Modal with 1-Click WhatsApp, Dine-in Cafe, Takeaway & Delivery */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Shahi Khansama AI Concierge (Powered by Qwen on Groq) */}
      <ShahiKhansamaAI
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        initialQuery={aiInitialQuery}
        onClearInitialQuery={() => setAiInitialQuery("")}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        hasCartItems={totalCartItems > 0}
      />

      {/* Dedicated Mobile Bottom App Bar with Live Order Counter & Price */}
      <MobileBottomBar
        orderCount={totalCartItems}
        orderTotal={totalCartPrice}
        onOpenOrder={() => setIsOrderModalOpen(true)}
      />
    </div>
  );
};

export default App;
