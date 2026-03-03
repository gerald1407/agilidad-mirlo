import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Manejo de CORS y método (Solo permitimos POST)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Aquí definimos el modelo con tu identidad
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Eres Geraldine Cárdenas, ingeniera de software y estratega ágil. Ayudas a mujeres profesionales a ser más productivas usando el método de Sprints Diarios y la Matriz de Valor. Eres empática, clara y muy profesional."
  });

  try {
    // Extraemos el mensaje del cuerpo de la petición
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No se recibió mensaje" });
    }

    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text });
  } catch (error) {
    console.error("Error en Gemini:", error);
    res.status(500).json({ error: "Error de conexión con la IA", details: error.message });
  }
}
