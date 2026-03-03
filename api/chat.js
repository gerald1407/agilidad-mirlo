import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Manejamos el método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // IMPORTANTE: En algunas regiones y versiones, el nombre exacto es este:
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { message } = req.body;

    // Si por alguna razón el body no se parseó automáticamente
    const userMessage = typeof message === 'string' ? message : JSON.stringify(message);

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });

  } catch (error) {
    console.error("DEBUG:", error);
    // Esto nos dirá exactamente qué pasa en los Logs de Vercel
    return res.status(500).json({ 
      error: "Error interno", 
      message: error.message 
    });
  }
}
