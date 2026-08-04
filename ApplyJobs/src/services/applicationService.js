import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

const normalize = (value = "") => value.trim().toLowerCase();
export async function createApplication(userId, data) {
  const payload = {
    ...data,
    userId,
    companyNameNormalized: normalize(data.companyName),
    jobTitleNormalized: normalize(data.jobTitle),
    locationNormalized: normalize(data.location),
    sourceNormalized: normalize(data.source),
    contactPersonNameNormalized: normalize(data.contactPersonName),
    followUpCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "applications"), payload);
  await Promise.all([
    addDoc(collection(db, "statusHistory"), {
      userId,
      applicationId: ref.id,
      previousStatus: null,
      newStatus: data.currentStatus,
      changedAt: serverTimestamp(),
    }),
    addDoc(collection(db, "activityLogs"), {
      userId,
      applicationId: ref.id,
      actionType: "created",
      description: "Application created.",
      createdAt: serverTimestamp(),
    }),
  ]);
  return ref.id;
}
export async function updateApplication(userId, id, data, previousStatus) {
  const clean = {
    ...data,
    companyNameNormalized: normalize(data.companyName),
    jobTitleNormalized: normalize(data.jobTitle),
    locationNormalized: normalize(data.location),
    sourceNormalized: normalize(data.source),
    contactPersonNameNormalized: normalize(data.contactPersonName),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, "applications", id), clean);
  const statusChanged = previousStatus && previousStatus !== data.currentStatus;
  await addDoc(collection(db, "activityLogs"), {
    userId,
    applicationId: id,
    actionType: statusChanged ? "status_changed" : "updated",
    description: statusChanged
      ? `Status changed from ${previousStatus} to ${data.currentStatus}.`
      : "Application details updated.",
    createdAt: serverTimestamp(),
  });
  if (statusChanged)
    await addDoc(collection(db, "statusHistory"), {
      userId,
      applicationId: id,
      previousStatus,
      newStatus: data.currentStatus,
      changedAt: serverTimestamp(),
    });
}
export async function deleteApplication(userId, id) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "applications", id));
  for (const name of ["events", "statusHistory", "activityLogs"]) {
    const snap = await getDocs(
      query(
        collection(db, name),
        where("userId", "==", userId),
        where("applicationId", "==", id),
      ),
    );
    snap.forEach((item) => batch.delete(item.ref));
  }
  await batch.commit();
}
export const removeApplication = deleteApplication;
