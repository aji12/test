'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const utils = require('../core/utils')

bot.onText(/^[/!#]help$/, msg => {
  const name = utils.escapeHtml(msg.from.first_name)
  const lang = utils.getUserLang(msg)
  const initKbd = utils.initialKeyboard(lang)

  bot.sendMessage(msg.from.id, `<b>Hai ${name},</b>\n\n${lang.start.info}`, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: initKbd
    }
  }).catch((error) => {
    if (error) {
      bot.reply(msg, `${lang.help.dlg[0]}`.replace(/BOT_LINK /, `<a href="https://t.me/${config.bot.UNAME}?start">`))
    }
  })
})

bot.onText(/^[/!#]help (\w+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)

  if (lang[`${match[1]}`]) {
    bot.reply(msg, lang[`${match[1]}`].info)
  } else {
    const noplug = `<code>${match[1]}</code> ${lang.help.dlg[1]}`
    let pluglist = []

    for (let i = 0; i < config.plugins.length; i++) {
      pluglist.push(`${i + 1}. ${config.plugins[i]}`)
    }
    pluglist = pluglist.join('\n')

    bot.reply(msg, noplug + '.\n\n' + pluglist)
  }
})
