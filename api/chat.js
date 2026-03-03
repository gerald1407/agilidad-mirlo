export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  // Usamos v1beta y gemini-pro: la combinación más estable y compatible globalmente
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

  try {
    const { message } = req.body;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `Eres Geraldine Cárdenas, ingeniera experta en agilidad. Ayuda a organizar esto: ${message}` 
          }]
        }]
      })
    });

    const data = await response.json();

    // Si hay error, lo mostramos para saber qué dice Google exactamente
    if (data.error) {
      return res.status(500).json({ error: "Error de Google", detail: data.error.message });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: aiResponse });

  } catch (error) {
    return res.status(500).json({ error: "Error de servidor", detail: error.message });
  }
}
