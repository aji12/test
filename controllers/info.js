'use strict'

const bot = require('../core/telegram')
const Ban = require('../models/banmodel')
const Mod = require('../models/modsmodel')
const config = require('../data/config.json')
const moment = require('moment')
const fs = require('fs')
const utils = require('../core/utils')

bot.onText(/^[/!#]banlist$/, msg => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (err) throw err
    if (count > 0 || config.sudo.ID === msg.from.id) {
      let query = Ban.find({}).select({
        'userid': 1,
        'name': 1,
        '_id': 0
      })
      const arr = []

      query.exec((err, results) => {
        if (err) throw err
        results.forEach(result => {
          arr.push(result.name)
          arr.push(result.userid)
        })

        let fixed = arr.join('\n')

        fs.writeFile('banlist.txt', fixed, (err) => {
          if (err) throw err
          bot.sendDocument(config.log.CHANNEL, `banlist.txt`, {
            caption: `Generated on ${moment().format('YYYY-MM-DD HH.mm.ss')}`
          })
        })
      })
    }
  })
})

bot.onText(/^[/!#]globaladmins$/, msg => {
  let query = Mod.find({}).select({
    'userid': 1,
    'name': 1,
    '_id': 0
  })

  const arr = []

  query.exec((err, results) => {
    if (err) throw err
    results.forEach(result => {
      arr.push('• ' + utils.escapeHtml(result.name) + ' <code>[' + result.userid + ']</code>')
    })

    let fixed = arr.join('\n')

    bot.sendMessage(msg.chat.id, `<b>Global Admins</b>\n${fixed}`, {
      parse_mode: 'HTML'
    })
  })
})
