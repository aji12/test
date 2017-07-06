'use strict'

const bot = require('../core/telegram')
const request = require('request')
const util = require('util')
const utils = require('../core/utils')

bot.onText(/^[/!#]ud (.+)/, (msg) => {
  const lang = utils.getUserLang(msg)
  const slang = msg.text.substr(4)
  const url = `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(slang)}`

  request(url, (error, response, body) => {
    if (error) {
      bot.reply(msg, `<code>${error.code}</code>`)
      return
    }

    const jud = JSON.parse(body)

    if (jud.result_type === 'no_results') {
      bot.reply(msg, util.format(lang.urbandictionary.dlg[0], slang))
      return
    }

    let output = jud.list[0].definition

    if (jud.list[0].example.length > 0) {
      output += `\n\n<i>${jud.list[0].example}</i>`
    }
    if (output.length > 4096) {
      const link = `\n<a href="${jud.list[0].permalink}">${lang.dialog.more}</a>`
      output = output.substr(0, 3996) + link
    }
    bot.reply(msg, output)
  })
})
