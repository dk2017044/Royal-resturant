import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2,
  Crown
} from "lucide-react";
import { royalConfig } from "../config";
import "./ContactBanquet.css";

export const ContactBanquet: React.FC = () => {
  const [banquetName, setBanquetName] = useState("");
  const [banquetPhone, setBanquetPhone] = useState("");
  const [banquetEmail, setBanquetEmail] = useState("");
  const [banquetGuests, setBanquetGuests] = useState("30-50 Guests");
  const [banquetType, setBanquetType] = useState("Wedding / Engagement Banquet");
  const [banquetDate, setBanquetDate] = useState("");
  const [banquetNotes, setBanquetNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="contact-section section-padding">
      <div className="container">
        <div className="section-header text-center">
          <div className="section-subtitle">
            <Sparkles size={16} />
            <span>ROYAL BANQUETS & REACH US</span>
          </div>
          <h2 className="section-title font-cinzel">Celebrate in Imperial Splendor</h2>
          <div className="golden-divider">
            <span className="divider-diamond"></span>
          </div>
          <p className="section-desc font-serif">
            Whether an intimate family celebration or a grand royal wedding reception, our royal banquet hall and personalized hospitality curate an unforgettable celebration.
          </p>
        </div>

        <div className="contact-grid">
          {/* Left Column: Contact & Heritage Details */}
          <motion.div
            className="contact-info-col"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="contact-card">
              <h3 className="contact-card-title font-cinzel">The Royal Courtyard</h3>
              
              <div className="info-list">
                <div className="info-item">
                  <div className="info-icon">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="info-label">Royal Address</span>
                    <p className="info-val">{royalConfig.restaurant.address}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="info-label">Reservations & Banquets</span>
                    <p className="info-val">{royalConfig.restaurant.phone}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="info-label">Email Concierge</span>
                    <p className="info-val">{royalConfig.restaurant.email}</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="info-label">Dining Hours</span>
                    <p className="info-val">
                      Lunch: {royalConfig.restaurant.hours.lunch}<br />
                      Dinner: {royalConfig.restaurant.hours.dinner}<br />
                      <span className="highlight-text">{royalConfig.restaurant.hours.days}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Royal Amenities */}
              <div className="amenities-box">
                <span className="amenities-title font-cinzel">Guest Amenities & Features</span>
                <div className="amenities-grid">
                  {royalConfig.restaurant.amenities.map((amenity, idx) => (
                    <div key={idx} className="amenity-chip">
                      <ShieldCheck size={15} />
                      <span>{amenity}</span>
                    </div>
                  ))}
                  <div className="amenity-chip">
                    <Crown size={15} />
                    <span>Price for Two: {royalConfig.restaurant.priceForTwo}</span>
                  </div>
                </div>
              </div>

              {/* Google Maps & Swiggy Links */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                <a
                  href={royalConfig.restaurant.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-royal-primary"
                  style={{ fontSize: "0.82rem", padding: "10px 22px" }}
                >
                  <MapPin size={16} />
                  <span>Open in Google Maps</span>
                </a>
                <a
                  href={royalConfig.restaurant.swiggyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-royal-glass"
                  style={{ fontSize: "0.82rem", padding: "10px 22px" }}
                >
                  <span>Swiggy Dineout & Pay</span>
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Banquet & Large Party Booking Form */}
          <motion.div
            className="banquet-form-col"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="banquet-form-wrap">
              {submitted ? (
                <div className="banquet-success-box">
                  <CheckCircle2 size={50} className="gold-text" />
                  <h3 className="banquet-success-title font-cinzel">Inquiry Received</h3>
                  <p className="banquet-success-desc font-serif">
                    Shukriya! Our Royal Banquet Concierge will contact you within 2 business hours with bespoke menu packages and hall viewing arrangements.
                  </p>
                  <button
                    type="button"
                    className="btn-outline-gold"
                    onClick={() => setSubmitted(false)}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <>
                  <div className="banquet-form-header">
                    <h3 className="banquet-title font-cinzel">Royal Banquet & Event Inquiry</h3>
                    <p className="banquet-desc font-serif">
                      For gatherings of 20 to 150+ guests, corporate banquets, and grand family celebrations.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="banquet-form">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Host Name *</label>
                        <input
                          type="text"
                          required
                          className="royal-input"
                          placeholder="Your Name"
                          value={banquetName}
                          onChange={(e) => setBanquetName(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          className="royal-input"
                          placeholder="+91 98765 43210"
                          value={banquetPhone}
                          onChange={(e) => setBanquetPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          className="royal-input"
                          placeholder="your.email@example.com"
                          value={banquetEmail}
                          onChange={(e) => setBanquetEmail(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Expected Date *</label>
                        <input
                          type="date"
                          required
                          className="royal-input"
                          value={banquetDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setBanquetDate(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Guest Count</label>
                        <select
                          className="royal-input"
                          value={banquetGuests}
                          onChange={(e) => setBanquetGuests(e.target.value)}
                        >
                          <option value="20-35 Guests">20 – 35 Guests</option>
                          <option value="35-60 Guests">35 – 60 Guests</option>
                          <option value="60-100 Guests">60 – 100 Guests</option>
                          <option value="100-150+ Guests">100 – 150+ Guests</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Event Type</label>
                        <select
                          className="royal-input"
                          value={banquetType}
                          onChange={(e) => setBanquetType(e.target.value)}
                        >
                          <option value="Wedding / Engagement Banquet">Wedding / Engagement Banquet</option>
                          <option value="Royal Birthday / Anniversary">Royal Birthday / Anniversary</option>
                          <option value="Corporate Executive Dinner">Corporate Executive Dinner</option>
                          <option value="Family Dawat / Reunion">Family Dawat / Reunion</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Special Banquet Requirements</label>
                      <textarea
                        rows={2}
                        className="royal-input royal-textarea"
                        placeholder="e.g. Live chaat counter, Awadhi Dum Biryani live handi, floral decor, projector setup..."
                        value={banquetNotes}
                        onChange={(e) => setBanquetNotes(e.target.value)}
                      ></textarea>
                    </div>

                    <button type="submit" className="btn-gold banquet-submit-btn">
                      <Send size={16} />
                      <span>Request Royal Banquet Proposal</span>
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
