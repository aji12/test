'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')
let dumpState

function varDump (msg) {
  let msgDump = JSON.stringify(msg, null, 2)

  bot.sendMessage(msg.chat.id, `<pre>${msgDump.substring(0, 4080)}</pre>`, {
    parse_mode: 'HTML'
  })
}

bot.onText(/^[/!#]dump$/, (msg) => {
  if (msg.reply_to_message) {
    varDump(msg.reply_to_message)
  } else {
    if (msg.chat.type === 'private') {
      try {
        const getDumpState = utils.db.getData(`/${msg.from.id}/dump`)
        const jdlang = utils.getUserLang(msg)

        switch (getDumpState) {
          case 'on':
            utils.db.push(`/${msg.from.id}/`, {dump: 'off'}, false)
            dumpState = 'off'
            bot.sendMessage(msg.chat.id, `${jdlang.jsondump.dlg[0]}`, utils.optionalParams(msg))
            break
          case 'off':
            utils.db.push(`/${msg.from.id}/`, {dump: 'on'}, false)
            dumpState = 'on'
            bot.sendMessage(msg.chat.id, `${jdlang.jsondump.dlg[1]}`, utils.optionalParams(msg))
            break
          default:
            utils.db.push(`/${msg.from.id}/`, {dump: 'on'}, false)
            break
        }
      } catch (error) {
        utils.db.push(`/${msg.from.id}/`, {dump: 'on'}, false)
        console.error(error.message)
      }
    }
  }
})

bot.on('message', (msg) => {
  if ((msg.chat.type === 'private') && (dumpState === 'on')) {
    varDump(msg)
  }
})
