const mongoose = require('mongoose')
const colors = require('colors')

// mongoDB connection
dbConnection = () => mongoose.connect(process.env.DB_URI)
.then((db) => {
  console.log(`${"-".repeat(68)}\nDB Connection Successful: ${db.connection.host}\n${"-".repeat(68)}`.cyan)
})

module.exports = dbConnection