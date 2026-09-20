import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Flame,
  Award,
  Users,
  Star,
  Quote,
  CheckCircle2,
  Calendar,
  ChevronRight,
  ShieldCheck,
  HeartHandshake
} from "lucide-react";
import { royalConfig } from "../config";
import "./PalaceHeritage.css";

interface PalaceHeritageProps {
  onOpenReservation: (dishName?: string) => void;
}

type TabType = "craft" | "story" | "reviews";

interface ReviewItem {
  id: number;
  name: string;
  source: string;
  rating: number;
  date: string;
  comment: string;
  dishRecommended: string;
  image: string;
}

export const PalaceHeritage: React.FC<PalaceHeritageProps> = ({ onOpenReservation }) => {
  const [activeTab, setActiveTab] = useState<TabType>("craft");
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const authenticReviews: ReviewItem[] = [
    {
      id: 1,
      name: "Aniket Raj",
      source: "Google Local Guide",
      rating: 5,
      date: "Recent Visit",
      comment: "Food was too good. We tried chicken biryani and chicken chilly. It was delicious. The service was top notch and the ambience feels truly regal.",
      dishRecommended: "Chicken Biryani & Chilli Chicken",
      image: "/data/reviews/review-image-1.jpg",
    },
    {
      id: 2,
      name: "Md Saquib",
      source: "Verified Diner",
      rating: 5,
      date: "2 weeks ago",
      comment: "Best family restaurant in Patna City. Handi chicken was mind blowing, tender and aromatic. The royal decor makes every family gathering special.",
      dishRecommended: "Handi Chicken & Butter Naan",
      image: "/data/reviews/review-image-2.jpg",
    },
    {
      id: 3,
      name: "Priya Kumari",
      source: "Google Review",
      rating: 5,
      date: "1 month ago",
      comment: "Royal Rasoi is our favorite weekend dining place in Sadikpur. The tandoori kebabs melt in your mouth and the staff treats you like royalty.",
      dishRecommended: "Royal Tandoori Kebab Platter",
      image: "/data/reviews/review-image-3.jpg",
    },
    {
      id: 4,
      name: "Rahul Verma",
      source: "Patna Food Explorer",
      rating: 5,
      date: "Recent Event",
      comment: "Hosted our family celebration here. The banquet service was seamless, food served piping hot, and our guests couldn't stop praising the Dum Biryani.",
      dishRecommended: "Dum Biryani & Paneer Lababdar",
      image: "/data/reviews/review-image-6.jpg",
    },
    {
      id: 5,
      name: "Zoya Afreen",
      source: "Local Guide",
      rating: 4,
      date: "3 weeks ago",
      comment: "Authentic Awadhi touch right in Patna. Dal Royal Rasoi is cooked to perfection with pure makhan. Must visit for authentic North Indian lovers.",
      dishRecommended: "Dal Royal Rasoi",
      image: "/data/reviews/review-image-7.jpg",
    },
  ];

  const galleryPhotos = [
    { src: "/data/reviews/review-image-1.jpg", label: "Charcoal Tandoori Kebab Platter", category: "Appetizer" },
    { src: "/data/reviews/review-image-2.jpg", label: "Awadhi Dum Biryani Handi", category: "Signature" },
    { src: "/data/reviews/review-image-3.jpg", label: "Grand Royal Dining Ambience", category: "Ambience" },
    { src: "/data/reviews/review-image-6.jpg", label: "Dal Royal Rasoi & Garlic Naan", category: "Main Course" },
    { src: "/data/reviews/review-image-7.jpg", label: "Crispy Sizzling Chinese Starters", category: "Snacks" },
    { src: "/data/reviews/review-image-8.jpg", label: "Paneer Lababdar & Gravies", category: "Main Course" },
    { src: "/data/reviews/review-image-9.jpg", label: "Royal Family Feast Setup", category: "Dining" },
    { src: "/data/reviews/review-image-10.jpg", label: "Chef's Special Mughlai Platter", category: "Chef Special" },
  ];

  return (
    <section id="heritage" className="palace-heritage-section">
      {/* Background Ambient Layers */}
      <div className="heritage-bg-glow glow-top"></div>
      <div className="heritage-bg-glow glow-bottom"></div>

      <div className="container">
        {/* Section Header */}
        <div className="heritage-header text-center">
          <div className="royal-pill-badge">
            <Sparkles size={14} />
            <span>THE ROYAL RASOI LEGACY</span>
          </div>

          <h2 className="heritage-title font-cinzel">
            A Journey of <span className="gold-text">Flavor, Craft & Hospitality</span>
          </h2>
          <p className="heritage-subtitle font-serif">
            Discover the time-honored slow-cooking traditions, our Sadikpur Patna origins, and real moments captured by our esteemed patrons.
          </p>

          {/* Interactive Modern Tab Switcher */}
          <div className="heritage-nav-tabs">
            <button
              type="button"
              className={`heritage-tab-btn ${activeTab === "craft" ? "active" : ""}`}
              onClick={() => setActiveTab("craft")}
            >
              <Flame size={16} />
              <span>The Culinary Craft</span>
              {activeTab === "craft" && (
                <motion.div
                  layoutId="heritageTabGlow"
                  className="tab-active-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              className={`heritage-tab-btn ${activeTab === "story" ? "active" : ""}`}
              onClick={() => setActiveTab("story")}
            >
              <Award size={16} />
              <span>Patna Heritage & Banquets</span>
              {activeTab === "story" && (
                <motion.div
                  layoutId="heritageTabGlow"
                  className="tab-active-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>

            <button
              type="button"
              className={`heritage-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              <Users size={16} />
              <span>Real Guest Glimpses & Reviews</span>
              {activeTab === "reviews" && (
                <motion.div
                  layoutId="heritageTabGlow"
                  className="tab-active-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content Display with Motion */}
        <AnimatePresence mode="wait">
          {/* TAB 1: THE CULINARY CRAFT */}
          {activeTab === "craft" && (
            <motion.div
              key="craft"
              className="tab-pane craft-pane"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="craft-grid">
                {/* Left: Chef & Craft Story */}
                <div className="craft-text-card glass-panel">
                  <div className="badge-inline">
                    <Flame size={14} className="gold-icon" />
                    <span>ANCIENT DUM PUKHT ART</span>
                  </div>

                  <h3 className="craft-heading font-cinzel">
                    Slow-Cooked Over Charcoal Embers in Sealed Earthen Handis
                  </h3>

                  <p className="craft-desc font-serif">
                    At Royal Rasoi, we preserve the authentic Awadhi method of <em>Dum Pukht</em> — slow breathing. Our earthen handis are sealed with freshly kneaded whole-wheat dough to lock in the fragrant steam of aged basmati, saffron strands, and hand-ground <em>potli masalas</em>.
                  </p>

                  <div className="craft-pillars-list">
                    <div className="pillar-item">
                      <div className="pillar-icon-box">
                        <ShieldCheck size={20} />
                      </div>
                      <div className="pillar-info">
                        <h4 className="pillar-title font-cinzel">100% Halal & Fresh Daily</h4>
                        <p className="pillar-detail font-serif">Every cut of poultry and mutton is strictly certified halal, procured fresh each morning.</p>
                      </div>
                    </div>

                    <div className="pillar-item">
                      <div className="pillar-icon-box">
                        <Sparkles size={20} />
                      </div>
                      <div className="pillar-info">
                        <h4 className="pillar-title font-cinzel">160 Heirloom Potli Spices</h4>
                        <p className="pillar-detail font-serif">Secrets passed down through generations, ground on stone sil-batta at the break of dawn.</p>
                      </div>
                    </div>

                    <div className="pillar-item">
                      <div className="pillar-icon-box">
                        <HeartHandshake size={20} />
                      </div>
                      <div className="pillar-info">
                        <h4 className="pillar-title font-cinzel">Pure Bilona Desi Ghee</h4>
                        <p className="pillar-detail font-serif">No synthetic additives or vanaspati. Slow-cooked in golden butter and pure churned ghee.</p>
                      </div>
                    </div>
                  </div>

                  <div className="craft-cta-row">
                    <button
                      type="button"
                      className="btn-royal-primary"
                      onClick={() => onOpenReservation("Dum Pukht Special Tasting")}
                    >
                      <Calendar size={16} />
                      <span>Book Dum Pukht Tasting</span>
                    </button>
                  </div>
                </div>

                {/* Right: Master Chef Feature Card */}
                <div className="craft-chef-card glass-panel">
                  <div className="chef-photo-container">
                    <img
                      src="/data/reviews/review-image-1.jpg"
                      alt="Royal Tandoori Kebab craft"
                      className="chef-dish-img"
                    />
                    <div className="chef-floating-quote">
                      <Quote size={20} className="quote-icon" />
                      <p className="quote-text font-serif">
                        "Real royal cooking cannot be rushed with pressure cookers. It requires charcoal, patience, and devotion to time."
                      </p>
                      <span className="quote-author font-cinzel">— Master Khansama Ustad Mehmood Qureshi</span>
                    </div>
                  </div>

                  <div className="chef-stats-row">
                    <div className="chef-stat">
                      <span className="stat-number gold-text">18 Hrs</span>
                      <span className="stat-label">Slow Simmer Dal</span>
                    </div>
                    <div className="stat-sep"></div>
                    <div className="chef-stat">
                      <span className="stat-number gold-text">25+ Yrs</span>
                      <span className="stat-label">Chef's Career Heritage</span>
                    </div>
                    <div className="stat-sep"></div>
                    <div className="chef-stat">
                      <span className="stat-number gold-text">220+</span>
                      <span className="stat-label">Imperial Recipes</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PATNA HERITAGE & BANQUETS */}
          {activeTab === "story" && (
            <motion.div
              key="story"
              className="tab-pane story-pane"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="story-grid">
                {/* Left: Ambience Photo */}
                <div className="story-photo-col glass-panel">
                  <img
                    src="/data/reviews/review-image-3.jpg"
                    alt="Royal Rasoi Dining Ambience Sadikpur Patna"
                    className="story-large-img"
                  />
                  <div className="story-photo-caption">
                    <span className="caption-tag">ESTD. 2018</span>
                    <h4 className="caption-heading font-cinzel">City Court, Sadikpur, Patna</h4>
                    <p className="caption-text font-serif">A sanctuary of Nawabi elegance with private family cabins and banquet seating.</p>
                  </div>
                </div>

                {/* Right: The Story & Banquet Hosting */}
                <div className="story-details-col glass-panel">
                  <div className="badge-inline">
                    <Award size={14} className="gold-icon" />
                    <span>THE SADIKPUR LANDMARK</span>
                  </div>

                  <h3 className="story-heading font-cinzel">
                    Patna’s Premier Destination for Royal Dining & Grand Celebrations
                  </h3>

                  <p className="story-desc font-serif">
                    Established in 2018 at City Court, Sadikpur, The Royal Rasoi was founded to revive the authentic royal dining traditions of Awadh and Lucknow in Patna. Under the culinary leadership of Master Khansama Ustad Mehmood Qureshi—who brings 25+ years of personal culinary career experience from historic royal kitchens—our restaurant has grown into Patna’s most beloved destination for celebratory feasts.
                  </p>

                  <div className="banquet-perks-box">
                    <h4 className="perks-title font-cinzel">The Imperial Banquet Hall (Up to 150 Guests)</h4>
                    <ul className="perks-list">
                      <li>
                        <CheckCircle2 size={16} className="gold-icon" />
                        <span>Private Birthday, Anniversary, & Family Reunion Halls</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} className="gold-icon" />
                        <span>Customized 5-Course Royal Buffet & Live Kebab Counters</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} className="gold-icon" />
                        <span>Dedicated Imperial Butler Service & Elegant Golden Seating</span>
                      </li>
                      <li>
                        <CheckCircle2 size={16} className="gold-icon" />
                        <span>High-Speed Audio-Visual Setup for Speeches & Celebrations</span>
                      </li>
                    </ul>
                  </div>

                  <div className="story-actions">
                    <button
                      type="button"
                      className="btn-royal-primary"
                      onClick={() => onOpenReservation("Banquet Booking")}
                    >
                      <Calendar size={16} />
                      <span>Inquire for Grand Banquet</span>
                    </button>
                    <a
                      href={`tel:${royalConfig.restaurant.phone}`}
                      className="btn-royal-glass"
                    >
                      <span>Direct Banquet Desk: {royalConfig.restaurant.phone}</span>
                      <ChevronRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: REAL GUEST GLIMPSES & REVIEWS */}
          {activeTab === "reviews" && (
            <motion.div
              key="reviews"
              className="tab-pane reviews-pane"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Google Reviews Trust Bar */}
              <div className="reviews-trust-bar glass-panel">
                <div className="trust-score">
                  <div className="score-stars">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={20} fill="#d4af37" color="#d4af37" />
                    ))}
                  </div>
                  <span className="score-num font-cinzel">4.2 / 5.0</span>
                  <span className="score-count font-serif">Based on 524+ Authentic Google Reviews</span>
                </div>

                <div className="trust-quote-preview">
                  <span className="highlight-pill">100% REAL DINER MOMENTS</span>
                  <p className="trust-subtext font-serif">
                    All photographs below were clicked and uploaded by genuine patrons dining at Royal Rasoi, Patna.
                  </p>
                </div>
              </div>

              {/* Review Cards Grid */}
              <div className="reviews-cards-grid">
                {authenticReviews.map((rev) => (
                  <motion.div
                    key={rev.id}
                    className="review-quote-card glass-panel"
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  >
                    <div className="rev-header">
                      <div className="rev-avatar">
                        <span>{rev.name.charAt(0)}</span>
                      </div>
                      <div className="rev-user-meta">
                        <h4 className="rev-name font-cinzel">{rev.name}</h4>
                        <span className="rev-source font-serif">{rev.source} • {rev.date}</span>
                      </div>
                      <div className="rev-stars">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} size={14} fill="#d4af37" color="#d4af37" />
                        ))}
                      </div>
                    </div>

                    <p className="rev-comment font-serif">"{rev.comment}"</p>

                    <div className="rev-dish-tag">
                      <span className="tag-label">Favorite:</span>
                      <span className="tag-val font-cinzel">{rev.dishRecommended}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Real Customer Photos Gallery */}
              <div className="gallery-header-row">
                <h3 className="gallery-title font-cinzel">Patron Photostory: Real Plates & Moments</h3>
                <span className="gallery-subtitle font-serif">Tap any photo to view full capture</span>
              </div>

              <div className="real-photos-grid">
                {galleryPhotos.map((photo, idx) => (
                  <motion.div
                    key={idx}
                    className="patron-photo-card"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedPhoto(photo.src)}
                  >
                    <img src={photo.src} alt={photo.label} className="patron-photo-img" />
                    <div className="photo-card-overlay">
                      <span className="photo-badge font-cinzel">{photo.category}</span>
                      <p className="photo-caption-text font-serif">{photo.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal for Real Photos */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            className="photo-lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              className="photo-lightbox-card"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedPhoto} alt="Royal Rasoi Patron Photo" className="lightbox-img" />
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
export default PalaceHeritage;
