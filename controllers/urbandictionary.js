'use strict'

const bot = require('../core/telegram')
const request = require('request')

bot.onText(/^[/!#]ud (.+)/, (msg) => {
  const slang = msg.text.slice(4)
  const url = 'http://api.urbandictionary.com/v0/define?term=' + encodeURIComponent(slang)
  const opts = {disable_web_page_preview: 'true', parse_mode: 'HTML'}

  request(url, (error, response, body) => {
    opts.reply_to_message_id = msg.message_id
    if (error || response.statusCode !== 200) {
      bot.sendMessage(msg.chat.id, 'Connection error.', opts)
      return
    }

    const jud = JSON.parse(body)

    if (jud.result_type === 'no_results') {
      bot.sendMessage(msg.chat.id, 'There aren\'t any definitions for "' + `${slang}` + '" yet.', opts)
      return
    }

    let output = jud.list[0].definition

    if (jud.list[0].example.length > 0) {
      output += '\n\n<i>' + jud.list[0].example + '</i>'
    }

    bot.sendMessage(msg.chat.id, output, opts)
  })
})
