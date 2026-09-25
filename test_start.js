const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@libsql/client');
const { PrismaLibSQL } = require('@prisma/adapter-libsql');
const fs = require('fs');

const env = fs.readFileSync('.env', 'utf-8');
const urlMatch = env.match(/TURSO_DATABASE_URL=(.*)/);
const tokenMatch = env.match(/TURSO_AUTH_TOKEN=(.*)/);
const url = urlMatch[1].replace(/['"]/g, '').trim();
const token = tokenMatch[1].replace(/['"]/g, '').trim();

const libsql = createClient({ url, authToken: token });
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function run() {
    try {
        console.log("Deleting player appearances...");
        await prisma.playerAppearance.deleteMany({});
        console.log("Deleting matches...");
        await prisma.match.deleteMany({});
        console.log("Deleting players...");
        await prisma.player.deleteMany({});
        console.log("Deleting teams...");
        await prisma.team.deleteMany({});
        console.log("Done deleting.");
    } catch (e) {
        console.error(e);
    }
}
run();
