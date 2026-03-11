import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Köpvillkor & Leveransvillkor — Batteriproffs",
}

export default function VillkorPage() {
  return (
    <>
      <TopBar />
      <Header />
      <div className="bg-white">
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[800px] px-4 pb-8 pt-10 sm:px-6">
            <h1 className="font-heading text-3xl font-extrabold text-text-dark">Köpvillkor & Leveransvillkor</h1>
          </div>
        </div>
        <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-8 text-base leading-relaxed text-text-mid">
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Beställning & Betalning</h2>
              <p>Alla priser på batteriproffs.se anges i svenska kronor (SEK) exklusive moms om inget annat anges. Moms (25%) tillkommer. Betalning sker via kort (Visa/Mastercard) eller Swish vid checkout. Din beställning är bindande när du genomfört betalningen och du får en orderbekräftelse via e-post.</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Leverans</h2>
              <p>Vi skickar alla ordrar via PostNord. Beräknad leveranstid är 1–3 arbetsdagar. Order lagda före kl 14:00 på vardagar skickas normalt samma dag. Fri frakt vid order över 2 000 kr exkl. moms. Under 2 000 kr tillkommer en fraktkostnad på 149 kr. Spårningsnummer skickas via e-post när din order har skickats.</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Ångerrätt & Öppet köp</h2>
              <p>Du har 30 dagars öppet köp från mottagandet av varan enligt Distansavtalslagen. Produkten ska vara i oskadat och oanvänt skick i originalförpackning. Kontakta oss på info@batteriproffs.se för att påbörja en retur. Vi återbetalar köpesumman inom 14 dagar efter mottagen retur.</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Reklamation & Garanti</h2>
              <p>Konsumentköplagen gäller. Garanti enligt respektive tillverkare. Om du vill reklamera en vara, kontakta oss med ditt ordernummer och en beskrivning av felet. Vi hanterar reklamationer skyndsamt.</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Kontakt</h2>
              <p>Batteriproffs.se · E-post: info@batteriproffs.se · Telefon: 070-123 45 67</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
