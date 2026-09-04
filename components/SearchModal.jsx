"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  X,
  Search,
  ArrowRight,
  Wrench,
  RefreshCw,
  LayoutGrid,
  MessageCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { CATEGORIES } from "@/lib/constants"
import { oppnaChatt } from "@/components/ChattKnapp"
import { sok, sokbar } from "@/lib/search-index"
import { useVat } from "@/lib/vat-context"
import { track } from "@/lib/track"

function formatPrice(n) {
  return new Intl.NumberFormat("sv-SE").format(n)
}

/**
 * Sökrutan bakom förstoringsglaset i headern.
 *
 * Söker i SAMMA register som herons sökfält (lib/search-index). Modalen hade
 * tidigare en egen enklare matchning som varken kände till ersättningssidorna
 * eller normaliserade bort bindestreck — mätningen visade att 15 av 22
 * sökningar gav noll träffar, däribland "trojan", "truckbatteri" och
 * "laddare" som alla har egna sidor. En sökmotor, ett beteende.
 */
export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("")
  const inputRef = useRef(null)
  const dialogRef = useRef(null)
  const router = useRouter()
  const { displayPrice, vatLabel } = useVat()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      setQuery("")
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const previous = document.activeElement
    const handler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
      if (e.key !== "Tab") return
      const dialog = dialogRef.current
      const controls = [
        ...(dialog?.querySelectorAll(
          "button:not([disabled]), a[href], input:not([disabled])",
        ) || []),
      ].filter((el) => el.getClientRects().length)
      const first = controls[0],
        last = controls.at(-1)
      if (
        e.shiftKey &&
        (document.activeElement === first ||
          !dialog?.contains(document.activeElement))
      ) {
        e.preventDefault()
        last?.focus()
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          !dialog?.contains(document.activeElement))
      ) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener("keydown", handler)
    return () => {
      document.removeEventListener("keydown", handler)
      if (previous?.isConnected) previous.focus()
    }
  }, [isOpen, onClose])

  const q = query.toLowerCase().trim()
  const kanSoka = sokbar(query)
  const traffar = kanSoka ? sok(query, 12) : []

  const maskiner = traffar.filter((t) => t.typ === "maskin").slice(0, 5)
  const ersattningar = traffar.filter((t) => t.typ === "ersattning").slice(0, 4)
  const sidor = traffar.filter((t) => t.typ === "sida").slice(0, 3)
  const produkter = traffar.filter((t) => t.typ === "produkt").slice(0, 6)

  // Logga vad besökarna faktiskt söker efter. Det är den billigaste källan vi
  // har till vilka maskinmodeller och artikelnummer som ska bli egna sidor
  // härnäst — annars gissar vi. Skickas först när kunden slutat skriva, och
  // bara termen, aldrig något som identifierar besökaren.
  useEffect(() => {
    if (q.length < 3) return
    const t = setTimeout(() => {
      track("sok", { term: q, traffar: traffar.length })
      /*
       * Noll träffar får ett EGET event, inte bara traffar: 0 på "sok".
       * Umami listar event per namn, så en nolla begravd i en egenskap syns
       * inte förrän någon aktivt filtrerar. Som eget namn står den i listan
       * och blir en sortimentsignal: det här ville kunden köpa och vi hade
       * det inte.
       */
      if (traffar.length === 0) track("sok-utan-traff", { term: q })
    }, 1200)
    return () => clearTimeout(t)
  }, [q, traffar.length])

  const hasResults = traffar.length > 0

  const goTo = (href) => {
    onClose()
    router.push(href)
  }

  const RadUtanBild = ({ post, Ikon }) => (
    <button
      onClick={() => goTo(post.href)}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-surface"
    >
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface">
        <Ikon size={16} className="text-navy" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-text-dark">
          {post.titel}
        </div>
        <div className="truncate text-xs text-text-light">
          {post.undertitel}
        </div>
      </div>
      {post.pris ? (
        <div className="flex-shrink-0 text-right">
          <div className="font-heading text-sm font-bold text-text-dark">
            {formatPrice(displayPrice(post.pris))} kr
          </div>
          <div className="text-[10px] text-text-light">
            {vatLabel.toLowerCase()}
          </div>
        </div>
      ) : (
        <ArrowRight size={14} className="flex-shrink-0 text-text-light" />
      )}
    </button>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] bg-black/50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Sök i sortimentet"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-[10%] z-[201] w-full max-w-[640px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-white shadow-2xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search size={20} className="flex-shrink-0 text-text-light" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Sök batteri, modellnr eller användningsområde..."
                className="flex-1 bg-transparent text-base text-text-dark outline-none placeholder:text-text-light"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-text-light hover:bg-surface hover:text-text-dark"
                >
                  <X size={16} />
                </button>
              )}
              <button
                onClick={onClose}
                className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-text-light hover:bg-surface"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {!kanSoka ? (
                /* Empty state — popular categories */
                <div className="px-5 py-6">
                  <div className="mb-3 text-xs font-bold uppercase tracking-wider text-text-light">
                    Populära kategorier
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => goTo(`/kategori/${cat.slug}`)}
                        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-text-dark transition-colors hover:border-amber-bg/40 hover:bg-amber-bg/5"
                      >
                        <span>{cat.icon}</span>
                        {cat.title}
                      </button>
                    ))}
                  </div>

                  <div className="mb-3 mt-6 text-xs font-bold uppercase tracking-wider text-text-light">
                    Populära sökningar
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "12V",
                      "6V",
                      "GF 12 105",
                      "Städmaskin",
                      "Golfbil",
                      "Sonnenschein",
                    ].map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm text-text-mid transition-colors hover:border-border-dark hover:text-text-dark"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : !hasResults ? (
                /*
                 * Noll träffar är ett säljläge, inte en återvändsgränd. Den som
                 * skriver ett modellnummer vi inte känner igen har redan
                 * bestämt sig — ge en människa att prata med i stället för
                 * "prova ett annat sökord".
                 */
                <div className="px-5 py-10 text-center">
                  <p className="mb-1 font-heading text-base font-bold text-text-dark">
                    Ingen träff på "{query}"
                  </p>
                  <p className="mx-auto mb-4 max-w-[420px] text-sm leading-relaxed text-text-mid">
                    Vi har fler batterier än vad som listas på sajten. Skicka
                    modellbeteckningen så tar vi fram rätt batteri och pris.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        if (!oppnaChatt()) router.push("/kontakt")
                      }}
                      className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2.5 font-heading text-sm font-bold text-white"
                    >
                      <MessageCircle size={14} aria-hidden="true" />
                      Chatta med oss
                    </button>
                    <button
                      onClick={() => goTo("/kontakt")}
                      className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-text-dark hover:bg-surface"
                    >
                      Skicka modellnumret
                    </button>
                  </div>
                </div>
              ) : (
                /* Results */
                <div>
                  {maskiner.length > 0 && (
                    <div className="border-b border-border px-5 py-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-light">
                        Din maskin
                      </div>
                      {maskiner.map((m) => (
                        <RadUtanBild key={m.href} post={m} Ikon={Wrench} />
                      ))}
                    </div>
                  )}

                  {ersattningar.length > 0 && (
                    <div className="border-b border-border px-5 py-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-light">
                        Ersätter
                      </div>
                      {ersattningar.map((r) => (
                        <RadUtanBild key={r.href} post={r} Ikon={RefreshCw} />
                      ))}
                    </div>
                  )}

                  {sidor.length > 0 && (
                    <div className="border-b border-border px-5 py-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-light">
                        Kategorier & guider
                      </div>
                      {sidor.map((s) => (
                        <RadUtanBild key={s.href} post={s} Ikon={LayoutGrid} />
                      ))}
                    </div>
                  )}

                  {/* Product matches */}
                  {produkter.length > 0 && (
                    <div className="px-5 py-4">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-text-light">
                        Produkter
                      </div>
                      {produkter.map((p) => (
                        <button
                          key={p.href}
                          onClick={() => goTo(p.href)}
                          className="flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-colors hover:bg-surface"
                        >
                          <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                            {p.bild && (
                              <Image
                                src={p.bild}
                                alt={p.titel}
                                fill
                                className="object-contain p-1"
                                sizes="56px"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="truncate text-sm font-semibold text-text-dark">
                              {p.titel}
                            </div>
                            <div className="text-xs text-text-light">
                              {p.undertitel}
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="font-heading text-sm font-bold text-text-dark">
                              {formatPrice(displayPrice(p.pris))} kr
                            </div>
                            <div className="text-[10px] text-text-light">
                              {vatLabel.toLowerCase()}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
