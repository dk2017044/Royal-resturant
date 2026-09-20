import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Crown,
  X,
  Send,
  Sparkles,
  Phone,
  Utensils,
  Bot,
  ShoppingBag
} from "lucide-react";
import { askShahiKhansama, type ChatMessage } from "../services/groqService";
import { royalConfig } from "../config";
import "./ShahiKhansamaAI.css";

interface ShahiKhansamaAIProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
  onOpenOrderModal?: () => void;
  hasCartItems?: boolean;
}

export const ShahiKhansamaAI: React.FC<ShahiKhansamaAIProps> = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  initialQuery = "",
  onClearInitialQuery,
  onOpenOrderModal,
  hasCartItems = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  const handleSetIsOpen = (open: boolean) => {
    if (!open && externalOnClose) {
      externalOnClose();
    }
    setInternalIsOpen(open);
  };

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello Dear! Main Rasoi AI hoon — The Royal Rasoi ka smart food assistant. Aap momos, burgers, pakode, biryani, starters, curries ya 10-12 logon ki birthday party ke baare me kuch bhi pooch sakte hain. Batayein aaj aap kya khana pasand karenge?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const quickQuestions = [
    "🥟 Momos & Snacks me kya hai?",
    "🍔 Best Burgers & Sandwiches",
    "🍗 Best Non-Veg & Biryani",
    "🧀 Pure Veg & Paneer Special",
    "🎉 Birthday Party (10-12 Log)",
    "⏰ Timings & Location kya hai?",
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || isLoading) return;

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: textToSend },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await askShahiKhansama(textToSend, messages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Hello Dear! Lagta hai connection thoda slow hai. Aap seedhe 09905604856 par call kar sakte hain!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSetIsOpen(true);
      handleSend(initialQuery.trim());
      onClearInitialQuery?.();
    }
  }, [initialQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleScrollToMenu = () => {
    handleSetIsOpen(false);
    const el = document.getElementById("menu");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        className={`shahi-ai-floating-btn ${hasCartItems ? "has-cart-items" : ""}`}
        onClick={() => handleSetIsOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Ask Rasoi AI"
      >
        <div className="btn-crown-icon">
          <Crown size={19} />
          <span className="live-sparkle-dot"></span>
        </div>
        <span className="btn-ai-text font-cinzel">Rasoi AI</span>
      </motion.button>

      {/* Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="shahi-chat-overlay" onClick={() => handleSetIsOpen(false)}>
            <motion.div
              className="shahi-chat-window glass-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 26, stiffness: 350 }}
            >
              {/* Header */}
              <div className="shahi-chat-header">
                <div className="header-left">
                  <div className="khansama-avatar">
                    <Bot size={22} />
                  </div>
                  <div>
                    <div className="avatar-title-row">
                      <h3 className="khansama-name font-cinzel">Rasoi AI</h3>
                      <span className="online-badge">Online</span>
                    </div>
                    <p className="khansama-role font-serif">
                      Cafe Food Assistant • The Royal Rasoi
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  className="chat-close-btn"
                  onClick={() => handleSetIsOpen(false)}
                  aria-label="Close chat"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="quick-chips-bar">
                <div className="chips-scroll">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="quick-chip font-serif"
                      onClick={() => handleSend(q)}
                      disabled={isLoading}
                    >
                      <Sparkles size={12} className="gold-icon" />
                      <span>{q}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages Container */}
              <div className="shahi-messages-container">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`chat-msg-row ${
                      msg.role === "user" ? "msg-user" : "msg-assistant"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="bot-bubble-icon">
                        <Crown size={14} />
                      </div>
                    )}
                    <div className="chat-msg-bubble font-serif">
                      <p className="msg-text">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="chat-msg-row msg-assistant">
                    <div className="bot-bubble-icon">
                      <Crown size={14} />
                    </div>
                    <div className="chat-msg-bubble thinking-bubble">
                      <span className="dot-pulse"></span>
                      <span className="dot-pulse"></span>
                      <span className="dot-pulse"></span>
                      <span className="thinking-text font-serif">Rasoi AI soch raha hai...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions Bar */}
              <div className="chat-quick-actions">
                <button
                  type="button"
                  className="quick-action-link"
                  onClick={handleScrollToMenu}
                >
                  <Utensils size={14} />
                  <span>View Menu</span>
                </button>

                {onOpenOrderModal && (
                  <button
                    type="button"
                    className="quick-action-link"
                    onClick={() => {
                      handleSetIsOpen(false);
                      onOpenOrderModal();
                    }}
                  >
                    <ShoppingBag size={14} />
                    <span>Order Online</span>
                  </button>
                )}

                <a
                  href={`tel:${royalConfig.restaurant.phone}`}
                  className="quick-action-link"
                >
                  <Phone size={14} />
                  <span>Call Cafe</span>
                </a>
              </div>

              {/* Input Bar */}
              <div className="shahi-chat-input-bar">
                <input
                  type="text"
                  className="shahi-input"
                  placeholder="Poochiye (e.g. momos, burger, pakoda, biryani, party)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="shahi-send-btn"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShahiKhansamaAI;
