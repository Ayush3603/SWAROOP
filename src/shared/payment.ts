// Money formatting, amount parsing, ID generation, date formatting.

const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateFmt     = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })

export const formatCurrency = (cents: number) => currencyFmt.format(cents / 100)
export const formatDate     = (ts: number)     => dateFmt.format(new Date(ts))

export function parseAmountToCents(input: string): number | null {
  const v = Number(input.trim().replace(/[$,]/g, ''))
  if (!Number.isFinite(v) || v <= 0) return null
  return Math.round(v * 100)
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}
