import { PHONE, PHONE_LINK, EMAIL } from "@/lib/constants"

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy to-navy-mid py-14">
      {/* Diagonal stripe texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,1) 20px, rgba(255,255,255,1) 21px)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-6">
        <div>
          <h3 className="mb-1.5 font-heading text-[26px] font-extrabold text-white">
            Osäker på vilket batteri du behöver?
          </h3>
          <p className="text-base text-white/75">
            Ring oss så hjälper vi dig välja rätt — kostnadsfritt, utan krångel.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={`tel:${PHONE_LINK}`}
            className="flex items-center gap-2 rounded-[10px] bg-amber-bg px-7 py-3.5 font-heading text-[15px] font-bold text-navy transition-transform hover:-translate-y-px"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="#0B1D3A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 3.5A1.5 1.5 0 013.5 2h2.29a1 1 0 01.95.68l.7 2.12a1 1 0 01-.26 1.05l-1 .87a10 10 0 004.6 4.6l.87-1a1 1 0 011.05-.26l2.12.7a1 1 0 01.68.95v2.29a1.5 1.5 0 01-1.5 1.5A13 13 0 012 3.5z" />
            </svg>
            {PHONE}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="rounded-[10px] border border-white/20 px-7 py-3.5 text-[15px] font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/4"
          >
            Mejla oss
          </a>
        </div>
      </div>
    </section>
  )
}
