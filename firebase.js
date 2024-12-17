import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDyry5ANRkz_ElZOGSbdF7hO2omZ-s1fSo',
  authDomain: 'react-native-auth-f24dd.firebaseapp.com',
  projectId: 'react-native-auth-f24dd',
  storageBucket: 'react-native-auth-f24dd.firebasestorage.app',
  messagingSenderId: '1052589796132',
  appId: '1:1052589796132:web:ac0b3f67ce14a214b8e1b1',
  measurementId: 'G-JLT4LVF4JT',
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }
