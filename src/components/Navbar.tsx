import React, { useState, useEffect } from "react";
import { Menu, X, Crown, MapPin, Clock, Phone, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { royalConfig } from "../config";
import { openDeviceMap } from "../utils/mapUtils";
import "./Navbar.css";

interface NavbarProps {
  onOpenOrderModal: () => void;
  cartCount: number;
  activePage: "home" | "menu";
  onNavigate: (page: "home" | "menu", anchorId?: string) => void;
  onOpenAI?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
  cartCount = 0,
  activePage,
  onNavigate,
  onOpenAI,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", page: "home" as const, anchor: "hero" },
    { label: "About", page: "home" as const, anchor: "story" },
    { label: "Menu", page: "menu" as const, anchor: undefined },
    { label: "Contact Us", page: "home" as const, anchor: "footer" },
  ];

  const handleLinkClick = (page: "home" | "menu", anchor?: string) => {
    setMobileOpen(false);
    onNavigate(page, anchor);
  };

  return (
    <>
      {/* Top Bar with Hours & Contact in Clean Light Style */}
      <div className="royal-topbar">
        <div className="container topbar-container">
          <div
            className="topbar-item address-item"
            onClick={openDeviceMap}
            style={{ cursor: "pointer" }}
            title="Open native map location"
          >
            <MapPin size={13} className="topbar-icon" />
            <span>{royalConfig.restaurant.address}</span>
          </div>

          <span className="dot-separator">•</span>

          <div className="topbar-item time-item">
            <Clock size={13} className="topbar-icon" />
            <span>Daily: 11:00 AM – 10:30 PM</span>
          </div>

          <span className="dot-separator">•</span>

          <div className="topbar-status-badge">
            <span className="live-status-dot"></span>
            <span>Open Now • Dine-in & Takeaway</span>
          </div>

          <span className="dot-separator">•</span>

          <a href={`tel:${royalConfig.restaurant.phone}`} className="topbar-item topbar-link">
            <Phone size={13} className="topbar-icon" />
            <span>{royalConfig.restaurant.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Clean Sticky White Navbar */}
      <header className={`royal-navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container nav-container">
          {/* Brand Logo matching KETO.GO clean feel */}
          <div
            className="royal-brand"
            onClick={() => handleLinkClick("home", "hero")}
            style={{ cursor: "pointer" }}
          >
            <div className="brand-logo-icon">
              <Crown size={20} className="crown-svg" />
            </div>
            <div className="brand-titles">
              <span className="brand-main">
                ROYAL<span className="brand-green">.RASOI</span>
              </span>
              <span className="brand-tagline">CULINARY CAFE • PATNA</span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav-menu">
            {navLinks.map((link) => {
              const isSelected =
                link.page === "menu" ? activePage === "menu" : activePage === "home" && link.label === "Home";
              return (
                <button
                  key={link.label}
                  type="button"
                  className={`nav-item-link ${isSelected ? "active" : ""}`}
                  onClick={() => handleLinkClick(link.page, link.anchor)}
                >
                  <span>{link.label}</span>
                  {isSelected && <span className="active-pill-dot"></span>}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="nav-actions-wrap">
            {/* Green Cart Icon Button matching reference screenshot */}
            <button
              type="button"
              className="nav-cart-btn"
              onClick={onOpenOrderModal}
              title="View Cart"
              aria-label="View Order Cart"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
            </button>

            {/* Check Menu / WhatsApp Action */}
            <button
              type="button"
              className="btn-green nav-cta-btn"
              onClick={() => handleLinkClick("menu")}
            >
              <span>Explore Menu</span>
            </button>

            {/* Rasoi AI Button */}
            {onOpenAI && (
              <button
                type="button"
                className="nav-ai-btn"
                onClick={onOpenAI}
                title="Ask Rasoi AI Concierge"
                aria-label="Open Rasoi AI Assistant"
              >
                <Sparkles size={16} />
                <span className="nav-ai-label">Rasoi AI</span>
              </button>
            )}

            {/* Mobile Toggle */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="mobile-links-list">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    className="mobile-link"
                    onClick={() => handleLinkClick(link.page, link.anchor)}
                  >
                    <span>{link.label}</span>
                  </button>
                ))}
                <div className="mobile-cta-box">
                  <button
                    type="button"
                    className="btn-green w-full"
                    onClick={() => {
                      setMobileOpen(false);
                      onOpenOrderModal?.();
                    }}
                  >
                    <ShoppingBag size={18} />
                    <span>View Order Cart ({cartCount})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
