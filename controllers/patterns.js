'use strict';

const bot = require('../core/telegram');
const config = require('../core/config');
const escapeHtml = require('escape-html');

bot.onText(/\/?s\/(.+)\/(.+)\/?/, (msg, match) => {
  if (!msg.reply_to_message) {return};
  if (msg.reply_to_message.from.id == config.BOT_ID) {return};

  let input = msg.reply_to_message.text;
  let regexp = `${match[1]}`;
  let replacement = `${match[2]}`;
  let re = new RegExp(regexp, "g");
  let output = input.replace(re, `${replacement}`);
  output = (escapeHtml(output).length >= 4000) ? escapeHtml(output).slice(0, 4000) : escapeHtml(output);

  bot.sendMessage(msg.chat.id, `<b>Did you mean:</b>\n"${output}"`, {reply_to_message_id: msg.reply_to_message.message_id, disable_web_page_preview: 'true', parse_mode: 'HTML'});
});
