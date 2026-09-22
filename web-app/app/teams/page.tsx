import { getTeams } from "../lib/data";
import TeamsClient from "./TeamsClient";
import { cookies } from "next/headers";

export default async function TeamsPage() {
  const teams = await getTeams();
  const isAdmin = (await cookies()).get("admin_session")?.value === "true";
  return <TeamsClient teams={teams} isAdmin={isAdmin} />;
}
