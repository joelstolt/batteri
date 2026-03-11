import TopBar from "@/components/TopBar"
import Header from "@/components/Header"
import Hero from "@/components/Hero"
import Categories from "@/components/Categories"
import FeaturedProducts from "@/components/FeaturedProducts"
import WhyUs from "@/components/WhyUs"
import CtaBanner from "@/components/CtaBanner"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <TopBar />
      <Header />
      <Hero />
      <Categories />
      <FeaturedProducts />
      <WhyUs />
      <CtaBanner />
      <Footer />
    </>
  )
}
