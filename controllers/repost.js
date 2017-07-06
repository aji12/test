'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

bot.onText(/^[/!#]repost (.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  const target = match[1].match(/^-?\d+ /)
  let chat = String(msg.chat.id)
  let text = match[1]

  if (target) {
    chat = target[0]
    text = match[1].replace(/^-?\d+ /, '')
  }
  if (!chat.match(/^-100/) && msg.from.id !== config.sudo.ID) {
    bot.reply(msg, `${lang.repost.dlg[0]}`)
    return
  }

  bot.getChatAdministrators(chat)
    .catch(error => {
      bot.reply(msg, `<code>${error.response.body.description}</code>`)
    })
    .then(admins => {
      if (!admins) { return }

      admins.forEach(admin => {
        if (admin.user.id !== msg.from.id) { return }

        const CAPTEXT = {caption: text}
        const message = (msg.reply_to_message) ? msg.reply_to_message : msg

        if (text && text > 199) CAPTEXT.caption.substr(0, 199)

        if (message.photo) {
          bot.sendPhoto(chat, message.photo[0].file_id, CAPTEXT).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
        if (message.audio) {
          bot.sendAudio(chat, message.audio.file_id, CAPTEXT).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
        if (message.document) {
          bot.sendDocument(chat, message.document.file_id, CAPTEXT).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
        if (message.sticker) {
          bot.sendSticker(chat, message.sticker.file_id).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
        if (message.video) {
          bot.sendVideo(chat, message.video.file_id, CAPTEXT).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
        if (message.voice) {
          bot.sendVoice(chat, message.voice.file_id, CAPTEXT).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
        if (message.location) {
          bot.sendLocation(chat, message.location.latitude, message.location.longitude).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
        if (message.contact) {
          bot.sendVenue(chat, message.contact.phone_number, message.contact.first_name).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
        if (message.text) {
          bot.sendMessage(chat, text, {
            parse_mode: 'HTML'
          }).catch((error) => {
            bot.reply(msg, `<code>${error.response.body.description}</code>`)
          })
        }
      })
      utils.deleteMessage(msg.chat.id, msg.message_id)
    })
})
