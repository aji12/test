'use strict'

const bot = require('../core/telegram')
const tgresolve = require('tg-resolve')
const config = require('../data/config.json')
const utils = require('../core/utils')

function getUserProperties (msg, lang, user) {
  let name = `<b>${utils.escapeHtml(user.first_name)}</b> `

  if (user.last_name) {
    name += `<b> ${utils.escapeHtml(user.last_name)}</b>`
    name += `\n${lang.id.dlg[0]}: ${utils.escapeHtml(user.first_name)} \n${lang.id.dlg[1]}: ${utils.escapeHtml(user.last_name)}`
  }
  if (user.username) name += `\n${lang.id.dlg[2]}: <a href="https://t.me/${user.username}">@${user.username}</a>`

  name += `\nID: <code>${user.id}</code>`

  if (user.language_code) name += `\n${lang.id.dlg[3]}: ${user.language_code}`
  if (user.type) name += `\nType: ${user.type}`

  bot.sendMessage(msg.chat.id, name, {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML'
  })
};

bot.onText(/^[/!#]id/, msg => {
  const lang = utils.getUserLang(msg)
  const cmd = msg.text.substr(0, 3)
  const uname = msg.text.substr(4)
  let user = msg.from

  if (msg.reply_to_message) user = msg.reply_to_message.from

  if (uname.match(/@\w+/)) {
    tgresolve(config.bot.TOKEN, uname, (error, result) => {
      if (error) {
        bot.reply(msg, `${lang.id.dlg[4]}`)
      } else {
        if (result.title) result.first_name = result.title
        getUserProperties(msg, lang, result)
      }
    })
  } else if (msg.text === cmd) {
    getUserProperties(msg, lang, user)
  } else {
    bot.reply(msg, `${lang.id.dlg[5]}`)
  }
})

bot.onText(/^[/!#]whoami$/, msg => {
  const lang = utils.getUserLang(msg)
  let name = utils.buildUserName(msg.from)
  let chat = `, ${lang.id.dlg[6]} <b>${utils.escapeHtml(msg.chat.title)}</b> `

  if (msg.chat.username) chat += `(@${msg.chat.username})`

  switch (msg.chat.type) {
    case 'private':
      bot.getMe().then(me => {
        name += `, ${lang.id.dlg[6]} <b>${utils.escapeHtml(me.first_name)}</b> (@${me.username}) [<code>${me.id}</code>]`

        bot.reply(msg, `${lang.id.dlg[7]} ${name}.`)
      })
      break
    default:
      name += `${chat} [<code>${msg.chat.id}</code>]`

      bot.reply(msg, `${lang.id.dlg[7]} ${name}.`)
      break
  }
})
