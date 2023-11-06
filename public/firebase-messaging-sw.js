importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCm5T1Bg_nhB2AHBE__ygIZCppX6DOTlRc",
  authDomain: "smartwork-6f2c8.firebaseapp.com",
  databaseURL: "https://smartwork-6f2c8-default-rtdb.firebaseio.com",
  projectId: "smartwork-6f2c8",
  storageBucket: "smartwork-6f2c8.appspot.com",
  messagingSenderId: "753125196089",
  appId: "1:753125196089:web:618d1e74f5b1efed6f28e8",
  measurementId: "G-C55RZWRNP6",
});

const messaging = firebase.messaging();

// Register background handler
messaging.setBackgroundMessageHandler(function (payload) {
  // Customize how to handle background messages
  return self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
  });
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service worker registered with scope: ", registration.scope);
    })
    .catch((error) => {
      console.error("Error registering service worker: ", error);
    });
}
