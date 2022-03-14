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

const sanitize = string => DOMPurify.sanitize(string)

const renderGamesList = querySnapshot => {
  if (!querySnapshot.metadata.hasPendingWrites) {
    gamesList.innerHTML = ''

    const games = querySnapshot.docs.map(doc => {
      const [id, { title, developedBy, createdAt }] = [doc.id, doc.data()]

      const liGame = document.createElement('li')
      liGame.setAttribute('data-id', id)
      liGame.setAttribute('class', 'my-4')

      const h5 = document.createElement('h5')
      h5.textContent = sanitize(title)

      const ul = document.createElement('ul')

      const liDevelopedBy = document.createElement('li')
      liDevelopedBy.textContent = `Desenvolvido por ${sanitize(developedBy)}`

      if (createdAt) {
        const liDate = document.createElement('li')
        liDate.textContent = `Adicionado ao banco em ${getFormattedDate(createdAt)}`
        ul.append(liDate)
      }

      const button = document.createElement('button')
      button.textContent = 'Remover'
      button.setAttribute('data-remove', id)
      button.setAttribute('class', 'btn btn-danger btn-sm')

      ul.append(liDevelopedBy)
      liGame.append(h5, ul, button)

      return liGame
    })
    games.forEach(game => gamesList.append(game))
  }
}

const to = promise => promise
  .then(result => [null, result])
  .catch(error => [error])

const addGame = async e => {
  e.preventDefault()

  const [error, doc] = await to(addDoc(collectionGames, {
    title: sanitize(e.target.title.value),
    developedBy: sanitize(e.target.developer.value),
    createdAt: serverTimestamp()
  }))

  if (error) {
    return log(error)
  }

  log('Document created with ID', doc.id)
  e.target.reset()
  e.target.title.focus()
}

const deleteGame = async e => {
  const idRemoveButton = e.target.dataset.remove

  if (!idRemoveButton) {
    return
  }

  const [error] = await to(deleteDoc(doc(db, 'games', idRemoveButton)))

  if (error) {
    return log(error)
  }

  log('Game removido')
}

const handleSnapshotError = error => log(error)

const unsubscribe = onSnapshot(collectionGames, renderGamesList, handleSnapshotError)
gamesList.addEventListener('click', deleteGame)
formAddGame.addEventListener('submit', addGame)
buttonUnsub.addEventListener('click', unsubscribe)