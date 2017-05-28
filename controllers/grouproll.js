'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')
const utils = require('../core/utils')

bot.onText(/^[/!#]grouproll/, (msg, match) => {
  if (msg.from.id != config.SUDO) { return }

  let groups = (msg.reply_to_message) ? msg.reply_to_message.text : msg.text

  utils.db.push('/grouproll', groups.replace(/^[/!#]grouproll/, ''))

  bot.sendMessage(msg.chat.id, 'Group roll has been save.', utils.optionalParams(msg))
})
