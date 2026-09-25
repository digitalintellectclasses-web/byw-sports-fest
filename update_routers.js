const fs = require('fs');
let c = fs.readFileSync('app/matches/MatchActionButtons.tsx', 'utf8');
c = c.replace(/import \{ useState, useTransition \} from 'react';/, "import { useState, useTransition } from 'react';\nimport { useRouter } from 'next/navigation';");
c = c.replace(/const \[isPending, startTransition\] = useTransition\(\);/, "const router = useRouter();\n  const [isPending, startTransition] = useTransition();");
c = c.replace(/window\.location\.reload\(\);/g, "router.refresh();");
fs.writeFileSync('app/matches/MatchActionButtons.tsx', c);

let t = fs.readFileSync('app/teams/TeamActionButtons.tsx', 'utf8');
t = t.replace(/import \{ useTransition \} from 'react';/, "import { useTransition } from 'react';\nimport { useRouter } from 'next/navigation';");
t = t.replace(/const \[isPending, startTransition\] = useTransition\(\);/, "const router = useRouter();\n  const [isPending, startTransition] = useTransition();");
t = t.replace(/window\.location\.reload\(\);/g, "router.refresh();");
fs.writeFileSync('app/teams/TeamActionButtons.tsx', t);
