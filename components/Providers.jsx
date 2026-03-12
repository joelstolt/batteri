"use client"

import { CartProvider } from "@/lib/cart-context"
import { VatProvider } from "@/lib/vat-context"
import CartDrawer from "@/components/CartDrawer"
import CartToast from "@/components/CartToast"
import ChatBubble from "@/components/ChatBubble"
import ScrollToTop from "@/components/ScrollToTop"

export default function Providers({ children }) {
  return (
    <VatProvider>
      <CartProvider>
        <ScrollToTop />
        {children}
        <CartDrawer />
        <CartToast />
        <ChatBubble />
      </CartProvider>
    </VatProvider>
  )
}
