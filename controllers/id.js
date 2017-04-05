'use strict';

const bot = require('../core/telegram');
const escapeHtml = require('escape-html');

bot.onText(/^[\/!#]id$/, msg => {
  let user = msg.from;

  if (msg.reply_to_message) {
    user = msg.reply_to_message.from;
  };

  let name = user.last_name ? user.first_name + ' ' + user.last_name : user.first_name;

  if (user.username) {
    name = '<b>' + escapeHtml(name) + '</b>\nID: <code>' + user.id + '</code>\nUsername: <a href="https://t.me/' + user.username + '">' + user.username + '</a>';
  } else {
    name = '<b>' + escapeHtml(name) + '</b>\nID: <code>' + user.id + '</code>';
  };

  bot.sendMessage(msg.chat.id, name, {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
});

bot.onText(/^[\/!#]whoami$/, msg => {
  let name = msg.from.last_name ? msg.from.first_name + ' ' + msg.from.last_name : msg.from.first_name;
  let chat = ', and you are messaging <b>' + escapeHtml(msg.chat.title) + '</b> ';

  if (msg.from.username) {
    name = '<b>' + escapeHtml(name) + '</b> (@' + msg.from.username + ') [<code>' + msg.from.id + '</code>]';
  } else {
    name = '<b>' + escapeHtml(name) + '</b> [<code>' + msg.from.id + '</code>]';
  };

  if (msg.chat.username) {
    chat = chat + '(@' + msg.chat.username + ')';
  };

  if (msg.chat.id != msg.from.id) {
    name = name + chat + ' [<code>' + msg.chat.id + '</code>]';
  };

  bot.sendMessage(msg.chat.id, `You are ${name}.`, {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
});
