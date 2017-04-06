'use strict';

const bot = require('../core/telegram');
const Ban = require('../models/banmodel');
const escapeHtml = require('escape-html');

bot.on('new_chat_participant', msg => {
  Ban.count({
    userid: msg.new_chat_participant.id
  }, (err, count) => {
    if (count > 0) {
      let user = escapeHtml(msg.new_chat_participant.first_name);
      bot.kickChatMember(msg.chat.id, msg.new_chat_participant.id);
      bot.sendMessage(msg.chat.id, `<b>${user}</b> is globally banned!`, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'HTML'}
      );
    }
  });
});

bot.on('new_chat_participant', msg => {
  bot.getMe().then(me => {
    if (msg.new_chat_participant.username == me.username) {
      bot.sendMessage(msg.chat.id, `<code>Hello there! I am a group administration bot, hit the button below to learn more about me!</code>`, {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{
            text: `Start Me`,
            url: `https://telegram.me/${me.username}?start`
          }]]
        }
      });
    }
  });
});
