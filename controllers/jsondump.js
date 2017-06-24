'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

let db = utils.readJSONFile(config.database.DB)
let dumpState

function varDump (msg) {
  let jstring = JSON.stringify(msg, null, 2)
  jstring = jstring.substring(0, 4080)

  bot.sendMessage(msg.chat.id, `<pre>${jstring}</pre>`, { parse_mode: 'HTML' }).catch((error) => {
    if (error) { console.log('>> jsondump.js: Failed to send HTML message, resend using Markdown') }
    bot.sendMessage(msg.chat.id, '`' + jstring + '`', { parse_mode: 'Markdown' })
  })
}

bot.onText(/^[/!#]dump$/, (msg) => {
  if (msg.reply_to_message) {
    varDump(msg.reply_to_message)
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
      bot.sendMessage(msg.chat.id, jdmessage, utils.optionalParams(msg))
    }
  }
})

bot.on('message', (msg) => {
  if ((msg.chat.type === 'private') && (dumpState === 'on')) {
    varDump(msg)
  }
})
