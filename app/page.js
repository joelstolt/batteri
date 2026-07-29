import { organizationJsonLd, websiteJsonLd, jsonLdProps } from "@/lib/schema"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import FinderSection from "@/components/FinderSection"
import Categories from "@/components/Categories"
import References from "@/components/References"
import HelpAndQuote from "@/components/HelpAndQuote"
// AllProducts låg tidigare här och dumpade hela katalogen, 20 produkter och 48
// länkar, på startsidan. Det är kategorisidans jobb — /kategori/alla listar
// exakt samma sortiment. FeaturedProducts visar 8 i stället.
import FeaturedProducts from "@/components/FeaturedProducts"
import Prisforklaring from "@/components/Prisforklaring"
import WhyUs from "@/components/WhyUs"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

// Canonical sätts per sida, aldrig i app/layout.js — där ärvs den till varenda
// undersida och pekar då hela sajten mot startsidan.
export const metadata = {
  // Ledde tidigare med "fritidsbatteri", alltså konsumentordet som valdes bort.
  // Nu B2B-orden först.
  title: "Truckbatteri, traktionsbatteri & batteri till städmaskin | Batteriproffs",
  description:
    "Traktionsbatterier och gelbatterier till truck, lift, pallyftare och städmaskin. Priser öppet på sajten, normalt 1–3 dagars leverans och offert på volym. Vi svarar själva i telefon.",
  alternates: { canonical: "https://www.batteriproffs.se" },
}

export default function Home() {
  return (
    <>
      {/* Organization knyter företaget till en entitet hos Google. Renderas
          inline i server-HTML — via next/script hade den varit osynlig. */}
      <script {...jsonLdProps(organizationJsonLd())} />
      <script {...jsonLdProps(websiteJsonLd())} />
      <TopBar />
      <Header />
      {/*
        Ordningen följer hur en företagsköpare faktiskt tänker:
        vad säljer ni → vad kostar det → hittar jag mitt → varför just er →
        hur beställer jag → vem mer har köpt.
      */}
      <main id="innehall">
        <Hero />
        {/*
          Produkter med pris direkt efter heron. Hela positioneringen är att
          priserna står öppet medan konkurrenterna gömmer dem bakom
          offertformulär — då kan de inte ligga under tre andra sektioner.
          Av de sex konkurrenter som rankar på "truckbatteri" visar två priser
          på startsidan, och det är just de två som är riktiga e-handlare.
        */}
        <FeaturedProducts />
        {/*
          Prisförklaringen direkt efter produkterna, medan siffrorna hänger kvar.
          Halva marknadspriset från en okänd aktör väcker misstanke innan det
          väcker köplust, och den frågan besvaras inte av något annat på sidan.
        */}
        <Prisforklaring />
        {/* Finnaren efter produkterna: för den som inte såg sitt batteri */}
        <FinderSection />
        <Categories />
        <WhyUs />
        <HelpAndQuote />
        <References />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
