import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  type DocumentData,
} from 'firebase/firestore'
import { db, DEMO_MODE } from './firebase'

type Unsubscribe = () => void

export function subscribeCollection<T>(
  collectionName: string,
  onData: (items: T[]) => void,
  sortField?: string
): Unsubscribe {
  if (DEMO_MODE) {
    const load = () => {
      const stored = localStorage.getItem(collectionName)
      onData(stored ? JSON.parse(stored) : [])
    }
    load()
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === collectionName) load()
    }
    window.addEventListener('demo-data-change', handler)
    return () => window.removeEventListener('demo-data-change', handler)
  }

  if (!db) return () => {}

  const ref = collection(db, collectionName)
  const q = sortField ? query(ref, orderBy(sortField, 'desc')) : ref

  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => ({
      ...d.data(),
      docId: d.id,
    })) as T[]
    onData(items)
  })
}

export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<string> {
  if (DEMO_MODE) {
    const stored = JSON.parse(localStorage.getItem(collectionName) || '[]')
    const newItem = { ...data, id: Date.now() }
    stored.unshift(newItem)
    localStorage.setItem(collectionName, JSON.stringify(stored))
    // Notify subscribers
    window.dispatchEvent(new CustomEvent('demo-data-change', { detail: collectionName }))
    return String(newItem.id)
  }

  if (!db) throw new Error('Firestore not configured')
  const docRef = await addDoc(collection(db, collectionName), data)
  return docRef.id
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  if (DEMO_MODE) {
    const stored = JSON.parse(localStorage.getItem(collectionName) || '[]')
    const idx = stored.findIndex((item: { id?: number; docId?: string }) =>
      item.docId === docId || String(item.id) === docId
    )
    if (idx !== -1) {
      stored[idx] = { ...stored[idx], ...data }
      localStorage.setItem(collectionName, JSON.stringify(stored))
      window.dispatchEvent(new CustomEvent('demo-data-change', { detail: collectionName }))
    }
    return
  }

  if (!db) throw new Error('Firestore not configured')
  await updateDoc(doc(db, collectionName, docId), data)
}

export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  if (DEMO_MODE) {
    const stored = JSON.parse(localStorage.getItem(collectionName) || '[]')
    const filtered = stored.filter((item: { id?: number; docId?: string }) =>
      item.docId !== docId && String(item.id) !== docId
    )
    localStorage.setItem(collectionName, JSON.stringify(filtered))
    window.dispatchEvent(new CustomEvent('demo-data-change', { detail: collectionName }))
    return
  }

  if (!db) throw new Error('Firestore not configured')
  await deleteDoc(doc(db, collectionName, docId))
}

// Settings — single document store
export function subscribeSettings(
  onData: (settings: Record<string, unknown>) => void
): () => void {
  if (DEMO_MODE) {
    const load = () => {
      const stored = localStorage.getItem('settings')
      onData(stored ? JSON.parse(stored) : {})
    }
    load()
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail === 'settings') load()
    }
    window.addEventListener('demo-data-change', handler)
    return () => window.removeEventListener('demo-data-change', handler)
  }

  if (!db) return () => {}
  const ref = doc(db, 'settings', 'main')
  return onSnapshot(ref, (snap) => {
    onData(snap.exists() ? (snap.data() as Record<string, unknown>) : {})
  })
}

export async function updateSettings(data: Record<string, unknown>): Promise<void> {
  if (DEMO_MODE) {
    const stored = JSON.parse(localStorage.getItem('settings') || '{}')
    const updated = { ...stored, ...data }
    localStorage.setItem('settings', JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('demo-data-change', { detail: 'settings' }))
    return
  }
  if (!db) throw new Error('Firestore not configured')
  await setDoc(doc(db, 'settings', 'main'), data, { merge: true })
}
