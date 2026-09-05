# Endast isolerat betalningstest

Denna gren är en testmiljö, inte en produktionsändring och ska inte slås ihop med main eller granskningsgrenen.

Bas: faf13f1. Betalningstest genomfört 2026-09-05. Rapporten finns på fix/order-integrity-20260904 i docs/payment-e2e-20260905.md.

Skillnader: obligatoriskt BP_PAYMENT_TEST=1, testnyckel och åtkomsttoken; testinloggning med HttpOnly-cookie; endast testets API-rutter öppna; strikt mottagarlista för joel@stoltmarketing.se; TEST-prefix på mejl; annonser/spårning avstängda och testets egna länkar i omdömesmejl. Fem tester av isoleringen finns i tests/payment-test-isolation.test.js.

Den särskilda Vercel-miljön batteriproffs-betalningstest-20260905 är pausad och dess Stripe-testwebhook avstängd efter slutförd verifiering. Betalningsobjekten var livemode=false. Ingen riktig betalning eller leverans beställdes.

Inga nycklar, åtkomstkoder eller inloggningscookies ingår i denna gren. De ska bara finnas i miljövariabler vid uttryckligen beställd testkörning. Git-deploy är avstängd för testgrenen. Vanliga granskningsprojektet och produktion använder egna konfigurationer.
