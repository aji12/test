'use strict';

const bot = require('../core/telegram');
const request = require('request');
const escapeHtml = require('escape-html');

bot.onText(/[\/!#]calc (.+)/, (msg, match) => {
  let url = 'http://api.mathjs.org/v1/?expr=' + escapeHtml(`${match[1]}`);

  request(url, function(error, response, body) {
    bot.sendMessage(msg.chat.id, `<code>${body}</code>`, {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
  });
});
