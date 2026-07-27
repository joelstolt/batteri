/**
 * Delade regler för B2B-kassan.
 *
 * Både klienten (direkt feedback i formuläret) och servern (som aldrig litar på
 * klienten) importerar härifrån, så att ett fält inte kan valideras hårt i
 * webbläsaren men slinka igenom på servern.
 */

export const UNLOADING_OPTIONS = [
  {
    value: "lastkaj",
    label: "Lastkaj",
    hint: "Chauffören kan backa in mot kaj",
  },
  {
    value: "truck",
    label: "Truck finns på plats",
    hint: "Ni lastar av pallen själva",
  },
  {
    value: "bakgavellyft",
    label: "Ingen lossningsutrustning",
    hint: "Bakgavellyft behövs — vi bokar det åt er",
  },
]

const UNLOADING_VALUES = UNLOADING_OPTIONS.map((o) => o.value)

/** Alla fält formuläret hanterar, med tomt startvärde. */
export const EMPTY_FORM = {
  // Företagsuppgifter
  companyName: "",
  orgNr: "",
  vatNr: "",
  reference: "",
  poNumber: "",
  invoiceEmail: "",
  // Beställare
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  // Leveransadress
  address: "",
  postalCode: "",
  city: "",
  goodsRecipient: "",
  doorCode: "",
  deliveryPhone: "",
  deliveryNote: "",
  unloading: "",
  // Fakturaadress
  invoiceSameAsDelivery: true,
  invoiceAddress: "",
  invoicePostalCode: "",
  invoiceCity: "",
}

/* ───────────── Organisationsnummer ───────────── */

/** Plockar ut de 10 siffrorna ur ett orgnr oavsett hur kunden skrev det. */
export function normalizeOrgNr(value = "") {
  let digits = String(value).replace(/\D/g, "")
  // 12-siffrigt format (161234567890) — sekelprefixet ingår inte i kontrollen
  if (digits.length === 12 && digits.startsWith("16")) digits = digits.slice(2)
  return digits
}

/**
 * Luhn (modulus 10) — samma kontrollsiffra som Bolagsverket använder.
 * Fångar felskrivna och påhittade nummer innan ordern går igenom.
 */
export function isValidOrgNr(value) {
  const digits = normalizeOrgNr(value)
  if (digits.length !== 10) return false

  let sum = 0
  for (let i = 0; i < 10; i++) {
    let n = Number(digits[i])
    if (i % 2 === 0) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
  }
  return sum % 10 === 0
}

/** Visningsformat: 556677-8899 */
export function formatOrgNr(value) {
  const digits = normalizeOrgNr(value)
  if (digits.length !== 10) return String(value || "").trim()
  return `${digits.slice(0, 6)}-${digits.slice(6)}`
}

/** Svenskt momsreg.nr härleds direkt ur orgnr: SE + 10 siffror + 01 */
export function vatNrFromOrgNr(value) {
  const digits = normalizeOrgNr(value)
  if (digits.length !== 10) return ""
  return `SE${digits}01`
}

export function isValidVatNr(value) {
  if (!value) return true // valfritt fält
  return /^[A-Z]{2}[A-Z0-9]{2,13}$/.test(String(value).replace(/\s/g, "").toUpperCase())
}

/* ───────────── Övriga fält ───────────── */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[\d\s\-+()]{7,20}$/
const POSTAL_RE = /^\d{3}\s?\d{2}$/

export function normalizePostalCode(value = "") {
  return String(value).replace(/\s/g, "")
}

/**
 * Validerar hela kassaformuläret. Returnerar { fält: "felmeddelande" }.
 * Tomt objekt = allt är i sin ordning.
 */
export function validateCheckout(form = {}) {
  const e = {}
  const get = (k) => String(form[k] ?? "").trim()

  // Företagsuppgifter
  if (get("companyName").length < 2) e.companyName = "Ange företagets namn"
  if (!isValidOrgNr(get("orgNr"))) e.orgNr = "Ange ett giltigt organisationsnummer (556677-8899)"
  if (!isValidVatNr(get("vatNr"))) e.vatNr = "Ogiltigt momsregistreringsnummer"
  if (get("reference").length < 2) e.reference = "Ange er referens — namnet trycks på fakturan"
  if (!EMAIL_RE.test(get("invoiceEmail"))) e.invoiceEmail = "Ange en giltig fakturaadress för e-post"
  if (get("poNumber").length > 60) e.poNumber = "Max 60 tecken"

  // Beställare
  if (get("firstName").length < 2) e.firstName = "Ange förnamn"
  if (get("lastName").length < 2) e.lastName = "Ange efternamn"
  if (!EMAIL_RE.test(get("email"))) e.email = "Ange en giltig e-postadress"
  if (!PHONE_RE.test(get("phone"))) e.phone = "Ange ett giltigt telefonnummer"

  // Leveransadress
  if (get("address").length < 2) e.address = "Ange gatuadress"
  if (!POSTAL_RE.test(get("postalCode"))) e.postalCode = "Ange postnummer (XXX XX)"
  if (get("city").length < 2) e.city = "Ange ort"
  if (get("deliveryPhone") && !PHONE_RE.test(get("deliveryPhone")))
    e.deliveryPhone = "Ange ett giltigt telefonnummer"
  if (get("deliveryNote").length > 300) e.deliveryNote = "Max 300 tecken"
  // Lossningsvalet är valfritt — vet kunden inte, ringer vi och stämmer av.
  // Men skickas ett värde in måste det vara ett av de tre giltiga.
  if (get("unloading") && !UNLOADING_VALUES.includes(get("unloading")))
    e.unloading = "Välj ett av alternativen"

  // Fakturaadress (bara om den skiljer sig från leveransadressen)
  if (form.invoiceSameAsDelivery === false) {
    if (get("invoiceAddress").length < 2) e.invoiceAddress = "Ange fakturaadress"
    if (!POSTAL_RE.test(get("invoicePostalCode"))) e.invoicePostalCode = "Ange postnummer (XXX XX)"
    if (get("invoiceCity").length < 2) e.invoiceCity = "Ange ort"
  }

  return e
}

/** Etikett att visa i mejl och på tack-sidan. */
export function unloadingLabel(value) {
  return UNLOADING_OPTIONS.find((o) => o.value === value)?.label || value || ""
}

/**
 * Plattar ut formuläret till det som skickas till Stripe.
 * Stripe tillåter max 500 tecken per metadata-värde — därför kapas fritexterna.
 */
export function buildOrderMetadata(form) {
  const t = (k, max = 200) => String(form[k] ?? "").trim().slice(0, max)
  const same = form.invoiceSameAsDelivery !== false

  return {
    company_name: t("companyName"),
    org_nr: formatOrgNr(form.orgNr),
    vat_nr: t("vatNr", 20),
    reference: t("reference"),
    po_number: t("poNumber", 60),
    invoice_email: t("invoiceEmail"),
    buyer_name: `${t("firstName", 60)} ${t("lastName", 60)}`.trim(),
    buyer_email: t("email"),
    buyer_phone: t("phone", 30),
    goods_recipient: t("goodsRecipient"),
    door_code: t("doorCode", 30),
    delivery_phone: t("deliveryPhone", 30),
    delivery_note: t("deliveryNote", 300),
    unloading: t("unloading", 20),
    invoice_address: same
      ? "samma som leverans"
      : `${t("invoiceAddress")}, ${normalizePostalCode(t("invoicePostalCode", 10))} ${t("invoiceCity", 60)}`.slice(0, 200),
  }
}
