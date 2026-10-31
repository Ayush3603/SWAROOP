// Simulates bank-account auto-detection from a phone number.
// A real UPI/payment backend would fetch these from the banking network.
// Demo: derive two bank accounts deterministically from the phone number.
import type { BankAccount } from '../shared/types'
import { generateId } from '../shared/payment'

const BANKS = ['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'PNB', 'Yes Bank', 'Canara Bank']

const seed  = (phone: string) => { const n = parseInt(phone.replace(/\D/g, '').slice(-6) || '1', 10); return n > 0 ? n : 424242 }
const last4 = (n: number) => String(1000 + (Math.abs(n) % 9000))

export function generateLinkedBanks(phone: string, profileId: string, holderName: string): BankAccount[] {
  const s = seed(phone), now = Date.now()
  return [
    { id: generateId('bank'), profileId, bankName: BANKS[s % BANKS.length],            holderName, last4: last4(s),          accountType: 'checking', createdAt: now },
    { id: generateId('bank'), profileId, bankName: BANKS[(s * 7 + 3) % BANKS.length],  holderName, last4: last4(s * 7 + 11), accountType: 'savings',  createdAt: now },
  ]
}
