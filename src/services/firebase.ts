// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence, getAuth, Auth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { Firestore, getFirestore, initializeFirestore } from 'firebase/firestore'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: '',
  authDomain: 'immaginario-italia.firebaseapp.com',
  projectId: 'imsmaginario-italia',
  storageBucket: 'immaginario-italia.appspot.com',
  messagingSenderId: '1022628546726',
  appId: '1:1022628546726:web:85d82a421dc663f0ca4c67',
  measurementId: 'G-DNXBSBZ3P0',
}

// Check if app is already initialized
const isInitialized = getApps().length !== 0

// Setup App singleton
let app: undefined | FirebaseApp
app = !isInitialized ? (app = initializeApp(firebaseConfig)) : getApps()[0]

// Setup Firebase authentication
let auth: undefined | Auth
auth = !isInitialized
  ? (auth = initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) }))
  : getAuth()

let firestore: undefined | Firestore
firestore = !isInitialized
  ? (firestore = initializeFirestore(app, { experimentalForceLongPolling: true }))
  : getFirestore()

const storage = getStorage(app)

export { app, auth, firestore, storage }
