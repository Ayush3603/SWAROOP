// Phone validation helper.
export function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length >= 7
}
