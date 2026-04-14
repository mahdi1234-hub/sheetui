import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { workbookId, name } = body;

  const lastSheet = await prisma.sheet.findFirst({
    where: { workbookId },
    orderBy: { orderIndex: "desc" },
  });

  const sheet = await prisma.sheet.create({
    data: {
      workbookId,
      name: name || `Sheet${(lastSheet?.orderIndex ?? -1) + 1}`,
      orderIndex: (lastSheet?.orderIndex ?? -1) + 1,
    },
  });

  return NextResponse.json(sheet);
}
