'use strict';

const moment = require('moment');
const bot = require('../core/telegram');
const tgresolve = require("tg-resolve");
const config = require('../core/config');
const Ban = require('../models/banmodel');
const Mod = require('../models/modsmodel');
const escapeHtml = require('escape-html');

let time = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;

bot.onText(/^[\/!#]hammer$/, msg => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (count > 0 || config.SUDO == msg.from.id) {
      bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id);

      let newBan = new Ban({
        userid: msg.reply_to_message.from.id,
        name: msg.reply_to_message.from.first_name
      });
      newBan.save(err => {
        let user = escapeHtml(msg.reply_to_message.from.first_name);
        if (err && err.code === 11000) {
          bot.sendMessage(msg.chat.id, `<b>${user}</b> is already globally banned.`, {
            parse_mode: 'HTML'
          });
        } else {
          let user = escapeHtml(msg.from.first_name);

          bot.sendMessage(msg.chat.id, `<b>${user}</b> has been globally banned.`, {
            parse_mode: 'HTML'
          });
          bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> has been globally banned.\nBy: _${user}_\n${time}`, {
            parse_mode: 'HTML'
          });
        }
      });
    }
  });
});

bot.onText(/^[\/!#]unhammer$/, msg => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (count > 0 || config.SUDO == msg.from.id) {
      bot.unbanChatMember(msg.chat.id, msg.reply_to_message.from.id);
      Ban.remove({
        userid: msg.reply_to_message.from.id
      }, () => {
        // Globally Unhammered
      });

      let user = escapeHtml(msg.reply_to_message.from.first_name);

      bot.sendMessage(msg.chat.id, `<b>${user}</b> has been globally unbanned.`, {
        parse_mode: 'HTML'
      });
      bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> has been globally unbanned.\nBy: _${msg.from.first_name}_\n${time}`, {
        parse_mode: 'HTML'
      });
    }
  });
});

bot.onText(/^[\/!#]hammer (\d+)/, (msg, match) => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (count > 0 || config.SUDO == msg.from.id) {

      let newBan = new Ban({
        userid: match[1]
      });
      newBan.save(err => {
        let user = escapeHtml(msg.from.first_name);

        if (err && err.code === 11000) {
          bot.sendMessage(msg.chat.id, `<b>${match[1]}</b> is already globally banned.`, {
            parse_mode: 'HTML'
          });
        } else {
          bot.sendMessage(msg.chat.id, `<b>${match[1]}</b> has been globally banned.`, {
            parse_mode: 'HTML'
          });
          bot.sendMessage(config.LOG_CHANNEL, `<code>(${match[1]})</code> has been globally banned.\nBy: <i>${user}</i>\n${time}`, {
            parse_mode: 'HTML'
          });
        }
      });
    }
  });
});

bot.onText(/^[\/!#]unhammer (\d+)/, (msg, match) => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (count > 0 || config.SUDO == msg.from.id) {
      Ban.remove({
        userid: match[1]
      }, (err, cb) => {
        if (cb.result.n == 0) {
          console.log('User Not Found!')
        }
      });
      let user = escapeHtml(msg.from.first_name);

      bot.sendMessage(msg.chat.id, `<b>${match[1]}</b> has been globally unbanned.`, {
        parse_mode: 'HTML'
      });
      bot.sendMessage(config.LOG_CHANNEL, `<i>(${match[1]})</i> has been globally unbanned.\nBy: <i>${user}</i>\n${time}`, {
        parse_mode: 'HTML'
      });
    }
  });
});

bot.onText(/^[\/!#]hammer (@\w+)/, (msg, match) => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (count > 0 || config.SUDO == msg.from.id) {
      tgresolve(config.BOT_TOKEN, match[1], (error, result) => {
        let newBan = new Ban({
          userid: result.id,
        });
          console.log(result)
        newBan.save(err => {
          let user = escapeHtml(result.first_name);

          if (err && err.code === 11000) {
            bot.sendMessage(msg.chat.id, `<b>${user}</b> is already globally banned.`, {
              parse_mode: 'HTML'
            });
          } else {
            bot.sendMessage(msg.chat.id, `<b>${user}</b> has been globally banned.`, {
              parse_mode: 'HTML'
            });
            bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> <code>(${result.id})</code> has been globally banned.\nBy: <i>${msg.from.first_name}</i>\n${time}`, {
              parse_mode: 'HTML'
            });
          }
        });
      });
    }
  });
});

bot.onText(/^[\/!#]unhammer (@\w+)/, (msg, match) => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (count > 0 || config.SUDO == msg.from.id) {
      tgresolve(config.BOT_TOKEN, match[1], (error, result) => {
        Ban.remove({
          userid: result.id
        }, (err, cb) => {
          if (cb.result.n == 0) {
            console.log('User Not Found!')
          }
        });

        let user = escapeHtml(result.first_name);

        bot.sendMessage(msg.chat.id, `<b>${user}</b> has been globally unbanned.`, {
          parse_mode: 'HTML'
        });
        bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> <code>(${result.id})</code> has been globally unbanned.\nBy: <i>${msg.from.first_name}</i>\n${time}`, {
          parse_mode: 'HTML'
        });
      });
    }
  });
});
