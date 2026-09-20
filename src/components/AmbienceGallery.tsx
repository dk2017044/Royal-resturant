import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";
import { royalConfig } from "../config";
import "./AmbienceGallery.css";

interface GalleryItem {
  id: string;
  title: string;
  category: "Customer Photos" | "Official Menu Cards" | "Restaurant Ambience";
  image: string;
  desc: string;
  tag: string;
}

export const AmbienceGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Build gallery items using strictly real data from data/royal-rasoi/
  const galleryItems: GalleryItem[] = [
    // 1. Real Customer Photos
    ...royalConfig.customerPhotos.map((cp, idx) => ({
      id: `cp-${idx + 1}`,
      title: cp.title,
      category: "Customer Photos" as const,
      image: cp.url,
      desc: `Captured by ${cp.author} at The Royal Rasoi, Sadikpur, Patna.`,
      tag: "Customer Review Photo",
    })),

    // 2. Official Menu Scans
    ...royalConfig.menuPages.map((mp, idx) => ({
      id: `mp-${idx + 1}`,
      title: `Official Menu Card • Page ${idx + 1}`,
      category: "Official Menu Cards" as const,
      image: mp,
      desc: `Official printed dine-in menu card of The Royal Rasoi (Page ${idx + 1}).`,
      tag: "Official Menu Card",
    })),

    // 3. Real Restaurant Ambience & Dining Setups
    {
      id: "amb-1",
      title: "Evening Palace Ambience",
      category: "Restaurant Ambience" as const,
      image: "/data/reviews/review-image-8.jpg",
      desc: "Warm ambient glow and intimate dining setups at City Court, Sadikpur, Patna.",
      tag: "Interior Ambience",
    },
    {
      id: "amb-2",
      title: "Family Dining Seating",
      category: "Restaurant Ambience" as const,
      image: "/data/reviews/review-image-4.jpg",
      desc: "Spacious air-conditioned seating curated for family gatherings and celebrations.",
      tag: "Family Seating",
    },
    {
      id: "amb-3",
      title: "Royal Table Dastarkhwan",
      category: "Restaurant Ambience" as const,
      image: "/data/reviews/review-image-3.jpg",
      desc: "Plush booth seating with traditional imperial court aesthetics.",
      tag: "Royal Seating",
    },
  ];

  const categories = ["All", "Customer Photos", "Official Menu Cards", "Restaurant Ambience"];

  const filteredItems =
    activeFilter === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeFilter);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : (prev ?? 0) - 1));
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : (prev ?? 0) + 1));
    }
  };

  return (
    <section id="gallery" className="gallery-section section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="royal-pill-badge">
            <Sparkles size={14} />
            <span>AUTHENTIC GLIMPSES</span>
          </div>
          <h2 className="section-title font-cinzel">Gallery & Official Menu Cards</h2>
          <p className="section-subtitle font-serif">
            Browse authentic customer photos taken at our restaurant, explore our official scanned menu cards, and view our dining ambience in Sadikpur, Patna.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="gallery-filters">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat}
              className={`gallery-filter-btn ${activeFilter === cat ? "active" : ""}`}
              onClick={() => setActiveFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid with Motion */}
        <motion.div layout className="gallery-grid">
          <AnimatePresence>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35 }}
                className={`gallery-card glass-panel ${
                  index === 0 && activeFilter === "All" ? "featured-card" : ""
                }`}
                onClick={() => setLightboxIndex(index)}
              >
                <div className="gallery-card-img-wrap">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="gallery-overlay">
                    <div className="gallery-view-btn">
                      <Eye size={20} />
                    </div>
                    <span className="gallery-tag-pill">{item.tag}</span>
                    <h3 className="gallery-card-title font-cinzel">{item.title}</h3>
                    <p className="gallery-card-desc font-serif">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal with Motion */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            className="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            <button
              type="button"
              className="lightbox-nav-btn prev"
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              type="button"
              className="lightbox-nav-btn next"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>

            <motion.div
              className="lightbox-dialog glass-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="lightbox-img-wrapper">
                <img
                  src={filteredItems[lightboxIndex].image}
                  alt={filteredItems[lightboxIndex].title}
                />
              </div>
              <div className="lightbox-caption">
                <span className="lightbox-tag font-serif">
                  {filteredItems[lightboxIndex].tag}
                </span>
                <h3 className="lightbox-title font-cinzel">
                  {filteredItems[lightboxIndex].title}
                </h3>
                <p className="lightbox-desc font-serif">
                  {filteredItems[lightboxIndex].desc}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
export default AmbienceGallery;
