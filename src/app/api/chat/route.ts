import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      const lowerMessage = message.toLowerCase();
      let mockReply = 'Hallo! Wie kann ich Ihnen bezüglich Rezepten, Öffnungszeiten oder unseren Services weiterhelfen?';
      if (lowerMessage.includes('hallo') || lowerMessage.includes('hi')) {
        mockReply = 'Hallo! Wie kann ich Ihnen heute in der Service Apotheke helfen?';
      } else if (lowerMessage.includes('öffnungszeit')) {
        mockReply = 'Wir haben von Montag bis Freitag zwischen 08:00 und 18:30 Uhr für Sie geöffnet. Samstags sind wir von 09:00 bis 13:00 Uhr für Sie da.';
      } else if (lowerMessage.includes('rezept')) {
        mockReply = 'Sie können Ihr e-Rezept bequem über unsere Plattform einlösen oder Ihre Gesundheitskarte in der Apotheke einlesen. Wir bereiten dann alles für Sie vor!';
      } else {
        mockReply = 'Ich bin momentan im Demo-Modus. Bitte stellen Sie Fragen zu Rezepten oder Öffnungszeiten, oder kontaktieren Sie uns direkt!';
      }
      await new Promise(resolve => setTimeout(resolve, 800));
      return NextResponse.json({ reply: mockReply });
    }

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
