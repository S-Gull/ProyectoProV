// js/auth.js
import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

export async function registrarUsuario(email, password, additionalData = {}) {
  try {
    // 1. Crear usuario en Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 2. Guardar información adicional en Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      uid: userCredential.user.uid,
      ...additionalData,
    });

    return userCredential;
  } catch (error) {
    console.error("Error en registrarUsuario:", error);

    // Manejo específico de errores
    let errorMessage = "Error al registrar usuario";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "El correo electrónico ya está en uso";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "La contraseña debe tener al menos 6 caracteres";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "El correo electrónico no es válido";
    }

    throw new Error(errorMessage);
  }
}

export async function iniciarSesion(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function cerrarSesion() {
  return await signOut(auth);
}
