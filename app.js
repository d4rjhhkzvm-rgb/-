import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPiLbUPClwrvbvzmvEaaIu2FaAWWsA4TI",
  authDomain: "centeralbaziki.firebaseapp.com",
  projectId: "centeralbaziki",
  storageBucket: "centeralbaziki.firebasestorage.app",
  messagingSenderId: "368079353950",
  appId: "1:368079353950:web:adb51c325e4208aba59ccf",
  measurementId: "G-C5FG364ZDR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function add() {
  const shoe = {
    model: document.getElementById("model").value,
    supplier: document.getElementById("supplier").value,
    color: document.getElementById("color").value,
    qty: document.getElementById("qty").value
  };

  await addDoc(collection(db, "shoes"), shoe);

  show();
}


async function show() {
  let html = "";

  const querySnapshot = await getDocs(collection(db, "shoes"));

  querySnapshot.forEach((doc) => {
    const shoe = doc.data();

    html += `
      <div class="item">
        <b>الموديل:</b> ${shoe.model}<br>
        <b>المورد:</b> ${shoe.supplier}<br>
        <b>اللون:</b> ${shoe.color}<br>
        <b>الكراتين:</b> ${shoe.qty}
      </div>
    `;
  });

  document.getElementById("list").innerHTML = html;
}


show();