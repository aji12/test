'use strict'

const Ban = require('../models/banmodel')
const bot = require('../core/telegram')
const config = require('../data/config.json')
const Mod = require('../models/modsmodel')
const moment = require('moment')
const tgresolve = require('tg-resolve')
const utils = require('../core/utils')
let time = `${moment().format('LLLL')}`

bot.onText(/^[/!#](.+)$/, (msg, match) => {
  const lang = utils.getUserLang(msg)

  switch (match[1]) {
    case 'hammer':
      if (!msg.reply_to_message) { return console.log('=> banhammer.js: Not a reply') }
      Mod.count({
        userid: msg.from.id
      }, (err, count) => {
        if (err) { return console.log('=> banhammer.js: Mod count error') }
        if (count > 0 || (config.sudo.ID === msg.from.id)) {
          bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id)

          let newBan = new Ban({
            userid: msg.reply_to_message.from.id,
            name: msg.reply_to_message.from.first_name
          })
          newBan.save(err => {
            let user = utils.buildUserName(msg.reply_to_message.from)

            if (err && err.code === 11000) {
              bot.reply(msg, `${user} ${lang.banhammer.dlg[0]}.`)
            } else {
              bot.reply(msg, `${user} ${lang.banhammer.dlg[1]}.`)
              bot.sendMonospace(config.log.CHANNEL, `${user} ${lang.banhammer.dlg[1]}.\nBy: _${user}_\n${time}`)
            }
          })
        }
      })
      break
    case 'unhammer':
      if (!msg.reply_to_message) { return console.log('=> banhammer.js: Not a reply') }
      Mod.count({
        userid: msg.from.id
      }, (err, count) => {
        if (err) { return console.log('=> banhammer.js: Mod count error') }
        if (count > 0 || (config.sudo.ID === msg.from.id)) {
          bot.unbanChatMember(msg.chat.id, msg.reply_to_message.from.id)
          Ban.remove({
            userid: msg.reply_to_message.from.id
          }, () => {
            // Globally Unhammered
          })
          const lang = utils.getUserLang(msg)
          const user = utils.buildUserName(msg.reply_to_message.from)

          bot.reply(msg, `${user} ${lang.banhammer.dlg[2]}.`)
          bot.sendMonospace(config.log.CHANNEL, `${user} ${lang.banhammer.dlg[2]}.\nBy: _${msg.from.first_name}_\n${time}`)
        }
      })
      break
  }
})

bot.onText(/^[/!#]hammer (\d+)/, (msg, match) => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (err) { return console.log('=> banhammer.js: Mod count error') }
    if (count > 0 || (config.sudo.ID === msg.from.id)) {
      let newBan = new Ban({
        userid: match[1]
      })
      newBan.save(err => {
        const lang = utils.getUserLang(msg)
        const user = utils.buildUserName(msg.from)

        if (err && err.code === 11000) {
          bot.reply(msg, `<b>${match[1]}</b> ${lang.banhammer.dlg[0]}.`)
        } else {
          bot.reply(msg, `<b>${match[1]}</b> ${lang.banhammer.dlg[1]}.`)
          bot.sendMonospace(config.log.CHANNEL, `<code>(${match[1]})</code> ${lang.banhammer.dlg[1]}.\nBy: ${user}\n${time}`)
        }
      })
    }
  })
})

bot.onText(/^[/!#]unhammer (\d+)/, (msg, match) => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (err) { return console.log('=> banhammer.js: Mod count error') }
    if (count > 0 || (config.sudo.ID === msg.from.id)) {
      Ban.remove({
        userid: match[1]
      }, (err, cb) => {
        if (err) return console.log('=> banhammer.js: Ban remove error')
        if (cb.result.n == 0) {
          console.log('=> banhammer.js: User Not Found!')
        }
      })
      const lang = utils.getUserLang(msg)
      const user = utils.buildUserName(msg.from)

      bot.reply(msg, `<b>${match[1]}</b> ${lang.banhammer.dlg[2]}.`)
      bot.sendMonospace(config.log.CHANNEL, `<i>(${match[1]})</i> ${lang.banhammer.dlg[2]}.\nBy: ${user}\n${time}`)
    }
  })
})

bot.onText(/^[/!#]hammer (@\w+)/, (msg, match) => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (err) { return console.log('=> banhammer.js: Mod count error') }
    if (count > 0 || (config.sudo.ID === msg.from.id)) {
      tgresolve(config.bot.TOKEN, match[1], (error, result) => {
        if (error) { return console.log('=> banhammer.js: tgresolve error') }
        let newBan = new Ban({
          userid: result.id
        })
        newBan.save(err => {
          const lang = utils.getUserLang(msg)
          const kicker = utils.buildUserName(msg.from)
          const victim = utils.buildUserName(result)

          if (err && err.code === 11000) {
            bot.reply(msg, `${victim} ${lang.banhammer.dlg[0]}.`)
          } else {
            bot.reply(msg, `${victim} ${lang.banhammer.dlg[1]}.`)
            bot.sendMonospace(config.log.CHANNEL, `${victim} ${lang.banhammer.dlg[1]}.\nBy: ${kicker}\n${time}`)
          }
        })
      })
    }
  })
})

bot.onText(/^[/!#]unhammer (@\w+)/, (msg, match) => {
  Mod.count({
    userid: msg.from.id
  }, (err, count) => {
    if (err) { return console.log('=> banhammer.js: Mod count error') }
    if (count > 0 || (config.sudo.ID === msg.from.id)) {
      tgresolve(config.bot.TOKEN, match[1], (error, result) => {
        if (error) { return console.log('=> banhammer.js: tgresolve error') }
        Ban.remove({
          userid: result.id
        }, (err, cb) => {
          if (err) { return console.log('=> banhammer.js: Ban remove error') }
          if (cb.result.n == 0) {
            console.log('=> banhammer.js: User Not Found!')
          }
        })
        const lang = utils.getUserLang(msg)
        const kicker = utils.buildUserName(msg.from)
        const victim = utils.buildUserName(result)

        bot.reply(msg, `${victim} ${lang.banhammer.dlg[2]}.`)
        bot.sendMonospace(config.log.CHANNEL, `${victim} ${lang.banhammer.dlg[2]}.\nBy: ${kicker}\n${time}`)
      })
    }
  })
})
