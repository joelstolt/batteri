import { NextResponse } from 'next/server'
import { createHash, timingSafeEqual } from 'node:crypto'

const allowedApi = new Set(['/api/create-payment-intent', '/api/order-details', '/api/order', '/api/order/capture', '/api/order/ship', '/api/stripe/webhook'])
function same(a, b) {
  const x = Buffer.from(a || ''), y = Buffer.from(b || '')
  return x.length === y.length && timingSafeEqual(x, y)
}
export async function proxy(request) {
  const headers = {'X-Robots-Tag':'noindex, nofollow','Cache-Control':'no-store'}
  const token = process.env.BP_TEST_ACCESS_TOKEN
  if (process.env.BP_PAYMENT_TEST !== '1' || !process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || !token || process.env.CONTACT_TO_EMAIL !== 'joel@stoltmarketing.se') {
    return new NextResponse('Testmiljön är stängd.', {status:503, headers})
  }
  const path = request.nextUrl.pathname
  const cookieValue = createHash('sha256').update(token).digest('hex')
  if (path === '/test-inloggning') {
    if (request.method === 'POST') {
      const form = await request.formData()
      if (!same(String(form.get('token') || ''), token)) return new NextResponse('Fel testkod.', {status:403, headers})
      const response = NextResponse.redirect(new URL('/kategori/alla', request.url),303)
      response.cookies.set('bp_payment_test',cookieValue,{httpOnly:true,secure:true,sameSite:'lax',maxAge:7200,path:'/'})
      response.headers.set('X-Robots-Tag','noindex, nofollow')
      return response
    }
    return new NextResponse('<!doctype html><html lang="sv"><title>Batteriproffs betalningstest</title><h1>Skyddat betalningstest</h1><p>Endast testkort. Ingen riktig beställning.</p><form method="post"><label>Testkod <input name="token" type="password" autocomplete="off" required></label><button type="submit">Öppna testmiljön</button></form></html>',{headers:{...headers,'Content-Type':'text/html; charset=utf-8'}})
  }
  // Stripe itself verifies the webhook signature in the original route.
  if (path !== '/api/stripe/webhook' && !same(request.cookies.get('bp_payment_test')?.value,cookieValue) && !same(request.headers.get('x-bp-test-token'),token)) {
    return new NextResponse('Skyddad testmiljö.',{status:401,headers})
  }
  if ((path.startsWith('/api/') && !allowedApi.has(path)) || path.startsWith('/studio') || path.startsWith('/admin') || path.startsWith('/konto')) {
    return new NextResponse('Funktionen är avstängd i betalningstestet.',{status:503,headers})
  }
  const response=NextResponse.next()
  response.headers.set('X-Robots-Tag','noindex, nofollow')
  response.headers.set('Cache-Control','no-store')
  return response
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']}
