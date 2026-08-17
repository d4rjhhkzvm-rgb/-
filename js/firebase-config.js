// Firebase Configuration - CENTER ALBAZIKI

const firebaseConfig = {
  apiKey: "AIzaSyBPiLbUPClwrvbvzmvEaaIu2FaAWWsA4TI",
  authDomain: "centeralbaziki.firebaseapp.com",
  projectId: "centeralbaziki",
  storageBucket: "centeralbaziki.firebasestorage.app",
  messagingSenderId: "368079353950",
  appId: "1:368079353950:web:adb51c325e4208aba59ccf",
  measurementId: "G-C5FG364ZDR"
};


// تشغيل Firebase
firebase.initializeApp(firebaseConfig);

// الخدمات
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();