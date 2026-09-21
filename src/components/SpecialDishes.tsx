import React, { useState } from "react";
import { Heart, Plus, Check } from "lucide-react";
import type { MenuItem } from "../config";
import "./SpecialDishes.css";

interface SpecialDishesProps {
  onAddToCart: (dish: MenuItem) => void;
  onSelectItem?: (dish: MenuItem) => void;
  onExploreMore?: () => void;
}

export const SpecialDishes: React.FC<SpecialDishesProps> = ({
  onAddToCart,
  onSelectItem,
  onExploreMore,
}) => {
  const [favorites, setFavorites] = useState<{ [id: string]: boolean }>({});
  const [addedItems, setAddedItems] = useState<{ [id: string]: boolean }>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(dish);
    setAddedItems((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [dish.id]: false }));
    }, 1200);
  };

  // 3 Signature Special Dishes matching the card layout in Screenshot 1
  const specialDishes: MenuItem[] = [
    {
      id: "spec-1",
      name: "Murgh Musallam",
      hindiName: "मुर्ग मुसल्लम",
      category: "Curries & Chinese",
      subCategory: "Indian (Chicken)",
      price: 599,
      isVeg: false,
      image: "/data/dishes/hero-gourmet-plate.jpg",
      description: "Tender whole chicken slow-roasted in imperial Awadhi spices and savory gravy.",
      spicyLevel: 2,
      serves: "2-3 Persons",
      isChefSpecial: true,
    },
    {
      id: "spec-2",
      name: "Royal Spl. Biryani",
      hindiName: "रॉयल स्पेशल बिरयानी",
      category: "Rice, Biryani & Noodles",
      subCategory: "Biryani",
      price: 399,
      isVeg: false,
      image: "/data/dishes/plate-biryani.png",
      description: "Aged long-grain basmati simmered over charcoal embers with saffron & pure desi ghee.",
      spicyLevel: 1,
      serves: "1-2 Persons",
      isChefSpecial: true,
    },
    {
      id: "spec-3",
      name: "Paneer Tikka",
      hindiName: "पनीर टिक्का",
      category: "Tandoori & Kebabs",
      subCategory: "Tandoori (Veg)",
      price: 225,
      isVeg: true,
      image: "/data/dishes/plate-paneer-tikka.png",
      description: "Fresh cottage cheese marinated in hung curd and aromatics, charred in clay tandoor.",
      spicyLevel: 2,
      serves: "1-2 Persons",
      isChefSpecial: true,
    },
  ];

  return (
    <section className="special-dishes-section">
      <div className="container">
        {/* Section Heading matching Screenshot 1 */}
        <div className="special-dishes-header">
          <h2 className="special-dishes-title">Our Special Dish</h2>
          <p className="special-dishes-sub">
            Hand-crafted by our master chefs using time-honored slow-cooking traditions.
          </p>
        </div>

        {/* 3 Protruding Round Plate Cards matching Reference Screenshot 1 */}
        <div className="special-dishes-grid">
          {specialDishes.map((dish) => {
            const isFav = !!favorites[dish.id];
            const isJustAdded = !!addedItems[dish.id];

            return (
              <div
                key={dish.id}
                className="special-dish-card"
                onClick={() => onSelectItem?.(dish)}
              >
                {/* Round Plate Protruding from Top */}
                <div className="special-card-plate-wrap">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="special-card-plate-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Card Content */}
                <div className="special-card-body">
                  <div className="special-card-text">
                    <h3 className="special-dish-name">{dish.name}</h3>
                    <p className="special-dish-desc">{dish.description}</p>
                  </div>

                  {/* Bottom Actions Row: Price, Favorite Heart & Green Add (+) Button */}
                  <div className="special-card-footer">
                    <span className="special-dish-price">₹ {dish.price}</span>

                    <div className="special-card-actions">
                      <button
                        type="button"
                        className={`special-fav-btn ${isFav ? "active" : ""}`}
                        onClick={(e) => toggleFavorite(dish.id, e)}
                        aria-label="Add to favorites"
                      >
                        <Heart
                          size={18}
                          fill={isFav ? "#ef4444" : "none"}
                          color={isFav ? "#ef4444" : "#9ca3af"}
                        />
                      </button>

                      <button
                        type="button"
                        className={`special-add-btn ${isJustAdded ? "added" : ""}`}
                        onClick={(e) => handleAdd(dish, e)}
                        aria-label={`Add ${dish.name} to order`}
                      >
                        {isJustAdded ? <Check size={18} /> : <Plus size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Explore Full Menu Link */}
        {onExploreMore && (
          <div className="special-dishes-more-cta">
            <button
              type="button"
              className="btn-green-outline"
              onClick={onExploreMore}
            >
              <span>Explore All 220+ Delicacies in Menu →</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SpecialDishes;
