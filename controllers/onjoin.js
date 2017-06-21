'use strict'

const bot = require('../core/telegram')
const Ban = require('../models/banmodel')
const utils = require('../core/utils')

bot.on('new_chat_participant', msg => {
  Ban.count({
    userid: msg.new_chat_participant.id
  }, (err, count) => {
    if (err) { return console.log('>> onjoin.js: Ban count error') }
    if (count > 0) {
      const lang = utils.getUserLang(msg)
      const user = utils.buildUserName(msg.new_chat_participant)

      bot.kickChatMember(msg.chat.id, msg.new_chat_participant.id)
      bot.sendMessage(msg.chat.id, `${user} ${lang.onmessage.dlg[0]}`, utils.optionalParams(msg))
    }
  })
})

bot.on('new_chat_participant', msg => {
  bot.getMe().then(me => {
    if (msg.new_chat_participant.username === me.username) {
      bot.sendMessage(msg.chat.id, `<code>Hello there! I am a group administration bot, hit the button below to learn more about me!</code>`, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{
            text: `Start Me`,
            url: `https://telegram.me/${me.username}?start`
          }]]
        }
      })
    }
  })
})
