import type { ReactNode } from "react";

/** Minimal wrapper — middleware handles /admin/login vs protected routes */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
