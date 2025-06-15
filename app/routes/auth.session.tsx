import { json } from "@remix-run/node";
import { setUserSession, sessionStorage } from "~/lib/session.server";

export async function action({ request }: any) {
  try {
    const { token } = await request.json();
    console.log("받은 토큰:", token);

    const { initializeFirebaseAdmin } = await import("~/lib/firebase.server");
    const { getAuth } = await import("firebase-admin/auth");

    initializeFirebaseAdmin();

    const decoded = await getAuth().verifyIdToken(token);
    const session = await setUserSession(request, token);

    return json(
      { success: true },
      {
        headers: {
          "Set-Cookie": await sessionStorage.commitSession(session)
        }
      }
    );
  } catch (err: any) {
    console.error("세션 저장 실패:", err);
    return json(
      { success: false, error: err.message || "세션 저장 실패" },
      { status: 500 }
    );
  }
}
