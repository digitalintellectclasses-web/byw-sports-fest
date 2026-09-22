"use server";

import { cookies } from "next/headers";

const ADMIN_PIN = process.env.ADMIN_PIN || "1234";

export async function authenticate(pin: string) {
  if (pin === ADMIN_PIN) {
    // Set a cookie that expires in 24 hours
    cookies().set("admin_session", "true", { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/"
    });
    return true;
  }
  return false;
}

export async function logout() {
  cookies().delete("admin_session");
}
