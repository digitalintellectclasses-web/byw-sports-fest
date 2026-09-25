"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "./lib/data";
import data from "./lib/data.json";

export async function startTournamentAction() {
  try {
    // We will do all deletions and insertions in a single transaction
    // This is much faster and avoids foreign key race conditions
    await prisma.$transaction([
      prisma.playerAppearance.deleteMany({}),
      prisma.match.deleteMany({}),
      prisma.player.deleteMany({}),
      prisma.team.deleteMany({}),

      prisma.team.createMany({
        data: data.teams.map((team: string) => ({ id: team, name: team, penalty_points: 0 }))
      }),

      prisma.player.createMany({
        data: data.players.filter((p: any) => p.name).map((p: any) => ({
          code: p.code,
          name: p.name,
          gender: p.gender || "Unknown",
          teamId: p.teamId
        }))
      }),

      prisma.match.createMany({
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
      }),

      prisma.playerAppearance.createMany({
        data: data.appearances.map((a: any) => ({
          id: a.id,
          matchId: a.matchId,
          playerCode: a.playerCode,
          teamId: a.teamId
        }))
      })
    ]);

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
    // First, start fresh by calling startTournamentAction
    await startTournamentAction();

    // Now let's fetch all matches and complete a bunch of them randomly
    const allMatches = await prisma.match.findMany();
    
    // Let's complete 80% of matches
    const matchesToComplete = allMatches.slice(0, Math.floor(allMatches.length * 0.8));
    
    const updatePromises = matchesToComplete.map((m) => {
      if (!m.team1Id || !m.team2Id) return null;
      
      const score1 = Math.floor(Math.random() * 21);
      const score2 = Math.floor(Math.random() * 21);
      const winnerId = score1 > score2 ? m.team1Id : (score2 > score1 ? m.team2Id : m.team1Id);
      
      return prisma.match.update({
        where: { id: m.id },
        data: {
          score1: score1.toString(),
          score2: score2.toString(),
          winnerId,
          completed: "YES"
        }
      });
    }).filter(Boolean);
    
    // Execute all updates in a single transaction to prevent timeouts on Vercel
    await prisma.$transaction(updatePromises as any);

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
