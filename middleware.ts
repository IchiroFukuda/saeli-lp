import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const url = request.nextUrl.clone();

  // mainichi-anoko.com → /mainichi-anoko にルーティング
  // ただし /letters/ 配下（手紙広場）は共通機能なのでrewrite対象外
  if (hostname.includes("mainichi-anoko.com")) {
    if (
      !url.pathname.startsWith("/mainichi-anoko") &&
      !url.pathname.startsWith("/letters")
    ) {
      url.pathname = `/mainichi-anoko${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
