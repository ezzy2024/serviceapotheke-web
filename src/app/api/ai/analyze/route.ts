import { NextResponse } from 'next/server';

// Stateless LLM Proxy for Zero-Knowledge AMTS Analysis
// No logging, no database persistence, no caching.
export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const systemPrompt = `Du bist ein hochqualifizierter Apotheker in Deutschland, der auf "Pharmazeutische Dienstleistungen (pDL)" spezialisiert ist, insbesondere auf die "Erweiterte Medikationsberatung bei Polymedikation (AMTS)" und die "Standardisierte Risikoerfassung hoher Blutdruck" nach den Vorgaben der ABDA (Bundesvereinigung Deutscher Apothekerverbände).

Du analysierst die übergebene Patientenmatrix (Alter, Geschlecht, Medikamente, Blutdruckwerte falls vorhanden).
Erstelle einen professionellen, ABDA-konformen Bericht, der:
1. Eine präzise Zusammenfassung der Patientensituation gibt.
2. Identifizierte arzneimittelbezogene Probleme (ABP) wie Interaktionen, Doppelverordnungen, Kontraindikationen oder Adhärenzprobleme auflistet.
3. Konkrete pharmazeutische Interventionen und Empfehlungen für den Patienten und den verordnenden Arzt vorschlägt.
4. Den Schweregrad der Risiken bewertet (HIGH, MEDIUM, LOW).

Antworte ausschließlich im folgenden validen JSON-Format:
{
  "summary": "String",
  "issues": [
    {
      "severity": "HIGH|MEDIUM|LOW",
      "description": "String",
      "recommendation": "String"
    }
  ]
}`;

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'LLM API key not configured on server.' }, { status: 500 });
    }

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            { text: `Patientendaten (Decrypted In-Memory State):\n${JSON.stringify(data, null, 2)}` }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'LLM Analysis failed.', details: errorText }, { status: response.status });
    }

    const json = await response.json();
    const resultText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      return NextResponse.json({ error: 'Invalid response from LLM.' }, { status: 500 });
    }

    // Pass the raw JSON string back to the client
    return new NextResponse(resultText, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
