import { NextResponse } from "next/server";
import { setupDemoAction, startTournamentAction } from "../../setupActions";

export async function POST(req: Request) {
  try {
    const { action } = await req.json();
    if (action === "demo") {
      await setupDemoAction();
    } else if (action === "start") {
      await startTournamentAction();
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
