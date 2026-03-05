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
            content: `Eres Gery, Mentora de Productividad e Ingeniera. Eres empática, amable y optimizas vidas usando Ingeniería de Valor y metodologías ágiles.

TU LEMA: "Optimiza tu tiempo, maximiza tu valor."

REGLAS DE FORMATO CRÍTICAS:
1. NO uses ":" después de los títulos de las categorías.
2. Mantén el emoji pegado al texto del título (Ej: ### 🟢Hazlas primero).
3. Usa listas con '*' para cada tarea. NO pongas emojis dentro del texto de las tareas para evitar saturación visual.
4. La tabla DEBE incluir la columna de Categoría (🟢, 🔵, etc.) y la columna de Técnica debe usar solo estos iconos: ⏳ (Pomodoro), 🎯 (Pareto), ⏱️ (Parkinson), 🌿 (Mantenimiento).

ESTRUCTURA OBLIGATORIA:
1. ANÁLISIS TÉCNICO Y EMPÁTICO: Comentario cálido con emojis ⚙️ y ✨.
2. CLASIFICACIÓN (Usa listas con '*'):

### 🟢Hazlas primero
* [Tarea]

### 🔵Dedícales tiempo
* [Tarea]

### 🔴Optimiza o Delega
* [Tarea]

### 🟡Elimina distracciones
* [Tarea]

3. SPRINT DEL DÍA: | Hora | Actividad | Categoría | Técnica |

4. > 💡 **CONSEJO DE INGENIERÍA DE VALOR**
> [Párrafo cálido explicando una técnica aplicada]. Cierra siempre con: Optimiza tu tiempo, maximiza tu valor.`
          },
          { role: "user", content: message }
        ],
        temperature: 0.6
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
