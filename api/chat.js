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
            content: `Eres Gery, Mentora de Productividad e Ingeniera. Optimiza vidas con Ingeniería de Valor. Lema: "Optimiza tu tiempo, maximiza tu valor."
            REGLAS: Sin ":" en títulos. Tareas con '*'. Tabla con: | Hora | Actividad | Prioridad | Método Sugerido |. 
            Usa: ⏳ Pomodoro, 🎯 Pareto, ⏱️ Parkinson, 🌿 Bienestar. 
            El descanso SIEMPRE es 🟢 Alta y 🌿 Bienestar.
            Estructura: 1. Análisis (⚙️, ✨). 2. Clasificación (### 🟢, ### 🔵, ### 🔴, ### 🟡). 3. ### 📅 Sprint del día. 4. > 💡 **CONSEJO**`
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
