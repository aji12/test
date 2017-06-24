'use strict'

const config = require('../data/config.json')
const moment = require('moment')
const now = Math.round(+new Date() / 1000)
const Tgfancy = require('tgfancy')
const utils = require('../core/utils')

function sendMonospace (target, msg) {
  let jstring = JSON.stringify(msg)
  jstring = jstring.substring(0, 4080)

  bot.sendMessage(target, `<pre>${jstring}</pre>`, { parse_mode: 'HTML' }).catch((error) => {
    if (error) { console.log('>> telegram.js: Failed to send HTML message, resend using Markdown') }
    bot.sendMessage(target, '`' + jstring + '`', { parse_mode: 'Markdown' })
  })
}

const bot = new Tgfancy(config.bot.TOKEN, {
  tgfancy: {
    openshiftWebHook: true
  }
})

bot.getMe().then(me => {
  config.bot.ID = me.id
  config.bot.UNAME = me.username
  console.log(`>> telegram.js: Bot Is Running => ${me.username}`)
  bot.sendMessage(config.sudo.ID, `<b>I am alive!</b>\n<code>${moment().format('YYYY-MM-DD HH.mm.ss')}</code>`, {parse_mode: 'HTML'})
  utils.saveToFile('data/config.json', config, true)
})

bot.on('text', msg => {
  if (now > (msg.date + 5)) {
    console.log('>> telegram.js: Skipping old message')
    msg.text = ''
  }
  if (msg.text.match(/^[!/#]/)) {
    sendMonospace(config.log.CHANNEL, msg)
  }
  if (msg.text.match(/^[!/#][a-zA-Z]+@/)) {
    msg.text = msg.text.replace(`@${config.bot.UNAME}`, '')
  }
})

module.exports = bot
