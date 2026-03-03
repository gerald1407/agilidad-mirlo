export default async function handler(req, res) {
    // 1. Configurar Headers para evitar problemas de CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Usar POST" });

    try {
        // 2. Extraer el mensaje con seguridad (Vercel a veces no parsea el JSON)
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) { /* no es JSON */ }
        }
        
        const message = body.message || "Hola";
        const API_KEY = process.env.GEMINI_API_KEY;

        // 3. Llamada directa a la API (usando la URL más estable posible)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }]
            })
        });

        const data = await response.json();

        // 4. Manejo de errores específicos de Google
        if (data.error) {
            return res.status(500).json({ 
                error: "Error de Google API", 
                detail: data.error.message 
            });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        return res.status(200).json({ text: aiResponse });

    } catch (error) {
        return res.status(500).json({ 
            error: "Error en el Servidor", 
            detail: error.message 
        });
    }
}
