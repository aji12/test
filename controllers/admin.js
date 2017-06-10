'use strict'

const moment = require('moment')
const tgresolve = require('tg-resolve')
const bot = require('../core/telegram')
const config = require('../data/config.json')
const Mod = require('../models/modsmodel')
const utils = require('../core/utils')
const html = {parse_mode: 'HTML'}

let time = `${moment().format('YYYY-MM-DD HH:mm:ss')}`

bot.onText(/^[/!#]leave$/, msg => {
  if (msg.from.id === config.sudo.ID) {
    bot.leaveChat(msg.chat.id)
  }
})

bot.onText(/^[/!#]promote$/, msg => {
  if (!msg) return console.log('Is it a bot?')
  if (!msg.reply_to_message) return console.log('Not a reply')
  if (msg.from.id === config.sudo.ID) {
    let newMod = new Mod({
      userid: msg.reply_to_message.from.id,
      name: msg.reply_to_message.from.first_name
    })
    newMod.save(err => {
      let user = utils.escapeHtml(msg.reply_to_message.from.first_name)

      if (err && err.code === 11000) {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> is already a global admin.`, html)
      } else {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> is now a global admin.`, html)
        bot.sendMessage(config.log.CHANNEL, `<b>${user}</b>, is now a global admin.\n${time}`, html)
      }
    })
  }
})

bot.onText(/^[/!#]demote$/, msg => {
  if (!msg.reply_to_message) return console.log('Not a reply')
  if (msg.from.id === config.sudo.ID) {
    Mod.remove({
      userid: msg.reply_to_message.from.id
    }, () => {
      // Demote A Global Admin
    })

    let user = utils.escapeHtml(msg.reply_to_message.from.first_name)

    bot.sendMessage(msg.chat.id, `<b>${user}</b> is no longer a global admin.`, html)
    bot.sendMessage(config.log.CHANNEL, `<b>${user}</b> is no longer a global admin.\n${time}`, html)
  }
})

bot.onText(/^[/!#]promote (\d+) (.+)/, (msg, match) => {
  if (msg.from.id === config.sudo.ID) {
    let newMod = new Mod({
      userid: match[1],
      name: match[2]
    })
    newMod.save(err => {
      let user = utils.escapeHtml(match[2])

      if (err && err.code === 11000) {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> is already a global admin.`, html)
      } else {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> is now a global admin.`, html)
        bot.sendMessage(config.log.CHANNEL, `<b>${user}</b> <code>([${match[1]}])</code> is now a global admin.\n${time}`, html)
      }
    })
  }
})

bot.onText(/^[/!#]demote (\d+) (.+)/, (msg, match) => {
  if (msg.from.id === config.sudo.ID) {
    let user = utils.escapeHtml(match[2])

    Mod.remove({
      userid: match[1]
    }, () => {
      // Demote A Global Admin
    })
    bot.sendMessage(msg.chat.id, `<b>${user}</b> is no longer a global admin.`, html)
    bot.sendMessage(config.log.CHANNEL, `<b>${user}</b> <code>([${match[1]}])</code> is no longer a global admin.\n${time}`, html)
  }
})

bot.onText(/^[/!#]promote (@\w+) (.+)/, (msg, match) => {
  if (msg.from.id === config.sudo.ID) {
    tgresolve(config.bot.TOKEN, match[1], (error, result) => {
      if (error) return console.log('Error')
      let newMod = new Mod({
        userid: result.id,
        name: result.first_name
      })
      newMod.save(err => {
        let user = utils.escapeHtml(result.first_name)

        if (err && err.code === 11000) {
          bot.sendMessage(msg.chat.id, `<b>${user}</b> is already a global admin.`, html)
        } else {
          bot.sendMessage(msg.chat.id, `<b>${user}</b> is now a global admin.`, html)
          bot.sendMessage(config.log.CHANNEL, `<b>${user}</b> <code>([${result.id}])</code> is now a global admin.\n${time}`, html)
        }
      })
    })
  }
})

bot.onText(/^[/!#]demote (@\w+) (.+)/, (msg, match) => {
  if (msg.from.id === config.sudo.ID) {
    tgresolve(config.bot.TOKEN, match[1], (error, result) => {
      if (error) return console.log('Error')
      Mod.remove({
        userid: result.id
      }, () => {
        // Demote A Global Admin
      })

      let user = utils.escapeHtml(result.first_name)

      bot.sendMessage(msg.chat.id, `*${user}* is no longer a global admin.`, html)
      bot.sendMessage(config.log.CHANNEL, `<b>${user}</b> <code>([${result.id}])</code> is no longer a global admin.\n${time}`, html)
    })
  }
})
