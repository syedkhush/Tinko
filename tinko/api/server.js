import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  if (!req.url.includes("node_modules") && !req.url.includes("@vite")) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
});

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL || "https://fvxiyxmyjpahghtvxufm.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2eGl5eG15anBhaGdodHZ4dWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MjExNjMsImV4cCI6MjA5MDE5NzE2M30.DzehuCrqFRxR81xnheqCO77CxL5tPraEu5dz3q8vQuY";
const supabase = createClient(supabaseUrl, supabaseKey);

// Razorpay Setup
let razorpay: any = null;
const getRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};

async function startServer() {
  // --- API ROUTES ---
  const apiRouter = express.Router();

  apiRouter.get("/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  apiRouter.post("/payment/create-order", async (req, res) => {
    const rzp = getRazorpay();
    if (!rzp) return res.json({ id: `mock_order_${Date.now()}`, amount: 9900, currency: "INR", mock: true });
    try {
      const options = { amount: 9900, currency: "INR", receipt: `receipt_${Date.now()}` };
      const order = await rzp.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  apiRouter.post("/payment/verify", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, isMock } = req.body;
    
    // If it's a mock payment (Demo Mode), we try to record it but always return success
    if (isMock || !process.env.RAZORPAY_KEY_SECRET) {
      console.log(`Mock access requested for ${email}`);
      try {
        await supabase.from("users_access").insert([{ 
          email, 
          payment_id: razorpay_payment_id || `mock_pay_${Date.now()}`, 
          order_id: razorpay_order_id || `mock_order_${Date.now()}`, 
          access_granted: true 
        }]);
      } catch (e) {
        console.error("Supabase insert failed (likely table missing), but proceeding with demo access:", e);
      }
      return res.json({ status: "success", message: "Mock access granted" });
    }
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");
    
    if (razorpay_signature === expectedSign) {
      const { error } = await supabase.from("users_access").insert([{ 
        email, 
        payment_id: razorpay_payment_id, 
        order_id: razorpay_order_id, 
        access_granted: true 
      }]);
      
      if (error) {
        console.error("Payment verified but DB error:", error);
        // Even if DB fails, if signature is valid, we might want to return success for better UX
        // but for now we'll stick to error for real payments
        return res.status(500).json({ error: "Payment verified but failed to grant access" });
      }
      res.json({ status: "success", message: "Payment verified and access granted" });
    } else {
      res.status(400).json({ status: "failure", message: "Invalid signature" });
    }
  });

  apiRouter.get("/payment/check-access", async (req, res) => {
    const { paymentId } = req.query;
    if (!paymentId) return res.json({ access: false });
    
    // For demo/mock IDs, always return true to avoid 404/failure in frontend
    if (paymentId.toString().startsWith('mock_pay_')) {
      return res.json({ access: true });
    }

    const { data, error } = await supabase.from("users_access").select("access_granted").eq("payment_id", paymentId).single();
    if (error || !data) return res.json({ access: false });
    res.json({ access: data.access_granted });
  });

  apiRouter.get("/data/:type", async (req, res) => {
    const { type } = req.params;
    const { data, error } = await supabase.from(type).select("*");
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  apiRouter.post("/ai/career-advice", async (req, res) => {
    const { query } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey === "") {
      return res.status(500).json({ error: "Gemini API key is missing. Please add it to your .env file." });
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const systemPrompt = `You are Tinko, an expert career counselor for Indian students. Provide realistic, practical, and culturally relevant advice about careers, businesses, farming, and financial planning in India. Be encouraging but also honest about risks, costs, and hard work. Use terms like 'lakh', 'crore', and mention specific Indian exams (UPSC, JEE, NEET) or schemes (PM-Kisan, Mudra Loan) when relevant.`;
      
      const result = await model.generateContent(systemPrompt + "\n\nUser Question: " + query);
      const response = await result.response;
      const text = response.text();
      
      if (!text) return res.status(500).json({ error: "Empty response from AI" });
      res.json({ text });
    } catch (error: any) {
      console.error("AI error:", error?.message || error);
      res.status(500).json({ error: `AI Error: ${error?.message || "Failed to get AI response"}` });
    }
  });

  app.use("/api", apiRouter);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    app.get("*", async (req, res, next) => {
      try {
        const html = await vite.transformIndexHtml(req.url, `<!doctype html><html lang="en"><head></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
