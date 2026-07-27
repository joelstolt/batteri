"use client"

import { createContext, useContext, useState, useCallback, useEffect } from "react"

const CartContext = createContext()

function loadCart() {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem("batteriproffs-cart")
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem("batteriproffs-cart", JSON.stringify(items))
  } catch {}
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    setItems(loadCart())
    setLoaded(true)
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (loaded) saveCart(items)
  }, [items, loaded])

  const addItem = useCallback((product, qty = 1) => {
    // Tratten mäts i Umami. Utan de här stegen syns inte var kunder hoppar av —
    // Link-buggen som låste kassan hade synts direkt som "påbörjad kassa" utan
    // motsvarande köp.
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("lagg-i-varukorg", { produkt: product.slug, antal: qty })
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug)
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { ...product, qty }]
    })
    setToast({ ...product, qty })
  }, [])

  const removeItem = useCallback((slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug))
  }, [])

  const updateQty = useCallback((slug, qty) => {
    if (qty < 1) return removeItem(slug)
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, qty } : i))
    )
  }, [removeItem])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        toast,
        setToast,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
