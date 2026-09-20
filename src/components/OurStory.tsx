import React from "react";
import { motion } from "motion/react";
import { Flame, Sparkles, HeartHandshake, Award, Phone, CalendarCheck } from "lucide-react";
import { royalConfig } from "../config";
import "./OurStory.css";

interface OurStoryProps {
  onOpenReservation?: () => void;
}

export const OurStory: React.FC<OurStoryProps> = ({ onOpenReservation }) => {
  const storyPillars = [
    {
      icon: Flame,
      title: "Dum Pukht Technique",
      desc: "Meats and basmati slow-cooked in dough-sealed handis over charcoal embers so natural aromas never escape.",
    },
    {
      icon: Sparkles,
      title: "160 Royal Botanicals",
      desc: "Spice blends ground on stone silbattas, featuring Kashmiri saffron, mace, and wild star anise.",
    },
    {
      icon: HeartHandshake,
      title: "Tehzeeb & Court Hospitality",
      desc: "Experience genuine royal courtesy with attentive service and comfortable family seating in Sadikpur.",
    },
    {
      icon: Award,
      title: "Pure & Hygienic Ingredients",
      desc: "Prepared exclusively with pure bilona churned ghee, fresh local farm produce, and zero artificial colors.",
    },
  ];

  return (
    <section className="story-section section-wrapper" id="story">
      <div className="container">
        <div className="story-grid-layout">
          {/* Left: Real Restaurant Ambience Showcase */}
          <motion.div
            className="story-visual-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="story-image-card glass-panel">
              <img
                src="/data/reviews/review-image-8.jpg"
                alt="The Royal Rasoi Evening Dining Setup in Sadikpur, Patna"
                className="story-main-img"
                loading="lazy"
              />
              <div className="story-img-glow"></div>

              {/* Floating Experience Badge */}
              <div className="story-exp-badge">
                <span className="exp-number font-cinzel">4.7★</span>
                <span className="exp-caption">112+ Google Reviews in Sadikpur</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Narrative & 4 Pillars */}
          <motion.div
            className="story-narrative-col"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="royal-pill-badge">
              <Sparkles size={14} />
              <span>OUR HERITAGE</span>
            </div>

            <h2 className="story-title font-cinzel">
              Every Flavor Tells an <span className="glow-text">Imperial Story</span>
            </h2>

            <p className="story-intro font-serif">
              Born from a reverent passion for the royal kitchens of Awadh and Mughlai courts, <strong>{royalConfig.restaurant.name}</strong> was established in Sadikpur, Patna to bring the authentic grandeur of royal dining within everyone's reach.
            </p>

            <p className="story-body font-serif">
              Every creation on our dastarkhwan is an ode to patience. From our signature Dum Biryani and charcoal-roasted kebabs to our 18-hour slow-simmered Dal Royal Rasoi, we honor authentic recipes without shortcut or compromise.
            </p>

            {/* Direct Call Box */}
            <div className="story-call-banner glass-panel">
              <div className="call-banner-icon">
                <Phone size={20} />
              </div>
              <div className="call-banner-text">
                <span className="call-sub">DIRECT TABLE BOOKING & TAKEAWAY</span>
                <a href={`tel:${royalConfig.restaurant.phone}`} className="call-number font-cinzel">
                  {royalConfig.restaurant.phone}
                </a>
              </div>
            </div>

            {/* 4 Pillars Subgrid */}
            <div className="story-pillars-subgrid">
              {storyPillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="story-pillar-item">
                    <div className="pillar-icon-box">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 className="story-item-title font-cinzel">{item.title}</h4>
                      <p className="story-item-desc font-serif">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {onOpenReservation && (
              <div className="story-cta-row">
                <button
                  type="button"
                  className="btn-royal-primary"
                  onClick={onOpenReservation}
                >
                  <CalendarCheck size={18} />
                  <span>Reserve A Royal Table</span>
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default OurStory;
