import React from "react";
import { motion } from "motion/react";
import { Flame, Crown, Award, Users, Sparkles } from "lucide-react";
import "./RoyalFeatures.css";

export const RoyalFeatures: React.FC = () => {
  const strengths = [
    {
      id: "f-1",
      icon: Flame,
      title: "Pure Bilona Ghee & Spices",
      hindi: "शुद्ध बिलोना घी व 160 मसाले",
      desc: "Traditional bilona churned ghee and freshly ground potli spices with zero artificial colors or synthetic preservatives.",
    },
    {
      icon: Crown,
      id: "f-2",
      title: "Awadhi Dum Pukht Heritage",
      hindi: "अवधी दम पुख़्त परंपरा",
      desc: "Slow-simmered in dough-sealed earthen handis over charcoal embers so every aroma is captured in its purest form.",
    },
    {
      icon: Award,
      id: "f-3",
      title: "Royal Culinary Artistry",
      hindi: "शाही पकवानों की शुद्धता",
      desc: "Authentic North Indian and Mughlai recipes prepared using traditional slow-cooking, clay tandoors, and hand-ground spice blends in Sadikpur, Patna.",
    },
    {
      icon: Users,
      id: "f-4",
      title: "Family & Celebration Banquets",
      hindi: "पारिवारिक दावत व बैठक",
      desc: "Comfortable air-conditioned family seating, party hosting, and custom dastarkhwan setups in Sadikpur, Patna.",
    },
  ];

  return (
    <section id="features" className="royal-features-section section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="royal-pill-badge">
            <Sparkles size={14} />
            <span>WHY CHOOSE US</span>
          </div>
          <h2 className="section-title font-cinzel">Our Royal Strengths</h2>
          <p className="section-subtitle font-serif">
            Distinguished by an unwavering commitment to royal culinary heritage, purity of ingredients, and courtly hospitality in Patna.
          </p>
        </div>

        {/* 4 Feature Cards with Motion */}
        <div className="features-grid">
          {strengths.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.id}
                className="feature-card glass-panel"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.12, duration: 0.6 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="feature-icon-box">
                  <Icon size={28} />
                </div>
                <span className="feature-hindi font-serif">{feat.hindi}</span>
                <h3 className="feature-title font-cinzel">{feat.title}</h3>
                <p className="feature-desc font-serif">{feat.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
export default RoyalFeatures;
