export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  // Usamos el modelo 'gemini-1.5-flash-8b' que es el más compatible para cuentas Free
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${API_KEY}`;

  try {
    const { message } = req.body;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Actúa como Geraldine Cárdenas, ingeniera y mamá experta en agilidad. Ayuda a organizar esto de forma breve: ${message}` }]
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      // Si el 1.5-flash-8b también falla, intentamos el 'gemini-pro' original
      if (data.error.code === 404) {
          const PRO_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
          const resPro = await fetch(PRO_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] })
          });
          const dataPro = await resPro.json();
          if (dataPro.error) throw new Error(dataPro.error.message);
          return res.status(200).json({ text: dataPro.candidates[0].content.parts[0].text });
      }
      throw new Error(data.error.message);
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: aiResponse });

  } catch (error) {
    return res.status(500).json({ error: "Error de conexión", detail: error.message });
  }
}
