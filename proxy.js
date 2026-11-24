import { NextResponse } from "next/server"
import { pausBeslut, PAUS_HTML, PAUS_API_FEL } from "@/lib/butik-paus"

const PAUS_HEADERS = { "Retry-After": "86400", "Cache-Control": "no-store" }

export function proxy(request) {
  const paus = pausBeslut(request.nextUrl.pathname)
  if (paus === "sida") {
    return new NextResponse(PAUS_HTML, {
      status: 503,
      headers: { ...PAUS_HEADERS, "Content-Type": "text/html; charset=utf-8" },
    })
  }
  if (paus === "api") {
    return NextResponse.json({ error: PAUS_API_FEL }, { status: 503, headers: PAUS_HEADERS })
  }
  if (process.env.BP_REVIEW_PREVIEW !== "1") return NextResponse.next()
  const path = request.nextUrl.pathname
  const headers = {
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
  }
  // Preview contains no payment credentials and cannot send messages or run jobs.
  if (path.startsWith("/api/")) {
    const invalidOrder =
      path === "/api/order" &&
      (!request.nextUrl.searchParams.get("payment_intent") ||
        !request.nextUrl.searchParams.get("payment_intent_client_secret"))
    return NextResponse.json(
      {
        error: invalidOrder
          ? "Orderuppgifter saknas"
          : "Betalning och kontakt är avstängda i förhandsvisningen.",
      },
      { status: invalidOrder ? 400 : 503, headers }
    )
  }
  const response = NextResponse.next()
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  return response
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
