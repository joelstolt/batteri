"use client"

import { CartProvider } from "@/lib/cart-context"
import { VatProvider } from "@/lib/vat-context"
import { AttributionProvider } from "@/lib/attribution-context"
import { BetygProvider } from "@/lib/betyg-context"
import CartDrawer from "@/components/CartDrawer"
import CartToast from "@/components/CartToast"
import ScrollToTop from "@/components/ScrollToTop"
import KlickSparning from "@/components/KlickSparning"

export default function Providers({ children, betyg }) {
  return (
    <AttributionProvider>
      <BetygProvider betyg={betyg}>
      <VatProvider>
        <CartProvider>
          <ScrollToTop />
          <KlickSparning />
          {children}
          <CartDrawer />
          <CartToast />
        </CartProvider>
      </VatProvider>
      </BetygProvider>
    </AttributionProvider>
  )
}
