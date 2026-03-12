"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PHONE } from "@/lib/constants"

const WELCOME_MESSAGE = {
  from: "bot",
  text: "Hej! 👋 Välkommen till Batteriproffs. Jag hjälper dig hitta rätt batteri. Vad kan jag hjälpa dig med?",
}

const QUICK_REPLIES = [
  "Jag behöver hjälp att välja batteri",
  "Jag har en fråga om min beställning",
  "Jag vill ha en offert",
]

export default function ChatBubble() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState("")
  const [sent, setSent] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = (text) => {
    const msg = text || input.trim()
    if (!msg) return

    setMessages((prev) => [...prev, { from: "user", text: msg }])
    setInput("")

    // Simulate bot reply
    setTimeout(() => {
      if (!sent) {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: `Tack! Vi har tagit emot ditt meddelande. En av våra batteritekniker återkommer till dig så snart som möjligt. Du kan också ringa oss direkt på ${PHONE}.`,
          },
        ])
        setSent(true)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: "bot",
            text: `Vi har noterat det! Vi återkommer inom kort. Ring ${PHONE} om det är brådskande.`,
          },
        ])
      }
    }, 800)
  }

  const handleQuickReply = (text) => {
    handleSend(text)
  }

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-4 z-[150] flex h-[480px] w-[360px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl sm:right-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-navy px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-bg text-sm font-bold text-navy">
                  ⚡
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Batteriproffs</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-green" />
                    Svarar inom minuter
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ChevronDown size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col gap-3">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                        msg.from === "user"
                          ? "rounded-br-md bg-navy text-white"
                          : "rounded-bl-md bg-surface text-text-dark"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Quick replies — only show before first user message */}
                {messages.length === 1 && (
                  <div className="mt-1 flex flex-col gap-2">
                    {QUICK_REPLIES.map((text) => (
                      <button
                        key={text}
                        onClick={() => handleQuickReply(text)}
                        className="self-start rounded-xl border border-border bg-white px-4 py-2 text-left text-[13px] font-medium text-navy transition-all hover:-translate-y-px hover:border-amber-bg hover:shadow-sm"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>

            {/* Input */}
            <div className="border-t border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Skriv ett meddelande..."
                  className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-dark placeholder:text-text-light focus:border-navy focus:shadow-[0_0_0_3px_rgba(11,29,58,0.06)]"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white transition-all hover:bg-navy-light disabled:opacity-30"
                >
                  <Send size={16} strokeWidth={2.5} />
                </button>
              </div>
              <div className="mt-2 text-center text-[11px] text-text-light">
                Vi svarar vanligtvis inom 30 minuter
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-4 z-[150] flex h-14 w-14 items-center justify-center rounded-full bg-navy shadow-lg shadow-navy/25 transition-all hover:-translate-y-1 hover:shadow-xl sm:right-6"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} className="text-white" strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} className="text-white" strokeWidth={2.5} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification dot */}
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-bg text-[9px] font-bold text-navy">
            1
          </span>
        )}
      </button>
    </>
  )
}
