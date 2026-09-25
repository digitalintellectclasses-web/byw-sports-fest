"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./lib/data";
import data from "./lib/data.json";

export async function startTournamentAction() {
  try {
    // Delete everything first (sequential to respect FK constraints)
    await prisma.playerAppearance.deleteMany({});
    await prisma.match.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.team.deleteMany({});

    // Re-insert everything in one shot per table
    await prisma.team.createMany({
      data: data.teams.map((team: string) => ({ id: team, name: team, penalty_points: 0 }))
    });

    await prisma.player.createMany({
      data: data.players.filter((p: any) => p.name).map((p: any) => ({
        code: p.code,
        name: p.name,
        gender: p.gender || "Unknown",
        teamId: p.teamId
      }))
    });

    await prisma.match.createMany({
      data: data.matches.map((m: any) => ({
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
      }))
    });

    await prisma.playerAppearance.createMany({
      data: data.appearances.map((a: any) => ({
        id: a.id,
        matchId: a.matchId,
        playerCode: a.playerCode,
        teamId: a.teamId
      }))
    });

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

export async function setupDemoAction() {
  try {
    // 1. Reset to clean state
    await startTournamentAction();

    // 2. Pre-compute demo scores in JS (no extra DB round-trip needed)
    //    Only complete league stage matches (stage = "League") - about 144 matches
    const leagueMatches = data.matches.filter((m: any) => m.stage === "League" && m.team1Id && m.team2Id);
    const cutoff = Math.floor(leagueMatches.length * 0.8);
    const toComplete = leagueMatches.slice(0, cutoff);

    // Build a single CASE WHEN SQL to update all rows in one query
    // This avoids N individual updates - it's one SQL statement
    if (toComplete.length > 0) {
      const ids = toComplete.map((m: any) => `'${m.id}'`).join(", ");
      
      // Assign scores deterministically based on id hash so it's reproducible
      const cases = toComplete.map((m: any) => {
        const s1 = (parseInt(m.id, 10) * 7 + 3) % 21;
        const s2 = (parseInt(m.id, 10) * 13 + 5) % 21;
        const winner = s1 >= s2 ? m.team1Id : m.team2Id;
        return `WHEN id = '${m.id}' THEN '${winner}'`;
      }).join(" ");

      const score1Cases = toComplete.map((m: any) => {
        const s1 = (parseInt(m.id, 10) * 7 + 3) % 21;
        return `WHEN id = '${m.id}' THEN '${s1}'`;
      }).join(" ");

      const score2Cases = toComplete.map((m: any) => {
        const s2 = (parseInt(m.id, 10) * 13 + 5) % 21;
        return `WHEN id = '${m.id}' THEN '${s2}'`;
      }).join(" ");

      await prisma.$executeRawUnsafe(`
        UPDATE "Match"
        SET
          score1 = CASE ${score1Cases} ELSE score1 END,
          score2 = CASE ${score2Cases} ELSE score2 END,
          winnerId = CASE ${cases} ELSE winnerId END,
          completed = CASE WHEN id IN (${ids}) THEN 'YES' ELSE completed END
        WHERE id IN (${ids})
      `);
    }

    revalidatePath("/");
    revalidatePath("/matches");
    revalidatePath("/standings");
    revalidatePath("/teams");
    return { success: true };
  } catch (error) {
    console.error("Failed to setup demo:", error);
    throw new Error("Failed to setup demo");
  }
}
