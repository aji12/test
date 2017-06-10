'use strict'

const bot = require('../core/telegram')
const request = require('request')
const utils = require('../core/utils')

bot.onText(/^[/!#]calc (.+)/, (msg, match) => {
  const url = 'http://api.mathjs.org/v1/?expr=' + encodeURIComponent(`${match[1]}`)

  request(url, (error, response, body) => {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Connection error.', utils.optionalParams(msg))
    } else {
      bot.sendMessage(msg.chat.id, `<code>${body}</code>`, utils.optionalParams(msg))
    }
  })
})
