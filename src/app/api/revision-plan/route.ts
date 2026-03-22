import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subjects, grade, daysPerWeek, apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api.x.ai/v1',
    });

    const response = await client.chat.completions.create({
      model: 'grok-2-latest',
      messages: [
        {
          role: 'system',
          content: `You are a Hong Kong primary school education expert. Create a structured revision plan for a ${grade} student.
Return VALID JSON only, no markdown formatting.`,
        },
        {
          role: 'user',
          content: `Create a ${daysPerWeek * 2}-day revision plan for these subjects: ${subjects.join(', ')}.
          
Return JSON with:
{
  "title": "Revision Plan for ${grade}",
  "totalDays": ${daysPerWeek * 2},
  "days": [
    {
      "day": 1,
      "topic": "Subject - Topic",
      "activities": ["Activity 1", "Activity 2"],
      "focusAreas": ["Area 1", "Area 2"],
      "estimatedMinutes": 30
    }
  ]
}
Distribute subjects evenly across the days. Each day should have 2-3 activities and focus areas.`,
        },
      ],
      temperature: 0.7,
    });

    const text = response.choices[0]?.message?.content || '{}';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Revision plan API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate revision plan' },
      { status: 500 }
    );
  }
}
