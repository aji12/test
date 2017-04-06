'use strict';

const bot = require('../core/telegram');

bot.onText(/^[\/!#]dump$/, msg => {
  if (msg.reply_to_message) {
    let msgDump = JSON.stringify(msg.reply_to_message, null, 2);

    bot.sendMessage(msg.chat.id, `<code>${msgDump}</code>`, {
      parse_mode: 'HTML'
    });
  }
});
