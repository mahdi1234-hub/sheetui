import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const workbook = await prisma.workbook.findFirst({
    where: {
      id: params.id,
      OR: [
        { ownerId: session.user.id },
        { collaborators: { some: { userId: session.user.id, isActive: true } } },
      ],
    },
    include: {
      sheets: { orderBy: { orderIndex: "asc" } },
      owner: { select: { id: true, name: true, email: true, avatarUrl: true } },
    },
  });

  if (!workbook) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Update last opened
  await prisma.workbook.update({
    where: { id: params.id },
    data: { lastOpenedAt: new Date() },
  });

  return NextResponse.json(workbook);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const workbook = await prisma.workbook.updateMany({
    where: {
      id: params.id,
      ownerId: session.user.id,
    },
    data: body,
  });

  return NextResponse.json(workbook);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.workbook.updateMany({
    where: {
      id: params.id,
      ownerId: session.user.id,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
