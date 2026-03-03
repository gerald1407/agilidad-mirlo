export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY;
  // Usamos v1beta, que es la que tiene mayor compatibilidad con las llaves gratuitas de AI Studio
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const { message } = req.body;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Eres Geraldine Cárdenas, ingeniera y experta en agilidad. Ayuda a organizar estas tareas: ${message}`
          }]
        }]
      })
    });

    const data = await response.json();

    // Si Google nos da un error, lo capturamos aquí
    if (data.error) {
      // Si el error es 404 con 'flash', intentamos 'gemini-pro' inmediatamente
      if (data.error.code === 404) {
        const FALLBACK_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
        const resFallback = await fetch(FALLBACK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Prioriza esto como Geraldine Cárdenas: ${message}` }] }]
          })
        });
        const dataFallback = await resFallback.json();
        
        if (dataFallback.error) throw new Error(dataFallback.error.message);
        
        return res.status(200).json({ text: dataFallback.candidates[0].content.parts[0].text });
      }
      
      throw new Error(data.error.message);
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    return res.status(200).json({ text: aiResponse });

  } catch (error) {
    console.error("ERROR_FINAL:", error.message);
    return res.status(500).json({ 
      error: "Error de conexión con Google", 
      detail: error.message 
    });
  }
}
