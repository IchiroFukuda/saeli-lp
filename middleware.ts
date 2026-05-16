import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const url = request.nextUrl.clone();

  // mainichi-anoko.com → /mainichi-anoko にルーティング
  if (hostname.includes("mainichi-anoko.com")) {
    if (url.pathname === "/") {
      url.pathname = "/mainichi-anoko";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
