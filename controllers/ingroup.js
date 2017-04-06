'use strict';

const bot = require('../core/telegram');
const escapeHtml = require('escape-html');

bot.onText(/^[\/!#]kick$/, msg => {
  bot.getChatAdministrators(msg.chat.id).then(admins => admins.some(child => child.user.id == msg.from.id)).then(isAdmin => {
    if (isAdmin) {
      let user = escapeHtml(msg.reply_to_message.from.first_name);
      bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id);
      bot.unbanChatMember(msg.chat.id, msg.reply_to_message.from.id);
      bot.sendMessage(msg.chat.id, `<b>${user}</b> has been kicked.`, {
        parse_mode: 'HTML'
      });
    }
  });
});

bot.onText(/^[\/!#]ban$/, msg => {
  bot.getChatAdministrators(msg.chat.id).then(admins => admins.some(child => child.user.id == msg.from.id)).then(isAdmin => {
    if (isAdmin) {
      let user = escapeHtml(msg.reply_to_message.from.first_name);
      bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id);
      bot.sendMessage(msg.chat.id, `<b>${user}</b> has been banned.`, {
        parse_mode: 'HTML'
      });
    }
  });
});

bot.onText(/^[\/!#]admins$/, msg => {
  bot.getChatAdministrators(msg.chat.id).then(admins => {
    let chatAdmins = admins.map(admin => '• ' + escapeHtml(admin.user.first_name) + ' <code>[' + admin.user.id + ']</code>').join('\n');
    bot.sendMessage(msg.chat.id, `<b>Administrators</b>:\n${chatAdmins}`, {
      parse_mode: 'HTML'
    });
  });
});
