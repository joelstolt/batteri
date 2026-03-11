"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { PHONE, PHONE_LINK } from "@/lib/constants"

const AREAS = [
  { id: "traktion", slug: "traktion-industri", label: "Traktion & Industri", icon: "🏗️", sub: "Truckar · Golfbilar · Bygg" },
  { id: "stad", slug: "stadmaskiner", label: "Städmaskiner", icon: "🧹", sub: "Skurmaskiner · Poleringsmaskiner" },
  { id: "stationart", slug: "stationara", label: "Stationära", icon: "🔋", sub: "Permobiler · Hissar · Larm" },
  { id: "fritid", slug: "fritid-solenergi", label: "Fritid & Solenergi", icon: "☀️", sub: "Husbil · Båt · Solceller" },
]

const VOLTAGES = [
  { id: "6v", label: "6V", sub: "Djupcykel" },
  { id: "12v", label: "12V", sub: "Vanligast" },
  { id: "24v", label: "24V", sub: "Industriellt" },
  { id: "vet-ej", label: "Vet ej", sub: "Vi hjälper dig" },
]

const RESULT_COUNTS = { stad: 6, traktion: 6, stationart: 6, fritid: 6 }

export default function BatteryFinder() {
  const [step, setStep] = useState(0)
  const [area, setArea] = useState(null)
  const [voltage, setVoltage] = useState(null)
  const router = useRouter()

  const handleArea = (a) => { setArea(a); setTimeout(() => setStep(1), 150) }
  const handleVoltage = (v) => { setVoltage(v); setTimeout(() => setStep(2), 150) }
  const handleReset = () => { setStep(0); setArea(null); setVoltage(null) }

  const selectedArea = AREAS.find((a) => a.id === area)
  const resultCount = RESULT_COUNTS[area] || 2

  const handleShowProducts = () => {
    if (selectedArea) {
      router.push(`/kategori/${selectedArea.slug}`)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-[380px] overflow-hidden rounded-2xl border border-border bg-white shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-navy px-6 pb-4 pt-5">
        <div>
          <h3 className="font-heading text-[17px] font-bold text-white">Hitta rätt batteri</h3>
          <p className="mt-0.5 text-[13px] text-white/50">
            {step === 0 && "Steg 1 av 2 — Välj användningsområde"}
            {step === 1 && "Steg 2 av 2 — Välj spänning"}
            {step === 2 && "Klart! Vi har förslag åt dig"}
          </p>
        </div>
        {step > 0 && step < 2 && (
          <button onClick={handleReset} className="text-xs font-semibold text-amber-bg hover:opacity-70">
            Börja om
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-[3px] bg-surface">
        <motion.div
          className="h-[3px] rounded-sm bg-gradient-to-r from-amber-bg to-amber"
          animate={{ width: step === 0 ? "0%" : step === 1 ? "50%" : "100%" }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Content */}
      <div className="px-6 pb-6 pt-5">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="flex flex-col gap-2">
              {AREAS.map((a, i) => (
                <motion.button key={a.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => handleArea(a.id)}
                  className="flex items-center gap-3.5 rounded-xl border border-border bg-surface/50 p-3.5 text-left transition-colors hover:border-amber-bg/40 hover:bg-surface"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-white text-xl shadow-sm">{a.icon}</div>
                  <div className="flex-1">
                    <div className="font-heading text-sm font-bold text-text-dark">{a.label}</div>
                    <div className="mt-0.5 text-xs text-text-light">{a.sub}</div>
                  </div>
                  <svg width="16" height="16" fill="none" stroke="#D4D4D4" strokeWidth="2" strokeLinecap="round"><path d="M6 3l5 5-5 5"/></svg>
                </motion.button>
              ))}
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3.5 py-2.5">
                <span className="text-base">{selectedArea?.icon}</span>
                <span className="text-[13px] font-semibold text-text-dark">{selectedArea?.label}</span>
                <button onClick={handleReset} className="ml-auto text-xs text-text-light hover:text-text-dark">Ändra</button>
              </div>
              <p className="mb-3 text-[13px] font-medium text-text-mid">Vilken spänning behöver du?</p>
              <div className="grid grid-cols-2 gap-2">
                {VOLTAGES.map((v, i) => (
                  <motion.button key={v.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    onClick={() => handleVoltage(v.id)}
                    className="rounded-xl border border-border bg-surface/50 px-4 py-4 text-center transition-colors hover:border-amber-bg/40 hover:bg-surface"
                  >
                    <div className={`font-heading font-extrabold text-text-dark ${v.id === "vet-ej" ? "text-sm" : "text-xl"}`}>{v.label}</div>
                    <div className="mt-1 text-[11px] text-text-light">{v.sub}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-md bg-surface px-3 py-1 text-xs font-semibold text-text-dark">
                  {selectedArea?.icon} {selectedArea?.label}
                </span>
                <span className="rounded-md bg-surface px-3 py-1 text-xs font-semibold text-text-dark">
                  {VOLTAGES.find((v) => v.id === voltage)?.label}
                </span>
              </div>
              <div className="mb-3.5 rounded-xl border border-amber-bg/20 bg-amber-bg/5 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <svg width="18" height="18" fill="none" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 1l2 4.1 4.6.7-3.3 3.2.8 4.5L9 11.3l-4.1 2.2.8-4.5L2.4 5.8 7 5.1 9 1z"/>
                  </svg>
                  <span className="font-heading text-[15px] font-bold text-text-dark">
                    {voltage === "vet-ej" ? "Vi rekommenderar:" : `${resultCount} träffar`}
                  </span>
                </div>
                <p className="text-[13px] leading-relaxed text-text-mid">
                  {voltage === "vet-ej"
                    ? "Ring oss så hjälper vi dig avgöra vilken spänning och kapacitet som passar bäst."
                    : `Vi har ${resultCount} batterier som matchar ditt val.`}
                </p>
              </div>
              <div className="flex gap-2.5">
                {voltage === "vet-ej" ? (
                  <a href={`tel:${PHONE_LINK}`} className="flex flex-1 items-center justify-center rounded-[10px] bg-amber-bg px-5 py-3.5 text-sm font-bold text-navy transition-transform hover:-translate-y-px">
                    Ring {PHONE}
                  </a>
                ) : (
                  <button onClick={handleShowProducts} className="flex-1 rounded-[10px] bg-amber-bg px-5 py-3.5 text-sm font-bold text-navy transition-transform hover:-translate-y-px">
                    Visa produkter
                  </button>
                )}
                <button onClick={handleReset} className="rounded-[10px] border border-border bg-surface px-4 py-3.5 text-sm font-semibold text-text-dark hover:bg-border/50">
                  Sök igen
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
