import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js'
import { getFirestore, collection, getDocs, addDoc, serverTimestamp, doc, deleteDoc, updateDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const collectionGames = collection(db, 'games')

const formAddGame = document.querySelector('[data-js="add-game-form"]')
const gamesList = document.querySelector('[data-js="games-list"]')

getDocs(collectionGames)
  .then(querySnapshot => {
    const gamesLis = querySnapshot.docs.reduce((acc, doc) => {
      const { title, developedBy, createdAt } = doc.data()
      acc += `<li data-id="${doc.id}" class="my-4">
        <h5>${title}</h5>
        
        <ul>
          <li>Desenvolvido por ${developedBy}</li>
          <li>Adicionado no banco em ${createdAt.toDate()}</li>
        </ul>

        <button data-remove="${doc.id}" class="btn btn-danger btn-sm">Remover</button>
      </li>`

      return acc
    }, '')

    gamesList.innerHTML = gamesLis
  })
  .catch(console.log)

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
      .then(() => {
        const game = document.querySelector(`[data-id="${idRemoveButton}"]`)

        game.remove()
        console.log('Game removido')
      })
      .catch(console.log)
  }
})

const theLastOfUsRef = doc(db, 'games', 'olPaNH9f8ZFaH80iFRIl')

updateDoc(theLastOfUsRef, {
  title: 'The Last of Us Part II',
  developedBy: 'Valve'
})
  .then(() => console.log('Documento atualizado'))
  .catch(console.log())
// updateDoc atualiza se existe, cria nova propriedade se não existe 

const re3 = doc(db, 'games', 're')

setDoc(re3, {
  developedBy: 'Capcom'
}, { merge: true })
  .then(() => console.log('Documento atualizado'))
  .catch(console.log())
// setDoc sobrescreve se existe, cria se não existe
// para evitar sobrescrever, {merge: true}