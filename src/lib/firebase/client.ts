import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import clientCredential from '../../../credentials/client'

firebase.initializeApp(clientCredential)

const auth = firebase.auth()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
const db = firebase.firestore()

export { auth, db, googleAuthProvider }
