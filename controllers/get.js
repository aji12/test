'use strict';

const bot = require('../core/telegram');

function sendError(msg, error) {
  let err = JSON.parse(error.response.body);
  bot.sendMessage(msg.chat.id, `<code>${err.description}</code>`, {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
};

bot.onText(/[\/!#](.+) (.+)/, (msg, match) => {
  if (`${match[1]}` == 'getphoto') {
    bot.sendPhoto(msg.chat.id, `${match[2]}`).catch((error) => {
      sendError(msg, error);
    });
  }
  if (`${match[1]}` == 'getvoice') {
    bot.sendVoice(msg.chat.id, `${match[2]}`).catch((error) => {
      sendError(msg, error);
    });
  }
  if (`${match[1]}` == 'getaudio') {
    bot.sendAudio(msg.chat.id, `${match[2]}`).catch((error) => {
      sendError(msg, error);
    });
  }
  if (`${match[1]}` == 'getvideo') {
    bot.sendVideo(msg.chat.id, `${match[2]}`).catch((error) => {
      sendError(msg, error);
    });
  }
  if (`${match[1]}` == 'getdoc') {
    bot.sendDocument(msg.chat.id, `${match[2]}`).catch((error) => {
      sendError(msg, error);
    });
  }
});
