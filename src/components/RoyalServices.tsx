import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import "./RoyalServices.css";

interface RoyalServicesProps {
  onExploreMenu: () => void;
}

export const RoyalServices: React.FC<RoyalServicesProps> = ({ onExploreMenu }) => {
  const pillars = [
    {
      id: "p-1",
      title: "Royal Dum Pukht Feast",
      hindi: "शाही दम पुख़्त बिरयानी",
      desc: "Slow-simmered in sealed earthen handis over gentle charcoal embers with saffron, ghee, and 2-year aged basmati.",
      image: "/data/reviews/review-image-2.jpg",
      tag: "SIGNATURE FEAST",
    },
    {
      id: "p-2",
      title: "Charcoal Angaare Tandoor",
      hindi: "अंगारे कबाब व टिक्का",
      desc: "Smoky, melt-in-mouth kebabs and golden tandoori skewers infused with 160 secret royal potli herbs.",
      image: "/data/reviews/review-image-1.jpg",
      tag: "CHARCOAL SPECIAL",
    },
    {
      id: "p-3",
      title: "Imperial Shahi Gravies",
      hindi: "शाही दाल व पनीर लबाबदार",
      desc: "18-hour slow-simmered Dal Royal Rasoi and rich cashew-saffron curries served with hot butter tandoori naans.",
      image: "/data/reviews/review-image-6.jpg",
      tag: "HEIRLOOM CURRIES",
    },
    {
      id: "p-4",
      title: "Chinese & Starters Platter",
      hindi: "क्रिस्पी स्टार्टर्स व चाउमीन",
      desc: "Wok-tossed chicken chilli, crispy vegetable lollipops, and savory Indo-Chinese fusion prepared fresh on order.",
      image: "/data/reviews/review-image-9.jpg",
      tag: "EVENING FAVORITES",
    },
  ];

  return (
    <section id="services" className="pillars-section section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="royal-pill-badge">
            <Sparkles size={14} />
            <span>CULINARY EXCELLENCE</span>
          </div>
          <h2 className="section-title font-cinzel">Pillars of Royal Rasoi</h2>
          <p className="section-subtitle font-serif">
            Every dish served at our tables in Sadikpur, Patna is an authentic tribute to centuries of Awadh and Mughlai court culinary artistry.
          </p>
        </div>

        {/* 4 Pillars Grid with Motion */}
        <div className="pillars-grid">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              className="pillar-card glass-panel"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              onClick={onExploreMenu}
            >
              <div className="pillar-banner-wrap">
                <img
                  src={pillar.image}
                  alt={pillar.title}
                  className="pillar-img"
                  loading="lazy"
                />
                <div className="pillar-tag">
                  <span>{pillar.tag}</span>
                </div>
              </div>

              <div className="pillar-body">
                <span className="pillar-hindi font-serif">{pillar.hindi}</span>
                <h3 className="pillar-title font-cinzel">{pillar.title}</h3>
                <p className="pillar-desc font-serif">{pillar.desc}</p>
                <div className="pillar-cta">
                  <span>Explore Category</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default RoyalServices;
