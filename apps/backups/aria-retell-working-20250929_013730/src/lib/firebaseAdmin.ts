import { cert, getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function initFirebaseAdmin() {
  const existingApp = getApps()[0];
  if (existingApp) {
    return existingApp;
  }

  const serviceAccountJSON = process.env.FIREBASE_SERVICE_ACCOUNT;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (serviceAccountJSON) {
    const serviceAccount = JSON.parse(serviceAccountJSON);
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  if (projectId && clientEmail && privateKey) {
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

const adminApp = initFirebaseAdmin();
export const firestore = getFirestore(adminApp);
