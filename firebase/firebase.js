import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAWKGXK-67GDBvFBGaHVHTQhoQwzgRJtxU",
  authDomain: "pro5ahga.firebaseapp.com",
  projectId: "pro5ahga",
  storageBucket: "pro5ahga.firebasestorage.app",
  messagingSenderId: "7149839710",
  appId: "1:7149839710:web:04d68f80f741407076dbcf",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
