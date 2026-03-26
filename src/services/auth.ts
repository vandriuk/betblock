import {
  initializeApp,
  deleteApp,
} from 'firebase/app'
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { auth, db, DEMO_MODE } from './firebase'
import type { AppUser, UserRole } from '@/types'

const firebaseConfig = {
  apiKey: 'AIzaSyBal2IiMwq97gBRfODesYVtRDHmBfQTWsY',
  authDomain: 'shlakoblock-ebf35.firebaseapp.com',
  projectId: 'shlakoblock-ebf35',
  storageBucket: 'shlakoblock-ebf35.firebasestorage.app',
  messagingSenderId: '198560932701',
  appId: '1:198560932701:web:5f1b278f4be868cb087eb4',
}

const DEMO_USERS: Record<string, { password: string; role: UserRole }> = {
  'admin@example.com': { password: 'admin123', role: 'admin' },
  'manager@example.com': { password: 'manager123', role: 'manager' },
  'worker@example.com': { password: 'worker123', role: 'worker' },
}

export async function signIn(email: string, password: string): Promise<AppUser> {
  if (DEMO_MODE) {
    const demoUser = DEMO_USERS[email]
    if (demoUser && demoUser.password === password) {
      const user: AppUser = {
        uid: email.split('@')[0],
        email,
        role: demoUser.role,
      }
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    }
    throw new Error('Невірний email або пароль')
  }

  if (!auth) throw new Error('Firebase not configured')
  const cred = await signInWithEmailAndPassword(auth, email, password)
  return getUserWithRole(cred.user)
}

export async function signOut(): Promise<void> {
  if (DEMO_MODE) {
    localStorage.removeItem('currentUser')
    return
  }
  if (auth) await firebaseSignOut(auth)
}

export function onAuthStateChanged(callback: (user: AppUser | null) => void): () => void {
  if (DEMO_MODE) {
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      callback(JSON.parse(stored))
    } else {
      callback(null)
    }
    return () => {}
  }

  if (!auth) {
    callback(null)
    return () => {}
  }

  return firebaseOnAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await getUserWithRole(firebaseUser)
        callback(user)
      } catch {
        callback(null)
      }
    } else {
      callback(null)
    }
  })
}

async function getUserWithRole(firebaseUser: User): Promise<AppUser> {
  if (!db) throw new Error('Firestore not configured')
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
  const role = userDoc.exists() ? (userDoc.data().role as UserRole) : 'worker'
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || '',
    role,
  }
}

/** Create a new Firebase Auth user + Firestore role doc (without signing out admin) */
export async function createUser(email: string, password: string, role: UserRole): Promise<string> {
  if (DEMO_MODE) {
    const uid = 'user_' + Date.now()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    users.unshift({ uid, email, role, createdAt: new Date().toISOString(), id: Date.now() })
    localStorage.setItem('users', JSON.stringify(users))
    window.dispatchEvent(new CustomEvent('demo-data-change', { detail: 'users' }))
    return uid
  }

  if (!db) throw new Error('Firestore not configured')

  // Use secondary app so admin session is not affected
  const secondaryApp = initializeApp(firebaseConfig, 'userCreator_' + Date.now())
  const secondaryAuth = getAuth(secondaryApp)

  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password)
    await setDoc(doc(db, 'users', cred.user.uid), {
      email,
      role,
      createdAt: new Date().toISOString(),
    })
    await firebaseSignOut(secondaryAuth)
    await deleteApp(secondaryApp)
    return cred.user.uid
  } catch (error) {
    await deleteApp(secondaryApp)
    throw error
  }
}

/** Update a user's role in Firestore */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  if (DEMO_MODE) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const idx = users.findIndex((u: { uid: string; id?: number; docId?: string }) =>
      u.uid === uid || u.docId === uid || String(u.id) === uid
    )
    if (idx !== -1) {
      users[idx].role = role
      localStorage.setItem('users', JSON.stringify(users))
      window.dispatchEvent(new CustomEvent('demo-data-change', { detail: 'users' }))
    }
    return
  }

  if (!db) throw new Error('Firestore not configured')
  await setDoc(doc(db, 'users', uid), { role }, { merge: true })
}

/** Remove user's Firestore doc (Auth account remains but user can't access the app) */
export async function removeUser(uid: string): Promise<void> {
  if (DEMO_MODE) {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const filtered = users.filter((u: { uid: string; id?: number; docId?: string }) =>
      u.uid !== uid && u.docId !== uid && String(u.id) !== uid
    )
    localStorage.setItem('users', JSON.stringify(filtered))
    window.dispatchEvent(new CustomEvent('demo-data-change', { detail: 'users' }))
    return
  }

  if (!db) throw new Error('Firestore not configured')
  await deleteDoc(doc(db, 'users', uid))
}
