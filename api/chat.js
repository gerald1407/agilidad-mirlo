import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Solo permitimos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verificamos que la API KEY exista en las variables de entorno
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: "Falta la API KEY en Vercel" });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { message } = req.body;

    // El prompt de sistema se lo pasamos aquí directamente para evitar errores de configuración
    const prompt = `Actúa como Geraldine Cárdenas, ingeniera experta en agilidad. 
    Ayuda a esta usuaria a organizar estas tareas usando el método de Sprints y Matriz de Valor: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Error detallado:", error);
    return res.status(500).json({ error: "Error de Gemini", details: error.message });
  }
}
