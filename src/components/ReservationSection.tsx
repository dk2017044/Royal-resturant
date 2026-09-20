import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, Calendar, Clock, CheckCircle2, Phone, MapPin, Sparkles } from "lucide-react";
import { royalConfig } from "../config";
import "./ReservationSection.css";

export const ReservationSection: React.FC = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [person, setPerson] = useState("2 Persons");
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("08:15 PM");
  const [message, setMessage] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `RR-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingRef(id);
    setIsBooked(true);
  };

  return (
    <section id="reservation-section" className="reservation-section section-wrapper">
      <div className="container">
        <div className="reservation-card-split glass-panel">
          {/* Left: Form */}
          <div className="form-left-col">
            {isBooked ? (
              <motion.div
                className="booking-success-wrap text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <CheckCircle2 size={56} className="gold-check-icon" />
                <h3 className="success-heading font-cinzel">Table Confirmed</h3>
                <p className="success-sub font-serif">
                  Thank you! Your royal reservation (ID: <strong className="gold-text">{bookingRef}</strong>) has been confirmed for {name || "Guest"} on {date} at {time} for {person}.
                </p>
                <button
                  type="button"
                  className="btn-royal-primary"
                  onClick={() => setIsBooked(false)}
                >
                  <span>Book Another Table</span>
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="reservation-inpage-form">
                <div className="royal-pill-badge">
                  <Sparkles size={14} />
                  <span>ONLINE RESERVATION</span>
                </div>

                <h2 className="reservation-title font-cinzel">Reserve Your Royal Table</h2>
                <p className="reservation-subtitle font-serif">
                  Booking request via call <a href={`tel:${royalConfig.restaurant.phone}`} className="gold-link">{royalConfig.restaurant.phone}</a> or fill out the form below
                </p>

                {/* Name & Phone */}
                <div className="form-grid-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    className="royal-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    className="royal-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                {/* Person, Date, Time with Icons */}
                <div className="form-grid-3">
                  <div className="icon-input-wrap">
                    <Users size={16} className="input-icon" />
                    <select
                      className="royal-input select-input"
                      value={person}
                      onChange={(e) => setPerson(e.target.value)}
                    >
                      <option value="1 Person">1 Person</option>
                      <option value="2 Persons">2 Persons</option>
                      <option value="4 Persons">4 Persons</option>
                      <option value="6 Persons">6 Persons</option>
                      <option value="8 Persons">8 Persons</option>
                      <option value="10+ Persons">10+ Persons (Banquet)</option>
                    </select>
                  </div>

                  <div className="icon-input-wrap">
                    <Calendar size={16} className="input-icon" />
                    <input
                      type="date"
                      required
                      className="royal-input date-input"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="icon-input-wrap">
                    <Clock size={16} className="input-icon" />
                    <select
                      className="royal-input select-input"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    >
                      <option value="12:30 PM">12:30 PM (Lunch)</option>
                      <option value="01:15 PM">01:15 PM (Lunch)</option>
                      <option value="02:00 PM">02:00 PM (Lunch)</option>
                      <option value="07:30 PM">07:30 PM (Dinner)</option>
                      <option value="08:15 PM">08:15 PM (Dinner)</option>
                      <option value="09:00 PM">09:00 PM (Dinner)</option>
                      <option value="09:45 PM">09:45 PM (Dinner)</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <textarea
                  rows={3}
                  placeholder="Special Requests / Occasion / Dietary preferences (e.g. Birthday, Anniversary, Jain Food)"
                  className="royal-input textarea-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>

                {/* Submit */}
                <div className="submit-row">
                  <button type="submit" className="btn-royal-primary w-full-btn">
                    <span>Confirm Royal Reservation</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Contact & Information Column */}
          <div className="form-right-col">
            <h3 className="contact-heading font-cinzel">Contact & Location</h3>

            <div className="contact-block">
              <span className="contact-label">BOOKING REQUEST</span>
              <a href={`tel:${royalConfig.restaurant.phone}`} className="contact-tel font-cinzel">
                <Phone size={16} className="gold-icon" />
                <span>{royalConfig.restaurant.phone}</span>
              </a>
            </div>

            <div className="contact-block">
              <span className="contact-label">ROYAL LOCATION</span>
              <address className="contact-address font-serif">
                <MapPin size={16} className="gold-icon" />
                <span>{royalConfig.restaurant.address}</span>
              </address>
            </div>

            <div className="contact-block">
              <span className="contact-label">LUNCH SERVICE</span>
              <p className="contact-time font-serif">
                Monday to Sunday <br />
                11:00 AM – 04:00 PM
              </p>
            </div>

            <div className="contact-block">
              <span className="contact-label">DINNER SERVICE</span>
              <p className="contact-time font-serif">
                Monday to Sunday <br />
                04:00 PM – 10:30 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ReservationSection;
