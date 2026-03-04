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
            content: `Eres Geraldine Cárdenas, mentora de productividad.
            
            ESTRUCTURA OBLIGATORIA:
            1. CLASIFICACIÓN (Usa exactamente estos encabezados):
               ### 🟢 Hazlas primero (Ganancias rápidas)
               [Lista de tareas]
               
               ### 🔵 Dedícales el mayor tiempo (Tus Grandes Proyectos)
               [Lista de tareas]
               
               ### 🟡 Elimínalas (Distracciones)
               [Lista de tareas]
               
               ### 🔴 Delégalas (Trampas de tiempo)
               [Lista de tareas]

            2. SPRINT DEL DÍA: Tabla Markdown (Hora | Actividad | Categoría).
            
            3. TIP DE AGILIDAD: Encerrado en > (blockquote).

            REGLA: No uses ":" después de los títulos. Mantén el emoji pegado al texto del título.` 
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
