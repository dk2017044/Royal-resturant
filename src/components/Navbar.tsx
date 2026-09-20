import React, { useState, useEffect } from "react";
import { Menu, X, Crown, MapPin, Clock, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { royalConfig } from "../config";
import "./Navbar.css";

interface NavbarProps {
  onOpenOrderModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrderModal: _onOpenOrderModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "Menu & Food", href: "#menu" },
    { label: "Cozy Celebrations", href: "#heritage" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <>
      {/* Top Bar with Real Contact & Hours */}
      <div className="royal-topbar">
        <div className="container topbar-container">
          <div className="topbar-item address-item">
            <MapPin size={14} className="topbar-icon" />
            <span>{royalConfig.restaurant.address}</span>
          </div>

          <span className="diamond-separator"></span>

          <div className="topbar-item time-item">
            <Clock size={14} className="topbar-icon" />
            <span>Daily : 11:00 AM – 10:30 PM</span>
          </div>

          <span className="diamond-separator"></span>

          <div className="topbar-status-badge">
            <span className="live-status-dot"></span>
            <span>Open Now • Dine-in & Takeaway</span>
          </div>

          <span className="diamond-separator"></span>

          <a href={`tel:${royalConfig.restaurant.phone}`} className="topbar-item topbar-link">
            <Phone size={14} className="topbar-icon" />
            <span>{royalConfig.restaurant.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Sticky Glass Navbar */}
      <header className={`royal-navbar ${isScrolled ? "scrolled" : ""}`}>
        <div className="container nav-container">
          {/* Brand Logo with Crown */}
          <a href="#hero" className="royal-brand" onClick={(e) => handleNavClick(e, "#hero")}>
            <div className="crown-icon-wrap">
              <Crown size={22} className="crown-icon" />
            </div>
            <div className="brand-titles">
              <span className="brand-main font-cinzel">{royalConfig.restaurant.name}</span>
              <span className="brand-tagline">CULINARY CAFE • SADIKPUR, PATNA</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="desktop-nav-menu">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-item-link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="nav-actions-wrap">
            <motion.a
              href={`https://wa.me/919905604856?text=${encodeURIComponent("Hi Royal Rasoi, I want to place an order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
            >
              <MessageSquare size={16} />
              <span>Order on WhatsApp</span>
            </motion.a>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer with Motion */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="mobile-links-list">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="mobile-link"
                    onClick={(e) => {
                      setMobileOpen(false);
                      handleNavClick(e, link.href);
                    }}
                  >
                    <span>{link.label}</span>
                  </a>
                ))}
                <div className="mobile-cta-box">
                  <a
                    href="https://wa.me/919905604856?text=Hi%20Royal%20Rasoi,%20I%20would%20like%20to%20place%20an%20order"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-royal-primary w-full"
                    onClick={() => setMobileOpen(false)}
                  >
                    <MessageSquare size={16} />
                    <span>Order on WhatsApp</span>
                  </a>
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
