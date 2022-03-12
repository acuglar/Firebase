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

getDocs(collection(db, 'games'))
  .then(querySnapshot => {
    // querySnapshot.docs.forEach(doc => console.log(doc.data())). método builtin js
    // querySnapshot.forEach(doc => console.log(doc.data())). método forEach do retorno de getDocs  

    const gamesLis = querySnapshot.docs.reduce((acc, doc) => {
      const { title, developedBy, createdAt } = doc.data()
      acc += `<li class="my-4">
        <h5>${title}</h5>
        
        <ul>
          <li>Desenvolvido por ${developedBy}</li>
          <li>Adicionado no banco em ${createdAt.toDate()}</li>
        </ul>
      </li>`

      return acc
    }, '')

    const gamesList = document.querySelector('[data-js="games-list"]')
    gamesList.innerHTML = gamesLis
  })

