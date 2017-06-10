'use strict'

const fs = require('fs')
const JsonDB = require('node-json-db')
const scripts = ['controllers', 'core', 'models']
let db = new JsonDB('./data/config.json', false, true)

for (let i = 0; i < scripts.length; i++) {
  db.delete("/plugins")

  fs.readdir(`./${scripts[i]}/`, (err, files) => {
    if (err) {
      return console.error(err)
    }

    files.forEach((file) => {
      if (i === 0) {
        db.push("/plugins[]", file.replace(/.js/, ''))
      }
      console.log(`Loading ${file}`)
      require(`./${scripts[i]}/${file}`)
    })

    db.save()
  })
}
