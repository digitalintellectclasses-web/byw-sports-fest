"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@libsql/client";
import { prisma } from "./lib/data";
import data from "./lib/data.json";

function getLibsqlClient() {
  return createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });
}

export async function startTournamentAction() {
  try {
    const client = getLibsqlClient();

    // Build all SQL statements up front
    const stmts: { sql: string; args?: any[] }[] = [
      // Clear in FK-safe order
      { sql: `DELETE FROM "PlayerAppearance"` },
      { sql: `DELETE FROM "Match"` },
      { sql: `DELETE FROM "Player"` },
      { sql: `DELETE FROM "Team"` },
      { sql: `DELETE FROM "Announcement"` },
    ];

    // Insert teams
    for (const team of data.teams as string[]) {
      stmts.push({
        sql: `INSERT INTO "Team" (id, name, penalty_points) VALUES (?, ?, 0)`,
        args: [team, team],
      });
    }

    // Insert players
    for (const p of data.players as any[]) {
      if (!p.name) continue;
      stmts.push({
        sql: `INSERT INTO "Player" (code, name, gender, teamId) VALUES (?, ?, ?, ?)`,
        args: [p.code, p.name, p.gender || "Unknown", p.teamId],
      });
    }

    // Insert matches
    for (const m of data.matches as any[]) {
      stmts.push({
        sql: `INSERT INTO "Match" (id, time, sport, category, stage, team1Id, team2Id, score1, score2, winnerId, completed) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL)`,
        args: [m.id, m.time, m.sport, m.category, m.stage, m.team1Id, m.team2Id],
      });
    }

    // Send everything in ONE batch HTTP request to Turso
    await client.batch(stmts, "write");

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
    const client = getLibsqlClient();

    const stmts: { sql: string; args?: any[] }[] = [
      { sql: `DELETE FROM "PlayerAppearance"` },
      { sql: `DELETE FROM "Match"` },
      { sql: `DELETE FROM "Player"` },
      { sql: `DELETE FROM "Team"` },
      { sql: `DELETE FROM "Announcement"` },
    ];

    // Insert teams
    for (const team of data.teams as string[]) {
      stmts.push({
        sql: `INSERT INTO "Team" (id, name, penalty_points) VALUES (?, ?, 0)`,
        args: [team, team],
      });
    }

    // Insert players
    for (const p of data.players as any[]) {
      if (!p.name) continue;
      stmts.push({
        sql: `INSERT INTO "Player" (code, name, gender, teamId) VALUES (?, ?, ?, ?)`,
        args: [p.code, p.name, p.gender || "Unknown", p.teamId],
      });
    }

    // Insert matches — complete 80% of league stage with deterministic scores
    const leagueIds = new Set(
      (data.matches as any[])
        .filter((m) => m.stage === "League")
        .map((m) => m.id)
    );
    const toComplete = new Set(
      [...leagueIds].slice(0, Math.floor(leagueIds.size * 0.8))
    );

    for (const m of data.matches as any[]) {
      if (toComplete.has(m.id) && m.team1Id && m.team2Id) {
        const s1 = (parseInt(m.id, 10) * 7 + 3) % 21;
        const s2 = (parseInt(m.id, 10) * 13 + 5) % 21;
        const winner = s1 >= s2 ? m.team1Id : m.team2Id;
        stmts.push({
          sql: `INSERT INTO "Match" (id, time, sport, category, stage, team1Id, team2Id, score1, score2, winnerId, completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'YES')`,
          args: [m.id, m.time, m.sport, m.category, m.stage, m.team1Id, m.team2Id, String(s1), String(s2), winner],
        });
      } else {
        stmts.push({
          sql: `INSERT INTO "Match" (id, time, sport, category, stage, team1Id, team2Id, score1, score2, winnerId, completed) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL)`,
          args: [m.id, m.time, m.sport, m.category, m.stage, m.team1Id, m.team2Id],
        });
      }
    }

    // One batch = one HTTP request to Turso — no timeouts
    await client.batch(stmts, "write");

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
