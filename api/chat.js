export default async function handler(req, res) {
  // 1. Recibimos 'messages' (la lista completa)
  const { messages } = req.body; 

  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });
  const API_KEY = process.env.GROQ_API_KEY;

  try {
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
            // CORREGIDO: Eliminamos el "content:" extra
            content: `Eres Gery, Mentora de Productividad e Ingeniera de Valor. Lema: "Optimiza tu tiempo, maximiza tu valor."

            PROTOCOLO DE INICIO (SI NO HAY TAREAS):
            - Saluda: "Hola, espero que estés muy bien. ¿Qué debes hacer hoy? Te ayudaré a organizar tu tiempo."
            - Explica que para un plan preciso, debe listar sus tareas y mencionar a qué hora inicia su día.
            - Si el usuario envía algo que no es una tarea, responde con tono conciliador.
            
            LÓGICA DE PRIORIZACIÓN Y BIENESTAR:
            - PRIORIDADES: 🟢 Alta (No negociables), 🔵 Media (Importantes), 🔴 Baja (Delegables).
            - BIENESTAR OBLIGATORIO: Debes incluir comidas y descanso si el usuario los olvida.
            
            TONO ANTE CUESTIONAMIENTOS:
            - Si el usuario dice "¿Por qué X es baja?", responde: "Entiendo, si para ti tiene un valor estratégico mayor, vamos a moverlo a Alta. ¿A qué hora prefieres hacerlo?".
            
            FORMATO DE RESPUESTA (ESTRICTO):
            1. ANÁLISIS TÉCNICO: Resumen empático.
            2. CLASIFICACIÓN: ### 🟢, ### 🔵, ### 🔴.
            3. SPRINT DEL DÍA (TABLA): | Hora | Actividad | Prioridad | Método |
               - Método: Usa solo: Pomodoro, Pareto, Parkinson, Bienestar (sin emojis).
            4. CONSEJO: Termina siempre con un bloque de cita (>) exactamente así:
            > 💡 **CONSEJO DE GERY PRODUCTIVA**
            > [Tu consejo estratégico aquí]
            > Optimiza tu tiempo, maximiza tu valor.`
          },
          ...messages 
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    return res.status(200).json({ text: data.choices[0].message.content });
  } catch (error) {
    return res.status(500).json({ error: "Error de servidor" });
  }
}
