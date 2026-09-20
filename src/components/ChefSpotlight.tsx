import React from "react";
import { motion } from "motion/react";
import { Sparkles, Award, Flame, HeartHandshake, UtensilsCrossed, Calendar, Utensils } from "lucide-react";
import { royalConfig } from "../config";
import "./ChefSpotlight.css";

interface ChefSpotlightProps {
  onExploreSpecials: () => void;
  onBookTable: () => void;
}

export const ChefSpotlight: React.FC<ChefSpotlightProps> = ({ onExploreSpecials, onBookTable }) => {
  const chef = royalConfig.restaurant.chef;

  const culinarySecrets = [
    {
      title: "18-Hour Coal Dum",
      desc: "Slow-simmered all night on gentle charcoal embers for velvet silkiness.",
      icon: Flame,
    },
    {
      title: "160 Royal Botanicals",
      desc: "Heirloom potli spice blends including Kashmiri saffron, rose petals & javitri.",
      icon: Sparkles,
    },
    {
      title: "Ancestral Heritage",
      desc: "Passed down through four generations of Awadh court culinary masters.",
      icon: Award,
    },
    {
      title: "Pure A2 Bilona Ghee",
      desc: "Crafted exclusively with traditional churned ghee and organic herbs.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="chef" className="chef-section section-wrapper">
      <div className="container">
        <div className="chef-grid">
          {/* Left Column: Real Food Visual Showcase */}
          <motion.div
            className="chef-visual"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="chef-img-wrapper glass-panel">
              <img
                src="/data/reviews/review-image-6.jpg"
                alt="Master Chef Dum Pukht Signature Dal Royal Rasoi"
                className="chef-main-img"
                loading="lazy"
              />
              <div className="chef-overlay-badge">
                <div className="badge-icon">
                  <UtensilsCrossed size={22} />
                </div>
                <div>
                  <span className="badge-subtitle">Heritage Masterpiece</span>
                  <span className="badge-title font-cinzel">18-Hour Dal Royal Rasoi</span>
                </div>
              </div>
            </div>

            <div className="chef-exp-chip">
              <span className="exp-num font-cinzel">25+</span>
              <span className="exp-label">Years of Regal Awadhi Artistry</span>
            </div>
          </motion.div>

          {/* Right Column: Narrative & Credentials */}
          <motion.div
            className="chef-content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="royal-pill-badge">
              <Sparkles size={14} />
              <span>THE MASTER KHANSAMA</span>
            </div>

            <h2 className="chef-name font-cinzel">{chef.name}</h2>
            <span className="chef-title">{chef.title}</span>

            <blockquote className="chef-quote font-serif">
              "Cooking in the royal tradition is not merely preparing food; it is an intimate prayer of time, fragrance, and patience. When a handi is sealed with dough, the soul of every spice is preserved for our esteemed guests."
            </blockquote>

            <p className="chef-bio font-serif">{chef.bio}</p>

            <div className="chef-secrets-grid">
              {culinarySecrets.map((secret, index) => {
                const Icon = secret.icon;
                return (
                  <div key={index} className="secret-card glass-panel">
                    <div className="secret-icon-wrap">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="secret-title font-cinzel">{secret.title}</h4>
                      <p className="secret-desc">{secret.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chef-actions">
              <button
                type="button"
                className="btn-royal-primary"
                onClick={onBookTable}
              >
                <Calendar size={18} />
                <span>Reserve Chef's Table</span>
              </button>
              <button
                type="button"
                className="btn-royal-glass"
                onClick={onExploreSpecials}
              >
                <Utensils size={18} />
                <span>View Chef's Special Menu</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default ChefSpotlight;
