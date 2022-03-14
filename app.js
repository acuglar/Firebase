import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js'
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const collectionGames = collection(db, 'games')

const formAddGame = document.querySelector('[data-js="add-game-form"]')
const gamesList = document.querySelector('[data-js="games-list"]')
const buttonUnsub = document.querySelector('[data-js="unsub"]')

const log = (...value) => console.log(...value)

const getFormattedDate = createdAt => new Intl
  .DateTimeFormat('pr-br', { dateStyle: 'short', timeStyle: 'short' })
  .format(createdAt.toDate())

const renderGamesList = querySnapshot => {
  if (!querySnapshot.metadata.hasPendingWrites) {
    gamesList.innerHTML = querySnapshot.docs.reduce((acc, doc) => {
      const [id, { title, developedBy, createdAt }] = [doc.id, doc.data()]

      return `${acc}<li data-id="${id}" class="my-4">
          <h5>${title}</h5>
  
          <ul>
            <li>Desenvolvido por ${developedBy}</li>
            ${createdAt ? `<li>Adicionado ao banco em ${getFormattedDate(createdAt)}</li>` : ''}
          </ul>
  
          <button data-remove="${id}" class="btn btn-danger btn-sm">Remover</button>
        </li>`
    }, '')
  }
}

const addGame = e => {
  e.preventDefault()

  addDoc(collectionGames, {
    title: e.target.title.value,
    developedBy: e.target.developer.value,
    createdAt: serverTimestamp()
  })
    .then(doc => {
      log('Document created with ID', doc.id)
      e.target.reset()
      e.target.title.focus()
    })
    .catch(log)
}

const to = promise => promise
  .then(result => [null, result])
  .catch(error => [error])

const deleteGame = async e => {
  const idRemoveButton = e.target.dataset.remove

  if (!idRemoveButton) {
    return
  }

  try {
    await deleteDoc(doc(db, 'games', idRemoveButton))
    log('Game removido')
  } catch (e) {
    log(e)
  }
}

const handleSnapshotError = error => log(error)

const unsubscribe = onSnapshot(collectionGames, renderGamesList, handleSnapshotError)
gamesList.addEventListener('click', deleteGame)
formAddGame.addEventListener('submit', addGame)
buttonUnsub.addEventListener('click', unsubscribe)