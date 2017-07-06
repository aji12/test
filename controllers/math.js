'use strict'

const bot = require('../core/telegram')
const request = require('request')

bot.onText(/^[/!#](calc|math) (.+)/, (msg, match) => {
  const url = 'http://api.mathjs.org/v1/?expr=' + encodeURIComponent(`${match[2]}`)

  request(url, (error, response, body) => {
    if (error) {
      bot.reply(msg, error)
    } else {
      bot.reply(msg, `<code>${body}</code>`)
    }
  })
})
