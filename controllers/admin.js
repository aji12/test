'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const Mod = require('../models/modsmodel')
const moment = require('moment')
const tgresolve = require('tg-resolve')
const utils = require('../core/utils')
let time = `${moment().format('YYYY-MM-DD HH:mm:ss')}`

bot.onText(/^[/!#](.+)$/, (msg, match) => {
  const lang = utils.getUserLang(msg)

  switch (match[1]) {
    case 'leave':
      if (msg.from.id === config.sudo.ID) {
        bot.leaveChat(msg.chat.id)
      }
      break
    case 'promote':
      if (!msg) { return console.log('>> admin.js: Is it a bot?') }
      if (!msg.reply_to_message) { return console.log('>> admin.js: Not a reply') }
      if (msg.from.id === config.sudo.ID) {
        let newMod = new Mod({
          userid: msg.reply_to_message.from.id,
          name: msg.reply_to_message.from.first_name
        })
        newMod.save(err => {
          let user = utils.buildUserName(msg.reply_to_message.from)

          if (err && err.code === 11000) {
            bot.sendMessage(msg.chat.id, `${user} ${lang.admin.dlg[0]}.`, utils.optionalParams(msg))
          } else {
            bot.sendMessage(msg.chat.id, `${user} ${lang.admin.dlg[1]}.`, utils.optionalParams(msg))
            bot.sendMessage(config.log.CHANNEL, `${user} ${lang.admin.dlg[1]}.\n${time}`, utils.optionalParams(msg))
          }
        })
      }
      break
    case 'demote':
      if (!msg.reply_to_message) { return console.log('>> admin.js: Not a reply') }
      if (msg.from.id === config.sudo.ID) {
        Mod.remove({
          userid: msg.reply_to_message.from.id
        }, () => {
          // Demote A Global Admin
        })

        let user = utils.buildUserName(msg.reply_to_message.from)

        bot.sendMessage(msg.chat.id, `${user} ${lang.admin.dlg[2]}.`, utils.optionalParams(msg))
        bot.sendMessage(config.log.CHANNEL, `${user} ${lang.admin.dlg[2]}.\n${time}`, utils.optionalParams(msg))
      }
      break
  }
})

bot.onText(/^[/!#]promote (\d+) (.+)/, (msg, match) => {
  if (msg.from.id === config.sudo.ID) {
    let newMod = new Mod({
      userid: match[1],
      name: match[2]
    })
    newMod.save(err => {
      const lang = utils.getUserLang(msg)
      const user = utils.escapeHtml(match[2])

      if (err && err.code === 11000) {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> ${lang.admin.dlg[0]}.`, utils.optionalParams(msg))
      } else {
        bot.sendMessage(msg.chat.id, `<b>${user}</b> ${lang.admin.dlg[1]}.`, utils.optionalParams(msg))
        bot.sendMessage(config.log.CHANNEL, `<b>${user}</b> <code>([${match[1]}])</code> ${lang.admin.dlg[1]}.\n${time}`, utils.optionalParams(msg))
      }
    })
  }
})

bot.onText(/^[/!#]demote (\d+) (.+)/, (msg, match) => {
  if (msg.from.id === config.sudo.ID) {
    const lang = utils.getUserLang(msg)
    const user = utils.escapeHtml(match[2])

    Mod.remove({
      userid: match[1]
    }, () => {
      // Demote A Global Admin
    })
    bot.sendMessage(msg.chat.id, `<b>${user}</b> ${lang.admin.dlg[2]}.`, utils.optionalParams(msg))
    bot.sendMessage(config.log.CHANNEL, `<b>${user}</b> <code>([${match[1]}])</code> ${lang.admin.dlg[2]}.\n${time}`, utils.optionalParams(msg))
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
        const lang = utils.getUserLang(msg)
        const user = utils.buildUserName(result)

        if (err && err.code === 11000) {
          bot.sendMessage(msg.chat.id, `${user} ${lang.admin.dlg[0]}.`, utils.optionalParams(msg))
        } else {
          bot.sendMessage(msg.chat.id, `${user} ${lang.admin.dlg[1]}.`, utils.optionalParams(msg))
          bot.sendMessage(config.log.CHANNEL, `${user} ${lang.admin.dlg[1]}.\n${time}`, utils.optionalParams(msg))
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
      const lang = utils.getUserLang(msg)
      const user = utils.buildUserName(result)

      bot.sendMessage(msg.chat.id, `${user} ${lang.admin.dlg[2]}.`, utils.optionalParams(msg))
      bot.sendMessage(config.log.CHANNEL, `${user} ${lang.admin.dlg[2]}.\n${time}`, utils.optionalParams(msg))
    })
  }
})
