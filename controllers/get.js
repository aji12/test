'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

function sendError (msg, error) {
  let err = JSON.parse(error.response.body)

  bot.reply(msg, `<code>${err.description}</code>`)
}

bot.onText(/^[/!#]get(.+) (.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  const CMD = `${match[1]}`
  const URL = `${match[2]}`

  if (!URL.match(/^http/)) {
    const user = utils.buildUserName(msg.from)

    if (msg.from.id !== config.sudo.ID) {
      bot.sendMessage(config.log.CHANNEL, `${user} ${lang.get.dlg[0]} ${URL}`, {parse_mode: 'HTML'})
      return
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
