import { NextResponse } from "next/server";
import { prisma } from "../../lib/data";

export async function POST(req: Request) {
  try {
    const { teamId, points } = await req.json();
    
    if (!teamId) {
      return NextResponse.json({ error: "Missing teamId" }, { status: 400 });
    }

    await prisma.team.update({
      where: { id: teamId },
      data: {
        penalty_points: {
          increment: parseInt(points) || 20
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
