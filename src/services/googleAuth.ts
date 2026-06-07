import { GOOGLE_CLIENT_ID, DRIVE_SCOPE } from '../config/google.ts'

// Minimalne typy GIS (token model)
interface TokenResponse { access_token: string; expires_in: number; error?: string }
interface TokenClient { requestAccessToken: (opts?: { prompt?: string }) => void }
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (cfg: {
            client_id: string; scope: string;
            callback: (r: TokenResponse) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

let accessToken: string | null = null
let tokenExpiry = 0
let userEmail: string | null = null
let tokenClient: TokenClient | null = null
const listeners = new Set<() => void>()

export function onAuthChange(fn: () => void): () => void {
  listeners.add(fn); return () => listeners.delete(fn)
}
function emit() { listeners.forEach((f) => f()) }

export function isSignedIn(): boolean { return !!accessToken && Date.now() < tokenExpiry }
export function getEmail(): string | null { return userEmail }
export function getAccessToken(): string | null { return isSignedIn() ? accessToken : null }

function loadGis(): Promise<void> {
  if (window.google?.accounts?.oauth2) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true; s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Nie udalo sie zaladowac Google Identity Services'))
    document.head.appendChild(s)
  })
}

async function fetchEmail(token: string): Promise<void> {
  try {
    const r = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (r.ok) { const j = await r.json(); userEmail = j.email ?? null }
  } catch { /* ignore */ }
}

export async function signIn(): Promise<void> {
  await loadGis()
  await new Promise<void>((resolve, reject) => {
    tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: DRIVE_SCOPE,
      callback: (r) => {
        if (r.error) { reject(new Error(r.error)); return }
        accessToken = r.access_token
        tokenExpiry = Date.now() + (r.expires_in - 60) * 1000
        fetchEmail(r.access_token).finally(() => { emit(); resolve() })
      },
    })
    tokenClient!.requestAccessToken({ prompt: 'consent' })
  })
}

export async function ensureToken(): Promise<string> {
  if (isSignedIn()) return accessToken!
  // ciche odswiezenie bez ekranu zgody
  await loadGis()
  return new Promise<string>((resolve, reject) => {
    tokenClient = window.google!.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID, scope: DRIVE_SCOPE,
      callback: (r) => {
        if (r.error || !r.access_token) { reject(new Error('Wymagane ponowne logowanie')); return }
        accessToken = r.access_token
        tokenExpiry = Date.now() + (r.expires_in - 60) * 1000
        emit(); resolve(r.access_token)
      },
    })
    tokenClient!.requestAccessToken({ prompt: '' })
  })
}

export function signOut(): void {
  accessToken = null; tokenExpiry = 0; userEmail = null; emit()
}

export function invalidateToken(): void { accessToken = null; tokenExpiry = 0 }
