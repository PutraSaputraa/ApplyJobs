import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export async function register(fullName, email, password) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName: fullName })
  await setDoc(doc(db, 'users', result.user.uid), {
    userId: result.user.uid, fullName, email,
    preferences: { noResponseThreshold: 7, defaultCurrency: 'IDR', defaultSalaryPeriod: 'Per Month', calendarView: 'dayGridMonth', theme: 'light' },
    createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
  })
  return result.user
}
export const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
export const logout = () => signOut(auth)
