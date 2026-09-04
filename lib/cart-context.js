"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react"

import { getProductBySlug } from "./products"
import { validStoredCart, removePurchased } from "./cart-integrity"
const CartContext = createContext()

function loadCart() {
  if (typeof window === "undefined") return []
  try {
    const saved = localStorage.getItem("batteriproffs-cart")
    return validStoredCart(saved ? JSON.parse(saved) : []).map((row) => {
      const product = getProductBySlug(row.slug)
      return product
        ? {
            ...product,
            qty: row.qty,
            lineId: row.lineId || crypto.randomUUID(),
            previousPrice:
              row.price !== undefined && row.price !== product.price
                ? row.price
                : row.previousPrice,
          }
        : {
            ...row,
            name: row.slug,
            shortName: row.slug + " (utgången)",
            images: ["/produkt-saknas.svg"],
            lineId: row.lineId || crypto.randomUUID(),
            unavailable: true,
            price: Number(row.price) || 0,
          }
    })
  } catch {
    return []
  }
}

function saveCart(items) {
  try {
    localStorage.setItem(
      "batteriproffs-cart",
      JSON.stringify(
        items.map(({ slug, qty, lineId, price, previousPrice }) => ({
          slug,
          qty,
          lineId,
          price,
          previousPrice,
        }))
      )
    )
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
    const sync = (event) => {
      if (event.key === "batteriproffs-cart") setItems(loadCart())
    }
    window.addEventListener("storage", sync)
    return () => window.removeEventListener("storage", sync)
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    if (loaded) saveCart(items)
  }, [items, loaded])

  const addItem = useCallback((product, qty = 1) => {
    if (!Number.isInteger(qty) || qty < 1 || qty > 99) return
    // Tratten mäts i Umami. Utan de här stegen syns inte var kunder hoppar av —
    // Link-buggen som låste kassan hade synts direkt som "påbörjad kassa" utan
    // motsvarande köp.
    if (typeof window !== "undefined" && window.umami) {
      window.umami.track("lagg-i-varukorg", {
        produkt: product.slug,
        antal: qty,
      })
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug)
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: Math.min(99, i.qty + qty) } : i
        )
      }
      return [...prev, { ...product, qty, lineId: crypto.randomUUID() }]
    })
    setToast({ ...product, qty })
  }, [])

  const removeItem = useCallback((slug) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug))
  }, [])

  const updateQty = useCallback(
    (slug, qty) => {
      if (!Number.isInteger(qty) || qty > 99) return
      if (qty < 1) return removeItem(slug)
      setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty } : i)))
    },
    [removeItem]
  )

  const clearCart = useCallback(() => setItems([]), [])

  const completeOrder = useCallback(
    (order) => {
      if (!loaded) return
      const key = `bp_pending_${order.id}`
      try {
        const raw = sessionStorage.getItem(key)
        if (!raw) return
        const pending = validStoredCart(JSON.parse(raw))
        sessionStorage.removeItem(key)
        setItems(removePurchased(loadCart(), pending, order))
      } catch {
        /* Keep the cart if it cannot be associated with this checkout. */
      }
    },
    [loaded]
  )

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
        completeOrder,
        loaded,
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
