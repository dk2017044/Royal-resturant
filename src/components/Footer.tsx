import React from "react";
import { Crown, Sparkles, MapPin, Phone, Mail, Clock, Heart } from "lucide-react";
import { royalConfig } from "../config";
import "./Footer.css";

interface FooterProps {
  onOpenReservation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReservation }) => {
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
    <footer className="royal-footer">
      <div className="container">
        {/* Top Call to Action Banner */}
        <div className="footer-cta-banner">
          <div className="cta-left">
            <span className="cta-subtitle font-cinzel">ROYAL FEAST AWAITS</span>
            <h3 className="cta-title font-cinzel">Experience Imperial Awadhi Dining Tonight</h3>
            <p className="cta-desc font-serif">
              Reserve your private dining chamber or candlelit courtyard table for an unforgettable evening.
            </p>
          </div>
          <div className="cta-right">
            <button
              type="button"
              className="btn-gold footer-book-btn"
              onClick={onOpenReservation}
            >
              <Crown size={16} />
              <span>Reserve a Table</span>
            </button>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              <div className="footer-crown">
                <Crown size={26} />
              </div>
              <div>
                <span className="footer-brand-name font-cinzel">{royalConfig.restaurant.name}</span>
                <span className="footer-brand-tagline">ROYAL FINE DINING • EST. {royalConfig.restaurant.establishedYear}</span>
              </div>
            </div>

            <p className="footer-brand-desc font-serif">
              Reviving the legendary culinary courts of Awadh, Lucknow, and Mughlai royalty through authentic Dum Pukht slow-cooking and pure heirloom spices.
            </p>

            <div className="footer-rating-pill">
              <Sparkles size={15} />
              <span>Rated {royalConfig.restaurant.rating}/5.0 • {royalConfig.restaurant.totalReviews} ({royalConfig.restaurant.guestsServed})</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading font-cinzel">The Palace</h4>
            <ul className="footer-links">
              <li><a href="#hero" onClick={(e) => handleSmoothScroll(e, "#hero")}>Home & Welcome</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Imperial Menu & Feast</a></li>
              <li><a href="#heritage" onClick={(e) => handleSmoothScroll(e, "#heritage")}>The Royal Heritage</a></li>
              <li><a href="#reservation-section" onClick={(e) => handleSmoothScroll(e, "#reservation-section")}>Table Reservation</a></li>
            </ul>
          </div>

          {/* Culinary Specialties */}
          <div className="footer-links-col">
            <h4 className="footer-heading font-cinzel">Royal Specialties</h4>
            <ul className="footer-links">
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Awadhi Dum Biryani</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Galouti & Kakori Kebabs</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>18-Hour Dal Royal Rasoi</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Mughlai Shahi Paneer</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Slow-Simmered Nalli Nihari</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Zauq-e-Shahi Tukda</a></li>
              <li><a href="#menu" onClick={(e) => handleSmoothScroll(e, "#menu")}>Saffron Badam Thandai</a></li>
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
                <Mail size={16} />
                <span>{royalConfig.restaurant.email}</span>
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
            © {new Date().getFullYear()} {royalConfig.restaurant.name}. All Royal Rights Reserved.
          </p>
          <p className="madewith-text font-serif">
            Crafted with passion & <Heart size={13} className="heart-icon" /> for the love of regal Indian gastronomy.
          </p>
        </div>
      </div>
    </footer>
  );
};
