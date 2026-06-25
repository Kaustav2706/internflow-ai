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

const fallbackReply = (
  messages: Array<{ role: string; content: string }>
) => {
  const lastUser = messages.slice().reverse().find((m) => m.role === "user");
  const prompt = (lastUser?.content || "").toLowerCase().trim();
  console.log("USER PROMPT:", prompt);

  //keyword 

  const joinKeywords = [
  "join internship",
  "join this internship",
  "how to join",
  "enroll",
  "register",
  "apply",
  "sign up",
  "become intern"
];

const roadmapKeywords = [
  "roadmap",
  "timeline",
  "internship roadmap",
  "internship flow",
  "flow of internship",
  "journey", 
  "flow",
  "internship structure",
  "program flow"
];

const internshipDetailsKeywords = [
  "details about this internship",
  "internship details",
  "about internship",
  "what is internflow",
  "about internflow",
  "internship information",
  "tell me about internship"
];


const weeklyTaskKeywords = [
  "what should i complete this week",
  "what should i do this week",
  "weekly tasks",
  "current week",
  "week",
  "what for this week",
  "what for today",
  "this week",
  "what next"
];

const announcementKeywords = [
  "announcement",
  "announcements",
  "latest announcement",
  "updates",
  "news"
];

const teamKeywords = [
  "team",
  "teammate",
  "group",
  "team formation",
  "join team"
];

const certificateKeywords = [
  "certificate",
  "certificates",
  "badge",
  "bronze",
  "silver",
  "gold",
  "platinum",
  "prize",
  "reward"
];

const submissionKeywords = [
  "submit",
  "submission",
  "deliverable",
  "upload project",
  "weekly report",
  "project files"
];

const resourceKeywords = [
  "resources",
  "resource",
  "template",
  "guidelines",
  "mern course",
  "course"
];

const meetingKeywords = [
  "zoom",
  "meeting",
  "standup",
  "standups",
  "attendance",
  "meeting link"
];
const helpKeywords = [
  "help",
  "support",
  "not working",
  "cant access",
  "loading",
  "error",
  "bug",
  "contact",
  "contact team",
  "issue",
  "problem",
  "stuck",
  "glitch",
  "admin"
];

  // Greetings
  const words = prompt.split(/\s+/);

if (
  words.includes("hi") || words.includes("hllo") ||words.includes("hiiii") || 
  words.includes("hai") ||
  words.includes("hello") ||
  words.includes("Yaksha") ||
  words.includes("hey")
)
   {
    return `Hello! 👋 I am Yaksha AI, the InternFlow internship assistant.

I can help you with:
• Internship roadmap
• Coursework and learning resources
• Teams and collaboration
• Standup meetings
• Deliverable submissions
• Project workflow
• Certificates and badges
• Announcements and resources

How can I help you today?`;
  }

  if (joinKeywords.some(k => prompt.includes(k))) {
  return `To join the InternFlow internship, complete the registration process and follow the onboarding instructions shared by the InternFlow team.

Once enrolled:
• Check announcements regularly
• Attend the onboarding Zoom session
• Review the Starter Kit
• Complete assigned coursework
• Participate in team activities and projects`;
}

if (internshipDetailsKeywords.some(k => prompt.includes(k))) {
  return `InternFlow is a structured internship program designed to help students gain practical industry experience.

The internship includes:
• Fundamentals of AI coursework
• MERN Stack learning track
• Team-based collaboration
• Daily standup meetings
• Weekly deliverables
• Real-world project development
• GitHub and Pull Request workflow
• Mentor guidance and feedback
• Certificates and badge progression

The program is designed to help interns learn, collaborate, and build industry-relevant skills through hands-on projects.`;
}

if (roadmapKeywords.some(k => prompt.includes(k))) {
  return `InternFlow Internship Roadmap

Before Week 1
• Check announcements
• Attend onboarding Zoom session
• Review Starter Kit

Week 1
• Orientation
• Fundamentals of AI coursework
• Team formation (10 members)
• Start FAQ project

Weeks 2-3
• Complete MERN Stack coursework
• Continue FAQ project

Week 4
• Submit FAQ deliverable
• Form Phase 2 team (5 members)

Weeks 5-8
• Build project with your team
• Raise Pull Requests
• Mentor reviews
• Daily standups

Badge Progression:
Bronze → Silver → Gold → Platinum`;
}

if (weeklyTaskKeywords.some(k => prompt.includes(k))) {
  return `Check your dashboard checklist and deadlines first.

Typical internship progress:

• Week 1: Orientation, AI coursework, team formation, FAQ project
• Weeks 2-3: MERN coursework and FAQ project
• Week 4: Deliverable submission and Phase 2 team formation
• Weeks 5-8: Project development, testing, PR submissions, mentor reviews

Complete any pending coursework, deliverables, and standup requirements for your current week.`;
}

if (announcementKeywords.some(k => prompt.includes(k))) {
  return `You can find internship updates, deadlines, meeting schedules, and important notices in the Announcements section of the InternFlow platform. Check it regularly so you don't miss important updates.`;
}

if (teamKeywords.some(k => prompt.includes(k))) {
  return `InternFlow uses team-based collaboration.

• Week 1 teams typically contain around 10 members.
• Phase 2 projects usually use smaller teams.
• Coordinate with fellow interns and mentors when forming teams.
• Project submission links and deadlines are available on the dashboard and announcements.
• Stay active in team discussions and project planning.`;
}

if (certificateKeywords.some(k => prompt.includes(k))) {
  return `InternFlow recognizes participation through certificates and badges.

• Bronze: Coursework + Attendance
• Silver: Active Contribution
• Gold: Strong Project Contribution
• Platinum: Post-internship Collaboration

Stay active, complete coursework, attend standups, and contribute to projects to maximize your progress.`;
}

if (submissionKeywords.some(k => prompt.includes(k))) {
  return `Weekly deliverables and project submissions should be uploaded through the InternFlow submission process.

Before submitting:
• Review submission guidelines
• Include all required files
• Verify project functionality
• Submission links and deadlines are available on the dashboard and announcements
• Submit before the deadline`;
}

if (resourceKeywords.some(k => prompt.includes(k))) {
  return `Available resources include:

• MERN Stack Course
• Fundamentals of AI Coursework
• Project Templates
• Development Guidelines
• Weekly Submission Forms
• Internship Resources

Check the Resources section for the latest materials.`;
}

if (meetingKeywords.some(k => prompt.includes(k))) {
  return `Daily standups help interns discuss progress and blockers.
• Attend scheduled Zoom meetings
• Share your progress
• Discuss blockers
• Coordinate with teammates
Meeting information is available through announcements and internship resources.`;
}

if (helpKeywords.some(k => prompt.includes(k))) {
  return `Need assistance?

If you're facing issues related to the internship, coursework, teams, submissions, meetings, or platform access, please use the Help button available on the platform to contact the InternFlow team.
The support team can help with:
• Platform issues
• Team-related concerns
• Submission problems
• Meeting access
• Internship guidance
• Account-related queries
Click the Help button to reach the team directly.`;
}


  // Unrelated Questions
  return `Yaksha AI specialize in guiding interns in navigating the InternFlow platform and internship workflow. For non-InternFlow topics, please redirect to a general GPT assistant to sort out coding,academic,debugging or study related questions. If you are facing a platform-related issue, please click the Help button to contact the InternFlow team directly.
  Check for typos and rephrase your question if needed.
  Ask me anything related to InternFlow internship guidance, and I'll be happy to assist you!`;
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
- Coursework guidance
- Team formation
- Deliverable submissions
- Standup meetings
- Certificates and badges
- Project workflow
- GitHub pull request process
If a user asks unrelated coding, academic, interview, or debugging questions, politely explain that Yaksha specializes in InternFlow internship guidance and recommend using a dedicated AI assistant for those topics.
Keep responses concise, friendly, and educational.

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
