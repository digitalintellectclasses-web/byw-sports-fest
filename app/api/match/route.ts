import { NextResponse } from "next/server";
import { prisma } from "../../lib/data";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { matchId, winnerId, score1, score2 } = body;
    
    if (!matchId || !winnerId) {
      return NextResponse.json({ error: "Missing matchId or winnerId" }, { status: 400 });
    }

    await prisma.match.update({
      where: { id: matchId },
      data: {
        winnerId: winnerId,
        score1: score1 || "0",
        score2: score2 || "0",
        completed: 'YES',
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const e = error as Error;
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
