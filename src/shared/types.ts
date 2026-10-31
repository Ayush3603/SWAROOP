// ─── Domain types ─────────────────────────────────────────────────────────────
// All money values are stored as integer cents to avoid floating-point bugs.

export interface Profile {
  id: string
  name: string
  phone: string              // primary identity — like real UPI/payment apps
  wallet: number             // balance in cents
  faceDescriptor: number[] | null  // 128-d face embedding; null = not yet linked
  createdAt: number
}

export type AccountType = 'checking' | 'savings'

export interface BankAccount {
  id: string
  profileId: string
  bankName: string
  holderName: string
  last4: string              // only last 4 digits ever stored
  accountType: AccountType
  createdAt: number
}

export type TxnType = 'payment' | 'topup'

export interface Transaction {
  id: string
  profileId: string
  profileName: string
  amount: number             // cents, always positive
  type: TxnType
  createdAt: number
  balanceAfter: number       // wallet cents after this transaction
  source?: string            // e.g. "HDFC Bank ••1234" for top-ups
}

export type View = 'dashboard' | 'pay' | 'enroll' | 'banking' | 'profile' | 'history'
