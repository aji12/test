'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')

bot.onText(/^[/!#](.+)$/, (msg, match) => {
  if (msg.chat.type === 'private') { return }
  if (!msg.reply_to_message) { return }

  const lang = utils.getUserLang(msg)

  bot.getChatAdministrators(msg.chat.id).then(admins => {
    const kickerIsAdmin = admins.some(child => child.user.id === msg.from.id)
    const victimIsAdmin = admins.some(child => child.user.id === msg.reply_to_message.from.id)
    const user = utils.buildUserName(msg.reply_to_message.from)

    switch (match[1]) {
      case 'kick':
        if (kickerIsAdmin) {
          if (victimIsAdmin) {
            bot.reply(msg, `${user} ${lang.ingroup.dlg[0]}`)
          } else {
            bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id)
            bot.unbanChatMember(msg.chat.id, msg.reply_to_message.from.id)
            bot.reply(msg, `${user} ${lang.ingroup.dlg[1]}`)
          }
        }
        break
      case 'ban':
        if (kickerIsAdmin) {
          if (victimIsAdmin) {
            bot.reply(msg, `${user} ${lang.ingroup.dlg[2]}`)
          } else {
            bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id)
            bot.reply(msg, `${user} ${lang.ingroup.dlg[3]}`)
          }
        }
        break
      case 'unban':
        if (kickerIsAdmin) {
          bot.unbanChatMember(msg.chat.id, msg.reply_to_message.from.id)
          bot.reply(msg, `${user} ${lang.ingroup.dlg[4]}`)
        }
        break
    }
  })
})

bot.onText(/^[/!#]admins$/, msg => {
  bot.getChatAdministrators(msg.chat.id).then(admins => {
    let chatAdmins = admins.map(admin => `• ${utils.buildUserName(admin.user)}`).join('\n')

    bot.reply(msg, `<b>Administrators</b>:\n${chatAdmins}`)
  })
})
