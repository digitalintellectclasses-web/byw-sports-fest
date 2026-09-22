import { getMatches } from "../lib/data";
import MatchesClient from "./MatchesClient";
import { cookies } from "next/headers";

export default async function MatchesPage() {
  const matches = await getMatches();
  const isAdmin = (await cookies()).get("admin_session")?.value === "true";
  
  return <MatchesClient matches={matches} isAdmin={isAdmin} />;
}
