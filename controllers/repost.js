'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

bot.onText(/^[/!#]repost (.+)/, (msg, match) => {
  const target = `${match[1]}`.replace(/ .+/, '')
  const lang = utils.getUserLang(msg)

  if ((!target.match(/^-/)) && (msg.from.id !== config.sudo.ID)) {
    bot.sendMessage(msg.from.id, `${lang.repost.dlg[0]}`, utils.optionalParams(msg))
    return
  }

  bot.getChatAdministrators(target).then(admins => admins.some(child => child.user.id === msg.from.id)).then(isAdmin => {
    if ((msg.from.id !== config.sudo.ID) && !(isAdmin)) {
      return console.log('Not a sudoer or groups owner!')
    }

    const text = msg.text.replace(/^\/repost [-@]?\w+/, '')

    if (msg.reply_to_message) {
      const message = msg.reply_to_message
      const CAPTEXT = {caption: text}

      if (text) {
        if (text > 199) CAPTEXT.caption.substring(0, 199)
      }

      if (message.photo) {
        bot.sendPhoto(target, message.photo[0].file_id, CAPTEXT).catch((error) => {
          utils.sendError(msg, error)
        })
      }
      if (message.audio) {
        bot.sendAudio(target, message.audio.file_id, CAPTEXT).catch((error) => {
          utils.sendError(msg, error)
        })
      }
      if (message.document) {
        bot.sendDocument(target, message.document.file_id, CAPTEXT).catch((error) => {
          utils.sendError(msg, error)
        })
      }
      if (message.sticker) {
        bot.sendSticker(target, message.sticker.file_id).catch((error) => {
          utils.sendError(msg, error)
        })
      }
      if (message.video) {
        bot.sendVideo(target, message.video.file_id, CAPTEXT).catch((error) => {
          utils.sendError(msg, error)
        })
      }
      if (message.voice) {
        bot.sendVoice(target, message.voice.file_id, CAPTEXT).catch((error) => {
          utils.sendError(msg, error)
        })
      }
      if (message.location) {
        bot.sendLocation(target, message.location.latitude, message.location.longitude).catch((error) => {
          utils.sendError(msg, error)
        })
      }
      if (message.contact) {
        bot.sendVenue(target, message.contact.phone_number, message.contact.first_name).catch((error) => {
          utils.sendError(msg, error)
        })
      }
      if (message.text) {
        bot.sendMessage(target, message.text, {
          parse_mode: 'HTML'
        }).catch((error) => {
          utils.sendError(msg, error)
        })
      }
    } else {
      if (!text) { return }
      bot.sendMessage(target, text, {parse_mode: 'HTML'}).catch((error) => {
        utils.sendError(msg, error)
      })
    }
  })
})
