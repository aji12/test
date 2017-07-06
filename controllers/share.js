'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')

bot.onText(/^[/!#]share (.*?) (.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  const url = encodeURIComponent(match[1])
  // Strip HTML tags
  const text = encodeURIComponent(match[2].replace(/<(?:.|\n)*?>/gm, ''))

  bot.sendMessage(msg.chat.id, match[2], {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [[{
        text: lang.share.dlg[0],
        url: `https://t.me/share/url?url=${url}&text=${text}`
      }]]
    }
  })
  utils.deleteMessage(msg.chat.id, msg.message_id)
})
