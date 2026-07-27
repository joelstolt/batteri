import { organizationJsonLd, websiteJsonLd, jsonLdProps } from "@/lib/schema"
import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import FinderSection from "@/components/FinderSection"
import Categories from "@/components/Categories"
import AllProducts from "@/components/AllProducts"
import WhyUs from "@/components/WhyUs"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

// Canonical sätts per sida, aldrig i app/layout.js — där ärvs den till varenda
// undersida och pekar då hela sajten mot startsidan.
export const metadata = {
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
      <main id="innehall">        <Hero />
        <FinderSection />
        <Categories />
        <AllProducts />
        <WhyUs />
        <CtaBanner />
      </main>
      <Footer />
    </>
  )
}
