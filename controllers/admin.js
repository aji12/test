'use strict';

const moment = require('moment');
const tgresolve = require("tg-resolve");
const bot = require('../core/telegram');
const config = require('../core/config');
const Mod = require('../models/modsmodel');
const escapeHtml = require('escape-html');

let time = `${moment().format('YYYY-MM-DD HH:mm:ss')}`;

bot.onText(/^[\/!#]leave$/, msg => {
  if (msg.from.id == config.SUDO) {
    bot.leaveChat(msg.chat.id);
  }
});

bot.onText(/^[\/!#]promote$/, msg => {
  if (msg.from.id == config.SUDO) {
    let newMod = new Mod({
      userid: msg.reply_to_message.from.id,
      name: msg.reply_to_message.from.first_name
    });
    newMod.save(err => {
      let user = escapeHtml(msg.reply_to_message.from.first_name);

      if (err && err.code === 11000) {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> is already a global admin.`, {
          parse_mode: 'HTML'
        });
      } else {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> is now a global admin.`, {
          parse_mode: 'HTML'
        });
        bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b>, is now a global admin.\n${time}`, {
          parse_mode: 'HTML'
        });
      }
    });
  }
});

bot.onText(/^[\/!#]demote$/, msg => {
  if (msg.from.id == config.SUDO) {
    Mod.remove({
      userid: msg.reply_to_message.from.id
    }, () => {
      // Demote A Global Admin
    });

    let user = escapeHtml(msg.reply_to_message.from.first_name);

    bot.sendMessage(msg.chat.id, `<b>${user}</b> is no longer a global admin.`, {
      parse_mode: 'HTML'
    });
    bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> is no longer a global admin.\n${time}`, {
      parse_mode: 'HTML'
    });
  }
});

bot.onText(/^[\/!#]promote (\d+) (.+)/, (msg, match) => {
  if (msg.from.id == config.SUDO) {
    let newMod = new Mod({
      userid: match[1],
      name: match[2]
    });
    newMod.save(err => {
      let user = escapeHtml(match[2]);

      if (err && err.code === 11000) {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> is already a global admin.`, {
          parse_mode: 'HTML'
        });
      } else {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> is now a global admin.`, {
          parse_mode: 'HTML'
        });
        bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> <code>([${match[1]}])</code> is now a global admin.\n${time}`, {
          parse_mode: 'HTML'
        });
      }
    });
  }
});

bot.onText(/^[\/!#]demote (\d+) (.+)/, (msg, match) => {
  if (msg.from.id == config.SUDO) {
    let user = escapeHtml(match[2]);

    Mod.remove({
      userid: match[1]
    }, () => {
      // Demote A Global Admin
    });
    bot.sendMessage(msg.chat.id, `<b>${user}</b> is no longer a global admin.`, {
      parse_mode: 'HTML'
    });
    bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> <code>([${match[1]}])</code> is no longer a global admin.\n${time}`, {
      parse_mode: 'HTML'
    });
  }
});

bot.onText(/^[\/!#]promote (@\w+) (.+)/, (msg, match) => {
  if (msg.from.id == config.SUDO) {
    tgresolve(config.BOT_TOKEN, match[1], (error, result) => {
      let newMod = new Mod({
        userid: result.id,
        name: result.first_name
      });
      newMod.save(err => {
        let user = escapeHtml(result.first_name);

        if (err && err.code === 11000) {
          bot.sendMessage(msg.chat.id, `<b>${user}</b> is already a global admin.`, {
            parse_mode: 'HTML'
          });
        } else {
          bot.sendMessage(msg.chat.id, `<b>${user}</b> is now a global admin.`, {
            parse_mode: 'HTML'
          });
          bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> <code>([${result.id}])</code> is now a global admin.\n${time}`, {
            parse_mode: 'HTML'
          });
        }
      });
    });
  }
});

bot.onText(/^[\/!#]demote (@\w+) (.+)/, (msg, match) => {
  if (msg.from.id == config.SUDO) {
    tgresolve(config.BOT_TOKEN, match[1], (error, result) => {
      Mod.remove({
        userid: result.id
      }, () => {
        // Demote A Global Admin
      });

      let user = escapeHtml(result.first_name);

      bot.sendMessage(msg.chat.id, `*${user}* is no longer a global admin.`, {
        parse_mode: 'HTML'
      });
      bot.sendMessage(config.LOG_CHANNEL, `<b>${user}</b> <code>([${result.id}])</code> is no longer a global admin.\n${time}`, {
        parse_mode: 'HTML'
      });
    });
  }
});
