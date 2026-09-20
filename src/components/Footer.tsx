import React from "react";
import { Crown, Sparkles, MapPin, Phone, Clock, Heart, MessageSquare } from "lucide-react";
import { royalConfig } from "../config";
import "./Footer.css";

interface FooterProps {
  onOpenOrderModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrderModal }) => {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
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
    <footer className="royal-footer" id="footer">
      <div className="container">
        {/* Top Call to Action Banner */}
        <div className="footer-cta-banner">
          <div className="cta-left">
            <span className="cta-subtitle font-cinzel">CRAVING DELICIOUS FOOD?</span>
            <h3 className="cta-title font-cinzel">Taste Authentic North Indian & Mughlai Delicacies</h3>
            <p className="cta-desc font-serif">
              Visit our cozy cafe in Sadikpur, Patna or order piping hot food directly on WhatsApp for takeaway & home delivery.
            </p>
          </div>
          <div className="cta-right">
            {onOpenOrderModal && (
              <button
                type="button"
                className="btn-outline-gold"
                onClick={onOpenOrderModal}
              >
                <span>View Cart & Order</span>
              </button>
            )}
            <a
              href={`https://wa.me/919905604856?text=${encodeURIComponent("Hi Royal Rasoi, I want to place an order.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold footer-book-btn"
            >
              <MessageSquare size={16} />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Footer Main Columns */}
        <div className="footer-main-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="footer-crown">
                <Crown size={26} />
              </div>
              <div>
                <span className="footer-brand-name font-cinzel">{royalConfig.restaurant.name}</span>
                <span className="footer-brand-tagline">CULINARY CAFE • EST. {royalConfig.restaurant.establishedYear}</span>
              </div>
            </div>

            <p className="footer-brand-desc font-serif">
              Serving delicious North Indian curries, slow-simmered handis, tandoori kebabs, and hosting cozy celebrations (10–12 guests) in Sadikpur, Patna.
            </p>

            <div className="footer-rating-pill">
              <Sparkles size={15} />
              <span>Rated {royalConfig.restaurant.rating}/5.0 • {royalConfig.restaurant.totalReviews} ({royalConfig.restaurant.guestsServed})</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading font-cinzel">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#hero" onClick={(e) => handleSmoothScroll(e, "#hero")}>Home</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Delicacies Menu</a></li>
              <li><a href="#heritage" onClick={(e) => handleSmoothScroll(e, "#heritage")}>Cozy Celebrations</a></li>
              <li>
                <a
                  href={`https://wa.me/919905604856?text=${encodeURIComponent("Hi Royal Rasoi, I want to place an order.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Order on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Popular Delicacies */}
          <div className="footer-links-col">
            <h4 className="footer-heading font-cinzel">Popular Delicacies</h4>
            <ul className="footer-links">
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Awadhi Dum Biryani</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Tandoori Chicken & Kebabs</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Dal Royal Rasoi</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Mughlai Shahi Paneer</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Butter Chicken & Naan</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Shahi Tukda & Desserts</a></li>
            </ul>
          </div>

          {/* Timings & Visit */}
          <div className="footer-contact-col">
            <h4 className="footer-heading font-cinzel">Visit & Hours</h4>
            <div className="footer-contact-items">
              <p className="contact-p">
                <MapPin size={16} />
                <span>{royalConfig.restaurant.address}</span>
              </p>
              <p className="contact-p">
                <Phone size={16} />
                <span>{royalConfig.restaurant.phone}</span>
              </p>
              <p className="contact-p">
                <Clock size={16} />
                <span>Lunch: {royalConfig.restaurant.hours.lunch}<br />Dinner: {royalConfig.restaurant.hours.dinner}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text">
            © {new Date().getFullYear()} {royalConfig.restaurant.name}. All Rights Reserved.
          </p>
          <p className="madewith-text font-serif">
            Crafted with passion & <Heart size={13} className="heart-icon" /> for the love of great food in Patna.
          </p>
        </div>
      </div>
    </footer>
  );
};
