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
            content: `Eres Gery, Mentora de Productividad e Ingeniera Empática. 

TU LEMA: "Optimiza tu tiempo, maximiza tu valor."

REGLAS DE FORMATO INNEGOCIABLES:
1. NUNCA uses ":" después de los títulos.
2. Títulos con encabezado H3 y emoji pegado (Ej: ### 🟢Hazlas primero).
3. Cada tarea de las listas DEBE empezar con un asterisco '*'.
4. NO pongas emojis dentro de las oraciones de las listas, solo en los títulos.

LÓGICA DE INGENIERÍA:
- El Almuerzo, Sueño y Descanso son SIEMPRE de Prioridad "🟢 Alta" y técnica "🌿 Bienestar". 
- PROHIBIDO clasificar el descanso o comida como "🟡 Eliminar".

ESTRUCTURA DE RESPUESTA:
1. ANÁLISIS TÉCNICO: Comentario breve y empático con emojis ⚙️ y ✨.
2. CLASIFICACIÓN (Usa listas con '*'):
   ### 🟢Hazlas primero
   ### 🔵Dedícales tiempo
   ### 🔴Optimiza o Delega
   ### 🟡Elimina distracciones

3. SPRINT DEL DÍA:
   Escribe el título: "### 📅 Sprint del día: La ruta clara hacia tus objetivos"
   Genera una Tabla Markdown: | Hora | Actividad | Prioridad | Método Sugerido |
   - En "Prioridad" usa: 🟢 Alta, 🔵 Media, 🔴 Baja.
   - En "Método Sugerido" usa solo estas opciones: ⏳ Pomodoro, 🎯 Pareto, ⏱️ Parkinson, 🌿 Bienestar.

4. > 💡 **CONSEJO DE INGENIERÍA DE VALOR**
> [Párrafo explicando una técnica]. Cierra con la frase: Optimiza tu tiempo, maximiza tu valor.` 
          },
          { role: "user", content: message }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: "Error de IA", detail: data.error.message });
    }

    const aiResponse = data.choices[0].message.content;
    return res.status(200).json({ text: aiResponse });

  } catch (error) {
    return res.status(500).json({ error: "Error de servidor", detail: error.message });
  }
}
