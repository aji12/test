'use strict'

const bot = require('../core/telegram')
const Ban = require('../models/banmodel')
const utils = require('../core/utils')

bot.on('message', msg => {
  Ban.count({
    userid: msg.from.id
  }, (err, count) => {
    if (err) {
      return console.log(`=> onmessage.js: ${err}`)
    }
    if (count > 0) {
      const lang = utils.getUserLang(msg)
      const user = utils.buildUserName(msg.from)

      bot.kickChatMember(msg.chat.id, msg.from.id)
      bot.reply(msg, `${user} ${lang.onmessage.dlg[0]}`)
    } else {
      // Some Random User Talking
    }
  })
})
