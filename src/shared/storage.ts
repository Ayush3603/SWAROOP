// localStorage persistence — v3 keys use phone-based auth schema.
import type { BankAccount, Profile, Transaction } from './types'

const K = {
  profiles:     'swaruoop.profiles.v3',
  banks:        'swaruoop.banks.v3',
  transactions: 'swaruoop.transactions.v3',
  session:      'swaruoop.session.v3',
}

function read<T>(key: string, fb: T): T {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) as T : fb }
  catch { return fb }
}

export const loadProfiles     = () => read<Profile[]>(K.profiles, [])
export const saveProfiles     = (v: Profile[])     => localStorage.setItem(K.profiles,     JSON.stringify(v))
export const loadBanks        = () => read<BankAccount[]>(K.banks, [])
export const saveBanks        = (v: BankAccount[]) => localStorage.setItem(K.banks,        JSON.stringify(v))
export const loadTransactions = () => read<Transaction[]>(K.transactions, [])
export const saveTransactions = (v: Transaction[]) => localStorage.setItem(K.transactions, JSON.stringify(v))
export const loadSession      = () => read<string | null>(K.session, null)
export const saveSession      = (v: string | null) => localStorage.setItem(K.session,      JSON.stringify(v))
