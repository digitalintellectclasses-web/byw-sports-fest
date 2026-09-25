const fs = require('fs');
let c = fs.readFileSync('app/settings/SettingsDashboard.tsx', 'utf8');

c = c.replace(/import \{ logout \} from "\.\.\/login\/actions";/, "");

c = c.replace(/const handleLogout = async \(\) => \{\s*await logout\(\);\s*router\.push\("\/login"\);\s*\};/g, `const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/login');
    router.refresh();
  };`);

fs.writeFileSync('app/settings/SettingsDashboard.tsx', c);
