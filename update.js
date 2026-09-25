const fs = require('fs');
let c = fs.readFileSync('app/matches/MatchActionButtons.tsx', 'utf8');
c = c.replace(/.*\{team1Id \? `Team \$\{team1Id\} Wins` : 'TBD'\}/g, "          {isPending ? 'Updating...' : `🏆 ${team1Id ? `Team ${team1Id} Wins` : 'TBD'}`}");
c = c.replace(/.*\{team2Id \? `Team \$\{team2Id\} Wins` : 'TBD'\}/g, "          {isPending ? 'Updating...' : `🏆 ${team2Id ? `Team ${team2Id} Wins` : 'TBD'}`}");
fs.writeFileSync('app/matches/MatchActionButtons.tsx', c);
