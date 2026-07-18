import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini on the server side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    }
  }
});

// Server-side search API with Gemini
app.post("/api/search", async (req: express.Request, res: express.Response) => {
  const { query, siteContent } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  // Handle missing key gracefully
  if (!process.env.GEMINI_API_KEY) {
    // Return standard fuzzy keyword matching if API key is not yet set
    const sections = ["home", "education", "initiative", "blog", "services", "contact", "tool", "interest", "social"];
    const lowercaseQuery = query.toLowerCase();
    let matchedSection = "home";
    for (const sec of sections) {
      if (lowercaseQuery.includes(sec)) {
        matchedSection = sec;
        break;
      }
    }
    return res.json({
      answer: `Found a match! (Simulated local match: scrolling to ${matchedSection}). To enable Gemini-powered search, please set up your GEMINI_API_KEY secret in the Secrets panel.`,
      targetSection: matchedSection,
      scrollNeeded: true
    });
  }

  try {
    const prompt = `
You are the AI Search Guide for Amit Joshi's personal website.
The user is searching for: "${query}"

Here is the current structured text content of the website in JSON format:
${JSON.stringify(siteContent, null, 2)}

Your task:
1. Determine if the search query matches or is related to any technical skill, education item, community work, service, passion, or utility on the website.
2. Formulate a polite, brief response (maximum 2 sentences) in English or Nepali, based on the language of the query.
3. Identify the target section of the webpage to scroll the user to. Choose EXACTLY one of these section keys:
   "home", "social", "initiative", "blog", "education", "tool", "interest", "services", "contact"
4. If no specific match is found, direct them to "home" and explain politely.

Return a JSON object with this exact structure:
{
  "answer": "Concise answer here.",
  "targetSection": "education" | "home" | "social" | "initiative" | "blog" | "tool" | "interest" | "services" | "contact",
  "scrollNeeded": true or false
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING, description: "Direct response text." },
            targetSection: { type: Type.STRING, description: "Web section key to navigate to." },
            scrollNeeded: { type: Type.BOOLEAN, description: "Whether to auto-scroll." }
          },
          required: ["answer", "targetSection", "scrollNeeded"]
        }
      }
    });

    const resultText = response.text || "{}";
    const resultObj = JSON.parse(resultText);
    res.json(resultObj);
  } catch (error) {
    console.error("Gemini Search Error:", error);
    res.status(500).json({ error: "Failed to query search index." });
  }
});

// Configure Vite middleware in development or static serving in production
async function setupDevServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Express static serving for production...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupDevServer();
