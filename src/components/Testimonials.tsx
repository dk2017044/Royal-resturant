import React from "react";
import { motion } from "motion/react";
import { Star, Quote, Award, Sparkles } from "lucide-react";
import { royalConfig } from "../config";
import "./Testimonials.css";

export const Testimonials: React.FC = () => {
  const reviews = royalConfig.reviews;

  return (
    <section id="reviews" className="testimonials-section section-wrapper">
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center">
          <div className="royal-pill-badge">
            <Sparkles size={14} />
            <span>AUTHENTIC PATRON REVIEWS</span>
          </div>
          <h2 className="section-title font-cinzel">Whispers of Royal Grandeur</h2>
          <p className="section-subtitle font-serif">
            Authentic reflections from families, gourmands, and valued guests who have dined at The Royal Rasoi in Sadikpur, Patna.
          </p>
        </div>

        {/* Ratings Highlight Bar with Motion */}
        <motion.div
          className="ratings-summary-bar glass-panel"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="summary-item">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#d4af37" color="#d4af37" />
              ))}
            </div>
            <span className="summary-val font-cinzel">4.7 / 5.0</span>
            <span className="summary-sub">Google Rating in Sadikpur, Patna</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-item">
            <div className="badge-inline">
              <Award size={22} className="gold-text" />
              <span className="summary-val font-cinzel">112+</span>
            </div>
            <span className="summary-sub">Verified Google Reviews</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-item">
            <span className="award-title font-cinzel">Top Rated Family Restaurant</span>
            <span className="summary-sub">Sadikpur, Patna • North Indian & Chinese</span>
          </div>
        </motion.div>

        {/* Reviews Grid with Motion */}
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="review-card glass-panel"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div className="review-top">
                <Quote size={28} className="review-quote-icon" />
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#d4af37" color="#d4af37" />
                  ))}
                </div>
              </div>

              <p className="review-comment font-serif">"{review.comment}"</p>

              {/* Real Customer Photos Attached to Reviews */}
              {review.images && review.images.length > 0 && (
                <div className="review-photos-row">
                  {review.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${review.guestName}'s dining photo at The Royal Rasoi`}
                      className="review-thumb-img"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              <div className="review-dish-tag">
                <span className="dish-label">Specialty:</span>
                <span className="dish-name">{review.dishLoved}</span>
              </div>

              <div className="review-author">
                <div className="author-avatar font-cinzel">
                  {review.guestName.charAt(0)}
                </div>
                <div>
                  <h4 className="author-name font-cinzel">{review.guestName}</h4>
                  <span className="author-city">{review.city} • {review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
