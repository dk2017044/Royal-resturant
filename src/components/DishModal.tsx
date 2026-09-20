import React, { useEffect } from "react";
import { X, Flame, Crown, Users, CalendarCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { MenuItem } from "../config";
import "./DishModal.css";

interface DishModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onBookTableForDish: (dishName: string) => void;
}

export const DishModal: React.FC<DishModalProps> = ({ item, onClose, onBookTableForDish }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div 
          className="dish-modal-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="dish-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <button 
              type="button" 
              className="dish-modal-close"
              onClick={onClose}
              aria-label="Close details"
            >
              <X size={20} />
            </button>

            <div className="dish-modal-grid">
              <div className="modal-img-wrap">
                <img src={item.image} alt={item.name} />
                <span className={`modal-diet-pill ${item.isVeg ? "veg" : "non-veg"}`}>
                  <span className="dot"></span>
                  <span>{item.isVeg ? "Pure Vegetarian" : "Gourmet Non-Veg"}</span>
                </span>
              </div>

              <div className="modal-info-wrap">
                <div className="modal-top-badges">
                  <span className="modal-cat-tag">{item.category}</span>
                  {item.isChefSpecial && (
                    <span className="modal-chef-tag">
                      <Crown size={13} />
                      Chef's Signature
                    </span>
                  )}
                </div>

                <h2 className="modal-dish-name font-cinzel">{item.name}</h2>
                {item.hindiName && (
                  <span className="modal-dish-hindi font-serif">{item.hindiName}</span>
                )}

                <div className="modal-price-row">
                  <span className="modal-price">₹{item.price}</span>
                  <div className="modal-meta-chips">
                    <span className="meta-chip">
                      <Users size={13} />
                      {item.serves}
                    </span>
                    <span className="meta-chip">
                      <Flame size={13} className="chilli-red" />
                      Spice: {item.spicyLevel}/3
                    </span>
                  </div>
                </div>

                <p className="modal-desc font-serif">{item.description}</p>

                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn-gold modal-reserve-btn"
                    onClick={() => {
                      onClose();
                      onBookTableForDish(item.name);
                    }}
                  >
                    <CalendarCheck size={16} />
                    <span>Reserve Table for this Dish</span>
                  </button>
                  <button
                    type="button"
                    className="btn-outline-gold"
                    onClick={onClose}
                  >
                    Back to Menu
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
