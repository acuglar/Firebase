import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js'
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'AIzaSyAi8OBJqIzYxfwIHuSJFsgO5_OkAbpzegg',
  authDomain: 'testing-firebase-60db9.firebaseapp.com',
  projectId: 'testing-firebase-60db9',
  storageBucket: 'testing-firebase-60db9.appspot.com',
  messagingSenderId: '920365434979',
  appId: '1:920365434979:web:04947e0f8dc299342ad056',
  measurementId: 'G-Q6EWYSBD5M'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)



