const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const next = require('next')
const admin = require('firebase-admin')

const port = !!process.env.PORT && parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const cre = require('../../credentials/server')

const firebase = admin.initializeApp(
  {
    credential: admin.credential.cert(require('../../credentials/server')),
    databaseURL: '' // TODO database URL goes here
  },
  'server'
)

app.prepare().then(() => {
  const server = express()

  server.use(bodyParser.json())
  server.use(
    session({
      secret: 'geheimnis',
      saveUninitialized: true,
      store: new FileStore({ path: '/tmp/sessions', secret: 'geheimnis' }),
      resave: false,
      rolling: true,
      httpOnly: true,
      cookie: { maxAge: 604800000 } // week
    })
  )

  server.use((req: any, _: unknown, next: any) => {
    req.firebaseServer = firebase
    next()
  })

  server.post('/api/login', (req: any, res: any) => {
    if (!req.body) return res.sendStatus(400)

    const token = req.body.token
    firebase
      .auth()
      .verifyIdToken(token)
      .then((decodedToken: any) => {
        req.session.decodedToken = decodedToken
        return decodedToken
      })
      .then((decodedToken: any) => res.json({ status: true, decodedToken }))
      .catch((error: any) => res.json({ error }))
  })

  server.post('/api/logout', (req: any, res: any) => {
    req.session.decodedToken = null
    res.json({ status: true })
  })

  server.get('*', (req: any, res: any) => {
    return handle(req, res)
  })

  server.listen(port, (err: any) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
