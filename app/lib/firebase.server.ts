import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

export function initializeFirebaseAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
      })
    });
  }
}

export async function getAllProjects() {
  initializeFirebaseAdmin();
  const db = getFirestore();
  const snapshot = await db
    .collection("projects")
    .orderBy("createdAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      title: data.title || "",
      description: data.description || "",
      period: data.period || "",
      techStack: data.techStack || "",
      imageUrl: data.imageUrl || "",
      createdAt: data.createdAt?.toDate().toISOString() ?? "",
      updatedAt: data.updatedAt?.toDate().toISOString() ?? ""
    };
  });
}

export async function getToProjects(limit = 3) {
  initializeFirebaseAdmin();
  const db = getFirestore();
  const snapshot = await db
    .collection("projects")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title || "",
      period: data.period || "",
      techStack: data.techStack || "",
      imageUrl: data.imageUrl || "",
      createdAt: data.createdAt?.toDate().toISOString() ?? "",
      updatedAt: data.updatedAt?.toDate().toISOString() ?? ""
    };
  });
}
