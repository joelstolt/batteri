"use client"

import { CompareProvider } from "@/lib/compare-context"
import { CartProvider } from "@/lib/cart-context"
import { VatProvider } from "@/lib/vat-context"
import { AttributionProvider } from "@/lib/attribution-context"
import { BetygProvider } from "@/lib/betyg-context"
import CartDrawer from "@/components/CartDrawer"
import CartToast from "@/components/CartToast"
import ScrollToTop from "@/components/ScrollToTop"
import KlickSparning from "@/components/KlickSparning"

export default function Providers({ children, betyg, kop }) {
  return (
    <AttributionProvider>
      <BetygProvider betyg={betyg} kop={kop}>
        <VatProvider>
          <CartProvider>
            <CompareProvider>
              <ScrollToTop />
              <KlickSparning />
              {children}
              <CartDrawer />
              <CartToast />
            </CompareProvider>
          </CartProvider>
        </VatProvider>
      </BetygProvider>
    </AttributionProvider>
  )
}
