import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, DEMO_MODE } from './firebase'
import type { AppUser, UserRole } from '@/types'

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
