"use client"

import { CartProvider } from "@/lib/cart-context"
import CartDrawer from "@/components/CartDrawer"
import CartToast from "@/components/CartToast"
import ScrollToTop from "@/components/ScrollToTop"

export default function Providers({ children }) {
  return (
    <CartProvider>
      <ScrollToTop />
      {children}
      <CartDrawer />
      <CartToast />
    </CartProvider>
  )
}
