'use strict'

const Ban = require('../models/banmodel')
const config = require('../data/config.json')
const cron = require('node-cron')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect(config.mongo.URI)

const db = mongoose.connection

db.on('error', console.error)
db.once('open', () => {
  console.log('>> mongo.js: Connected To MongoDB')
})

module.exports = db

// cron.schedule('* 3 * * *', () => {
  // const sync = mongoose.createConnection('mongodb://sync:sync@ds029665.mlab.com:29665/banhammer')
  // const remoteList = sync.model('Ban')

  // remoteList.find({}, (err, docs) => {
    // Ban.collection.insert(docs, status)
  // })

  // function status (err, result) {
    // if (err && err.code == 11000) {
      // console.log(`>> mongo.js: ${err}`)
    // } else {
      // console.info('>> mongo.js: Sync Successful!')
    // }
  // }
// })
