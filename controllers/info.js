'use strict'

const Ban = require('../models/banmodel')
const bot = require('../core/telegram')
const config = require('../data/config.json')
const fs = require('fs')
const Mod = require('../models/modsmodel')
const moment = require('moment')
const utils = require('../core/utils')

bot.onText(/^[/!#](.+)$/, (msg, match) => {
  switch (match[1]) {
    case 'banlist':
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

              const lang = utils.getUserLang(msg)

              bot.sendDocument(config.log.CHANNEL, `banlist.txt`, {
                caption: `${lang.info.dlg[0]} ${moment().format('LLLL')}`
              })
            })
          })
        }
      })
      break
    case 'globaladmins':
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
        const lang = utils.getUserLang(msg)

        bot.reply(msg, `<b>${lang.info.dlg[1]}</b>\n${fixed}`)
      })
      break
  }
})
