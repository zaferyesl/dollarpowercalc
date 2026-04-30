import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const path = req.nextUrl.pathname;
  const isAdminArea = path.startsWith("/admin");
  if (!isAdminArea) return NextResponse.next();

  const isLogin = path === "/admin/login" || path.startsWith("/admin/login/");
  if (isLogin) {
    if (req.auth) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
