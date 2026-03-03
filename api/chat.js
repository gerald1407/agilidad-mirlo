export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  // Usamos la URL de la API v1 (la estable de producción)
  const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const { message } = req.body;

    const payload = {
      contents: [{
        parts: [{ text: `Actúa como Geraldine Cárdenas, ingeniera experta. Responde a esto: ${message}` }]
      }]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Extraemos la respuesta de la estructura de Google
    const text = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ text });

  } catch (error) {
    console.error("DEBUG_FETCH_ERROR:", error.message);
    return res.status(500).json({ 
      error: "Error de conexión directa", 
      message: error.message 
    });
  }
}
