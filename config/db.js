const mongoose = require('mongoose')

const connectMongo = () => {
  mongoose.connect(process.env.DB_URL)

  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error: '))
  db.once('open', () => {
    console.log('Database connected')
  })
}

module.exports = connectMongo
