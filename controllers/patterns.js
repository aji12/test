'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')
const escapeHtml = require('escape-html')
const utils = require('../core/utils')

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
  }

  let regexp = `${match[1]}`
  let replacement = `${match[2]}` || ''
  let re = new RegExp(regexp, 'g')
  let output = input.replace(re, `${replacement}`)

  // 4096 is the characters limit count of Telegram post
  if (escapeHtml(output).length >= 4000) {
    output = escapeHtml(output).slice(0, 4000)
  } else {
    output = escapeHtml(output)
  };

  bot.sendMessage(msg.chat.id, `<b>Did you mean:</b>\n"${output}"`, utils.optionalParams(msg.reply_to_message))
})
