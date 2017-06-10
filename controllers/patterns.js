'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

bot.onText(/^\/?s\/(.+)\/(.+)\/?/, (msg, match) => {
  const message = msg.reply_to_message
  // Return if there is no message to change.
  if (!message) { return }

  let input = message.text
  let re

  if (!input) { return }

  if (message.from.id === config.bot.ID) {
    const head = '^Did you mean:\n"'
    const pre = new RegExp(head, '')
    const post = new RegExp('"$', '')
    input = input.replace(pre, '')
    input = input.replace(post, '')
  }

  try {
    re = new RegExp(match[1], 'g')
  } catch (error) {
    bot.sendMessage(msg.chat.id, `SyntaxError: Invalid regular expression: <code>/${match[1]}/</code>: Nothing to repeat`, utils.optionalParams(msg))
    return
  }

  let output = input.replace(re, match[2])

  // 4096 is the characters limit count of Telegram post
  if (utils.escapeHtml(output).length >= 4000) {
    output = utils.escapeHtml(output).slice(0, 4000)
  } else {
    output = utils.escapeHtml(output)
  }

  bot.sendMessage(msg.chat.id, `<b>Did you mean:</b>\n"${output}"`, utils.optionalParams(message))
})
