'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')

function sendError (msg, error) {
  let err = JSON.parse(error.response.body)

  bot.sendMessage(msg.chat.id, `<code>${err.description}</code>`, {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML'
  })
};

bot.onText(/^[/!#](.+) (.+)/, (msg, match) => {
  const CMD = `${match[1]}`
  const URL = `${match[2]}`

  if (msg.from.id != config.SUDO) {
    if (!URL.match(/^http/)) {
      return console.log('Blocking an attempt to get local files!')
    }
  }

  if (CMD === 'getphoto') {
    bot.sendPhoto(msg.chat.id, URL).catch((error) => {
      sendError(msg, error)
    })
  }
  if (CMD === 'getvoice') {
    bot.sendVoice(msg.chat.id, URL).catch((error) => {
      sendError(msg, error)
    })
  }
  if (CMD === 'getaudio') {
    bot.sendAudio(msg.chat.id, URL).catch((error) => {
      sendError(msg, error)
    })
  }
  if (CMD === 'getvideo') {
    bot.sendVideo(msg.chat.id, URL).catch((error) => {
      sendError(msg, error)
    })
  }
  if (CMD === 'getdoc') {
    bot.sendDocument(msg.chat.id, URL).catch((error) => {
      sendError(msg, error)
    })
  }
})
