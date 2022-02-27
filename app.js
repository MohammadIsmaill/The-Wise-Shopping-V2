if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const cluster = require('cluster')
const { cpus } = require('os')

const express = require('express')
const app = express()
const path = require('path')
const User = require('./models/user')
const LocalStrategy = require('passport-local')
const passport = require('passport')
const ExpressError = require('./utils/ExpressError')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const productRoutes = require('./routes/products')
const shopRoutes = require('./routes/shops')
const userRoutes = require('./routes/users')
const connectMongo = require('./config/db')
const sessionConfig = require('./config/session')
const mongoSanitize = require('express-mongo-sanitize')
// const cors = require('cors')
connectMongo()
if (cluster.isMaster) {
  const numberCPUs = cpus().length
  for (let i = 0; i < numberCPUs; i++) {
    cluster.fork()
  }
} else {
  app.engine('ejs', ejsMate)
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))

  app.use(express.urlencoded({ extended: true }))
  // app.use(fileUpload())
  app.use(methodOverride('_method'))
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(
    mongoSanitize({
      replaceWith: '_',
    })
  )
  //comment s8eere bas la ya3mel commit
  app.use(session(sessionConfig))
  app.use(flash())

  //fix contentSecurityPolicy later
  // app.use(helmet({ contentSecurityPolicy: false }))

  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy(User.authenticate()))
  passport.serializeUser(User.serializeUser())
  passport.deserializeUser(User.deserializeUser())

  app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
  })
  app.use('/', userRoutes)
  app.use('/users/:usersId/shops', shopRoutes)
  app.use('/users/:usersId/shops/:shopsId/products', productRoutes)

  app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
  })

  app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Oh No, something went wrong' } = err
    res.status(statusCode).render('error', { err })
  })
  app.listen(process.env.PORT || 3000)
}
