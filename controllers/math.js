'use strict'

const axios = require('axios')
const bot = require('../core/telegram')
const utils = require('../core/utils')

bot.onText(/^[/!#]calc (.+)/, (msg, match) => {
  const url = 'http://api.mathjs.org/v1/?expr=' + encodeURIComponent(`${match[1]}`)

  axios.get(url)
    .then(response => {
      if (response.status !== 200) {
        bot.sendMessage(msg.chat.id, `<code>Error ${response.status}: ${response.statusText}</code>`, utils.optionalParams(msg))
        return
      }
      bot.sendMessage(msg.chat.id, `<code>${response.data}</code>`, utils.optionalParams(msg))
    })
    .catch(error => {
      bot.sendMessage(msg.chat.id, `<code>${error}</code>`, utils.optionalParams(msg))
    })
})
