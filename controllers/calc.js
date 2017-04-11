'use strict'

const bot = require('../core/telegram')
const request = require('request')

bot.onText(/^[/!#]calc (.+)/, (msg, match) => {
  let url = 'http://api.mathjs.org/v1/?expr=' + encodeURIComponent(`${match[1]}`)

  request(url, function (error, response, body) {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Connection error.', {reply_to_message_id: msg.message_id})
    } else {
      bot.sendMessage(msg.chat.id, `<code>${body}</code>`, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'HTML'
      })
    }
  })
})
