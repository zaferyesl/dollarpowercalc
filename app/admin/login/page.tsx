"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { adminLoginAction, type AdminLoginState } from "@/app/admin/_actions/login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();

  const [state, formAction] = useActionState<AdminLoginState, FormData>(
    async (_prev, fd) => adminLoginAction(undefined, fd),
    { ok: false },
  );

  useEffect(() => {
    if (state?.ok) {
      router.push("/admin");
      router.refresh();
    }
  }, [state?.ok, router]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/30 px-4 py-16">
      <Card className="w-full max-w-md border-border/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">WealthTrace admin</CardTitle>
          <CardDescription>Restricted access — credential login only.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" action={formAction}>
            {!state.ok && state.error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {state.error}
              </p>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="mt-2 w-full rounded-xl">
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
