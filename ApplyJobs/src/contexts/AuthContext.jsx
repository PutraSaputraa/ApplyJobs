import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(
    () =>
      onAuthStateChanged(auth, (current) => {
        setUser(current);
        setLoading(false);
      }),
    [],
  );
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
