import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb, json, requireAdmin } from "./_lib/firebase-admin.mjs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function listUsers() {
  const users = [];
  let pageToken;
  do {
    const page = await adminAuth.listUsers(1000, pageToken);
    users.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);
  const profiles = users.length
    ? await adminDb.getAll(...users.map((user) => adminDb.doc(`users/${user.uid}`)))
    : [];
  const byId = new Map(profiles.map((profile) => [profile.id, profile.data() || {}]));
  return users.map((user) => {
    const profile = byId.get(user.uid) || {};
    return {
      uid: user.uid,
      fullName: profile.fullName || user.displayName || "",
      email: user.email || profile.email || "",
      status: user.disabled || profile.status === "disabled" ? "disabled" : "active",
      createdAt: user.metadata.creationTime || null,
      lastSignInAt: user.metadata.lastSignInTime || null,
      isAdmin: user.customClaims?.admin === true,
    };
  }).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

async function createUser(body) {
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (fullName.length < 2 || fullName.length > 80) return json(400, { error: "Nama harus terdiri dari 2–80 karakter." });
  if (!emailPattern.test(email) || email.length > 254) return json(400, { error: "Alamat email tidak valid." });
  if (password.length < 8 || password.length > 128) return json(400, { error: "Password harus terdiri dari 8–128 karakter." });
  let user;
  try {
    user = await adminAuth.createUser({ displayName: fullName, email, password, disabled: false });
    await adminDb.doc(`users/${user.uid}`).set({
      userId: user.uid,
      fullName,
      email,
      status: "active",
      preferences: {
        noResponseThreshold: 7,
        defaultCurrency: "IDR",
        defaultSalaryPeriod: "Per Month",
        calendarView: "dayGridMonth",
        theme: "light",
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    if (user) await adminAuth.deleteUser(user.uid).catch(() => {});
    if (error.code === "auth/email-already-exists") return json(409, { error: "Email ini sudah terdaftar." });
    throw error;
  }
  return json(201, { message: "Akun customer berhasil dibuat dan langsung aktif." });
}

async function setStatus(body, adminUid) {
  const uid = typeof body?.uid === "string" ? body.uid.trim() : "";
  const status = body?.status;
  if (!uid || !["active", "disabled"].includes(status)) return json(400, { error: "UID atau status tidak valid." });
  const target = await adminAuth.getUser(uid);
  if (uid === adminUid || target.customClaims?.admin === true) return json(400, { error: "Akun admin tidak dapat dinonaktifkan dari halaman ini." });
  const disabled = status === "disabled";
  await adminAuth.updateUser(uid, { disabled });
  await adminDb.doc(`users/${uid}`).set({ status, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  await adminAuth.revokeRefreshTokens(uid);
  return json(200, { message: disabled ? "Akun customer dinonaktifkan." : "Akun customer diaktifkan kembali." });
}

export default async (request) => {
  const authorization = await requireAdmin(request);
  if (authorization.error) return authorization.error;
  try {
    if (request.method === "GET") return json(200, { users: await listUsers() });
    const body = await request.json().catch(() => null);
    if (!body) return json(400, { error: "Body JSON tidak valid." });
    if (request.method === "POST" && body.action === "create") return createUser(body);
    if (request.method === "PATCH" && body.action === "status") return setStatus(body, authorization.token.uid);
    return json(405, { error: "Metode atau aksi tidak didukung." });
  } catch (error) {
    if (error.code === "auth/user-not-found") return json(404, { error: "Pengguna tidak ditemukan." });
    return json(500, { error: "Operasi admin gagal. Periksa konfigurasi server." });
  }
};
