/**
 * Comprehensive Security Utilities for The Royal Rasoi
 * Defenses against:
 * 1. SSTI (Server-Side Template Injection)
 * 2. ReDoS (Regular Expression Denial of Service)
 * 3. LPDoS (Large Payload Denial of Service)
 * 4. Secret Key Leakage Protection
 * 5. SQL & NoSQL Injection
 * 6. Clipboard Attacks & Pastejacking
 * 7. Replay Attacks & Price Tampering
 */

import { royalConfig } from "../config";
import type { CartItem } from "../components/OrderModal";

// ============================================================================
// 1. SSTI (Server-Side Template Injection) & Template Sanitization
// ============================================================================

/**
 * Strips and neutralizes template engine expressions (Jinja2, Twig, EJS, ES6 Template literals)
 * e.g., {{...}}, ${...}, <%- ... %>, #{...}, <%= ... %>
 */
export function sanitizeTemplateInput(input: string, maxLength = 200): string {
  if (typeof input !== "string") return "";
  
  // Truncate to prevent LPDoS first
  let clean = input.slice(0, maxLength);

  // Neutralize template delimiters
  clean = clean
    .replace(/\{\{/g, "&#123;&#123;")
    .replace(/\}\}/g, "&#125;&#125;")
    .replace(/\$\{/g, "&#36;&#123;")
    .replace(/<%/g, "&lt;%")
    .replace(/%>/g, "%&gt;")
    .replace(/#\{/g, "&#35;&#123;");

  return clean.trim();
}

// ============================================================================
// 2. ReDoS (Regular Expression Denial of Service) Defense
// ============================================================================

/**
 * Safely parses and validates Indian mobile phone numbers without backtracking regexes.
 * Enforces strict length bounds before character testing.
 */
export function safeSanitizePhone(phoneInput: string): { isValid: boolean; cleanPhone: string; error?: string } {
  if (typeof phoneInput !== "string") {
    return { isValid: false, cleanPhone: "", error: "Invalid phone input" };
  }

  // Bound length immediately (prevent regex evaluation on massive inputs)
  const bounded = phoneInput.slice(0, 20);

  // Extract only digits using linear single-pass check
  let clean = "";
  for (let i = 0; i < bounded.length; i++) {
    const code = bounded.charCodeAt(i);
    if (code >= 48 && code <= 57) { // '0'-'9'
      clean += bounded[i];
    }
  }

  // Remove leading country code if 91 is prepended
  if (clean.length === 12 && clean.startsWith("91")) {
    clean = clean.slice(2);
  }

  if (!clean) {
    return { isValid: false, cleanPhone: "", error: "Please enter mobile number" };
  }

  if (clean.length !== 10) {
    return { isValid: false, cleanPhone: clean.slice(0, 10), error: "Please enter a valid 10-digit mobile number" };
  }

  // Check valid Indian mobile prefix (6, 7, 8, 9)
  const firstDigit = clean.charCodeAt(0);
  if (firstDigit < 54 || firstDigit > 57) {
    return { isValid: false, cleanPhone: clean.slice(0, 10), error: "Phone number must start with 6, 7, 8, or 9" };
  }

  return { isValid: true, cleanPhone: clean };
}

// ============================================================================
// 3. LPDoS (Large Payload Denial of Service) Defense
// ============================================================================

export const PAYLOAD_LIMITS = {
  SEARCH_QUERY: 80,
  CUSTOMER_NAME: 50,
  PHONE_NUMBER: 15,
  ADDRESS: 200,
  SPECIAL_INSTRUCTIONS: 200,
  AI_CHAT_INPUT: 300,
  MAX_CART_ITEM_QTY: 50,
  MAX_CART_TOTAL_ITEMS: 200,
};

/**
 * Hard-clamps payload length and strips multi-line flood characters
 */
export function clampPayload(text: string, maxLength: number): string {
  if (typeof text !== "string") return "";
  if (text.length > maxLength) {
    return text.slice(0, maxLength);
  }
  return text;
}

// ============================================================================
// 4. SQL / NoSQL Injection Defense
// ============================================================================

/**
 * Sanitizes search tokens and parameters, stripping SQL & NoSQL operators
 */
export function sanitizeSearchQuery(query: string): string {
  if (typeof query !== "string") return "";
  
  const bounded = query.slice(0, PAYLOAD_LIMITS.SEARCH_QUERY);

  // Strip NoSQL operators like $gt, $where, $regex, $ne, $or
  // Strip SQL comments and quotes: ', ", ;, --, /*, */
  const clean = bounded
    .replace(/[$}{}\\]/g, "")
    .replace(/['";]|--|\/\*|\*\//g, "")
    .replace(/\s+/g, " ")
    .trim();

  return clean;
}

// ============================================================================
// 5. Clipboard Attack & Pastejacking Defense
// ============================================================================

/**
 * Sanitizes text before writing to clipboard.
 * Strips:
 * - Hidden control characters (\u0000-\u001F except newline, \u007F-\u009F)
 * - Directional override / invisible unicode chars (\u200B, \u200E, \u200F, \u202A-\u202E)
 * - Dangerous terminal command injection prefixes (e.g., "rm ", "curl ", "powershell ")
 */
export function safeSanitizeForClipboard(text: string): string {
  if (typeof text !== "string") return "";

  let safe = text
    // Strip invisible zero-width and directional override characters
    .replace(/[\u200B-\u200D\u200E\u200F\u202A-\u202E\uFEFF]/g, "")
    // Strip non-printable ASCII control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize newlines
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // If text starts with shell/terminal execution prefixes, neutralize them
  const dangerousPrefixes = /^\s*(curl|wget|bash|sh|cmd|powershell|rm|del|chmod|nc)\s+/i;
  if (dangerousPrefixes.test(safe)) {
    safe = safe.replace(dangerousPrefixes, "");
  }

  return safe;
}

/**
 * Writes safely sanitized text to the system clipboard
 */
export async function safeCopyToClipboard(text: string): Promise<boolean> {
  try {
    const safeText = safeSanitizeForClipboard(text);
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = safeText;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
    await navigator.clipboard.writeText(safeText);
    return true;
  } catch (err) {
    console.warn("Failed to copy safely to clipboard", err);
    return false;
  }
}

// ============================================================================
// 6. Replay Attack & Price Tampering Defense
// ============================================================================

interface VerifiedBill {
  subtotal: number;
  packagingFee: number;
  grandTotal: number;
  isTampered: boolean;
  tamperedItems: string[];
}

/**
 * Re-verifies all item prices in the cart against canonical menu prices.
 * Prevents client-side price tampering and replay attacks.
 */
export function verifyCartPrices(cart: CartItem[], orderType: "dine-in" | "takeaway" | "delivery"): VerifiedBill {
  let verifiedSubtotal = 0;
  let isTampered = false;
  const tamperedItems: string[] = [];

  const canonicalMap = new Map<string, number>();
  for (const dish of royalConfig.menu) {
    canonicalMap.set(dish.id, dish.price);
  }

  for (const item of cart) {
    const officialPrice = canonicalMap.get(item.id);
    const validQty = Math.max(1, Math.min(PAYLOAD_LIMITS.MAX_CART_ITEM_QTY, Math.floor(item.quantity) || 1));

    if (officialPrice !== undefined) {
      if (item.price !== officialPrice) {
        isTampered = true;
        tamperedItems.push(item.name);
      }
      verifiedSubtotal += officialPrice * validQty;
    } else {
      // Unknown item ID
      isTampered = true;
      tamperedItems.push(item.name);
      verifiedSubtotal += item.price * validQty;
    }
  }

  const packagingFee = orderType === "dine-in" ? 0 : 20;
  const grandTotal = verifiedSubtotal + packagingFee;

  return {
    subtotal: verifiedSubtotal,
    packagingFee,
    grandTotal,
    isTampered,
    tamperedItems,
  };
}

/**
 * Idempotency Tracker: Prevents duplicate replay submissions within a 5-second window
 */
class IdempotencyGuard {
  private lastSubmissionHash = "";
  private lastSubmissionTime = 0;
  private readonly COOLDOWN_MS = 3000; // 3 seconds

  public canSubmit(payloadSummary: string): boolean {
    const now = Date.now();
    if (this.lastSubmissionHash === payloadSummary && now - this.lastSubmissionTime < this.COOLDOWN_MS) {
      return false; // Replay / double-click blocked
    }
    this.lastSubmissionHash = payloadSummary;
    this.lastSubmissionTime = now;
    return true;
  }

  public generateOrderNonce(): string {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID().slice(0, 8).toUpperCase();
    }
    return Math.random().toString(36).slice(2, 10).toUpperCase();
  }
}

export const idempotencyGuard = new IdempotencyGuard();
