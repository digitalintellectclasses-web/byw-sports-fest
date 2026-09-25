import { createClient } from "@libsql/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

const libsql = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function main() {
  const data = JSON.parse(fs.readFileSync("./seed_data.json", "utf-8"));

  console.log("Seeding teams...");
  for (const team of data.teams) {
    await prisma.team.upsert({
      where: { id: team },
      update: {},
      create: { id: team, name: team, penalty_points: 0 },
    });
  }

  console.log("Seeding players...");
  for (const p of data.players) {
    if (!p.name) continue; // Skip empty players
    await prisma.player.upsert({
      where: { code: p.code },
      update: { name: p.name, gender: p.gender || "Unknown", teamId: p.teamId },
      create: { code: p.code, name: p.name, gender: p.gender || "Unknown", teamId: p.teamId },
    });
  }

  console.log("Seeding matches...");
  for (const m of data.matches) {
    await prisma.match.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }

  console.log("Seeding player appearances...");
  for (const a of data.appearances) {
    await prisma.playerAppearance.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
