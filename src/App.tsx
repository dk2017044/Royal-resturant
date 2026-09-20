import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { RoyalMenu } from "./components/RoyalMenu";
import { PalaceHeritage } from "./components/PalaceHeritage";
import { ReservationSection } from "./components/ReservationSection";
import { Footer } from "./components/Footer";
import { DishModal } from "./components/DishModal";
import { ReservationModal } from "./components/ReservationModal";
import { OrderModal, type CartItem } from "./components/OrderModal";
import { MobileBottomBar } from "./components/MobileBottomBar";
import { ShahiKhansamaAI } from "./components/ShahiKhansamaAI";
import type { MenuItem } from "./config";
import "./App.css";

export const App: React.FC = () => {
  const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedDishModal, setSelectedDishModal] = useState<MenuItem | null>(null);
  const [preselectedDishForBooking, setPreselectedDishForBooking] = useState<string>("");

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

  const handleOpenReservation = (dishName: string = "") => {
    setPreselectedDishForBooking(dishName);
    setIsReservationOpen(true);
  };

  const handleCloseReservation = () => {
    setIsReservationOpen(false);
    setPreselectedDishForBooking("");
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
      <Navbar onOpenReservation={() => handleOpenReservation()} />

      {/* Main Content Sections - Mobile-First Curated Luxury Experience */}
      <main className="main-content">
        {/* 1. Hero with Interactive Spinning White Plate Delicacy Showcase */}
        <Hero onOpenReservation={() => handleOpenReservation()} />

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

        {/* 3. Palace Heritage, Master Khansama Craft & Real Customer Glimpses */}
        <PalaceHeritage onOpenReservation={(dishName) => handleOpenReservation(dishName)} />

        {/* 4. Imperial Reservation & Banquet Desk */}
        <ReservationSection />
      </main>

      {/* Royal Footer */}
      <Footer onOpenReservation={() => handleOpenReservation()} />

      {/* Modals */}
      <DishModal
        item={selectedDishModal}
        onClose={() => setSelectedDishModal(null)}
        onBookTableForDish={(dishName) => handleOpenReservation(dishName)}
      />

      <ReservationModal
        isOpen={isReservationOpen}
        onClose={handleCloseReservation}
        preselectedDish={preselectedDishForBooking}
      />

      {/* Easy Order Modal with 1-Click WhatsApp, Dine-in Table, Takeaway & Delivery */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* Desktop-Only Floating Reserve Button (Hidden on Mobile) */}
      <button
        type="button"
        className="btn-gold floating-reserve-cta desktop-only-cta"
        onClick={() => handleOpenReservation()}
        aria-label="Book a table quickly"
      >
        <Calendar size={18} />
        <span>Book Table</span>
      </button>

      {/* Shahi Khansama AI Concierge (Powered by Qwen on Groq) */}
      <ShahiKhansamaAI
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        initialQuery={aiInitialQuery}
        onClearInitialQuery={() => setAiInitialQuery("")}
        onOpenReservation={() => handleOpenReservation()}
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        hasCartItems={totalCartItems > 0}
      />

      {/* Dedicated Mobile Bottom App Bar with Live Order Counter & Price */}
      <MobileBottomBar
        orderCount={totalCartItems}
        orderTotal={totalCartPrice}
        onOpenOrder={() => setIsOrderModalOpen(true)}
        onOpenReservation={() => handleOpenReservation()}
      />
    </div>
  );
};

export default App;
