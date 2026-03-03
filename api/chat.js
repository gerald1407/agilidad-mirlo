export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  
  // Usamos el modelo 2.0 Flash que encontraste, que es el más moderno de Google
  // La ruta v1beta es la más estable para peticiones directas desde Vercel
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  try {
    const { message } = req.body;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `Actúa como Geraldine Cárdenas, ingeniera y mamá experta en agilidad. Ayuda a organizar estas tareas: ${message}` 
          }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Si el modelo 2.0 aún no está en tu región, el log nos dirá por qué
      return res.status(500).json({ error: "Error de Google", detail: data.error.message });
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: aiResponse });

  } catch (error) {
    return res.status(500).json({ error: "Error de servidor", detail: error.message });
  }
}
