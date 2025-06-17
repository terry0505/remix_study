import { redirect } from "@remix-run/node";
import { getAuth } from "firebase-admin/auth";
import { getUserToken } from "~/lib/session.server";
import { initializeFirebaseAdmin } from "~/lib/firebase.server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function requireAdmin(request: Request) {
  const token = await getUserToken(request);
  if (!token) throw redirect("/login");

  initializeFirebaseAdmin();

  const decoded = await getAuth().verifyIdToken(token);
  if (decoded.email !== ADMIN_EMAIL) {
    alert("관리자 회원만 접근 가능합니다.");
    throw redirect("/");
  }

  return decoded;
}
