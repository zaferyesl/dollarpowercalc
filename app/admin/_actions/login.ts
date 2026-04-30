"use server";

import { signIn } from "@/auth";

export type AdminLoginState = { ok: true } | { ok: false; error?: string };

export async function adminLoginAction(_: AdminLoginState | undefined, formData: FormData): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return { ok: false, error: "Invalid email or password." };
  }

  return { ok: true };
}
