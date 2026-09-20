import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Users, Sparkles, CheckCircle2, MapPin, Phone, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { royalConfig } from "../config";
import "./ReservationModal.css";

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDish?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  preselectedDish = "",
}) => {
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>("08:15 PM");
  const [seatingArea, setSeatingArea] = useState<string>("courtyard");
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [occasion, setOccasion] = useState<string>("Family Dinner");
  const [notes, setNotes] = useState<string>("");

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<string>("");

  useEffect(() => {
    if (preselectedDish) {
      setNotes(`Preferred specialty dish: ${preselectedDish}`);
    }
  }, [preselectedDish]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomId = `RR-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingId(randomId);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  const timeSlots = [
    { type: "Lunch", times: ["12:30 PM", "01:15 PM", "02:00 PM", "02:45 PM"] },
    { type: "Dinner", times: ["07:30 PM", "08:15 PM", "09:00 PM", "09:45 PM", "10:30 PM"] },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="res-modal-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="res-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.94, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 25 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <button
              type="button"
              className="res-modal-close"
              onClick={onClose}
              aria-label="Close reservation modal"
            >
              <X size={20} />
            </button>

            {isSubmitted ? (
              <div className="res-success-view">
                <div className="res-success-icon">
                  <CheckCircle2 size={54} />
                </div>
                <span className="res-tagline font-cinzel">शाही दावत आरक्षण</span>
                <h2 className="res-success-title font-cinzel">Table Confirmed</h2>
                <p className="res-success-desc">
                  Welcome! We are honored to host you at <strong>{royalConfig.restaurant.name}</strong>.
                  Your reservation request has been confirmed.
                </p>

                <div className="res-confirmation-card">
                  <div className="res-confirm-row">
                    <span className="label">Reservation ID:</span>
                    <span className="val highlight">{bookingId}</span>
                  </div>
                  <div className="res-confirm-row">
                    <span className="label">Guest:</span>
                    <span className="val">{fullName || "Esteemed Guest"}</span>
                  </div>
                  <div className="res-confirm-row">
                    <span className="label">Date & Time:</span>
                    <span className="val">{date} at {timeSlot}</span>
                  </div>
                  <div className="res-confirm-row">
                    <span className="label">Guests:</span>
                    <span className="val">{guests} Guests</span>
                  </div>
                  <div className="res-confirm-row">
                    <span className="label">Seating Area:</span>
                    <span className="val">
                      {royalConfig.seatingOptions.find((s) => s.id === seatingArea)?.name}
                    </span>
                  </div>
                  {notes && (
                    <div className="res-confirm-row">
                      <span className="label">Special Request:</span>
                      <span className="val note">{notes}</span>
                    </div>
                  )}
                </div>

                <div className="res-success-instructions">
                  <p>
                    <MapPin size={15} /> {royalConfig.restaurant.address}
                  </p>
                  <p>
                    <Phone size={15} /> For modifications: {royalConfig.restaurant.phone}
                  </p>
                </div>

                <div className="res-success-actions">
                  <button
                    type="button"
                    className="btn-gold"
                    onClick={handleReset}
                  >
                    Done & Return to Website
                  </button>
                </div>
              </div>
            ) : (
              <div className="res-form-view">
                <div className="res-header">
                  <div className="res-crown-tag">
                    <Sparkles size={14} />
                    <span>Royal Hospitality</span>
                  </div>
                  <h2 className="res-title font-cinzel">Reserve Your Royal Table</h2>
                  <p className="res-subtitle font-serif">
                    Experience unmatched Awadhi & Mughlai culinary excellence. Kindly reserve in advance for private chambers and weekend dining.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="res-form">
                  {/* Row 1: Guests and Date */}
                  <div className="res-form-grid-2">
                    <div className="res-form-group">
                      <label className="res-label">
                        <Users size={15} />
                        <span>Number of Guests</span>
                      </label>
                      <div className="guest-selector">
                        {[1, 2, 4, 6, 8, 10, 12].map((num) => (
                          <button
                            type="button"
                            key={num}
                            className={`guest-btn ${guests === num ? "active" : ""}`}
                            onClick={() => setGuests(num)}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="res-form-group">
                      <label htmlFor="res-date" className="res-label">
                        <Calendar size={15} />
                        <span>Dining Date</span>
                      </label>
                      <input
                        id="res-date"
                        type="date"
                        className="res-input"
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Time Slots */}
                  <div className="res-form-group">
                    <label className="res-label">
                      <Clock size={15} />
                      <span>Select Dining Time Slot</span>
                    </label>
                    <div className="time-slot-groups">
                      {timeSlots.map((group) => (
                        <div key={group.type} className="slot-subgroup">
                          <span className="slot-type-label">{group.type}</span>
                          <div className="slot-buttons">
                            {group.times.map((slot) => (
                              <button
                                type="button"
                                key={slot}
                                className={`slot-btn ${timeSlot === slot ? "active" : ""}`}
                                onClick={() => setTimeSlot(slot)}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 3: Seating Preference */}
                  <div className="res-form-group">
                    <label className="res-label">
                      <span>Select Seating Experience</span>
                    </label>
                    <div className="seating-cards-grid">
                      {royalConfig.seatingOptions.map((opt) => (
                        <div
                          key={opt.id}
                          className={`seating-card ${seatingArea === opt.id ? "active" : ""}`}
                          onClick={() => setSeatingArea(opt.id)}
                        >
                          <div className="seating-card-top">
                            <span className="seating-badge">{opt.badge}</span>
                          </div>
                          <h4 className="seating-name font-cinzel">{opt.name}</h4>
                          <p className="seating-desc">{opt.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 4: Guest Contact Details */}
                  <div className="res-form-grid-2">
                    <div className="res-form-group">
                      <label htmlFor="res-name" className="res-label">Full Name *</label>
                      <input
                        id="res-name"
                        type="text"
                        className="res-input"
                        placeholder="e.g. Kunwar R. Singh"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="res-form-group">
                      <label htmlFor="res-phone" className="res-label">Phone Number *</label>
                      <input
                        id="res-phone"
                        type="tel"
                        className="res-input"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="res-form-grid-2">
                    <div className="res-form-group">
                      <label htmlFor="res-email" className="res-label">Email Address</label>
                      <input
                        id="res-email"
                        type="email"
                        className="res-input"
                        placeholder="guest@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="res-form-group">
                      <label htmlFor="res-occasion" className="res-label">Occasion</label>
                      <select
                        id="res-occasion"
                        className="res-input"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                      >
                        <option value="Family Dinner">Family Dinner</option>
                        <option value="Anniversary Celebration">Anniversary Celebration</option>
                        <option value="Birthday Dinner">Birthday Dinner</option>
                        <option value="Corporate / Business Dining">Corporate / Business Dining</option>
                        <option value="Romantic Date">Romantic Date</option>
                        <option value="Royal Banquet Gathering">Royal Banquet Gathering</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 5: Notes / Dish Pref */}
                  <div className="res-form-group">
                    <label htmlFor="res-notes" className="res-label">
                      Special Requests / Dietary Needs / Dish Pre-Order
                    </label>
                    <textarea
                      id="res-notes"
                      rows={2}
                      className="res-input res-textarea"
                      placeholder="e.g. Mild spice preference, anniversary flower arrangement, or specific dish pre-order..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="res-actions">
                    <button type="submit" className="btn-gold res-submit-btn">
                      <ShieldCheck size={18} />
                      <span>Confirm Royal Table Reservation</span>
                    </button>
                    <p className="res-guarantee font-serif">
                      * Complimentary valet parking & welcome royal Kahwa included with all reservations.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
