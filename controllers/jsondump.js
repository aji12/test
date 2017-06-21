'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')
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
        const getDumpState = utils.db.getData(`/${msg.from.id}/dump`)

        if (getDumpState === 'on') {
          utils.db.push(`/${msg.from.id}/`, {dump: 'off'}, false)
          dumpState = 'off'
          jdmessage = `${jdlang.jsondump.dlg[0]}`
        } else {
          utils.db.push(`/${msg.from.id}/`, {dump: 'on'}, false)
          dumpState = 'on'
          jdmessage = `${jdlang.jsondump.dlg[1]}`
        }
      } catch (error) {
        utils.db.push(`/${msg.from.id}/`, {dump: 'on'}, false)
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
