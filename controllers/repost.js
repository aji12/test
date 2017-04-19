'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')
const utils = require('../core/utils')

bot.onText(/^[/!#]repost (.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  const target = `${match[1]}`.replace(/ .+/, '')
  const text = msg.text.replace(/^\/repost [-@]?\w+/, '')

  if ((msg.from.id != config.SUDO) && (!target.match(/^-|@tgramindo/))) {
    bot.sendMessage(msg.from.id, `${lang.repostdenied}`, utils.optionalParams(msg))
    return
  }

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
