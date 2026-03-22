import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getAnalytics, logEvent as fbLogEvent, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyBal2IiMwq97gBRfODesYVtRDHmBfQTWsY',
  authDomain: 'shlakoblock-ebf35.firebaseapp.com',
  projectId: 'shlakoblock-ebf35',
  storageBucket: 'shlakoblock-ebf35.firebasestorage.app',
  messagingSenderId: '198560932701',
  appId: '1:198560932701:web:5f1b278f4be868cb087eb4',
}

const isConfigured = !firebaseConfig.apiKey.includes('ВАШ')

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let analytics: Analytics | null = null
let DEMO_MODE = !isConfigured

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    analytics = getAnalytics(app)
  } catch {
    DEMO_MODE = true
  }
}

function logEvent(name: string, params?: Record<string, string | number>) {
  if (analytics) {
    fbLogEvent(analytics, name, params)
  }
}

export { app, auth, db, analytics, DEMO_MODE, logEvent }
