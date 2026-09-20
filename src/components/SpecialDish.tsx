import React from "react";
import { motion } from "motion/react";
import { Sparkles, Calendar, Utensils } from "lucide-react";
import "./SpecialDish.css";

interface SpecialDishProps {
  onOpenReservation: () => void;
}

export const SpecialDish: React.FC<SpecialDishProps> = ({ onOpenReservation }) => {
  return (
    <section id="special-dish" className="special-dish-section section-wrapper">
      <div className="container">
        <div className="special-dish-card glass-panel">
          {/* Left: Real Photo Banner with Motion */}
          <motion.div
            className="special-banner-col"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="special-img-container">
              <img
                src="/data/reviews/review-image-2.jpg"
                alt="Awadhi Dum Biryani - The Royal Rasoi Signature Dish"
                className="special-dish-img"
                loading="lazy"
              />
              <div className="special-price-badge">
                <span className="price-label">SIGNATURE PRICE</span>
                <span className="price-amount font-cinzel">₹220</span>
                <span className="price-serves">Serves 1–2 Persons</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Dish Story & CTAs */}
          <motion.div
            className="special-details-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="royal-pill-badge">
              <Sparkles size={14} />
              <span>CHEF'S SIGNATURE MASTERPIECE</span>
            </div>

            <h2 className="special-dish-title font-cinzel">
              Awadhi Dum <span className="glow-text">Biryani</span>
            </h2>
            <span className="special-dish-hindi font-serif">अवधी दम बिरयानी • शाही दस्तरख़्वान</span>

            <p className="special-dish-desc font-serif">
              Slow-cooked in dough-sealed earthen handis over gentle charcoal embers for hours. Layered with aged long-grain basmati, saffron-infused warm milk, pure bilona churned ghee, and secret aromatic potli spices that melt effortlessly on the tongue.
            </p>

            {/* Key Highlights */}
            <div className="special-highlights-row">
              <div className="highlight-pill">
                <span className="dot"></span>
                <span>Authentic Dum Pukht</span>
              </div>
              <div className="highlight-pill">
                <span className="dot"></span>
                <span>Pure Desi Ghee</span>
              </div>
              <div className="highlight-pill">
                <span className="dot"></span>
                <span>Kashmiri Saffron</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="special-actions-row">
              <button
                type="button"
                className="btn-royal-primary"
                onClick={onOpenReservation}
              >
                <Calendar size={18} />
                <span>Book This Dish & Table</span>
              </button>

              <a href="#menu" className="btn-royal-glass">
                <Utensils size={18} />
                <span>Explore Full Menu</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default SpecialDish;
