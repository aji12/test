'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

let db = utils.readJSONFile(config.database.DB)
let dumpState

bot.onText(/^[/!#]dump$/, (msg) => {
  if (msg.reply_to_message) {
    bot.sendMonospace(msg.chat.id, msg.reply_to_message, 2)
  } else {
    if (msg.chat.type === 'private') {
      const jdlang = utils.getUserLang(msg)
      let jdmessage

      try {
        const getDumpState = db[msg.from.id].dump

        if (getDumpState === 'on') {
          db[msg.from.id].dump = 'off'
          dumpState = 'off'
          jdmessage = `${jdlang.jsondump.dlg[0]}`
        } else {
          db[msg.from.id].dump = 'on'
          dumpState = 'on'
          jdmessage = `${jdlang.jsondump.dlg[1]}`
        }
        utils.saveToFile(config.database.DB, db)
      } catch (error) {
        db[msg.from.id].dump = 'on'
        utils.saveToFile(config.database.DB, db)
        dumpState = 'on'
        jdmessage = `${jdlang.jsondump.dlg[1]}`
      }
      bot.reply(msg, jdmessage)
    }
  }
})

bot.on('message', (msg) => {
  if ((msg.chat.type === 'private') && (dumpState === 'on')) {
    bot.sendMonospace(msg.chat.id, msg, 2)
  }
})
