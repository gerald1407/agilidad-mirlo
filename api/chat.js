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

            ESCENARIO AMBIGUO:
            Si la usuaria dice estar abrumada o no da tareas, VALIDA con ⚙️✨ y pide un "Vaciado de Cerebro". NO inventes tareas ni hagas tablas aún.

            ESCENARIO CON TAREAS (ESTRUCTURA OBLIGATORIA):
            1. ANÁLISIS TÉCNICO: Breve y empático.
            2. CLASIFICACIÓN: Usa títulos H3 (### 🟢, ### 🔵, ### 🔴, ### 🟡) y listas con '*'.
            3. SPRINT DEL DÍA: 
               - Tabla Markdown: | Hora | Actividad | Prioridad | Método |
               - Columna 'Prioridad': Usa solo 🟢Alta, 🔵Media o 🔴Baja.
               - Columna 'Método': Escribe SOLO la palabra: Pomodoro, Pareto, Parkinson o Bienestar. (SIN EMOJIS en esta columna para no romper los clics).
               - 'Actividad': Máximo 3 palabras para evitar scroll.

            4. CONSEJO:
               - Usa blockquote de Markdown ('>').
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
