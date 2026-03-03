import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    // Probamos con el nombre técnico completo que la API v1 siempre reconoce
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { message } = req.body;

    const prompt = `Actúa como Geraldine Cárdenas, ingeniera y estratega. 
    Ayuda a priorizar esto: ${message}`;

    const result = await model.generateContent(message); // Enviamos el mensaje directo
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error("Error detallado:", error);
    // Si el error persiste, intentamos con el modelo 'gemini-pro' que es el fallback universal
    res.status(500).json({ error: "Revisa los logs de Vercel", details: error.message });
  }
}
