import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, workbookId, sessionId, contextCells } = await request.json();

  try {
    // Save user message
    await prisma.aiChatHistory.create({
      data: {
        workbookId,
        userId: session.user.id,
        sessionId: sessionId || crypto.randomUUID(),
        role: "user",
        content: message,
        contextCells: contextCells || {},
      },
    });

    // Call Cerebras API
    const response = await fetch("https://api.cerebras.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.CEREBRAS_MODEL || "llama-3.1-8b",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for SheetUI, a powerful spreadsheet application. You help users with:
- Writing and explaining spreadsheet formulas (SUM, VLOOKUP, INDEX/MATCH, etc.)
- Analyzing data patterns and trends
- Suggesting chart types for data visualization
- Answering questions about their spreadsheet data
- Providing data manipulation suggestions

When the user provides cell data context, use it to give accurate, data-specific answers.
Keep responses concise and practical. When suggesting formulas, use standard Excel/Sheets syntax.
If cell context is provided, reference actual cell values in your response.`,
          },
          ...(contextCells
            ? [
                {
                  role: "user" as const,
                  content: `Current spreadsheet context:\n${JSON.stringify(contextCells, null, 2)}`,
                },
              ]
            : []),
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cerebras API error:", errorText);
      return NextResponse.json(
        { error: "AI service error", details: errorText },
        { status: 502 }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "I could not process that request.";
    const tokensUsed = data.usage?.total_tokens || 0;

    // Save AI response
    await prisma.aiChatHistory.create({
      data: {
        workbookId,
        userId: session.user.id,
        sessionId: sessionId || crypto.randomUUID(),
        role: "assistant",
        content: aiMessage,
        tokensUsed,
        model: process.env.CEREBRAS_MODEL || "llama-3.1-8b",
      },
    });

    return NextResponse.json({
      message: aiMessage,
      tokensUsed,
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const workbookId = searchParams.get("workbookId");

  if (!workbookId) {
    return NextResponse.json({ error: "workbookId required" }, { status: 400 });
  }

  const messages = await prisma.aiChatHistory.findMany({
    where: {
      workbookId,
      userId: session.user.id,
    },
    orderBy: { createdAt: "asc" },
    take: 100,
  });

  return NextResponse.json(messages);
}
