const fs = require('fs');
let c = fs.readFileSync('app/teams/TeamActionButtons.tsx', 'utf8');

c = c.replace("import { addPenalty } from '../actions';", "");

c = c.replace(/startTransition\(async \(\) => \{\s*try \{\s*const formData = new FormData\(\);\s*formData\.append\('teamId', teamId\);\s*formData\.append\('points', '20'\);\s*await addPenalty\(formData\);/g, `startTransition(async () => {
      try {
        const res = await fetch('/api/penalty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ teamId, points: 20 })
        });
        if (!res.ok) throw new Error("Failed to add penalty");
        window.location.reload();`);

c = c.replace(/<AlertTriangle size=\{14\} \/> Add -20 Penalty/g, "<AlertTriangle size={14} /> {isPending ? 'Adding Penalty...' : 'Add -20 Penalty'}");

fs.writeFileSync('app/teams/TeamActionButtons.tsx', c);
