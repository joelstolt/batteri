import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
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
      <TopBar />
      <Header />
      <Hero />
      <Categories />
      <AllProducts />
      <WhyUs />
      <CtaBanner />
      <Footer />
    </>
  )
}
