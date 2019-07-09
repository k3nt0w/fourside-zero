import React, { Component } from 'react'
import 'isomorphic-unfetch'
import { auth, googleAuthProvider } from '../lib/firebase/client'

interface Props {
  user?: any
  value?: string
  messages?: string
  unsubscribe?: any
}

export default class Auth extends Component<Props> {
  static async getInitialProps({ req }: any) {
    const user = req && req.session ? req.session.decodedToken : null
    // don't fetch anything from firebase if the user is not found
    // const snap = user && await req.firebaseServer.database().ref('messages').once('value')
    // const messages = snap && snap.val()
    const messages = null
    return { user, messages }
  }

  constructor(props: any) {
    super(props)
    this.state = {
      user: this.props.user,
      value: '',
      messages: this.props.messages
    }

    // this.addDbListener = this.addDbListener.bind(this)
    // this.removeDbListener = this.removeDbListener.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount(this: any) {
    // if (this.state.user) this.addDbListener()
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        this.setState({ user: user })
        return user.getIdToken().then((token: any) => {
          // eslint-disable-next-line no-undef
          return fetch('/api/login', {
            method: 'POST',
            // eslint-disable-next-line no-undef
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin',
            body: JSON.stringify({ token })
          })
        })
        // .then(() => this.addDbListener())
      } else {
        this.setState({ user: null })
        // eslint-disable-next-line no-undef
        fetch('/api/logout', {
          method: 'POST',
          credentials: 'same-origin'
        })
        // .then(() => this.removeDbListener())
      }
    })
  }

  // addDbListener() {
  //   var db = firebase.firestore()
  //   // Disable deprecated features
  //   db.settings({
  //     timestampsInSnapshots: true
  //   })
  //   let unsubscribe = db.collection('messages').onSnapshot(
  //     (querySnapshot: any) => {
  //       var messages = {}
  //       querySnapshot.forEach(function(doc: any) {
  //         messages = {
  //           ...messages,
  //           ...JSON.parse(`{"${doc.id}": ${doc.data()}}`)
  //         }
  //       })
  //       if (messages) this.setState({ messages })
  //     },
  //     (error: any) => {
  //       console.error(error)
  //     }
  //   )
  //   this.setState({ unsubscribe })
  // }

  // removeDbListener(this: any) {
  //   // firebase.database().ref('messages').off()
  //   if (this.state.unsubscribe) {
  //     this.state.unsubscribe()
  //   }
  // }

  handleChange(event: any) {
    this.setState({ value: event.target.value })
  }

  handleSubmit(this: any, event: any) {
    event.preventDefault()
    var db = firebase.firestore()
    // Disable deprecated features
    db.settings({
      timestampsInSnapshots: true
    })
    const date = new Date().getTime()
    db.collection('messages')
      .doc(`${date}`)
      .set({
        id: date,
        text: this.state.value
      })
    this.setState({ value: '' })
  }

  handleLogin() {
    auth.signInWithPopup(googleAuthProvider)
  }

  handleLogout() {
    auth.signOut()
  }

  render(this: any) {
    const { user, value, messages } = this.state

    return (
      <div>
        {user ? (
          <>
            <h1>This is a certified page.</h1>
            <button onClick={this.handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={this.handleLogin}>Login</button>
        )}
        {user && (
          <div>
            <form onSubmit={this.handleSubmit}>
              <input
                type={'text'}
                onChange={this.handleChange}
                placeholder={'add message...'}
                value={value}
              />
            </form>
            <ul>
              {messages &&
                Object.keys(messages).map(key => (
                  <li key={key}>{messages[key].text}</li>
                ))}
            </ul>
          </div>
        )}
      </div>
    )
  }
}
