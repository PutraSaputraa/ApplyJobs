import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "./useAuth";
export function useUserCollection(name) {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    return onSnapshot(
      query(collection(db, name), where("userId", "==", user.uid)),
      (snap) => {
        setData(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );
  }, [name, user]);
  return { data, loading, error };
}
