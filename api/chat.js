export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  const { message } = req.body;

  // Lista de modelos para probar en orden de prioridad
  const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  for (const modelName of modelsToTry) {
    try {
      const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Eres Geraldine Cárdenas, ingeniera experta. Prioriza esto: ${message}` }] }]
        })
      });

      const data = await response.json();

      // Si este modelo funcionó, enviamos la respuesta y terminamos el bucle
      if (data.candidates && data.candidates[0].content) {
        const text = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ text });
      }
      
      console.log(`Modelo ${modelName} no disponible, probando el siguiente...`);
    } catch (e) {
      continue; // Si hay error de red con un modelo, probamos el siguiente
    }
  }

  // Si llegamos aquí es que ninguno funcionó
  return res.status(500).json({ 
    error: "Error de Configuración de Google", 
    detail: "Ningún modelo (Flash, Pro o Gemini-Pro) respondió. Revisa si tu API Key está activa en Google AI Studio." 
  });
}
