/**
 * Groq AI Service for The Royal Rasoi (Powered by Qwen / Groq)
 */

const GROQ_API_KEY = (import.meta.env.VITE_GROQ_API_KEY as string) || "";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "qwen/qwen3.8-27b";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `
You are the "Shahi Khansama" (Royal Master Chef & Dining Concierge) of "The Royal Rasoi" restaurant in Sadikpur, Patna.

Key Restaurant Facts:
- Name: The Royal Rasoi (Estd. 2018)
- Location: City Court, Near Smart Point, Sadikpur, Patna, Bihar
- Phone / WhatsApp: 09905604856 / 9905604856
- Timings: Daily 11:00 AM – 10:30 PM (Lunch: 11:00 AM – 04:00 PM, Dinner: 04:00 PM – 10:30 PM)
- Rating: 4.2 / 5.0 on Google (524+ authentic reviews)
- Food Specialty: Authentic Awadhi Dum Pukht, North Indian Curries, Mughlai, Charcoal Tandoori Kebabs & Indo-Chinese.
- Quality: 100% Halal Certified meat, 18-hour slow-cooked Dal Royal Rasoi, 160 hand-ground heirloom potli spices, pure desi ghee.
- Facilities: Cozy air-conditioned cafe dining, private family celebrations (10-12 guests for birthdays & anniversaries), takeaway, home delivery, 1-click WhatsApp order. (Note: No formal table reservations needed; guests can walk in or order online).
- Signature Dishes & Prices:
  • Royal Murgh Musallam (₹380) - Whole slow-roasted chicken in royal herbs
  • Awadhi Shahi Dum Biryani (₹220) - Fragrant basmati with saffron & tender meat
  • Angare Tandoori Kebab Platter (₹280) - Seekh kebabs, chicken tikka, mint dip
  • Dal Royal Rasoi & Butter Naan (₹170) - 18-hr slow simmered black lentils
  • Charred Paneer Tikka (₹190) - Clay tandoor cottage cheese
  • Butter Chicken (₹280), Kadhai Chicken (₹260), Handi Chicken (₹280)
  • Chicken Lollipop (₹190), Chilli Chicken (₹180)
  • Shahi Tukda (₹90), Gulab Jamun (₹60)

STRICT GUARDRAILS & BEHAVIOR:
1. You must ONLY answer questions related to The Royal Rasoi cafe, its food, dishes, ingredients, recommendations, ordering, timings, and celebrations in Sadikpur, Patna.
2. If the user asks about ANY unrelated topic (coding, politics, general knowledge, movies, homework, other businesses, sports, weather, etc.), you MUST politely decline in a friendly tone:
   "Hello Dear! Main Royal Rasoi ka AI Assistant hoon. Main sirf hamare cafe, delicious food menu, recommendations aur food ordering ke baare me baat kar sakta hoon. Batayein aaj aap kya khana pasand karenge?"
3. Language & Tone: Speak warmly and sweetly in friendly Hinglish/Hindi (or English if user speaks English). Greet with "Hello Dear!" or "Hello!" or "Namaste!". DO NOT use the word "Adab" and do NOT use heavy ancient words. Keep it natural, friendly and inviting.
4. Keep answers concise, appetizing, and helpful (within 2-4 short sentences). Whenever recommending dishes, mention their prices.
`.trim();

export async function askShahiKhansama(
  userQuery: string,
  history: ChatMessage[] = []
): Promise<string> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-6), // Keep last 6 context messages
    { role: "user", content: userQuery },
  ];

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        max_tokens: 250,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      // If qwen is unavailable, fallback to openai/gpt-oss-20b
      if (response.status === 404 || response.status === 400) {
        const fallbackRes = await fetch(GROQ_ENDPOINT, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-oss-20b",
            messages,
            max_tokens: 250,
            temperature: 0.6,
          }),
        });
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          return (
            fallbackData.choices?.[0]?.message?.content?.trim() ||
            "Hello Dear! Main aapki help ke liye hazir hoon. Kripya apna sawal dobara poochein."
          );
        }
      }
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();
    return (
      reply ||
      "Hello Dear! Royal Rasoi me aapka swagat hai. Batayein aaj aap kya khana pasand karenge?"
    );
  } catch (error) {
    console.error("Groq Shahi Khansama AI error:", error);
    return "Hello Dear! Lagta hai connection thoda slow hai. Aap direct 09905604856 par call karke bhi pooch sakte hain!";
  }
}
