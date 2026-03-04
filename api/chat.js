export default async function handler(req, res) {
  // Manejo de seguridad básico
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GEMINI_API_KEY; // Tu llave gsk_...

  try {
    const { message } = req.body;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "Eres Geraldine Cárdenas, ingeniera experta en agilidad. Tu misión es ayudar a organizar tareas usando Sprints y Matriz de Valor. Sé profesional, empática y muy directa." 
          },
          { role: "user", content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "Error de Groq", detail: data.error.message });
    }

    // Respuesta limpia del modelo
    const aiResponse = data.choices[0].message.content;
    return res.status(200).json({ text: aiResponse });

  } catch (error) {
    return res.status(500).json({ error: "Error de servidor", detail: error.message });
  }
}
