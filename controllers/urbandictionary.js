'use strict'

const bot = require('../core/telegram')
const request = require('request')
const utils = require('../core/utils')

bot.onText(/^[/!#]ud (.+)/, (msg) => {
  const lang = utils.getUserLang(msg)
  const slang = msg.text.slice(4)
  const url = 'http://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(slang)

  request(url, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      return bot.sendMessage(msg.chat.id, `${lang.error[0]}`, utils.optionalParams(msg))
    }

    const jud = JSON.parse(body)

    if (jud.result_type === 'no_results') {
      return bot.sendMessage(msg.chat.id, `${lang.urbandictionary.dlg[0]} "${slang}".`, utils.optionalParams(msg))
    }

    let output = jud.list[0].definition

    if (jud.list[0].example.length > 0) {
      output += '\n\n<i>' + jud.list[0].example + '</i>'
    }

    bot.sendMessage(msg.chat.id, output, utils.optionalParams(msg))
  })
})
