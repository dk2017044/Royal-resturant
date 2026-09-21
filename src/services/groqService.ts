/**
 * Secure Groq AI Service for The Royal Rasoi
 * 
 * Security Defenses Applied:
 * - Secret Key Protection: Calls serverless /api/ai proxy so keys are never leaked to client bundle
 * - SSTI Protection: Sanitizes user message against template injection delimiters
 * - LPDoS Defense: Enforces strict length limits on user input (max 300 chars)
 */

import { sanitizeTemplateInput, clampPayload, PAYLOAD_LIMITS } from "../utils/security";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const API_AI_ENDPOINT = "/api/ai";

export async function askShahiKhansama(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<string> {
  // LPDoS & SSTI defense: sanitize and truncate user input
  const safeQuery = sanitizeTemplateInput(
    clampPayload(userQuery, PAYLOAD_LIMITS.AI_CHAT_INPUT),
    PAYLOAD_LIMITS.AI_CHAT_INPUT
  );

  if (!safeQuery) {
    return "Hello Dear! Kripya apna sawal poochein, main zaroor madad karunga.";
  }

  const messages: ChatMessage[] = [
    ...history.slice(-6), // Keep last 6 context messages
    { role: "user", content: safeQuery },
  ];

  try {
    const response = await fetch(API_AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.reply) {
        return data.reply.trim();
      }
    }

    // If serverless endpoint returned an error or is in pure static environment
    console.warn("AI endpoint response status:", response.status);
    return getOfflineRecommendation(safeQuery);
  } catch (error) {
    console.warn("AI service unreachable, using smart offline recommendation fallback", error);
    return getOfflineRecommendation(safeQuery);
  }
}

/**
 * High-speed offline recommendation fallback if network/API is slow
 */
function getOfflineRecommendation(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("momo") || q.includes("dumpling")) {
    return "Hello Dear! Humare paas 15 tarah ke momos hain! Try kijiye humara Chicken Afghani Momo (₹145) ya Crispy Paneer Momo (₹125), jo fiery red chutney aur creamy mayo ke sath serve hota hai.";
  }
  if (q.includes("burger") || q.includes("sandwich") || q.includes("snack")) {
    return "Hello Dear! Snacks me humara Snacks Combo (₹179) best hai jisme French Fries, Veg Grilled Sandwich, 2 Fried Momos aur Cold Drink milti hai! Ya try kijiye Chicken Cheese Burger (₹125).";
  }
  if (q.includes("biryani") || q.includes("rice")) {
    return "Hello Dear! Biryani lovers ke liye Lucknowi Dum Handi Biryani aur Royal Spl. Biryani (₹399) Patna me best hai. Sath me Chicken Biryani (₹250) aur Egg Biryani (₹172) bhi available hai.";
  }
  if (q.includes("paneer") || q.includes("veg") || q.includes("thali")) {
    return "Hello Dear! Pure veg me Royal Spl. Veg Thali (₹269) poori meal hai, ya try kijiye Paneer Tikka (₹225) aur Butter Naan (₹40) ke sath Paneer Butter Masala!";
  }
  if (q.includes("party") || q.includes("birthday") || q.includes("celebrat")) {
    return "Hello Dear! The Royal Rasoi me hum 10-12 logon ki cozy private birthday & anniversary parties host karte hain! Booking aur custom combo ke liye 09905604856 par call ya WhatsApp karein.";
  }

  return "Hello Dear! Royal Rasoi me aapka swagat hai. Awadhi curries, tandoori kebabs aur Indo-Chinese ke liye menu check karein ya direct 09905604856 par call karein!";
}
