'use strict'

const bot = require('../core/telegram')

bot.onText(/^[/!#]repost (.+)/, (msg, match) => {
  if (msg.reply_to_message) {
    const message = msg.reply_to_message
    let [chatId, ...captext] = `${match[1]}`.split(' ')
    const CAPTEXT = {caption: captext.join(' ')}

    if (message.photo) {
      bot.sendPhoto(chatId, message.photo[0].file_id, CAPTEXT)
    }
    if (message.voice) {
      bot.sendVoice(chatId, message.voice.file_id, CAPTEXT)
    }
    if (message.audio) {
      bot.sendAudio(chatId, message.audio.file_id, CAPTEXT)
    }
    if (message.video) {
      bot.sendVideo(chatId, message.video.file_id, CAPTEXT)
    }
    if (message.document) {
      bot.sendDocument(chatId, message.document.file_id, CAPTEXT)
    }
    if (message.text) {
      bot.sendMessage(chatId, message.text, {
        parse_mode: 'HTML'
      })
    }
  }
})
