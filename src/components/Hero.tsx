import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import "./Hero.css";

interface HeroProps {
  onExploreMenu: () => void;
}

interface HeroDish {
  id: number;
  title: string;
  hindiTitle: string;
  tag: string;
  price: string;
  image: string;
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu }) => {
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  const heroDishes: HeroDish[] = [
    {
      id: 0,
      title: "Murgh Musallam",
      hindiTitle: "मुर्ग मुसल्लम",
      tag: "IMPERIAL SPECIAL",
      price: "₹599",
      image: "/data/dishes/royal-murgh-musallam.jpg",
    },
    {
      id: 1,
      title: "Royal Spl. Biryani",
      hindiTitle: "रॉयल स्पेशल बिरयानी",
      tag: "SIGNATURE DUM PUKHT",
      price: "₹399",
      image: "/data/dishes/royal-handi-biryani.jpg",
    },
    {
      id: 2,
      title: "Tandoori Chicken Platter",
      hindiTitle: "तंदूरी चिकन प्लैटर",
      tag: "CLAY TANDOOR SPECIAL",
      price: "₹380",
      image: "/data/dishes/royal-tandoori-platter.jpg",
    },
    {
      id: 3,
      title: "Paneer Tikka",
      hindiTitle: "पनीर टिक्का",
      tag: "CLAY TANDOOR SPECIAL",
      price: "₹225",
      image: "/data/dishes/plate-paneer-tikka.png",
    },
  ];

  const currentDish = heroDishes[activeDishIndex];

  return (
    <section id="hero" className="clean-hero-section">
      <div className="container hero-clean-grid">
        {/* Left Column: Big Bold Typography matching Screenshot 1 */}
        <div className="hero-clean-text-col">
          {/* Top Pill Badge */}
          <div className="hero-kicker-badge">
            <Sparkles size={14} className="kicker-icon" />
            <span>ESTD. 2018 • SADIKPUR, PATNA</span>
          </div>

          {/* Main Huge Clean Title matching EAT HEALTHY BE HEALTHY */}
          <h1 className="hero-clean-title">
            <span className="hero-accent-green">ROYAL</span>
            <br />
            FLAVORS
            <br />
            BE ROYAL
          </h1>

          <p className="hero-clean-description">
            Everything you need to savor authentic slow-cooked Awadhi handi curries, fresh charcoal tandoori kebabs, and cozy family celebrations in Patna.
          </p>

          {/* Clean Green Pill Button matching Screenshot 1 */}
          <div className="hero-cta-row">
            <button
              type="button"
              className="btn-green hero-pill-btn"
              onClick={onExploreMenu}
            >
              <span>Check Menu</span>
              <ArrowRight size={18} className="btn-arrow-icon" />
            </button>
          </div>

          {/* Clean Metric Chips */}
          <div className="hero-trust-row">
            <div className="trust-pill">
              <Star size={15} fill="#f59e0b" color="#f59e0b" />
              <span className="trust-rating">4.7</span>
              <span className="trust-label">(520+ Reviews)</span>
            </div>
            <span className="trust-divider">|</span>
            <div className="trust-pill">
              <span className="trust-green-num">220+</span>
              <span className="trust-label">Authentic Dishes</span>
            </div>
            <span className="trust-divider">|</span>
            <div className="trust-pill">
              <span className="trust-label">Avg ₹500 for two</span>
            </div>
          </div>
        </div>

        {/* Right Column: Large Gourmet Plate with Floating Herb Leaves */}
        <div className="hero-clean-image-col">
          <div className="hero-plate-stage">
            {/* Floating Herb Leaves matching the visual reference */}
            <div className="floating-leaf leaf-top-right float-leaf-1">
              <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
                <path
                  d="M15 85 C 10 50, 45 15, 85 15 C 85 55, 50 90, 15 85 Z"
                  fill="#22c55e"
                  opacity="0.85"
                />
                <path d="M15 85 Q 50 50 85 15" stroke="#16a34a" strokeWidth="3" />
                <path d="M40 60 Q 55 50 65 52" stroke="#16a34a" strokeWidth="2" />
                <path d="M55 45 Q 65 35 75 36" stroke="#16a34a" strokeWidth="2" />
              </svg>
            </div>

            <div className="floating-leaf leaf-bottom-left float-leaf-2">
              <svg width="56" height="56" viewBox="0 0 100 100" fill="none">
                <path
                  d="M20 80 C 15 45, 50 10, 90 10 C 90 50, 55 85, 20 80 Z"
                  fill="#16a34a"
                  opacity="0.8"
                />
                <path d="M20 80 Q 55 45 90 10" stroke="#15803d" strokeWidth="3" />
                <path d="M45 55 Q 60 45 70 47" stroke="#15803d" strokeWidth="2" />
              </svg>
            </div>

            {/* Main Gourmet Plate with Smooth Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDish.id}
                className="plate-display-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <img
                  src={currentDish.image}
                  alt={currentDish.title}
                  className="hero-main-plate-img"
                  decoding="async"
                />

                {/* Price Pill Tag */}
                <div className="hero-dish-badge">
                  <span className="badge-tag-text">{currentDish.tag}</span>
                  <span className="badge-price-text">{currentDish.price}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Quick Dish Switcher Dots matching clean minimalist UI */}
            <div className="hero-plate-selector">
              {heroDishes.map((dish, idx) => (
                <button
                  key={dish.id}
                  type="button"
                  className={`plate-dot-btn ${idx === activeDishIndex ? "active" : ""}`}
                  onClick={() => setActiveDishIndex(idx)}
                  aria-label={`Show ${dish.title}`}
                  title={dish.title}
                >
                  <img src={dish.image} alt={dish.title} className="dot-thumb-img" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
