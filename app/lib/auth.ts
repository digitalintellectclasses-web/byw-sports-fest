import { cookies } from "next/headers";

export async function isReferee() {
  const cookieStore = await cookies();
  const token = cookieStore.get("referee_auth");
  return token?.value === "true";
}
