import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Usamos el alias 'latest' que es más robusto para despliegues web
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const { message } = req.body;
    const userMessage = typeof message === 'string' ? message : message.text || JSON.stringify(message);

    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });

  } catch (error) {
    console.error("DEBUG:", error);
    // Si sigue fallando el 'flash-latest', probamos con el 'pro' como último recurso
    return res.status(500).json({ 
      error: "Error de modelo", 
      message: error.message 
    });
  }
}
