"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { prisma } from "./lib/data";

export async function startTournamentAction() {
  try {
    const filePath = path.join(process.cwd(), "seed_data.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // We can do this in a transaction or sequentially
    // But since it's sqlite and we need to reset everything

    // 1. Delete all matches, appearances, players, teams
    await prisma.playerAppearance.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.team.deleteMany({});

    // 2. Re-create teams
    for (const team of data.teams) {
      await prisma.team.create({
        data: { id: team, name: team, penalty_points: 0 },
      });
    }

    // 3. Re-create players
    for (const p of data.players) {
      if (!p.name) continue;
      await prisma.player.create({
        data: { code: p.code, name: p.name, gender: p.gender || "Unknown", teamId: p.teamId },
      });
    }

    // 4. Re-create matches with scores and winners set to null
    for (const m of data.matches) {
      await prisma.match.create({
        data: {
          id: m.id,
          time: m.time,
          sport: m.sport,
          category: m.category,
          stage: m.stage,
          team1Id: m.team1Id,
          team2Id: m.team2Id,
          score1: null,
          score2: null,
          winnerId: null,
          completed: null
        }
      });
    }

    // 5. Re-create player appearances
    for (const a of data.appearances) {
      await prisma.playerAppearance.create({
        data: {
          id: a.id,
          matchId: a.matchId,
          playerCode: a.playerCode,
          teamId: a.teamId
        }
      });
    }

    revalidatePath("/");
    revalidatePath("/matches");
    revalidatePath("/standings");
    revalidatePath("/teams");
    return { success: true };
  } catch (error) {
    console.error("Failed to start tournament:", error);
    throw new Error("Failed to start tournament");
  }
}
