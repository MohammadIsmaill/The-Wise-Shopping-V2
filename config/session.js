const MongoStore = require('connect-mongo')

const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: process.env.SECRET,
  },
})

store.on('error', function (e) {
  console.log('SESSION STORE ERROR', e)
})
const sessionConfig = {
  name: 'session',
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}
module.exports = sessionConfig
