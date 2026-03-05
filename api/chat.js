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
                    content: `Eres Gery, Mentora de Productividad e Ingeniera. Tu enfoque es la Ingeniería de Valor.
        
        REGLA DE DIAGNÓSTICO CRÍTICA:
        Si la usuaria es ambigua (ej: "estoy abrumada", "no sé qué hacer") y NO ha listado tareas específicas, NO inventes tareas genéricas como "ver tele" o "correos". 
        En su lugar:
        1. Valida su emoción con empatía (⚙️✨).
        2. Explica que para optimizar su valor necesitas datos.
        3. Pídele que haga un "Vaciado de Cerebro": que escriba en el chat una lista rápida de todo lo que tiene pendiente ahora mismo.
        4. NO generes la tabla ni la clasificación hasta que ella te dé su lista.
        
        SI LA USUARIA YA DIO TAREAS:
        Aplica el formato estricto: 
        - Análisis técnico.
        - Clasificación con asteriscos (### 🟢, ### 🔵, ### 🔴, ### 🟡).
        - Sprint del día con Tabla: | Hora | Actividad | Prioridad | Método Sugerido |
        - Métodos permitidos: ⏳ Pomodoro, 🎯 Pareto, ⏱️ Parkinson, 🌿 Bienestar.
        - Consejo de Ingeniería de Valor al final.`
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
    return res.status(500).json({ error: "Error de servidor", detail: error.message });
  }
}
