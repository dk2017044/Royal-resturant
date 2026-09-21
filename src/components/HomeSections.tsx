import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Utensils, HeartHandshake, ShieldCheck, Flame, Star } from "lucide-react";
import "./HomeSections.css";

interface HomeSectionsProps {
  onExploreMenu: () => void;
  onOpenOrderModal?: () => void;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({ onExploreMenu, onOpenOrderModal }) => {
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  const testimonials: Testimonial[] = [
      {
        id: 1,
        name: "Jeeny Aesa",
        role: "Happy Customer • Verified Patron",
        quote: "The food here is simply exceptional! Fresh ingredients, authentic aroma, and slow-simmered handi curries that remind you of royalty. The cozy ambiance and fast delivery make Royal Rasoi my top choice in Patna.",
        rating: 5,
        image: "/data/reviews/happy-customer.jpg",
      },
    {
      id: 2,
      name: "Md Saquib",
      role: "Happy Diner • Verified Patron",
      quote: "Best family restaurant in Patna City. Handi chicken was mind blowing, tender and aromatic. The tandoori naan straight from the clay oven is unmatchable!",
      rating: 5,
      image: "/data/reviews/review-image-3.jpg",
    },
    {
      id: 3,
      name: "Priya Kumari",
      role: "Happy Diner • Weekend Foodie",
      quote: "Royal Rasoi is our favorite dining place in Sadikpur. The tandoori kebabs melt in your mouth and the team prepares every single dish fresh on order.",
      rating: 5,
      image: "/data/reviews/review-image-1.jpg",
    },
  ];

  const currentReview = testimonials[activeReviewIdx];

  const handlePrev = () => {
    setActiveReviewIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveReviewIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="home-extra-sections" id="story">
      {/* 1. WE SERVE AUTHENTIC & FRESH FOOD SECTION (matching Screenshot 2 top) */}
      <section className="food-story-section">
        <div className="container story-grid-layout">
          {/* Left: Big Gourmet Plate with Garnishes */}
          <motion.div
            className="story-img-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="story-plate-wrapper">
              <div className="story-plate-circle">
                <img
                  src="/data/dishes/royal-handi-biryani.jpg"
                  alt="Authentic Charcoal Dum Biryani at The Royal Rasoi"
                  className="story-main-dish-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="story-garnishes-badge">
                <Flame size={16} className="flame-icon" />
                <span>Cooked Over Charcoal Embers</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Narrative & Explore Story Button */}
          <motion.div
            className="story-text-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="story-main-heading">
              We Serve Authentic & Fresh Food.
            </h2>
            <p className="story-description">
              At <strong>The Royal Rasoi</strong>, we preserve the authentic Awadhi method of slow cooking. Every earthen handi is prepared with aged long-grain basmati, royal saffron, and sil-batta hand-ground potli spices.
            </p>
            <p className="story-sub-description">
              Procured fresh every morning with strict hygiene standards, zero synthetic additives, and 100% pure desi ghee churned to golden perfection.
            </p>

            <div className="story-cta-row">
              <button
                type="button"
                className="btn-green story-pill-btn"
                onClick={onExploreMenu}
              >
                <span>Explore Story & Menu</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. GET YOUR FOOD IN 30 MINUTES (3 Process Cards matching Screenshot 2 middle) */}
      <section className="process-steps-section">
        <div className="container">
          <motion.div
            className="process-header text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h2 className="process-title">Get Your Food in 30 minutes</h2>
            <p className="process-subtitle">
              Piping hot delicacies prepared fresh on order for Dine-in, Takeaway, and Home Delivery.
            </p>
          </motion.div>

          <div className="process-cards-grid">
            {/* Step 1: Order Your Food (Yellow/Amber Icon Badge) */}
            <motion.div
              className="process-card clean-white-card"
              onClick={onOpenOrderModal}
              role={onOpenOrderModal ? "button" : undefined}
              tabIndex={onOpenOrderModal ? 0 : undefined}
              style={{ cursor: onOpenOrderModal ? "pointer" : "default" }}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <div className="process-icon-box box-amber">
                <Utensils size={28} />
              </div>
              <h3 className="process-card-title">Order Your Food</h3>
              <p className="process-card-desc">
                Browse our 220+ North Indian, Tandoori & Chinese delicacies and place your order online, on call, or via 1-tap WhatsApp.
              </p>
            </motion.div>

            {/* Step 2: Fresh Preparation (Coral/Red Icon Badge) */}
            <motion.div
              className="process-card clean-white-card"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
            >
              <div className="process-icon-box box-coral">
                <ShieldCheck size={28} />
              </div>
              <h3 className="process-card-title">Fresh Preparation</h3>
              <p className="process-card-desc">
                Hand-kneaded whole-wheat breads slapped fresh on the clay tandoor and slow-simmered handis prepared with strict hygiene.
              </p>
            </motion.div>

            {/* Step 3: Enjoy Your Food (Green Icon Badge) */}
            <motion.div
              className="process-card clean-white-card"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: 0.34, ease: "easeOut" }}
            >
              <div className="process-icon-box box-green">
                <HeartHandshake size={28} />
              </div>
              <h3 className="process-card-title">Enjoy Your Food</h3>
              <p className="process-card-desc">
                Savor piping hot royal flavors with friends & family in our cozy air-conditioned Sadikpur cafe or delivered to your door.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. TESTIMONIAL / HAPPY CUSTOMERS SECTION (matching Screenshot 2 bottom) */}
      <section className="testimonial-section">
        <div className="container testimonial-layout">
          {/* Left: Review Text & Controls */}
          <div className="testimonial-content-col">
            <div className="quote-mark-icon">
              <svg width="60" height="50" viewBox="0 0 75 60" fill="none">
                <path
                  d="M0 35 C0 15, 12 0, 32 0 L32 15 C20 15, 15 22, 15 30 L32 30 L32 60 L0 60 Z M42 35 C42 15, 54 0, 74 0 L74 15 C62 15, 57 22, 57 30 L74 30 L74 60 L42 60 Z"
                  fill="#bbf7d0"
                />
              </svg>
            </div>

            <p className="testimonial-quote">
              "{currentReview.quote}"
            </p>

            <div className="testimonial-author-box">
              <h4 className="author-name">{currentReview.name}</h4>
              <span className="author-role">{currentReview.role}</span>
              <div className="author-stars">
                {[...Array(currentReview.rating)].map((_, i) => (
                  <Star key={i} size={15} fill="#22c55e" color="#22c55e" />
                ))}
              </div>
            </div>

            {/* Prev / Next Navigation Controls matching Screenshot 2 */}
            <div className="testimonial-slider-controls">
              <button
                type="button"
                className="slider-arrow-btn"
                onClick={handlePrev}
                aria-label="Previous review"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="slider-arrow-btn"
                onClick={handleNext}
                aria-label="Next review"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Right: Circular Photo in Layered Soft Rings */}
          <div className="testimonial-avatar-col">
            <div className="avatar-multi-ring">
              <div className="avatar-outer-ring">
                <img
                  src={currentReview.image}
                  alt={currentReview.name}
                  className="avatar-circular-photo"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSections;
