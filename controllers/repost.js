'use strict';

const bot = require('../core/telegram');

bot.onText(/^[\/!#]repost (.+)/, (msg, match) => {
  if (msg.reply_to_message) {
    let message = msg.reply_to_message;
    let [chat_id, ...captext] = `${match[1]}`.split(' ');

    if (message.photo) {
      bot.sendPhoto(chat_id, message.photo[0].file_id, {
        caption: captext.join(' ')
      });
    }
    if (message.voice) {
      bot.sendVoice(chat_id, message.voice.file_id, {
        caption: captext.join(' ')
      });
    }
    if (message.audio) {
      bot.sendAudio(chat_id, message.audio.file_id, {
        caption: captext.join(' ')
      });
    }
    if (message.video) {
      bot.sendVideo(chat_id, message.video.file_id, {
        caption: captext.join(' ')
      });
    }
    if (message.document) {
      bot.sendDocument(chat_id, message.document.file_id, {
        caption: captext.join(' ')
      });
    }
    if (message.text) {
      bot.sendMessage(chat_id, message.text, {
        parse_mode: 'HTML'
      });
    }
  }
});
