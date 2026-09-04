import { evidenceFor } from "@/lib/product-evidence"

export default function ProductDocuments({ product }) {
  const evidence = evidenceFor(product)
  if (!evidence) return null
  return (
    <section
      className="my-5 rounded-xl border border-border bg-surface p-4"
      aria-label="Produktunderlag"
    >
      <h2 className="font-heading text-sm font-bold text-navy">
        Datablad, mått och poler
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-mid">
        {evidence.note}
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {evidence.documents.map((doc) => (
          <li key={doc.url}>
            <a
              className="font-semibold underline"
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
