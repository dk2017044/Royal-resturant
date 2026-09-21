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

import {
  sanitizeTemplateInput,
  safeSanitizePhone,
  verifyCartPrices,
  idempotencyGuard,
  safeCopyToClipboard,
  PAYLOAD_LIMITS,
} from "../utils/security";

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
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  // Security: Canonical Price Re-Verification to prevent client-side price tampering / replay
  const verifiedBill = verifyCartPrices(cart, orderType);
  const totalItems = cart.reduce(
    (sum, item) => sum + Math.max(1, Math.min(PAYLOAD_LIMITS.MAX_CART_ITEM_QTY, Math.floor(item.quantity) || 1)),
    0
  );
  const subtotal = verifiedBill.subtotal;
  const packagingFee = verifiedBill.packagingFee;
  const grandTotal = verifiedBill.grandTotal;

  const validateCustomerDetails = (): boolean => {
    const errs: {
      name?: string;
      phone?: string;
      address?: string;
    } = {};

    const cleanName = sanitizeTemplateInput(name, PAYLOAD_LIMITS.CUSTOMER_NAME);
    if (!cleanName.trim()) {
      errs.name = "Please enter your name (Aapka naam zaroori hai)";
    } else if (cleanName.trim().length < 2) {
      errs.name = "Name must be at least 2 characters";
    }

    // Security: ReDoS-safe linear phone validation
    const phoneCheck = safeSanitizePhone(phone);
    if (!phoneCheck.isValid) {
      errs.phone = phoneCheck.error || "Please enter a valid 10-digit mobile number";
    }

    if (orderType === "delivery") {
      const cleanAddress = sanitizeTemplateInput(address, PAYLOAD_LIMITS.ADDRESS);
      if (!cleanAddress.trim()) {
        errs.address = "Please enter delivery address in Sadikpur / Patna City";
      }
    }

    setFormErrors(errs);
    const isValid = Object.keys(errs).length === 0;
    setShowErrorBanner(!isValid);
    return isValid;
  };

  const generateOrderText = (nonce: string) => {
    // Security: SSTI & Template Injection defense
    const cleanName = sanitizeTemplateInput(name, PAYLOAD_LIMITS.CUSTOMER_NAME);
    const cleanPhone = safeSanitizePhone(phone).cleanPhone || phone.slice(0, 15);
    const cleanAddress = sanitizeTemplateInput(address, PAYLOAD_LIMITS.ADDRESS);
    const cleanNotes = sanitizeTemplateInput(notes, PAYLOAD_LIMITS.SPECIAL_INSTRUCTIONS);

    let text = `👑 *ROYAL RASOI - NEW ORDER* [REF: #${nonce}] 👑\n`;
    text += `---------------------------------\n`;
    text += `*Order Type:* ${
      orderType === "dine-in"
        ? "☕ At Cafe / Dine-In"
        : orderType === "takeaway"
        ? "🥡 Takeaway / Pickup"
        : "🛵 Home Delivery"
    }\n`;

    if (cleanName) text += `*Customer Name:* ${cleanName}\n`;
    if (cleanPhone) text += `*Phone:* ${cleanPhone}\n`;
    if (orderType === "delivery" && cleanAddress) text += `*Delivery Address:* ${cleanAddress}\n`;
    text += `---------------------------------\n`;
    text += `*ITEMS ORDERED:*\n`;

    cart.forEach((item) => {
      const canonicalItem = royalConfig.menu.find((d) => d.id === item.id);
      const verifiedPrice = canonicalItem ? canonicalItem.price : item.price;
      const validQty = Math.max(1, Math.min(PAYLOAD_LIMITS.MAX_CART_ITEM_QTY, Math.floor(item.quantity) || 1));
      text += `• ${validQty}x ${item.name} - ₹${verifiedPrice * validQty}\n`;
    });

    text += `---------------------------------\n`;
    if (packagingFee > 0) text += `*Packaging / Delivery:* ₹${packagingFee}\n`;
    text += `*TOTAL BILL:* ₹${grandTotal}\n`;
    if (cleanNotes) text += `*Special Instructions:* ${cleanNotes}\n`;
    text += `---------------------------------\n`;
    text += `Please confirm my order. Thank you!`;

    return text;
  };

  const handleWhatsAppOrder = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return;
    if (!validateCustomerDetails()) return;

    // Security: Replay attack & duplicate submission guard
    const orderNonce = idempotencyGuard.generateOrderNonce();
    const submissionKey = `${phone}_${grandTotal}_${cart.length}`;
    if (!idempotencyGuard.canSubmit(submissionKey)) {
      alert("Order already being dispatched! Please wait a moment.");
      return;
    }

    const msg = generateOrderText(orderNonce);
    const encoded = encodeURIComponent(msg);
    const waNumber = "919905604856";
    const waUrl = `https://wa.me/${waNumber}?text=${encoded}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Also mark confirmed locally
    setOrderId(orderNonce);
    setIsConfirmed(true);
  };

  const handleDirectConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!validateCustomerDetails()) return;

    const orderNonce = idempotencyGuard.generateOrderNonce();
    const submissionKey = `${phone}_${grandTotal}_${cart.length}`;
    if (!idempotencyGuard.canSubmit(submissionKey)) {
      alert("Order already being dispatched! Please wait a moment.");
      return;
    }

    setOrderId(orderNonce);
    setIsConfirmed(true);
  };

  const handleCopyOrder = async () => {
    const summary = `Royal Rasoi Order Ref: #${orderId} | Total: ₹${grandTotal} | Phone: ${royalConfig.restaurant.phone}`;
    const success = await safeCopyToClipboard(summary);
    if (success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
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
                Shukriya {name || "Guest"}! Your order has been received. Our kitchen team is preparing your food piping hot.
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

              <div className="success-actions" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <button
                  type="button"
                  className="btn-royal-secondary w-full"
                  onClick={handleCopyOrder}
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  <span>{isCopied ? "✓ Copied to Clipboard!" : "📋 Copy Order Details"}</span>
                </button>
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
                  <span>At Cafe / Dine-In</span>
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

              {/* Items List Section Header */}
              {cart.length > 0 && (
                <div className="cart-items-section-header">
                  <span className="cart-items-count-badge font-cinzel">
                    DISHES IN ORDER ({totalItems})
                  </span>
                  <button
                    type="button"
                    className="cart-clear-all-link font-serif"
                    onClick={onClearCart}
                    title="Clear entire cart"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Items List */}
              <div className="order-items-scroll">
                {cart.length === 0 ? (
                  <div className="empty-cart-view text-center">
                    <ShoppingBag size={42} className="empty-cart-icon" />
                    <p className="empty-cart-text font-serif">Your royal feast cart is empty.</p>
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
                      <div key={item.id} className="order-item-card">
                        {/* Top: Image, Names & Delete */}
                        <div className="item-card-top">
                          <div className="item-thumb-wrapper">
                            <img src={item.image} alt={item.name} className="order-item-thumb" />
                            <span className={`item-diet-tag ${item.isVeg ? "veg" : "nonveg"}`}>
                              <span className="diet-dot-inner"></span>
                            </span>
                          </div>

                          <div className="item-details-column">
                            <h4 className="item-name font-cinzel">{item.name}</h4>
                            {item.hindiName && (
                              <span className="item-hindi font-serif">{item.hindiName}</span>
                            )}
                            <span className="item-unit-rate font-serif">₹{item.price} each</span>
                          </div>

                          <button
                            type="button"
                            className="item-remove-icon-btn"
                            onClick={() => onRemoveItem(item.id)}
                            title={`Remove ${item.name}`}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Bottom: Stepper & Subtotal */}
                        <div className="item-card-bottom">
                          <div className="item-stepper-pill">
                            <button
                              type="button"
                              className="stepper-btn minus"
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="stepper-qty font-cinzel">{item.quantity}</span>
                            <button
                              type="button"
                              className="stepper-btn plus"
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <div className="item-line-total-box">
                            <span className="item-total-label font-serif">Subtotal:</span>
                            <span className="item-total-amount font-cinzel">
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Form Details */}
              {cart.length > 0 && (
                <form onSubmit={handleDirectConfirm} className="order-details-form" noValidate>
                  <div className="form-row-2">
                    <div className="input-group">
                      <input
                        type="text"
                        placeholder="Your Name (Aapka Naam) *"
                        maxLength={PAYLOAD_LIMITS.CUSTOMER_NAME}
                        className={`order-input ${formErrors.name ? "input-error" : ""}`}
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (formErrors.name) {
                            setFormErrors((prev) => ({ ...prev, name: undefined }));
                            setShowErrorBanner(false);
                          }
                        }}
                        required
                      />
                      {formErrors.name && (
                        <span className="field-error-text">{formErrors.name}</span>
                      )}
                    </div>

                    <div className="input-group">
                      <input
                        type="tel"
                        placeholder="Phone Number (10-Digit Mobile) *"
                        maxLength={PAYLOAD_LIMITS.PHONE_NUMBER}
                        className={`order-input ${formErrors.phone ? "input-error" : ""}`}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (formErrors.phone) {
                            setFormErrors((prev) => ({ ...prev, phone: undefined }));
                            setShowErrorBanner(false);
                          }
                        }}
                        required
                      />
                      {formErrors.phone && (
                        <span className="field-error-text">{formErrors.phone}</span>
                      )}
                    </div>
                  </div>


                  {orderType === "delivery" && (
                    <div className="form-row-single">
                      <input
                        type="text"
                        placeholder="Delivery Address in Sadikpur / Patna City *"
                        maxLength={PAYLOAD_LIMITS.ADDRESS}
                        className={`order-input ${formErrors.address ? "input-error" : ""}`}
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          if (formErrors.address) {
                            setFormErrors((prev) => ({ ...prev, address: undefined }));
                            setShowErrorBanner(false);
                          }
                        }}
                        required
                      />
                      {formErrors.address && (
                        <span className="field-error-text">{formErrors.address}</span>
                      )}
                    </div>
                  )}

                  <div className="form-row-single">
                    <input
                      type="text"
                      placeholder="Cooking Instructions (e.g. Less spicy, Extra green chutney, Boiled egg)"
                      maxLength={PAYLOAD_LIMITS.SPECIAL_INSTRUCTIONS}
                      className="order-input"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* Validation Error Alert Banner */}
                  {showErrorBanner && (
                    <div className="order-validation-banner">
                      <span>⚠️ Please fill in all required customer details (* marked) to proceed.</span>
                    </div>
                  )}

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
