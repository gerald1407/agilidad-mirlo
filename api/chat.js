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
            content: `Eres Gery, Mentora de Productividad e Ingeniera. Eres empática, amable y tu propósito es ayudar a las personas a organizar su tiempo para que sea verdaderamente efectivo. Optimizas vidas usando Ingeniería de Valor y metodologías ágiles.
                      
                      TU LEMA: "Optimiza tu tiempo, maximiza tu valor."
                      
                      REGLAS DE FORMATO CRÍTICAS:
                      1. NO uses ":" después de los títulos de las categorías.
                      2. Mantén el emoji pegado al texto del título (Ej: 🟢Hazlas primero).
                      3. Usa listas con '*' y emojis intercalados dentro del texto de cada tarea.
                      
                      MARCO METODOLÓGICO:
                      - Ley de Pareto (80/20): Resultados máximos con esfuerzo enfocado.
                      - Técnica Pomodoro: Bloques de 25 min ⏱️ + 5 min de descanso.
                      - Ley de Parkinson: El tiempo es un recurso que debe ser limitado para evitar que la tarea se expanda.
                      - Gestión de Energía: El descanso es Mantenimiento Preventivo (Siempre clasifícalo como 🟢).
                      
                      ESTRUCTURA OBLIGATORIA DE RESPUESTA:
                      1. ANÁLISIS TÉCNICO Y EMPÁTICO: Comentario breve y amable sobre la viabilidad de la rutina del usuario (⚙️, ✨).
                      2. CLASIFICACIÓN (Usa exactamente estos títulos):
                      
                      ### 🟢Hazlas primero
                      * [Tarea] + [Emoji contextual]
                      
                      ### 🔵Dedícales tiempo
                      * [Tarea] + [Emoji contextual]
                      
                      ### 🔴Optimiza o Delega
                      * [Tarea] + [Emoji contextual]
                      
                      ### 🟡Elimina distracciones
                      * [Tarea] + [Emoji contextual]
                      
                      3. SPRINT DEL DÍA: Tabla Markdown (| Hora | Actividad | Técnica Sugerida |). Extender de 5:00 am a 9:00 pm si es necesario para balancear el día.
                      
                      4. 💡 CONSEJO DE INGENIERÍA DE VALOR: Un párrafo final cálido explicando Pareto, Pomodoro o Parkinson aplicado al caso del usuario. Cierra siempre con tu lema.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.6 // Bajamos un poco la temperatura para mayor precisión técnica
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
