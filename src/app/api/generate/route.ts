import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, type, subject, grade, apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api.x.ai/v1',
    });

    const systemPrompt = `You are a Hong Kong primary school education expert. Generate revision content for ${grade} ${subject}. 
All content must be age-appropriate and follow the Hong Kong curriculum.
Return VALID JSON only, no markdown formatting.`;

    let userPrompt: string;
    let model: string;

    if (type === 'image') {
      model = 'grok-2-vision-latest';
      userPrompt = `Analyze this educational material image and generate revision content. Return JSON with:
{
  "questions": [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..."}],
  "flashcards": [{"front": "...", "back": "..."}],
  "scrambleWords": [{"word": "...", "hint": "..."}],
  "summary": "Brief summary of the material",
  "keyPoints": ["point1", "point2"]
}
Generate 8-12 questions, 6-10 flashcards, and 5-8 scramble words.`;

      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              { type: 'image_url', image_url: { url: content } },
            ],
          },
        ],
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || '{}';
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } else {
      model = 'grok-2-latest';
      userPrompt = `Based on this study material, generate revision content:

"${content}"

Return JSON with:
{
  "questions": [{"question": "...", "options": ["A", "B", "C", "D"], "correctAnswer": 0, "explanation": "..."}],
  "flashcards": [{"front": "...", "back": "..."}],
  "scrambleWords": [{"word": "...", "hint": "..."}],
  "summary": "Brief summary of the material",
  "keyPoints": ["point1", "point2"]
}
Generate 8-12 questions, 6-10 flashcards, and 5-8 scramble words.`;

      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      });

      const text = response.choices[0]?.message?.content || '{}';
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    }
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
