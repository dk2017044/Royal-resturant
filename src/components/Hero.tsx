import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Star, MapPin, ArrowRight, Calendar, Phone, Utensils } from "lucide-react";
import { royalConfig } from "../config";
import "./Hero.css";

interface HeroProps {
  onOpenReservation: () => void;
}

interface HeroDish {
  id: number;
  title: string;
  hindiTitle: string;
  tag: string;
  price: string;
  image: string;
  description: string;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReservation }) => {
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  // 5 Signature Delicacies on White Ceramic Plates with Transparent Backgrounds
  const heroDishes: HeroDish[] = [
    {
      id: 0,
      title: "Royal Murgh Musallam",
      hindiTitle: "शाही मुर्ग मुसल्लम",
      tag: "IMPERIAL WHOLE ROAST",
      price: "₹380",
      image: "/data/dishes/plate-roast-chicken.png",
      description: "Whole tender chicken slow-roasted to golden crispness in 160 royal potli herbs, served with roasted baby potatoes & fresh rosemary.",
    },
    {
      id: 1,
      title: "Awadhi Shahi Dum Biryani",
      hindiTitle: "अवधी शाही दम बिरयानी",
      tag: "SIGNATURE DUM PUKHT",
      price: "₹220",
      image: "/data/dishes/plate-biryani.png",
      description: "Aged long-grain basmati simmered over charcoal embers with saffron, pure desi ghee, tender succulent meat, and boiled farm egg.",
    },
    {
      id: 2,
      title: "Angare Tandoori Kebab Platter",
      hindiTitle: "अंगारे तंदूरी कबाब थाल",
      tag: "CHARCOAL EMBERS SPECIAL",
      price: "₹280",
      image: "/data/dishes/plate-kebabs.png",
      description: "Succulent charcoal-grilled seekh kebabs and chicken tikka with spiced onion rings, lemon wedges, and fresh mint-coriander dip.",
    },
    {
      id: 3,
      title: "Dal Royal Rasoi & Naan",
      hindiTitle: "दाल रॉयल रसोई व मक्खन नान",
      tag: "18-HR HEIRLOOM SLOW-COOK",
      price: "₹170",
      image: "/data/dishes/plate-dal-makhani.png",
      description: "Overnight slow-cooked black urad lentils infused with smoked white butter, fresh cream swirl, and hot tandoori garlic naan.",
    },
    {
      id: 4,
      title: "Charred Paneer Tikka",
      hindiTitle: "अंगारे पनीर टिक्का",
      tag: "CLAY TANDOOR SPECIAL",
      price: "₹190",
      image: "/data/dishes/plate-paneer-tikka.png",
      description: "Fresh cottage cheese cubes marinated in hung curd, yellow mustard, and Kashmiri deghi mirch, blistered crisp over live embers.",
    },
  ];

  // Auto-advance active dish every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDishIndex((prev) => (prev + 1) % heroDishes.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroDishes.length]);

  const currentDish = heroDishes[activeDishIndex];

  return (
    <section id="hero" className="royal-hero-section">
      {/* Dynamic Background Glows */}
      <div className="hero-ambient-glow glow-1"></div>
      <div className="hero-ambient-glow glow-2"></div>

      <div className="container hero-layout-grid">
        {/* Left Column: Brand Story & CTAs */}
        <motion.div
          className="hero-text-col"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Royal Pill Badge */}
          <div className="royal-pill-badge hero-pill">
            <Sparkles size={14} />
            <span>ESTD. 2018 • SADIKPUR, PATNA</span>
          </div>

          {/* Grand Main Headline */}
          <h1 className="hero-main-title font-cinzel">
            The Royal <span className="glow-text">Rasoi</span>
          </h1>

          <p className="hero-headline-sub font-serif">
            Flavors Crafted for Royalty • Authentic North Indian & Chinese Fine Dining
          </p>

          <p className="hero-paragraph font-serif">
            Immerse yourself in authentic royal court flavors in Sadikpur, Patna. Every dish is slow-cooked over gentle embers using pure bilona ghee and secret heirloom spices.
          </p>

          {/* Real Metrics Bar */}
          <div className="hero-metrics-bar">
            <div className="metric-chip">
              <div className="metric-stars">
                <Star size={16} fill="#d4af37" color="#d4af37" />
                <span className="metric-val">4.7</span>
              </div>
              <span className="metric-label">112+ Google Reviews</span>
            </div>

            <div className="metric-divider"></div>

            <div className="metric-chip">
              <span className="metric-val gold-text">220+</span>
              <span className="metric-label">Authentic Dishes</span>
            </div>

            <div className="metric-divider"></div>

            <div className="metric-chip">
              <span className="metric-val">₹500</span>
              <span className="metric-label">Avg for Two</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="hero-action-buttons">
            <motion.a
              href="#menu"
              className="btn-royal-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Utensils size={18} />
              <span>Explore 220+ Dishes</span>
              <ArrowRight size={16} />
            </motion.a>

            <motion.button
              type="button"
              className="btn-royal-glass"
              onClick={onOpenReservation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar size={18} />
              <span>Reserve Table</span>
            </motion.button>
          </div>

          {/* Quick Location & Direct Call */}
          <div className="hero-quick-meta">
            <div className="meta-item">
              <MapPin size={14} className="meta-icon" />
              <span>City Court, Near Smart Point, Sadikpur</span>
            </div>
            <a href={`tel:${royalConfig.restaurant.phone}`} className="meta-item meta-call">
              <Phone size={14} className="meta-icon" />
              <span>Call: {royalConfig.restaurant.phone}</span>
            </a>
          </div>
        </motion.div>

        {/* Right Column: Interactive Spinning & Zooming White Plate Showcase */}
        <motion.div
          className="hero-showcase-col"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="showcase-card-container">
            {/* Spinning Plate Stage */}
            <div className="plate-showcase-stage">
              {/* Glowing Golden Ring & Shadow beneath the plate */}
              <div className="plate-under-glow"></div>
              <div className="plate-ambient-ring"></div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentDish.id}
                  className="spinning-plate-wrapper"
                  initial={{ scale: 0.4, rotate: -100, opacity: 0 }}
                  animate={{
                    scale: [0.4, 1.06, 1],
                    rotate: 0,
                    opacity: 1,
                  }}
                  exit={{ scale: 0.4, rotate: 100, opacity: 0 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {/* Continuous Smooth 360 Spin + Breathing Zoom In / Out Animation */}
                  <motion.div
                    className="plate-rotating-body"
                    animate={{
                      rotate: [0, 360],
                      scale: [0.95, 1.05, 0.95],
                    }}
                    transition={{
                      rotate: { duration: 26, repeat: Infinity, ease: "linear" },
                      scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                    whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                  >
                    <img
                      src={currentDish.image}
                      alt={currentDish.title}
                      className="white-plate-image"
                    />
                  </motion.div>

                  {/* Floating Price Pill */}
                  <div className="plate-price-pill font-cinzel">
                    <span>{currentDish.price}</span>
                  </div>

                  {/* Tag Badge */}
                  <div className="plate-tag-badge font-cinzel">
                    <span>{currentDish.tag}</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dish Info Panel */}
            <div className="plate-info-card glass-panel">
              <div className="dish-title-group">
                <h3 className="dish-showcase-title font-cinzel">{currentDish.title}</h3>
                <span className="dish-showcase-hindi font-serif">{currentDish.hindiTitle}</span>
              </div>
              <p className="dish-showcase-desc font-serif">{currentDish.description}</p>
            </div>

            {/* Dish Thumbnail Switcher Bar */}
            <div className="dish-thumbnail-selector">
              <span className="selector-label font-cinzel">Tap to Spin & View Delicacy:</span>
              <div className="thumbnails-row">
                {heroDishes.map((dish, idx) => (
                  <button
                    key={dish.id}
                    type="button"
                    className={`thumb-btn ${idx === activeDishIndex ? "active" : ""}`}
                    onClick={() => setActiveDishIndex(idx)}
                    aria-label={`Show ${dish.title}`}
                  >
                    <img src={dish.image} alt={dish.title} className="thumb-img" />
                    {idx === activeDishIndex && (
                      <motion.div
                        layoutId="activeThumbBorder"
                        className="thumb-active-ring"
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
