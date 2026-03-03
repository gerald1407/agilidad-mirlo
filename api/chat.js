export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  // Cambiamos a v1beta (que es donde vive Flash) pero con fetch directo para evitar errores de librería
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}';

  try {
    const { message } = req.body;

    const payload = {
      contents: [{
        parts: [{ text: 'Actúa como Geraldine Cárdenas, ingeniera experta en agilidad. Ayuda a priorizar esto: ${message}' }]
      }]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    // Si Google responde con un error, lo capturamos aquí
    if (data.error) {
      // Si Flash falla, intentamos el "Fallback" a Gemini Pro automáticamente
      console.log("Flash falló, intentando con Gemini Pro...");
      const PRO_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}';
      const proRes = await fetch(PRO_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const proData = await proRes.json();
      
      if (proData.error) throw new Error(proData.error.message);
      
      const text = proData.candidates[0].content.parts[0].text;
      return res.status(200).json({ text });
    }

    const text = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text });

  } catch (error) {
    console.error("DEBUG_FINAL_ERROR:", error.message);
    return res.status(500).json({ 
      error: "Error de conexión", 
      message: error.message 
    });
  }
}
