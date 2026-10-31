// Global app state — auth, face, banking, payments, navigation.
import {
  createContext, useCallback, useContext, useEffect,
  useMemo, useState, type ReactNode,
} from 'react'
import { loadModels, matchFace } from '../face/faceApi'
import { generateId } from './payment'
import { isValidPhone } from '../auth/authHelpers'
import { generateLinkedBanks } from '../banking/linkedAccounts'
import { loadBanks, loadProfiles, loadSession, loadTransactions, saveBanks, saveProfiles, saveSession, saveTransactions } from './storage'
import type { BankAccount, Profile, Transaction, View } from './types'

export interface AuthResult { ok: boolean; error?: string }
export interface BankResult { ok: boolean; error?: string }
export interface PayResult  { ok: boolean; error?: string; transaction?: Transaction }

interface AddBankInput {
  bankName: string; holderName: string
  accountNumber: string; accountType: BankAccount['accountType']
}

interface Ctx {
  currentProfile: Profile | null
  myBanks: BankAccount[]
  myTransactions: Transaction[]
  hasLinkedFace: boolean
  view: View; setView: (v: View) => void
  modelsReady: boolean; modelError: string | null; retryModels: () => void
  signup:  (name: string, phone: string) => AuthResult
  login:   (phone: string) => AuthResult
  logout:  () => void
  linkFace:    (descriptor: Float32Array) => void
  identifyFace:(descriptor: Float32Array) => { profile: Profile | null; distance: number }
  addBankAccount:    (input: AddBankInput) => BankResult
  removeBankAccount: (id: string) => void
  addFunds:          (bankId: string, amountCents: number) => BankResult
  chargeProfile:     (profileId: string, amountCents: number) => PayResult
  deleteAccount: () => void
}

const AppContext = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [profiles,     setProfiles]     = useState<Profile[]>    (() => loadProfiles())
  const [banks,        setBanks]        = useState<BankAccount[]> (() => loadBanks())
  const [transactions, setTransactions] = useState<Transaction[]> (() => loadTransactions())
  const [sessionId,    setSessionId]    = useState<string | null> (() => loadSession())

  const [view,         setView]         = useState<View>('dashboard')
  const [modelsReady,  setModelsReady]  = useState(false)
  const [modelError,   setModelError]   = useState<string | null>(null)

  useEffect(() => saveProfiles(profiles),         [profiles])
  useEffect(() => saveBanks(banks),               [banks])
  useEffect(() => saveTransactions(transactions), [transactions])
  useEffect(() => saveSession(sessionId),         [sessionId])

  const retryModels = useCallback(() => {
    let live = true; setModelError(null)
    loadModels()
      .then(() => { if (live) setModelsReady(true) })
      .catch((e: unknown) => { if (live) setModelError(e instanceof Error ? e.message : String(e)) })
    return () => { live = false }
  }, [])
  useEffect(() => retryModels(), [retryModels])

  const currentProfile = useMemo(() => profiles.find((p) => p.id === sessionId) ?? null, [profiles, sessionId])
  const myBanks        = useMemo(() => banks.filter((b) => b.profileId === sessionId),   [banks, sessionId])
  const myTransactions = useMemo(() => transactions.filter((t) => t.profileId === sessionId), [transactions, sessionId])
  const hasLinkedFace  = !!currentProfile?.faceDescriptor

  const ensureBanks = useCallback((profileId: string, phone: string, name: string) => {
    const desired = generateLinkedBanks(phone, profileId, name)
    setBanks((prev) => {
      const exist = prev.filter((b) => b.profileId === profileId)
      const toAdd = desired.filter((d) => !exist.some((e) => e.bankName === d.bankName && e.last4 === d.last4))
      return toAdd.length ? [...toAdd, ...prev] : prev
    })
  }, [])

  // ── Auth ──────────────────────────────────────────────────────────────────
  const signup = useCallback((name: string, phone: string): AuthResult => {
    const p = phone.trim()
    if (!isValidPhone(p)) return { ok: false, error: 'Enter a valid phone number.' }
    if (!name.trim())     return { ok: false, error: 'Please enter your name.' }
    if (profiles.some((pr) => pr.phone === p)) return { ok: false, error: 'Account already exists. Please log in.' }
    const id = generateId('profile')
    const profile: Profile = { id, name: name.trim(), phone: p, wallet: 0, faceDescriptor: null, createdAt: Date.now() }
    setProfiles((prev) => [...prev, profile])
    ensureBanks(id, p, profile.name)
    setSessionId(id); setView('dashboard')
    return { ok: true }
  }, [profiles, ensureBanks])

  const login = useCallback((phone: string): AuthResult => {
    const p = phone.trim()
    if (!isValidPhone(p)) return { ok: false, error: 'Enter a valid phone number.' }
    const profile = profiles.find((pr) => pr.phone === p)
    if (!profile) return { ok: false, error: 'No account found for this number. Please sign up.' }
    ensureBanks(profile.id, p, profile.name)
    setSessionId(profile.id); setView('dashboard')
    return { ok: true }
  }, [profiles, ensureBanks])

  const logout = useCallback(() => { setSessionId(null); setView('dashboard') }, [])

  // ── Face ──────────────────────────────────────────────────────────────────
  const linkFace = useCallback((descriptor: Float32Array) => {
    if (!sessionId) return
    setProfiles((prev) => prev.map((p) => p.id === sessionId ? { ...p, faceDescriptor: Array.from(descriptor) } : p))
  }, [sessionId])

  const identifyFace = useCallback((descriptor: Float32Array) => {
    const enrolled = profiles.filter((p) => p.faceDescriptor).map((p) => ({ id: p.id, descriptor: p.faceDescriptor as number[] }))
    const { id, distance } = matchFace(descriptor, enrolled)
    return { profile: id ? (profiles.find((p) => p.id === id) ?? null) : null, distance }
  }, [profiles])

  // ── Banking ───────────────────────────────────────────────────────────────
  const addBankAccount = useCallback((input: AddBankInput): BankResult => {
    if (!currentProfile) return { ok: false, error: 'Please log in first.' }
    if (!input.bankName.trim())   return { ok: false, error: 'Enter the bank name.' }
    if (!input.holderName.trim()) return { ok: false, error: 'Enter the account holder name.' }
    const digits = input.accountNumber.replace(/\D/g, '')
    if (digits.length < 4) return { ok: false, error: 'Enter a valid account number (min 4 digits).' }
    setBanks((prev) => [{ id: generateId('bank'), profileId: currentProfile.id, bankName: input.bankName.trim(), holderName: input.holderName.trim(), last4: digits.slice(-4), accountType: input.accountType, createdAt: Date.now() }, ...prev])
    return { ok: true }
  }, [currentProfile])

  const removeBankAccount = useCallback((id: string) => setBanks((prev) => prev.filter((b) => b.id !== id)), [])

  const addFunds = useCallback((bankId: string, amountCents: number): BankResult => {
    if (!currentProfile) return { ok: false, error: 'Please log in first.' }
    if (amountCents <= 0) return { ok: false, error: 'Enter a valid amount.' }
    const bank = banks.find((b) => b.id === bankId && b.profileId === currentProfile.id)
    if (!bank) return { ok: false, error: 'Bank account not found.' }
    const balanceAfter = currentProfile.wallet + amountCents
    setProfiles((prev) => prev.map((p) => p.id === currentProfile.id ? { ...p, wallet: balanceAfter } : p))
    setTransactions((prev) => [{ id: generateId('txn'), profileId: currentProfile.id, profileName: currentProfile.name, amount: amountCents, type: 'topup', createdAt: Date.now(), balanceAfter, source: `${bank.bankName} ••${bank.last4}` }, ...prev])
    return { ok: true }
  }, [currentProfile, banks])

  // ── Pay ───────────────────────────────────────────────────────────────────
  const chargeProfile = useCallback((profileId: string, amountCents: number): PayResult => {
    if (amountCents <= 0) return { ok: false, error: 'Enter an amount greater than $0.00' }
    const profile = profiles.find((p) => p.id === profileId)
    if (!profile)                        return { ok: false, error: 'Account not found.' }
    if (amountCents > profile.wallet)    return { ok: false, error: 'Insufficient wallet balance.' }
    const balanceAfter = profile.wallet - amountCents
    const transaction: Transaction = { id: generateId('txn'), profileId, profileName: profile.name, amount: amountCents, type: 'payment', createdAt: Date.now(), balanceAfter }
    setProfiles((prev) => prev.map((p) => p.id === profileId ? { ...p, wallet: balanceAfter } : p))
    setTransactions((prev) => [transaction, ...prev])
    return { ok: true, transaction }
  }, [profiles])

  const deleteAccount = useCallback(() => {
    if (!sessionId) return
    setProfiles((prev)     => prev.filter((p) => p.id !== sessionId))
    setBanks((prev)        => prev.filter((b) => b.profileId !== sessionId))
    setTransactions((prev) => prev.filter((t) => t.profileId !== sessionId))
    setSessionId(null); setView('dashboard')
  }, [sessionId])

  const value = useMemo<Ctx>(() => ({
    currentProfile, myBanks, myTransactions, hasLinkedFace,
    view, setView, modelsReady, modelError, retryModels,
    signup, login, logout,
    linkFace, identifyFace,
    addBankAccount, removeBankAccount, addFunds, chargeProfile, deleteAccount,
  }), [currentProfile, myBanks, myTransactions, hasLinkedFace, view, modelsReady, modelError, retryModels, signup, login, logout, linkFace, identifyFace, addBankAccount, removeBankAccount, addFunds, chargeProfile, deleteAccount])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): Ctx {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
