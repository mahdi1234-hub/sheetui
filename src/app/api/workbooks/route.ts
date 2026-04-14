import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workbooks = await prisma.workbook.findMany({
    where: {
      ownerId: session.user.id,
      isDeleted: false,
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(workbooks);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const workbook = await prisma.workbook.create({
    data: {
      name: body.name || "Untitled Workbook",
      ownerId: session.user.id,
      sheets: {
        create: {
          name: "Sheet0",
          orderIndex: 0,
        },
      },
    },
    include: { sheets: true },
  });

  return NextResponse.json(workbook);
}
