'use strict'

const axios = require('axios')
const bot = require('../core/telegram')
const utils = require('../core/utils')

bot.onText(/^[/!#]ud (.+)/, (msg) => {
  const lang = utils.getUserLang(msg)
  const slang = msg.text.slice(4)
  const url = 'http://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(slang)

  axios.get(url)
    .then(response => {
      if (response.status !== 200) {
        bot.sendMessage(msg.chat.id, `<code>Error ${response.status}: ${response.statusText}</code>`, utils.optionalParams(msg))
        return
      }

      const udata = response.data

      if (udata.result_type === 'no_results') {
        bot.sendMessage(msg.chat.id, `${lang.urbandictionary.dlg[0]} "${slang}".`, utils.optionalParams(msg))
        return
      }

      let output = `<b>${udata.list[0].word}</b>\n${udata.list[0].definition}`

      if (udata.list[0].example.length > 0) {
        output += '\n\n<i>' + udata.list[0].example + '</i>'
      }

      bot.sendMessage(msg.chat.id, output, utils.optionalParams(msg))
    })
    .catch(error => {
      bot.sendMessage(msg.chat.id, `<code>${error}</code>`, utils.optionalParams(msg))
    })
})
