import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Integritetspolicy — Batteriproffs",
}

export default function IntegritetPage() {
  return (
    <>
      <TopBar />
      <Header />
      <div className="bg-white">
        <div className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[800px] px-4 pb-8 pt-10 sm:px-6">
            <h1 className="font-heading text-3xl font-extrabold text-text-dark">Integritetspolicy</h1>
          </div>
        </div>
        <div className="mx-auto max-w-[800px] px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-8 text-base leading-relaxed text-text-mid">
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Vilka uppgifter vi samlar in</h2>
              <p>Vi samlar in personuppgifter som du lämnar vid beställning: namn, e-post, telefonnummer, leveransadress och betalningsuppgifter. Vi samlar även in teknisk data via cookies för att förbättra din upplevelse på sajten.</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Hur vi använder uppgifterna</h2>
              <p>Dina uppgifter används för att hantera din beställning, skicka orderbekräftelse och leveransinformation, samt kontakta dig vid frågor om din order. Vi delar aldrig dina uppgifter med tredje part i marknadsföringssyfte.</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Cookies</h2>
              <p>Vi använder cookies för att webbplatsen ska fungera korrekt, för att spara din varukorg och för att analysera trafik. Du kan hantera cookies i din webbläsares inställningar.</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Dina rättigheter</h2>
              <p>Enligt GDPR har du rätt att begära tillgång till, rättelse av eller radering av dina personuppgifter. Kontakta oss på info@batteriproffs.se för att utöva dina rättigheter.</p>
            </div>
            <div>
              <h2 className="mb-3 font-heading text-xl font-bold text-text-dark">Kontakt</h2>
              <p>Personuppgiftsansvarig: Batteriproffs.se · E-post: info@batteriproffs.se · Telefon: 070-123 45 67</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
