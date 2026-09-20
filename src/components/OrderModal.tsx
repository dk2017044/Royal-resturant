import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  Utensils,
  ShoppingBag,
  Bike
} from "lucide-react";
import { royalConfig } from "../config";
import "./OrderModal.css";

export interface CartItem {
  id: string;
  name: string;
  hindiName?: string;
  price: number;
  image: string;
  quantity: number;
  isVeg: boolean;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

type OrderType = "dine-in" | "takeaway" | "delivery";

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [tableNo, setTableNo] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const packagingFee = orderType === "dine-in" ? 0 : 20;
  const grandTotal = subtotal + packagingFee;

  const generateOrderText = () => {
    let text = `👑 *ROYAL RASOI - NEW ORDER* 👑\n`;
    text += `---------------------------------\n`;
    text += `*Order Type:* ${
      orderType === "dine-in"
        ? `🍽️ Dine-In (Table ${tableNo || "Not Specified"})`
        : orderType === "takeaway"
        ? "🥡 Takeaway / Pickup"
        : "🛵 Home Delivery"
    }\n`;

    if (name) text += `*Customer Name:* ${name}\n`;
    if (phone) text += `*Phone:* ${phone}\n`;
    if (orderType === "delivery" && address) text += `*Delivery Address:* ${address}\n`;
    text += `---------------------------------\n`;
    text += `*ITEMS ORDERED:*\n`;

    cart.forEach((item) => {
      text += `• ${item.quantity}x ${item.name} - ₹${item.price * item.quantity}\n`;
    });

    text += `---------------------------------\n`;
    if (packagingFee > 0) text += `*Packaging / Delivery:* ₹${packagingFee}\n`;
    text += `*TOTAL BILL:* ₹${grandTotal}\n`;
    if (notes) text += `*Special Instructions:* ${notes}\n`;
    text += `---------------------------------\n`;
    text += `Please confirm my order. Thank you!`;

    return text;
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const msg = generateOrderText();
    const encoded = encodeURIComponent(msg);
    const waNumber = "919905604856";
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Also mark confirmed locally
    const id = `RR-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(id);
    setIsConfirmed(true);
  };

  const handleDirectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    const id = `RR-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(id);
    setIsConfirmed(true);
  };

  const handleResetAndClose = () => {
    setIsConfirmed(false);
    onClearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="order-modal-backdrop" onClick={onClose}>
        <motion.div
          className="order-modal-sheet glass-panel"
          onClick={(e) => e.stopPropagation()}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
        >
          {/* Header */}
          <div className="order-modal-header">
            <div className="header-title-box">
              <span className="order-kicker font-cinzel">QUICK ORDER DESK</span>
              <h3 className="order-main-title font-cinzel">Your Royal Order</h3>
            </div>
            <button
              type="button"
              className="order-close-btn"
              onClick={onClose}
              aria-label="Close order modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Success View */}
          {isConfirmed ? (
            <div className="order-success-pane text-center">
              <CheckCircle2 size={56} className="success-icon" />
              <h3 className="success-title font-cinzel">Order Dispatched!</h3>
              <p className="success-ref font-serif">
                Order ID: <strong className="gold-text">#{orderId}</strong>
              </p>
              <p className="success-desc font-serif">
                Shukriya {name || "Guest"}! Your order has been received. Our royal khansama is preparing your delicacies piping hot.
              </p>

              <div className="success-meta-box">
                <div className="meta-row">
                  <Clock size={16} className="gold-icon" />
                  <span>Estimated Preparation: <strong>20-25 Mins</strong></span>
                </div>
                <div className="meta-row">
                  <Phone size={16} className="gold-icon" />
                  <span>Direct Kitchen Desk: <strong>{royalConfig.restaurant.phone}</strong></span>
                </div>
              </div>

              <div className="success-actions">
                <button
                  type="button"
                  className="btn-royal-primary w-full"
                  onClick={handleResetAndClose}
                >
                  <span>Done & Clear Cart</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="order-modal-body">
              {/* Order Type Tabs */}
              <div className="order-type-tabs">
                <button
                  type="button"
                  className={`type-tab-btn ${orderType === "dine-in" ? "active" : ""}`}
                  onClick={() => setOrderType("dine-in")}
                >
                  <Utensils size={16} />
                  <span>Dine-In (Table)</span>
                </button>

                <button
                  type="button"
                  className={`type-tab-btn ${orderType === "takeaway" ? "active" : ""}`}
                  onClick={() => setOrderType("takeaway")}
                >
                  <ShoppingBag size={16} />
                  <span>Takeaway</span>
                </button>

                <button
                  type="button"
                  className={`type-tab-btn ${orderType === "delivery" ? "active" : ""}`}
                  onClick={() => setOrderType("delivery")}
                >
                  <Bike size={16} />
                  <span>Delivery</span>
                </button>
              </div>

              {/* Items List */}
              <div className="order-items-scroll">
                {cart.length === 0 ? (
                  <div className="empty-cart-view text-center">
                    <p className="empty-cart-text font-serif">Your order cart is empty.</p>
                    <button
                      type="button"
                      className="btn-royal-glass"
                      onClick={onClose}
                    >
                      <span>Explore Royal Menu</span>
                    </button>
                  </div>
                ) : (
                  <div className="order-items-list">
                    {cart.map((item) => (
                      <div key={item.id} className="order-item-row">
                        <div className="item-left-meta">
                          <img src={item.image} alt={item.name} className="order-item-thumb" />
                          <div className="item-name-box">
                            <div className="item-title-wrap">
                              <span className={`diet-dot ${item.isVeg ? "veg" : "nonveg"}`}></span>
                              <h4 className="item-name font-cinzel">{item.name}</h4>
                            </div>
                            <span className="item-unit-price font-serif">₹{item.price} each</span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="item-qty-controls">
                          <button
                            type="button"
                            className="qty-btn minus"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-number font-cinzel">{item.quantity}</span>
                          <button
                            type="button"
                            className="qty-btn plus"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                          <span className="item-row-total font-cinzel">
                            ₹{item.price * item.quantity}
                          </span>
                          <button
                            type="button"
                            className="item-delete-btn"
                            onClick={() => onRemoveItem(item.id)}
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Form Details */}
              {cart.length > 0 && (
                <form onSubmit={handleDirectConfirm} className="order-details-form">
                  <div className="form-row-2">
                    <input
                      type="text"
                      placeholder="Your Name (Aapka Naam)"
                      className="order-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number (Mobile No.)"
                      className="order-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  {orderType === "dine-in" && (
                    <div className="form-row-single">
                      <input
                        type="text"
                        placeholder="Table Number (e.g. Table 4, Family Cabin 2)"
                        className="order-input"
                        value={tableNo}
                        onChange={(e) => setTableNo(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {orderType === "delivery" && (
                    <div className="form-row-single">
                      <input
                        type="text"
                        placeholder="Delivery Address in Sadikpur / Patna City"
                        className="order-input"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="form-row-single">
                    <input
                      type="text"
                      placeholder="Cooking Instructions (e.g. Less spicy, Extra green chutney, Boiled egg)"
                      className="order-input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* Bill Summary */}
                  <div className="bill-summary-box">
                    <div className="bill-row">
                      <span>Total Items:</span>
                      <span>{totalItems} items</span>
                    </div>
                    <div className="bill-row">
                      <span>Items Subtotal:</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {packagingFee > 0 && (
                      <div className="bill-row">
                        <span>Packaging & Delivery:</span>
                        <span>₹{packagingFee}</span>
                      </div>
                    )}
                    <div className="bill-divider"></div>
                    <div className="bill-row grand-total-row">
                      <span className="font-cinzel">Total Amount:</span>
                      <span className="total-val gold-text font-cinzel">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* 1-Click Fast Actions */}
                  <div className="order-actions-grid">
                    {/* Primary: 1-Click WhatsApp Order */}
                    <button
                      type="button"
                      className="btn-whatsapp-order"
                      onClick={handleWhatsAppOrder}
                    >
                      <MessageSquare size={18} />
                      <div className="btn-text-group">
                        <span className="btn-main-text">Order via WhatsApp</span>
                        <span className="btn-sub-text">Instant 1-Tap Kitchen Dispatch</span>
                      </div>
                    </button>

                    {/* Secondary: Call to Order */}
                    <a
                      href={`tel:${royalConfig.restaurant.phone}`}
                      className="btn-call-order"
                    >
                      <Phone size={18} />
                      <span>Call {royalConfig.restaurant.phone}</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderModal;
