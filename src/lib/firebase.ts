// Browser-only Firebase initialisation for Cloud Messaging (FCM web push).
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported, type Messaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyB5vaowJSmTliPPShPC5Oi9vD4sc61fVt0",
  authDomain: "mindrop-35b97.firebaseapp.com",
  projectId: "mindrop-35b97",
  storageBucket: "mindrop-35b97.firebasestorage.app",
  messagingSenderId: "1026619184955",
  appId: "1:1026619184955:web:a97781537abf2d8fd5c91e",
};

let app: FirebaseApp | null = null;
let messagingInstance: Messaging | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  app = getApps()[0] ?? initializeApp(firebaseConfig);
  return app;
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === "undefined") return null;
  if (!(await isSupported())) return null;
  if (messagingInstance) return messagingInstance;
  messagingInstance = getMessaging(getFirebaseApp());
  return messagingInstance;
}

export async function requestFcmToken(vapidKey: string): Promise<string | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
    scope: "/",
  });
  await navigator.serviceWorker.ready;

  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: registration,
  });
  return token || null;
}

export async function onForegroundMessage(handler: (payload: unknown) => void) {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return () => {};
  return onMessage(messaging, handler);
}
