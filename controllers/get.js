'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')

function sendError (msg, error) {
  let err = JSON.parse(error.response.body)

  bot.sendMessage(msg.chat.id, `<code>${err.description}</code>`, {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML'
  })
};

bot.onText(/^[/!#]get(.+) (.+)/, (msg, match) => {
  const CMD = `${match[1]}`
  const URL = `${match[2]}`

  if (!URL.match(/^http/)) {
    if (msg.from.id !== config.sudo.ID) {
      return console.log('Blocking an attempt to get local files!')
    }
  }

  switch (CMD) {
    case 'photo':
      bot.sendPhoto(msg.chat.id, URL).catch((error) => {
        sendError(msg, error)
      })
      break
    case 'voice':
      bot.sendVoice(msg.chat.id, URL).catch((error) => {
        sendError(msg, error)
      })
      break
    case 'audio':
      bot.sendAudio(msg.chat.id, URL).catch((error) => {
        sendError(msg, error)
      })
      break
    case 'video':
      bot.sendVideo(msg.chat.id, URL).catch((error) => {
        sendError(msg, error)
      })
      break
    case 'doc':
      bot.sendDocument(msg.chat.id, URL).catch((error) => {
        sendError(msg, error)
      })
      break
  }
})
