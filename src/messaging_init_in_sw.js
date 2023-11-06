import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyCm5T1Bg_nhB2AHBE__ygIZCppX6DOTlRc",
  authDomain: "smartwork-6f2c8.firebaseapp.com",
  databaseURL: "https://smartwork-6f2c8-default-rtdb.firebaseio.com",
  projectId: "smartwork-6f2c8",
  storageBucket: "smartwork-6f2c8.appspot.com",
  messagingSenderId: "753125196089",
  appId: "1:753125196089:web:618d1e74f5b1efed6f28e8",
  measurementId: "G-C55RZWRNP6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
const getTokenDeviceFCM = (SetFcmToken) => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      const messaging = getMessaging(app);

      getToken(messaging, {
        vapidKey:
          "BGIwZ_kyTWrx8FZ3EL6O9ZkTrunkVwlhiClz3rjIduK7EE0WMuSu39Kl5A0V118D5Q3k9IYQF-9wed_epvOZiw0",
      }).then((currentToken) => {
        if (currentToken) {
          SetFcmToken(currentToken);
        } else {
          console.log("can not get token");
        }
      });
    } else {
      console.log("Do not have permission.");
    }
  });
};

export default getTokenDeviceFCM;
