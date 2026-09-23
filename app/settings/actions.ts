"use server";

import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { prisma } from "../lib/data";

export async function updateRules(rulesJson: string) {
  try {
    const filePath = path.join(process.cwd(), "data", "rules.json");
    fs.writeFileSync(filePath, rulesJson);
    revalidatePath("/rules");
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update rules", error);
    return { success: false, error: "Failed to update rules" };
  }
}

export async function addParticipant(data: { code: string; name: string; gender: string; teamId: string }) {
  try {
    await prisma.player.create({
      data: {
        code: data.code,
        name: data.name,
        gender: data.gender,
        teamId: data.teamId
      }
    });
    revalidatePath("/teams");
    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to add participant", error);
    return { success: false, error: "Failed to add participant. Make sure Player Code is unique." };
  }
}

export async function resetTournamentData() {
  try {
    // 1. Clear all match results
    await prisma.match.updateMany({
      data: {
        score1: null,
        score2: null,
        winnerId: null,
        completed: null
      }
    });

    // 2. Clear all team penalty points
    await prisma.team.updateMany({
      data: {
        penalty_points: 0
      }
    });

    revalidatePath("/");
    revalidatePath("/matches");
    revalidatePath("/standings");
    revalidatePath("/teams");
    return { success: true };
  } catch (error) {
    console.error("Failed to reset tournament data", error);
    return { success: false, error: "Failed to reset tournament data" };
  }
}
