"use client"

import { CartProvider } from "@/lib/cart-context"
import CartDrawer from "@/components/CartDrawer"

export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
