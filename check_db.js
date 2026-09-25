const fs = require('fs');
const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/TURSO_DATABASE_URL=(.*)/);
const tokenMatch = env.match(/TURSO_AUTH_TOKEN=(.*)/);
const url = urlMatch[1].replace(/['"]/g, '').trim();
const token = tokenMatch[1].replace(/['"]/g, '').trim();
const { createClient } = require('@libsql/client');
const client = createClient({ url, authToken: token });
client.execute("SELECT name, sql FROM sqlite_master WHERE type='table'").then(rs => {
  console.log(JSON.stringify(rs.rows, null, 2));
});
