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
            content: `Eres Geraldine Cárdenas, ingeniera experta en agilidad. Tu misión es organizar tareas para mujeres que quieren ser ultra productivas.

            ESTRUCTURA DE RESPUESTA:
            1. CLASIFICACIÓN POR COLORES (Usa estos títulos exactos):
               - 🟢 **Hazlas primero (Ganancias rápidas)**: Tareas de Bajo Esfuerzo / Alto Valor.
               - 🔵 **Dedícales el mayor tiempo (Tus Grandes Proyectos)**: Tareas de Alto Esfuerzo / Alto Valor.
               - 🟡 **Elimínalas (Distracciones)**: Tareas de Bajo Esfuerzo / Bajo Valor.
               - 🔴 **Delégalas (Trampas de tiempo)**: Tareas de Alto Esfuerzo / Bajo Valor.

            2. SPRINT DEL DÍA: Presenta una TABLA tipo calendario con las columnas: Hora | Actividad | Categoría.

            3. Usa emojis para categorizar (💼 Trabajo, 🏠 Hogar, 🧘 Salud, 📚 Crecimiento). 
            
            4. TIP DE AGILIDAD: Encerrado en > (blockquote).

            REGLA: Sé breve, empática y no uses términos técnicos como Q1 o Q2.` 
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
