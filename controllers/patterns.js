'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')
const escapeHtml = require('escape-html')

bot.onText(/^\/?s\/(.+)\/(.+)\/?/, (msg, match) => {
  // Return if there is no message to change.
  if (!msg.reply_to_message) { return }

  let input = msg.reply_to_message.text

  if (!input) { return }

  if (msg.reply_to_message.from.id == config.BOT_ID) {
    const pre = new RegExp('^Did you mean:\n"', '')
    const post = new RegExp('"$', '')
    input = input.replace(pre, '')
    input = input.replace(post, '')
    console.log(input)
  }

  let regexp = `${match[1]}`
  let replacement = `${match[2]}` || ''
  let re = new RegExp(regexp, 'g')
  let output = input.replace(re, `${replacement}`)

  // 4096 is the limit characters count of Telegram post
  if (escapeHtml(output).length >= 4000) {
    output = escapeHtml(output).slice(0, 4000)
  } else {
    output = escapeHtml(output)
  };

  bot.sendMessage(msg.chat.id, `<b>Did you mean:</b>\n"${output}"`, {
    reply_to_message_id: msg.reply_to_message.message_id,
    disable_web_page_preview: 'true',
    parse_mode: 'HTML'
  })
})
