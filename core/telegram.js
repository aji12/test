'use strict'

const config = require('../data/config.json')
const moment = require('moment')
const now = Math.round(+new Date() / 1000)
const Tgfancy = require('tgfancy')
const utils = require('../core/utils')

const bot = new Tgfancy(config.bot.TOKEN, {
  tgfancy: {
    openshiftWebHook: true
  }
})

bot.getMe().then(me => {
  config.bot.ID = me.id
  config.bot.UNAME = me.username
  console.log(`=> telegram.js: Bot Is Running => ${me.username}`)
  bot.sendMessage(config.sudo.ID, `<b>I am alive!</b>\n<code>${moment().format('LLLL')}</code>`, {parse_mode: 'HTML'})
  utils.saveToFile('data/config.json', config, true)
})

bot.on('text', msg => {
  if (now > (msg.date + 5)) {
    console.log('=> telegram.js: Skipping old message')
    msg.text = ''
  }
  if (msg.text.match(/^[!/#]/)) {
    bot.sendMonospace(config.log.CHANNEL, msg)
  }
  if (msg.text.match(/^[!/#][a-zA-Z]+@/)) {
    msg.text = msg.text.replace(`@${config.bot.UNAME}`, '')
  }
})

bot.reply = function (msg, text, webPagePreview) {
  let opts = {}
  opts.disable_web_page_preview = (webPagePreview) ? 'false' : 'true'
  opts.reply_to_message_id = msg.message_id
  opts.parse_mode = 'HTML'
  let message
  message = Array.isArray(text) ? text[0] : text

  bot.sendMessage(msg.chat.id, message, opts).catch((error) => {
    // Telegram HTML parser can only parse limited range of tags and cannot parse nested tags
    // So we're strip all tags and resend message as plain text
    if (error) {
      if (Array.isArray(text)) {
        message = text[1]
      } else {
        message = text.replace(/<\/?.*?>/g, '')
      }
      bot.sendMessage(msg.chat.id, message, opts)
    }
  })
}

bot.sendMonospace = function (target, string, format) {
  let jstring = JSON.stringify(string, null, format)
  jstring = jstring.substring(0, 4080)

  bot.sendMessage(target, `<pre>${jstring}</pre>`, { parse_mode: 'HTML' }).catch((error) => {
    if (error) { console.log('=> utilities.sendMonospace: Failed to send HTML message, will resend using Markdown.') }
    bot.sendMessage(target, '`' + jstring + '`', { parse_mode: 'Markdown' })
  })
}

module.exports = bot
