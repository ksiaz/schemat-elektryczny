import { GOOGLE_API_KEY, DRIVE_FOLDER_ID } from '../config/google.ts'
import { ensureToken } from './googleAuth.ts'

export interface PickedFile { id: string; name: string }

/* eslint-disable @typescript-eslint/no-explicit-any */
// Brak oficjalnych typow dla gapi/google.picker — dostep przez luzny cast.
function w(): any { return window as any }

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return }
    const s = document.createElement('script')
    s.src = src; s.async = true; s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Nie udalo sie zaladowac ${src}`))
    document.head.appendChild(s)
  })
}

let pickerReady = false
async function loadPicker(): Promise<void> {
  if (pickerReady && w().google?.picker) return
  await loadScript('https://apis.google.com/js/api.js')
  await new Promise<void>((resolve, reject) => {
    if (!w().gapi?.load) { reject(new Error('gapi niedostepne')); return }
    w().gapi.load('picker', () => resolve())
  })
  pickerReady = true
}

// Otwiera Google Picker nawigowany do wspolnego folderu; zwraca wybrany plik lub null.
export async function pickProjectFile(): Promise<PickedFile | null> {
  await loadPicker()
  const token = await ensureToken()
  const picker = w().google.picker
  return new Promise<PickedFile | null>((resolve) => {
    const view = new picker.DocsView(picker.ViewId.DOCS)
      .setParent(DRIVE_FOLDER_ID)
      .setMimeTypes('application/json')
    const p = new picker.PickerBuilder()
      .setOAuthToken(token)
      .setDeveloperKey(GOOGLE_API_KEY)
      .addView(view)
      .setCallback((data: any) => {
        if (data.action === picker.Action.PICKED) {
          const doc = data.docs && data.docs[0]
          resolve(doc ? { id: doc.id, name: doc.name } : null)
        } else if (data.action === picker.Action.CANCEL) {
          resolve(null)
        }
      })
      .build()
    p.setVisible(true)
  })
}
/* eslint-enable @typescript-eslint/no-explicit-any */
