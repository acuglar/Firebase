import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js'
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const collectionGames = collection(db, 'games')

const formAddGame = document.querySelector('[data-js="add-game-form"]')
const gamesList = document.querySelector('[data-js="games-list"]')
const buttonUnsub = document.querySelector('[data-js="unsub"]')

const unsubscribe = onSnapshot(collectionGames, querySnapshot => {
  if (!querySnapshot.metadata.hasPendingWrites) {
    const gamesLis = querySnapshot.docs.reduce((acc, doc) => {
      const { title, developedBy, createdAt } = doc.data()

      acc += `<li data-id="${doc.id}" class="my-4">
          <h5>${title}</h5>
  
          <ul>
            <li>Desenvolvido por ${developedBy}</li>
            ${createdAt ? `<li>Adicionado ao banco em ${new Intl.DateTimeFormat('pr-br', { dateStyle: 'short', timeStyle: 'short' }).format(createdAt.toDate())}</li>` : ''}
          </ul>
  
          <button data-remove="${doc.id}" class="btn btn-danger btn-sm">Remover</button>
        </li>`

      return acc
    }, '')

    gamesList.innerHTML = gamesLis
  }
})

formAddGame.addEventListener('submit', e => {
  e.preventDefault()

  addDoc(collectionGames, {
    title: e.target.title.value,
    developedBy: e.target.developer.value,
    createdAt: serverTimestamp()
  })
    .then(doc => console.log('Document created with ID', doc.id))
    .catch(console.log)
})

gamesList.addEventListener('click', e => {
  const idRemoveButton = e.target.dataset.remove
  console.log(idRemoveButton);

  if (idRemoveButton) {
    deleteDoc(doc(db, 'games', idRemoveButton))
      .then(() => console.log('Game removido'))
      .catch(console.log)
  }
})

buttonUnsub.addEventListener('click', unsubscribe)