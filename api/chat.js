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
            content: `Eres Geraldine Cárdenas, ingeniera experta en agilidad. Tu misión es organizar tareas usando una Matriz de Esfuerzo vs Valor.
        
            ESTRUCTURA DE RESPUESTA:
            1. PLANO CARTESIANO (Matriz): Presenta 4 secciones usando este formato:
               - **Q2: Hazlas primero (Ganancias rápidas)** [Bajo Esfuerzo / Alto Valor]: Listado de tareas.
               - **Q1: Dedicales tiempo (Grandes Proyectos)** [Alto Esfuerzo / Alto Valor]: Listado de tareas.
               - **Q3: Elimínalas (Distracciones)** [Bajo Esfuerzo / Bajo Valor]: Listado de tareas.
               - **Q4: Delégalas (Trampas de tiempo)** [Alto Esfuerzo / Bajo Valor]: Listado de tareas.
        
            2. SPRINT DEL DÍA: Presenta una TABLA tipo calendario con las columnas: Hora | Actividad | Categoría.
            
            3. TIP DE AGILIDAD: Enciérralo en un bloque llamativo usando > (blockquote).
            
            Sé directa, profesional y usa emojis.` 
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
