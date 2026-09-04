import { createHash } from "node:crypto"
import { assertMetadataFits } from "./order-items"

// Resend retains idempotency keys for 24 hours. Leave one hour of margin.
const RETRY_WINDOW = 23 * 60 * 60 * 1000
export async function sendOrderMail({
  stripe,
  resend,
  paymentId,
  role,
  message,
  now = Date.now(),
}) {
  if (!["customer", "accounting", "admin"].includes(role))
    throw new Error("Unknown mail role")
  const field = `order_mail_${role}`
  const pi = await stripe.paymentIntents.retrieve(paymentId)
  let state
  try {
    state = JSON.parse(pi.metadata[field] || "null")
  } catch {
    throw new Error("Invalid mail receipt; reconcile manually")
  }
  if (state?.sent) return state.sent
  const hash = createHash("sha256")
    .update(JSON.stringify(message))
    .digest("hex")
  if (
    state &&
    (state.hash !== hash ||
      !Number.isFinite(state.started) ||
      now - state.started >= RETRY_WINDOW)
  ) {
    throw new Error(`Reconcile ${paymentId}/${role} in Resend before retrying`)
  }
  if (!state) {
    state = { started: now, hash }
    assertMetadataFits({ ...pi.metadata, [field]: JSON.stringify(state) })
    // Persist intent before any send. Failed writes cannot cause a send.
    await stripe.paymentIntents.update(paymentId, {
      metadata: { [field]: JSON.stringify(state) },
    })
  }
  const result = await resend.emails.send(message, {
    idempotencyKey: `order-confirmation-v2/${paymentId}/${role}`,
  })
  if (result.error || !result.data?.id)
    throw new Error(
      `Order email ${role} failed: ${result.error?.name || "missing receipt"}`
    )
  await stripe.paymentIntents.update(paymentId, {
    metadata: { [field]: JSON.stringify({ ...state, sent: result.data.id }) },
  })
  return result.data.id
}
