import { initializeApp } from "firebase/app"
import { getStorage } from "firebase/storage"

// Initialize Firebase
const firebaseConfig = {

}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)