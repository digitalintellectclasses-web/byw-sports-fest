import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function getTeams() {
  return await prisma.team.findMany({
    include: {
      players: true
    }
  });
}

export async function getPlayers() {
  return await prisma.player.findMany({
    include: {
      team: true
    }
  });
}

export async function getMatches() {
  return await prisma.match.findMany({
    include: {
      appearances: {
        include: {
          player: true
        }
      }
    }
  });
}

export async function getAnnouncements() {
  return await prisma.announcement.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
}

export async function getRecentMatches() {
  return await prisma.match.findMany({
    where: { completed: 'YES' },
    // Since id might not be purely chronological, but we have no createdAt, 
    // we'll just take 5 matches that are completed.
    take: 5
  });
}
