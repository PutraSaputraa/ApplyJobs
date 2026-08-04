import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
export const createEvent = (userId, data) =>
  addDoc(collection(db, "events"), {
    ...data,
    userId,
    isCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
export const updateEvent = (id, data) =>
  updateDoc(doc(db, "events", id), { ...data, updatedAt: serverTimestamp() });
export const deleteEvent = (id) => deleteDoc(doc(db, "events", id));
