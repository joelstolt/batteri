import { USPS } from "@/lib/constants"

export default function TopBar() {
  return (
    <div className="bg-gradient-to-r from-amber-bg to-amber-light py-2.5 text-sm font-semibold text-text-dark">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6">
        {/* USPs */}
        <div className="flex flex-wrap items-center gap-6">
          {USPS.map((text, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="7.5" fill="#1A1A1A" opacity="0.12" />
                <path
                  d="M4.5 7.5l2 2 4-4"
                  stroke="#1A1A1A"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {text}
            </span>
          ))}
        </div>

        {/* Right links */}
        <div className="flex items-center gap-5 text-[13px]">
          <a
            href="#"
            className="flex items-center gap-1.5 font-semibold transition-opacity hover:opacity-70"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 4l5 3.5L12 4" />
              <rect x="1" y="2.5" width="12" height="9" rx="2" />
            </svg>
            Kundservice
          </a>
          <span className="h-3.5 w-px bg-black/15" />
          <a
            href="#"
            className="flex items-center gap-1.5 font-semibold transition-opacity hover:opacity-70"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="#1A1A1A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 1v4l2.5 1.5" />
              <circle cx="7" cy="7" r="6" />
            </svg>
            Företag (exkl. moms)
          </a>
        </div>
      </div>
    </div>
  )
}
