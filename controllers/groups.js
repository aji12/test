'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')

bot.onText(/^[/!#]group(.+)/, (msg, match) => {
  const config = utils.readJSONFile('data/config.json')
  const lang = utils.getUserLang(msg)

  if (msg.from.id === config.sudo.ID) {
    switch (match[1]) {
      case 's':
        if (config.groups) {
          bot.reply(msg, config.groups)
        } else {
          bot.reply(msg, `${lang.groups.dlg[0]}`)
        }
        break
      default:
        config.groups = msg.text.substr(8)

        utils.saveToFile('data/config.json', config, true)
        bot.reply(msg, `${lang.groups.dlg[1]}`)
        break
    }
  }
})
