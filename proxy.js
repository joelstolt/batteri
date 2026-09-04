import { NextResponse } from "next/server"

export function proxy(request) {
  if (process.env.BP_REVIEW_PREVIEW !== "1") return NextResponse.next()
  const path = request.nextUrl.pathname
  const headers = {
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control": "no-store",
  }
  // Preview contains no payment credentials and cannot send messages or run jobs.
  if (path.startsWith("/studio"))
    return new NextResponse("Studion är avstängd i förhandsvisningen.", {
      status: 503,
      headers,
    })
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
