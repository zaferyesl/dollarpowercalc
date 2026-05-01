"use server";

import { signIn } from "@/auth";

export type AdminLoginState = { ok: true } | { ok: false; error?: string };

/** NextAuth v5: `redirect: false` returns a URL string, not `{ error }`. Failures include `?error=`. */
function signInFailed(result: unknown): boolean {
  if (result && typeof result === "object" && "error" in result) {
    return Boolean((result as { error?: string }).error);
  }
  if (typeof result === "string") {
    try {
      const base = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? "http://localhost:3000";
      return new URL(result, base).searchParams.has("error");
    } catch {
      return result.includes("error=");
    }
  }
  return false;
}

export async function adminLoginAction(_: AdminLoginState | undefined, formData: FormData): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  const result = await signIn("admin-credentials", {
    email,
    password,
    redirect: false,
  });

  if (signInFailed(result)) {
    return { ok: false, error: "Invalid email or password." };
  }

  return { ok: true };
}
