import fs from "fs";
import path from "path";
import SettingsDashboard from "./SettingsDashboard";
import { getTeams } from "../lib/data";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const isAdmin = (await cookies()).get("admin_session")?.value === "true";
  
  if (!isAdmin) {
    redirect("/login");
  }

  // Load initial rules JSON
  const filePath = path.join(process.cwd(), "data", "rules.json");
  let initialRules = "";
  try {
    initialRules = fs.readFileSync(filePath, "utf-8");
  } catch (e) {
    initialRules = "{\n  // rules.json not found\n}";
  }

  // Load teams for dropdown
  const teams = await getTeams();

  return (
    <SettingsDashboard initialRules={initialRules} teams={teams} />
  );
}
