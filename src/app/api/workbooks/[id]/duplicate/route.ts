import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const original = await prisma.workbook.findFirst({
    where: { id: params.id, ownerId: session.user.id },
    include: { sheets: true },
  });

  if (!original) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const duplicate = await prisma.workbook.create({
    data: {
      name: `${original.name} (Copy)`,
      ownerId: session.user.id,
      settings: original.settings as object,
      sheets: {
        create: original.sheets.map((s) => ({
          name: s.name,
          orderIndex: s.orderIndex,
          color: s.color,
          frozenRows: s.frozenRows,
          frozenCols: s.frozenCols,
          zoom: s.zoom,
          showGridlines: s.showGridlines,
          columnWidths: s.columnWidths as object,
          rowHeights: s.rowHeights as object,
        })),
      },
    },
    include: { sheets: true },
  });

  return NextResponse.json(duplicate);
}
