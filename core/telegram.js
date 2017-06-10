'use strict'

const Tgfancy = require('tgfancy')
const config = require('../data/config.json')
const moment = require('moment')
const rangi = require('rangi')
const now = Math.round(+new Date() / 1000)

const bot = new Tgfancy(config.bot.TOKEN, {
  tgfancy: {
    openshiftWebHook: true
  }
})

bot.getMe().then(me => {
  console.log(rangi.cyan(`Bot Is Running => ${me.username}`));
  bot.sendMessage(config.sudo.ID, `<b>Bot Started!</b>\n<code>${moment().format('YYYY-MM-DD HH.mm.ss')}</code>`, {parse_mode: 'HTML'})
})

bot.on('text', msg => {
  if (now > (msg.date + 5)) msg.text = ''
})

module.exports = bot
