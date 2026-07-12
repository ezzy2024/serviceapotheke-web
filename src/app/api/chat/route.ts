import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || '';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // Map history to Gemini format
    const contents = [];
    
    // System instruction
    contents.push({
      role: 'user',
      parts: [{ text: "You are a helpful assistant for 'Apotheke am Markt' (ServiceApotheke). You answer questions about pharmacy services, opening hours, prescriptions, and medical products. Be concise and professional in German." }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: "Verstanden. Ich bin der Assistent der Apotheke am Markt und antworte professionell auf Deutsch." }]
    });

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Gemini API Error:', data);
      return NextResponse.json({ reply: 'Entschuldigung, es gab ein Problem bei der Verarbeitung Ihrer Anfrage.' }, { status: 500 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Keine Antwort erhalten.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: 'Ein unerwarteter Fehler ist aufgetreten.' }, { status: 500 });
  }
}
