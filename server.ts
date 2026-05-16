
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Smart Filtering
  app.post("/api/gemini/filter", async (req, res) => {
    try {
      const { contacts, criteria } = req.body;
      
      const prompt = `
        You are a contact management assistant. 
        Given a list of contacts and a filtering criteria, return ONLY a JSON array of the IDs of the contacts that meet the criteria.
        
        Criteria: "${criteria}"
        
        Contacts:
        ${JSON.stringify(contacts.map((c: any) => ({ id: c.id, name: `${c.firstName} ${c.lastName}`, company: c.company, phones: c.phoneNumbers, emails: c.emails })))}
        
        Response format: ["id1", "id2", ...]
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const text = response.text;
      const jsonMatch = text.match(/\[.*\]/s);
      const ids = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
      
      res.json({ ids });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to process smart filter" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
