'use strict';

const bot = require('../core/telegram');
const escapeHtml = require('escape-html');
const tgresolve = require('tg-resolve');
const config = require('../core/config');

function getUserProperties (msg, user) {
  let name = user.last_name ? user.first_name + ' ' + user.last_name : user.first_name;

  if (user.username) {
    name = '<b>' + escapeHtml(name) + '</b>\nID: <code>' + user.id + '</code>\nUsername: <a href="https://t.me/' + user.username + '">' + user.username + '</a>'
  } else {
    name = '<b>' + escapeHtml(name) + '</b>\nID: <code>' + user.id + '</code>'
  };
  bot.sendMessage(msg.chat.id, name, {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML'
  })
};

bot.onText(/^[/!#]id/, msg => {
  const cmd = msg.text.slice(-3)
  const uname = msg.text.slice(4)
  let user = msg.from

  if (msg.reply_to_message) user = msg.reply_to_message.from

  if (uname.match(/@\w+/)) {
    tgresolve(config.BOT_TOKEN, uname, (error, result) => {
      if (error) {
        console.log(error);
        bot.sendMessage(msg.chat.id, 'Unable to connect to @pwrtelegram.', {
          reply_to_message_id: msg.message_id
        })
      } else {
        if (result.title) result.first_name = result.title;
        getUserProperties(msg, result)
      }
    })
  } else if (msg.text === cmd) {
    getUserProperties(msg, user)
  } else {
    let help = 'Type /id, by post or reply.\nPost /id @username to resolve the @username\n\n<b>Disclaimer</b>: Resolving a username is using @pwrtelegram service, which is sometimes unreliable.'
    bot.sendMessage(msg.chat.id, help, {
      reply_to_message_id: msg.message_id,
      parse_mode: 'HTML'
    })
  }
});

bot.onText(/^[/!#]whoami$/, msg => {
  const uid = '[<code>' + msg.from.id + '</code>]'
  let name = msg.from.first_name
  let chat = ', and you are messaging <b>' + escapeHtml(msg.chat.title) + '</b> '

  if (msg.from.last_name) name += ' ' + msg.from.last_name

  if (msg.from.username) {
    name = '<b>' + escapeHtml(name) + '</b> (@' + msg.from.username + ') ' + uid
  } else {
    name = '<b>' + escapeHtml(name) + '</b> ' + uid
  };

  if (msg.chat.username) chat += '(@' + msg.chat.username + ')'

  if (msg.chat.type === 'private') {
    bot.getMe().then(me => {
      name += ', and you are messaging <b>' + escapeHtml(me.first_name) + '</b> (@' + me.username + ') [<code>' + me.id + '</code>]'

      bot.sendMessage(msg.chat.id, `You are ${name}.`, {parse_mode: 'HTML'})
    })
  } else {
    name += chat + ' [<code>' + msg.chat.id + '</code>]'

    bot.sendMessage(msg.chat.id, `You are ${name}.`, {
      reply_to_message_id: msg.message_id,
      parse_mode: 'HTML'
    })
  }
})
