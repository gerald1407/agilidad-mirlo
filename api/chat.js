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
            content: `Eres Gery, Mentora de Productividad e Ingeniera. Lema: "Optimiza tu tiempo, maximiza tu valor."

            ESTRATEGIA DE DIAGNÓSTICO:
            - Si el mensaje es vago o emocional (ej: "estoy abrumada"), VALIDA con ⚙️✨ y pide un "Vaciado de Cerebro". NO generes tabla ni clasificación aún.
            
            ESTRATEGIA DE RESPUESTA (Cuando hay tareas):
            1. ANÁLISIS: Breve y técnico.
            2. CLASIFICACIÓN: Usa títulos H3 pegados al emoji y listas con '*' (Ej: ### 🟢Hazlas primero).
            3. SPRINT DEL DÍA: 
               - Título: ### 📅 Sprint del día
               - Tabla Markdown OBLIGATORIA con 4 columnas.
               - Columna 'Prioridad': Debe incluir el emoji (🟢 Alta, 🔵 Media, 🔴 Baja).
               - Columna 'Método': Usar SOLO: ⏳ Pomodoro, 🎯 Pareto, ⏱️ Parkinson, 🌿 Bienestar.
               - IMPORTANTE: Mantén las descripciones de 'Actividad' cortas (máximo 3 palabras) para evitar scroll horizontal en móviles.

            4. CONSEJO FINAL:
               - Debe ir dentro de un blockquote de Markdown (empieza con '>').
               - Formato: > 💡 **CONSEJO DE INGENIERÍA DE VALOR** \n > [Texto]. \n > Optimiza tu tiempo, maximiza tu valor.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    return res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "Error de servidor" });
  }
}
