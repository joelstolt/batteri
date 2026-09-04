export function isConfirmedPayment(status) {
  return status === "requires_capture" || status === "succeeded"
}
