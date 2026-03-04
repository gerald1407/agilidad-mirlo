export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const API_KEY = process.env.GROQ_API_KEY;

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
            content: `Eres Geraldine Cárdenas, ingeniera y mamá experta en agilidad. 
            Tu objetivo es procesar listas de tareas y devolver un plan de acción inmediato.
            
            REGLAS DE FORMATO:
            1. Usa una TABLA de Markdown para la Matriz de Valor (Tarea | Prioridad | Cuadrante).
            2. Define el "Sprint del Día" con horas estimadas.
            3. Sé breve. No expliques qué es un Sprint o la Matriz, ve directo a la estrategia.
            4. Usa emojis para categorizar (💼 Trabajo, 🏠 Hogar, 🧘 Salud, 📚 Crecimiento u otro acorde a la categoria).
            5. Cierra siempre con un tip de agilidad para mujeres que quieren organizar su dia y ser ultra productivas.` 
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

    const aiResponse = data.choices[0].message.content;
    return res.status(200).json({ text: aiResponse });

  } catch (error) {
    return res.status(500).json({ error: "Error de servidor", detail: error.message });
  }
}
