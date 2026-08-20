import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(
    () =>
      onAuthStateChanged(auth, async (current) => {
        if (!current) {
          setUser(null);
          setLoading(false);
          return;
        }
        try {
          const [profile, token] = await Promise.all([
            getDoc(doc(db, "users", current.uid)),
            current.getIdTokenResult(),
          ]);
          const isAdmin = token.claims.admin === true;
          const active = profile.exists() && profile.data().status !== "disabled";
          if (!isAdmin && !active) {
            await signOut(auth);
            setUser(null);
          } else {
            setUser(current);
          }
        } catch {
          await signOut(auth);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }),
    [],
  );
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
