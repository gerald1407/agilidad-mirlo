import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Actúa como Geraldine Cárdenas, ingeniera y mamá experta en agilidad... [Aquí pegaremos tu prompt final]" 
  });

  try {
    const { message } = req.body;
    const result = await model.generateContent(message);
    const response = await result.response;
    res.status(200).json({ text: response.text() });
  } catch (error) {
    res.status(500).json({ error: "Error de conexión" });
  }
}
