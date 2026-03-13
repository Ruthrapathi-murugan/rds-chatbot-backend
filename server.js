import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  try {

  const chatCompletion = await groq.chat.completions.create({
  messages: [
    {
      role: "system",
      content: `You are a chatbot for Ruthra Digital Solutions. STRICT RULE: Every reply MUST be 1-3 sentences only. NEVER use bullet points or numbered lists. NEVER write more than 3 sentences.

Company: Palani-based digital agency, 2+ years, 20+ projects, 10+ happy clients. Serving Tamil Nadu (Chennai, Bangalore + remote).

Services: Web Development (₹15,000–₹50,000+, 2-4 weeks), Hotel Management Solutions (₹30,000–₹1,50,000+, 8-12 weeks), SEO (₹5,000–₹20,000/month), Digital Marketing (₹10,000–₹50,000/month). Tech: React, Next.js, Node.js, MongoDB.

Portfolio: Eshwaraa Cottage, Royal Ayurvedic Body Massage, Luxury Hotel Booking System.

Contact: Phone/WhatsApp +91 96263 80310 | Email ruthradigitalsolutions@outlook.com | www.ruthradigitalsolutions.com

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
  model: "llama-3.3-70b-versatile",
  max_tokens: 150
});

    const reply = chatCompletion.choices[0].message.content;

    res.json({ reply });

  } catch (error) {

    console.error("Groq API Error:", error?.error || error.message);

    res.json({
      reply: "AI assistant temporarily unavailable."
    });

  }

});

app.listen(5000, () => {
  console.log("Chatbot server running on port 5000");
});