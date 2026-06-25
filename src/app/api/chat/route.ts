import { NextResponse } from 'next/server';

const createSSEStream = async (content: string) => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`));
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  return stream;
};

const fallbackReply = (messages: Array<{ role: string; content: string }>) => {
  const lastUser = messages.slice().reverse().find((m) => m.role === 'user');
  const prompt = lastUser?.content?.toLowerCase() || '';

  if (prompt.includes('hi') || prompt.includes('hello')) {
    return `Hello! I am Yaksha AI, your internship assistant. Ask me about project workflow, Git commands, Next.js, or anything related to your internship tasks.`;
  }

  if (prompt.includes('git')) {
    return `Use Git by creating a branch from main or dev, commit your changes locally, then push to origin. Open a PR and share the link with your mentor.`;
  }

  if (prompt.includes('next.js') || prompt.includes('next js')) {
    return `Next.js uses pages or app routes. In this app, use the App Router and API routes under src/app/api for server code. Create UI in components and pages under src/app.`;
  }

  if (prompt.includes('backend') || prompt.includes('express')) {
    return `The backend is a Node/Express server. You can call /api/chat from the frontend and add endpoints for auth, questions, and answers.`;
  }

  return `I am ready to help. Please describe your question in more detail and I will do my best to assist.`;
};

const createProviderConfig = () => {
  const openaiKey = process.env.OPENAI_API_KEY;
  const openaiBase = process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1/chat/completions';
  const openaiModel = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const openrouterModel = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

  if (openaiKey) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    };

    return {
      url: openaiBase,
      headers,
      body: {
        model: openaiModel,
        stream: true,
      },
    };
  }

  if (openrouterKey) {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${openrouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://internflow.ai',
      'X-Title': 'InternFlow AI',
    };

    return {
      url: 'https://openrouter.ai/api/v1/chat/completions',
      headers,
      body: {
        model: openrouterModel,
        stream: true,
      },
    };
  }

  return null;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages must be provided as an array.' },
        { status: 400 }
      );
    }

    const providerConfig = createProviderConfig();
    if (!providerConfig) {
      const responseText = fallbackReply(messages);
      const stream = await createSSEStream(responseText);
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    const response = await fetch(providerConfig.url, {
      method: 'POST',
      headers: providerConfig.headers,
      body: JSON.stringify({
        ...providerConfig.body,
        messages: [
    {
      role: "system",
      content: `
You are Yaksha AI, the official AI assistant of InternFlow.

Your purpose is to guide interns and admins using the InternFlow platform.

You should help users with:

- Dashboard navigation
- Internship workflow
- Teams and collaboration
- Announcements
- FAQs
- Resources
- Project guidance
- Git and GitHub
- Next.js and React
- DSA and coding questions
- Submission process
- Daily tasks and streaks

When users ask platform-related questions, answer specifically in the context of InternFlow.

Keep responses concise, friendly, and educational.

Do not mention OpenAI or OpenRouter.
Always behave as Yaksha AI.
`
    },
    ...messages
  ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI provider error response:', errorText);
      return NextResponse.json(
        { error: 'Unable to generate response. Please try again.' },
        { status: response.status || 500 }
      );
    }

    if (!response.body) {
      return NextResponse.json(
        { error: 'No response body from the AI provider.' },
        { status: 500 }
      );
    }

    const responseBody = response.body;
    const stream = new ReadableStream({
      async start(controller) {
        const reader = responseBody.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('API Chat Route Error:', error);
    return NextResponse.json(
      { error: 'Unable to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
