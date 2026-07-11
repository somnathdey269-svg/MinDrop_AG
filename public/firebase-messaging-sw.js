/* global importScripts, firebase */
// Firebase Cloud Messaging service worker (background handler).
// Loaded from the site root scope so it can receive push events for the whole app.

importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB5vaowJSmTliPPShPC5Oi9vD4sc61fVt0",
  authDomain: "mindrop-35b97.firebaseapp.com",
  projectId: "mindrop-35b97",
  storageBucket: "mindrop-35b97.firebasestorage.app",
  messagingSenderId: "1026619184955",
  appId: "1:1026619184955:web:a97781537abf2d8fd5c91e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || payload.data?.title || "MinDrop";
  const options = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ("focus" in client) return client.focus();
      }
      return self.clients.openWindow(url);
    }),
  );
});
