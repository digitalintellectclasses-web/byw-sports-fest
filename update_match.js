const fs = require('fs');
let c = fs.readFileSync('app/matches/MatchActionButtons.tsx', 'utf8');

c = c.replace("import { updateMatchResult } from '../actions';", "");

c = c.replace(/startTransition\(async \(\) => \{\s*try \{\s*const formData = new FormData\(\);\s*formData\.append\('matchId', matchId\);\s*formData\.append\('winnerId', winnerId\);\s*formData\.append\('score1', score1\);\s*formData\.append\('score2', score2\);\s*await updateMatchResult\(formData\);/g, `startTransition(async () => {
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId, winnerId, score1, score2 })
        });
        if (!res.ok) throw new Error("Failed to update match");
        
        window.location.reload();`);

fs.writeFileSync('app/matches/MatchActionButtons.tsx', c);
