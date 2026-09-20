import React from "react";
import { UtensilsCrossed, ShoppingBag, MessageSquare, Phone, MapPin } from "lucide-react";
import { royalConfig } from "../config";
import "./MobileBottomBar.css";

interface MobileBottomBarProps {
  orderCount: number;
  orderTotal: number;
  onOpenOrder: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  orderCount,
  orderTotal,
  onOpenOrder,
}) => {
  const handleScrollToMenu = () => {
    const el = document.getElementById("menu");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenMaps = () => {
    window.open(
      "https://maps.google.com/?q=Royal+Rasoi+City+Court+Sadikpur+Patna",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <nav className="mobile-bottom-appbar" aria-label="Mobile Navigation">
      <div className="bottom-bar-items">
        {/* 1. Menu */}
        <button
          type="button"
          className="bottom-nav-btn"
          onClick={handleScrollToMenu}
          aria-label="View Royal Menu"
        >
          <div className="icon-wrapper">
            <UtensilsCrossed size={20} />
          </div>
          <span className="btn-label font-cinzel">Menu</span>
        </button>

        {/* 2. WhatsApp Order / Chat */}
        <a
          href={`https://wa.me/919905604856?text=${encodeURIComponent("Hi Royal Rasoi, I want to place an order / inquire about food.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bottom-nav-btn"
          aria-label="Order on WhatsApp"
        >
          <div className="icon-wrapper">
            <MessageSquare size={20} />
          </div>
          <span className="btn-label font-cinzel">WhatsApp</span>
        </a>

        {/* 3. Order Cart (Center Highlighted CTA) */}
        <button
          type="button"
          className="bottom-nav-btn center-cta-btn"
          onClick={onOpenOrder}
          aria-label={`View Order with ${orderCount} items`}
        >
          <div className="center-cta-circle">
            <ShoppingBag size={22} />
            {orderCount > 0 && <span className="feast-badge-counter">{orderCount}</span>}
          </div>
          <span className="btn-label font-cinzel">
            {orderCount > 0 ? `₹${orderTotal}` : "Order"}
          </span>
        </button>

        {/* 4. Direct Call */}
        <a
          href={`tel:${royalConfig.restaurant.phone}`}
          className="bottom-nav-btn"
          aria-label={`Call Royal Rasoi at ${royalConfig.restaurant.phone}`}
        >
          <div className="icon-wrapper">
            <Phone size={20} />
          </div>
          <span className="btn-label font-cinzel">Call Desk</span>
        </a>

        {/* 5. Google Maps Directions */}
        <button
          type="button"
          className="bottom-nav-btn"
          onClick={handleOpenMaps}
          aria-label="Open Google Maps Directions to Royal Rasoi Sadikpur"
        >
          <div className="icon-wrapper">
            <MapPin size={20} />
          </div>
          <span className="btn-label font-cinzel">Location</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomBar;
