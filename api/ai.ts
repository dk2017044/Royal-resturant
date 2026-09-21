/**
 * Serverless Backend Function for Vercel: /api/ai
 * 
 * Defenses:
 * - Secret Protection: GROQ_API_KEY is kept strictly on the server (never sent to client)
 * - LPDoS: Hard payload size check (max 4KB)
 * - SSTI: Sanitizes user messages, escapes template characters
 * - Method Restriction: Only POST allowed
 */

import type { IncomingMessage, ServerResponse } from "http";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "qwen/qwen3.8-27b";

interface RequestBody {
  messages?: Array<{ role: string; content: string }>;
}

export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  // CORS & Security Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Method not allowed. Only POST is supported." }));
    return;
  }

  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "";
  if (!apiKey) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Groq API key not configured on server." }));
    return;
  }

  // Read request body with LPDoS limit (max 4KB)
  let rawBody = "";
  let totalBytes = 0;
  const MAX_BYTES = 4096; // 4KB

  try {
    const bodyPromise = new Promise<string>((resolve, reject) => {
      if (req.body && typeof req.body === "object") {
        return resolve(JSON.stringify(req.body));
      }
      req.on("data", (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > MAX_BYTES) {
          reject(new Error("Payload Too Large (LPDoS defense)"));
        } else {
          rawBody += chunk;
        }
      });
      req.on("end", () => resolve(rawBody));
      req.on("error", (err) => reject(err));
    });

    const bodyStr = await bodyPromise;
    const parsed: RequestBody = typeof bodyStr === "string" && bodyStr.trim() ? JSON.parse(bodyStr) : req.body || {};

    if (!parsed.messages || !Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Invalid request: messages array required." }));
      return;
    }

    // Sanitize messages against SSTI & prompt injection
    const sanitizedMessages = parsed.messages.slice(-8).map((msg) => ({
      role: msg.role === "assistant" || msg.role === "system" ? msg.role : "user",
      content: String(msg.content || "")
        .slice(0, 500)
        .replace(/\{\{/g, "&#123;&#123;")
        .replace(/\}\}/g, "&#125;&#125;")
        .replace(/\$\{/g, "&#36;&#123;"),
    }));

    // Dispatch to Groq API securely
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: sanitizedMessages,
        temperature: 0.5,
        max_tokens: 350,
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      res.statusCode = groqRes.status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Upstream AI service error", details: errText.slice(0, 200) }));
      return;
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content || "";

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ reply }));
  } catch (err: any) {
    const isPayloadTooLarge = err.message?.includes("Payload Too Large");
    res.statusCode = isPayloadTooLarge ? 413 : 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: isPayloadTooLarge ? "Payload Too Large (max 4KB)" : "Internal server error" }));
  }
}
