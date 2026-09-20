import React from "react";
import { UtensilsCrossed, ShoppingBag, Calendar, Phone, MapPin } from "lucide-react";
import { royalConfig } from "../config";
import "./MobileBottomBar.css";

interface MobileBottomBarProps {
  orderCount: number;
  orderTotal: number;
  onOpenOrder: () => void;
  onOpenReservation: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  orderCount,
  orderTotal,
  onOpenOrder,
  onOpenReservation,
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

        {/* 2. Order Cart (with badge & price) */}
        <button
          type="button"
          className={`bottom-nav-btn ${orderCount > 0 ? "has-feast" : ""}`}
          onClick={onOpenOrder}
          aria-label={`View Order with ${orderCount} items`}
        >
          <div className="icon-wrapper feast-icon-wrapper">
            <ShoppingBag size={20} />
            {orderCount > 0 && <span className="feast-badge-counter">{orderCount}</span>}
          </div>
          <span className="btn-label font-cinzel">
            {orderCount > 0 ? `₹${orderTotal}` : "Order"}
          </span>
        </button>

        {/* 3. Book Table (Center Highlighted CTA) */}
        <button
          type="button"
          className="bottom-nav-btn center-cta-btn"
          onClick={onOpenReservation}
          aria-label="Reserve a Royal Table"
        >
          <div className="center-cta-circle">
            <Calendar size={22} />
          </div>
          <span className="btn-label font-cinzel">Book Table</span>
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
