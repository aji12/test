'use strict';

const bot = require('../core/telegram');
const escapeHtml = require('escape-html');
const tgresolve = require("tg-resolve");
const config = require('../core/config');

function getUserProperties(msg, user) {
  let name = user.last_name ? user.first_name + ' ' + user.last_name : user.first_name;

  if (user.username) {
    name = '<b>' + escapeHtml(name) + '</b>\nID: <code>' + user.id + '</code>\nUsername: <a href="https://t.me/' + user.username + '">' + user.username + '</a>';
  } else {
    name = '<b>' + escapeHtml(name) + '</b>\nID: <code>' + user.id + '</code>';
  };
  bot.sendMessage(msg.chat.id, name, {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML'
  });
}

bot.onText(/^[\/!#]id/, msg => {
  let user = msg.from;
  let uname = msg.text.slice(4);

  if (msg.reply_to_message) {
    user = msg.reply_to_message.from;
  };

  if (uname.match(/@\w+/)) {
    tgresolve(config.BOT_TOKEN, uname, (error, result) => {
      getUserProperties(msg, result);
    });
  } else {
    getUserProperties(msg, user);
  }
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

  if (msg.chat.type == 'private') {
    console.log(msg.chat.type);
    bot.getMe().then(me => {
      let user = name + ', and you are messaging <b>' + escapeHtml(me.first_name) + '</b> (@' + me.username + ') [<code>' + me.id + '</code>]';
      bot.sendMessage(msg.chat.id, `You are ${user}.`, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'HTML'
      });
    });
  } else {
    if (msg.chat.username) {
      name = name + chat + '(@' + msg.chat.username + ')';
    };
    bot.sendMessage(msg.chat.id, `You are ${name}.`, {
      reply_to_message_id: msg.message_id,
      parse_mode: 'HTML'
    });
  }
});
