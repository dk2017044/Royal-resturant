import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Star, MapPin, ArrowRight, MessageSquare, Phone, Utensils } from "lucide-react";
import { royalConfig } from "../config";
import { openDeviceMap } from "../utils/mapUtils";
import "./Hero.css";

interface HeroProps {
  onOpenOrderModal?: () => void;
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

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal: _onOpenOrderModal }) => {
  const [activeDishIndex, setActiveDishIndex] = useState(0);

  // 5 Signature Delicacies on White Ceramic Plates with Transparent Backgrounds
  const heroDishes: HeroDish[] = [
    {
      id: 0,
      title: "Murgh Musallam",
      hindiTitle: "मुर्ग मुसल्लम",
      tag: "IMPERIAL SPECIAL",
      price: "₹599",
      image: "/data/dishes/plate-roast-chicken.png",
      description: "Whole tender chicken slow-roasted in authentic royal spices, served piping hot with rich savory gravy.",
    },
    {
      id: 1,
      title: "Royal Spl. Biryani",
      hindiTitle: "रॉयल स्पेशल बिरयानी",
      tag: "SIGNATURE DUM PUKHT",
      price: "₹399",
      image: "/data/dishes/plate-biryani.png",
      description: "Aged long-grain basmati simmered over charcoal embers with royal saffron, pure desi ghee, and tender succulent meat.",
    },
    {
      id: 2,
      title: "Chicken Seekh Kebab",
      hindiTitle: "चिकन सीख कबाब",
      tag: "TANDOOR SPECIAL",
      price: "₹250",
      image: "/data/dishes/plate-kebabs.png",
      description: "Minced royal chicken blended with authentic aromatics, skewered and charcoal-grilled to melt-in-mouth perfection.",
    },
    {
      id: 3,
      title: "Dal Royal Rasoi",
      hindiTitle: "दाल रॉयल रसोई",
      tag: "SLOW-SIMMERED SPECIAL",
      price: "₹219",
      image: "/data/dishes/plate-dal-makhani.png",
      description: "Slow-simmered black lentils churned with rich golden butter, fresh dairy cream, and hand-ground royal spices.",
    },
    {
      id: 4,
      title: "Paneer Tikka",
      hindiTitle: "पनीर टिक्का",
      tag: "CLAY TANDOOR SPECIAL",
      price: "₹225",
      image: "/data/dishes/plate-paneer-tikka.png",
      description: "Fresh cottage cheese cubes marinated in hung curd and hand-pounded spices, charred crisp over glowing coal embers.",
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
            <span className="title-royal">The Royal</span> <span className="glow-text">Rasoi</span>
          </h1>

          <p className="hero-headline-sub font-serif">
            Authentic Flavors • North Indian, Tandoori & Chinese Delights
          </p>

          <p className="hero-paragraph font-serif">
            Welcome to The Royal Rasoi at City Court, Sadikpur, Patna. Enjoy mouth-watering handi curries, fresh charcoal tandoori kebabs, and cozy celebration vibes for birthdays & anniversaries (10–12 guests).
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

            <motion.a
              href={`https://wa.me/919905604856?text=${encodeURIComponent("Hi Royal Rasoi, I want to place an order / inquire about celebration.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-royal-glass"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare size={18} />
              <span>Order on WhatsApp</span>
            </motion.a>
          </div>

          {/* Quick Location & Direct Call */}
          <div className="hero-quick-meta">
            <div
              className="meta-item"
              onClick={openDeviceMap}
              style={{ cursor: "pointer" }}
              title="Open native map directions"
            >
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
                  <div className="plate-rotating-body">
                    <img
                      src={currentDish.image}
                      alt={currentDish.title}
                      className="white-plate-image"
                      decoding="async"
                    />
                  </div>

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
