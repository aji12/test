'use strict'

const bot = require('../core/telegram')
const tgresolve = require('tg-resolve')
const config = require('../data/config.json')
const utils = require('../core/utils')

function getUserProperties (msg, user) {
  let name = `<b> ${utils.escapeHtml(user.first_name)} </b> `

  if (user.last_name) {
    name += `<b> ${utils.escapeHtml(user.last_name)}</b>`
    name += `\nFirst name: ${utils.escapeHtml(user.first_name)} \nLast name: ${utils.escapeHtml(user.last_name)}`
  }
  if (user.username) name += `\nUsername: <a href="https://t.me/${user.username}">@${user.username}</a>`

  name += `\nID: <code>${user.id}</code>\nLanguage: ${user.language_code}`

  if (user.type) name += `\nType: ${user.type}`

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
    tgresolve(config.bot.TOKEN, uname, (error, result) => {
      if (error) {
        console.log(error)
        bot.sendMessage(msg.chat.id, 'Unable to connect to @pwrtelegram.', {
          reply_to_message_id: msg.message_id
        })
      } else {
        if (result.title) result.first_name = result.title
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
})

bot.onText(/^[/!#]whoami$/, msg => {
  let name = `<b>${utils.escapeHtml(msg.from.first_name)}</b>`
  let chat = `, and you are messaging <b>${utils.escapeHtml(msg.chat.title)}</b> `

  if (msg.from.last_name) name += ` <b>${utils.escapeHtml(msg.from.last_name)}</b>`

  if (msg.from.username) name += ` (@${msg.from.username})`

  name += ` [<code>${msg.from.id}</code>]`

  if (msg.chat.username) chat += `(@${msg.chat.username})`

  switch (msg.chat.type) {
    case 'private':
      bot.getMe().then(me => {
        name += `, and you are messaging <b>${utils.escapeHtml(me.first_name)}</b> (@${me.username}) [<code>${me.id}</code>]`

        bot.sendMessage(msg.chat.id, `You are ${name}.`, {parse_mode: 'HTML'})
      })
      break
    default:
      name += chat + ` [<code>${msg.chat.id}</code>]`

      bot.sendMessage(msg.chat.id, `You are ${name}.`, {
        reply_to_message_id: msg.message_id,
        parse_mode: 'HTML'
      })
      break
  }
})
