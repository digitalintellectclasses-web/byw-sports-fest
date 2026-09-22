import { prisma } from './data';

export async function getTeamPoints() {
  const teams = await prisma.team.findMany();
  const matches = await prisma.match.findMany({
    where: { completed: "YES" }
  });
  
  const points: Record<string, number> = {};
  
  // Initialize with penalties
  for (const team of teams) {
    points[team.id] = -team.penalty_points;
  }
  
  // Add 10 points for each win
  for (const match of matches) {
    if (match.winnerId && points[match.winnerId] !== undefined) {
      points[match.winnerId] += 10;
    }
  }
  
  return points;
}

export async function getCategoryStandings() {
  // Returns standings per sport and category for League matches only
  const teams = await prisma.team.findMany();
  const leagueMatches = await prisma.match.findMany({
    where: { 
      completed: "YES",
      stage: "League"
    }
  });

  // group by Sport -> Category -> Group (A or B) -> Team
  const categories: Record<string, Record<string, Record<string, Record<string, number>>>> = {};
  
  for (const match of leagueMatches) {
    if (!match.sport || !match.category) continue;
    
    if (!categories[match.sport]) categories[match.sport] = {};
    if (!categories[match.sport][match.category]) {
      categories[match.sport][match.category] = { "Group A": {}, "Group B": {} };
    }
    
    // determine group of winner
    if (match.winnerId) {
      const group = match.winnerId.startsWith('A') ? "Group A" : "Group B";
      if (categories[match.sport][match.category][group][match.winnerId] === undefined) {
        categories[match.sport][match.category][group][match.winnerId] = 0;
      }
      categories[match.sport][match.category][group][match.winnerId] += 10;
    }
  }

  return categories;
}
