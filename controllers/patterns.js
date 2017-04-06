'use strict';

const bot = require('../core/telegram');
const config = require('../core/config');
const escapeHtml = require('escape-html');

bot.onText(/^\/?s\/(.+)\/(.+)\/?/, (msg, match) => {
  // Only process a replied message
  if (!msg.reply_to_message) {return};
  // Instead of creating a function to avoid recursive process, just avoid bot post
  if (msg.reply_to_message.from.id == config.BOT_ID) {return};

  let input = msg.reply_to_message.text;
  let regexp = `${match[1]}`;
  let replacement = `${match[2]}`;
  let re = new RegExp(regexp, "g");
  let output = input.replace(re, `${replacement}`);

  // 4096 is the limit characters count of Telegram post
  if (escapeHtml(output).length >= 4000) {
    output = escapeHtml(output).slice(0, 4000);
  } else {
    output = escapeHtml(output);
  };

  bot.sendMessage(msg.chat.id, `<b>Did you mean:</b>\n"${output}"`, {
    reply_to_message_id: msg.reply_to_message.message_id,
    disable_web_page_preview: 'true',
    parse_mode: 'HTML'
  });
});
