'use strict';

const bot = require('../core/telegram');
const Ban = require('../models/banmodel');
const escapeHtml = require('escape-html');

bot.on('message', msg => {
  Ban.count({
    userid: msg.from.id
  }, (err, count) => {
    if (count > 0) {
      let user = escapeHtml(msg.from.first_name);
      bot.kickChatMember(msg.chat.id, msg.from.id);
      bot.sendMessage(msg.chat.id, `<b>${user}</b> is globally banned!`, {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
    } else {
      // Some Random User Talking
    }
  });
});
