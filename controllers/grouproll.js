'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

bot.onText(/^[/!#]grouproll/, (msg, match) => {
  if (msg.from.id !== config.sudo.ID) { return }

  let db = utils.readJSONFile(config.database.DB)
  const groups = (msg.reply_to_message) ? msg.reply_to_message.text : msg.text
  const lang = utils.getUserLang(msg)
  db.grouproll = groups.replace(/^[/!#]\w+/, '')

  utils.saveToFile(config.database.DB, db)
  bot.sendMessage(msg.chat.id, `${lang.grouproll.dlg[0]}.`, utils.optionalParams(msg))
})
