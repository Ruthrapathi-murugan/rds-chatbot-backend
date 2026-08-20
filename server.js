import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

const groqApiKey = process.env.GROQ_API_KEY?.trim();
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;

app.post("/chat", async (req, res) => {
  const userMessage = typeof req.body?.message === "string" ? req.body.message.trim() : "";

  if (!userMessage) {
    return res.status(400).json({
      reply: "Please enter a message."
    });
  }

  if (!groq) {
    return res.status(503).json({
      reply: "AI assistant temporarily unavailable. Please add GROQ_API_KEY to the environment."
    });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a chatbot for Ruthra Digital Solutions. STRICT RULE: Every reply MUST be 1-3 sentences only. NEVER use bullet points or numbered lists. NEVER write more than 3 sentences.

Company: Palani-based digital agency, 2+ years, 20+ projects, 10+ happy clients. Serving Tamil Nadu (Chennai, Bangalore + remote).

Services: Website Packages from pricing page — Basic ₹8,000, Standard ₹12,000, Premium ₹18,000–₹25,000, E-Commerce ₹20,000–₹35,000, Add-ons: Landing Page ₹3,000–₹6,000, Website Maintenance ₹1,000/month, Speed Optimization ₹2,000–₹5,000, Website Redesign ₹5,000–₹10,000. Other services: Hotel Management Solutions ₹30,000–₹1,50,000+, SEO ₹5,000–₹20,000/month, Digital Marketing ₹10,000–₹50,000/month. Tech: React, Next.js, Node.js, MongoDB.

Portfolio: Eshwaraa Cottage, Royal Ayurvedic Body Massage, Luxury Hotel Booking System.

Contact: Phone/WhatsApp +91 96263 80310 | Email ruthradigitalsolutions@outlook.com | Address No 2, 1, Mill Rd, Shanmugapuram, Palani, Tamil Nadu 624601 | www.ruthradigitalsolutions.com

RESPONSE RULES:
- Greetings → "Hello! 👋 Welcome to Ruthra Digital Solutions. How can I help you today?"
- Contact → Just give phone, email, website in one sentence.
- Pricing → One sentence with price range + "Contact us for an exact quote."
- Gibberish → "I didn't quite get that. How can I help you today?"
- NEVER exceed 3 sentences. NEVER use lists. Keep it conversational and brief.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      model: "groq/compound",
      max_tokens: 150
    });

    const rawReply = chatCompletion?.choices?.[0]?.message?.content || "";
    const cleanedReply = rawReply
      .replace(/<think>[\s\S]*?<\/think>/gi, "")
      .replace(/<think>[\s\S]*$/gi, "")
      .replace(/\s+/g, " ")
      .replace(/\s*\n\s*/g, " ")
      .trim();

    const reply = cleanedReply || "I didn't quite get that. How can I help you today?";

    res.json({ reply });
  } catch (error) {
    console.error("Groq API Error:", JSON.stringify({
      status: error?.status,
      type: error?.type,
      message: error?.message,
      error: error?.error,
    }, null, 2));

    res.status(502).json({
      reply: "AI assistant is temporarily unavailable. Please try again in a moment."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Chatbot server running on port ${PORT}`);
});