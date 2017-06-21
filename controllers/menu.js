'use strict'

const bot = require('../core/telegram')
const cfg = 'data/config.json'
const config = require(`../${cfg}`)
const utils = require('../core/utils')
const locale = utils.locale
let db = utils.db

function buildKbdPage (lang, ptype) {
  let man, plugins, usr
  let manpage = []
  let kbd = []
  let size = 3

  if (ptype === 'user') {
    man = 'manpage'
    plugins = config.plugins.user
    usr = 'usr'
  } else {
    man = 'admmanpage'
    plugins = config.plugins.admin
    usr = 'adm'
  }
  for (let i = 0; i < plugins.length; i += size) {
    let row = plugins.slice(i, i + size)
    let button = []
    let num = Math.floor(i / 8)
    for (let b = 0; b < row.length; b++) {
      button.push({
        text: lang[`${row[b]}`].btn,
        callback_data: `cmd_${usr}_${num}_${row[b]}`
      })
    }
    kbd.push(button)
  }
  for (let b = 0; b < kbd.length; b += 3) {
    manpage.push(kbd.slice(b, b + 3))
  }
  for (let p = 0; p < manpage.length; p++) {
    let mainmenuBtn = [{text: `${lang.mainmenu.btn}`, callback_data: 'mainMenu_'}]
    let prev = p - 1
    prev = (prev < 0) ? 'mainMenu_' : `${man}_${prev}`
    let next = p + 1
    if (next === manpage.length) {
      mainmenuBtn.unshift({
        text: `${lang.prev.btn}`,
        callback_data: prev
      })
    } else {
      mainmenuBtn.push({
        text: `${lang.next.btn}`,
        callback_data: `${man}_${next}`
      })
    }
    manpage[p].push(mainmenuBtn)
  }
  config.plugins[usr] = JSON.stringify(manpage)
  utils.saveToFile(cfg, config)
  return utils.reloadModule(`../${cfg}`)
}

// Language settings
const langKeyboard = [[{
  text: '🇬🇧 English',
  callback_data: 'setlang_en'
}, {
  text: '🇮🇩 Bahasa Indonesia',
  callback_data: 'setlang_id'
}]]

bot.onText(/^[/!#]start/, msg => {
  bot.sendMessage(msg.from.id, `*Select language:*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: langKeyboard
    }
  })
})

bot.on('callback_query', msg => {
  let lang = utils.getUserLang(msg)
  let params = utils.optionalParams(msg.message)
  let navi = [{text: `${lang.mainmenu.btn}`, callback_data: 'mainMenu_'}]
  params.chat_id = msg.message.chat.id
  params.message_id = msg.message.message_id

  let command = msg.data.match(/^.+?_/)
  switch (command[0]) {
    case 'admmanpage_':
      if (!config.plugins.adm) { buildKbdPage(lang, 'admin') }
      const admKbd = JSON.parse(config.plugins.adm)
      const admCmdNum = msg.data.slice(11)
      params.reply_markup = { inline_keyboard: admKbd[admCmdNum] }
      bot.editMessageText(`${lang.admin.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'cmd_':
      const plug = msg.data.slice(10)
      let type = msg.data.substr(4, 3)
      type = (type === 'usr') ? 'manpage' : 'admmanpage'
      navi.unshift({
        text: `${lang.back.btn}`,
        callback_data: `${type}_${msg.data.charAt(8)}`
      })
      params.reply_markup = { inline_keyboard: [navi] }
      bot.editMessageText(`${lang[plug].info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'links_':
      params.reply_markup = {
        inline_keyboard: [[{
          text: `${lang.source.btn}`,
          url: 'https://github.com/rizaumami/TGramIndoBot'
        }, {
          text: 'TGramIndo',
          url: 'https://t.me/tgramindo'
        }], [{
          text: `${lang.grouproll.btn}`,
          callback_data: 'lnk_grouproll'
        }, {
          text: `${lang.about.btn}`,
          callback_data: 'lnk_about'
        }], [{
          text: `${lang.back.btn}`,
          callback_data: 'mainMenu_'
        }]]
      }
      bot.editMessageText(`${lang.links.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'lnk_':
      const lnk = msg.data.slice(4)
      navi.unshift({
        text: `${lang.back.btn}`,
        callback_data: 'links_'
      })
      params.reply_markup = { inline_keyboard: [navi] }

      if (lnk === 'grouproll') {
        try {
          db.reload()
          const data = db.getData('/grouproll')
          bot.editMessageText(data, params).catch((error) => console.log(error.response.body))
        } catch (error) {
          bot.editMessageText(`${lang.menu.dlg[0]}`, params).catch((error) => console.log(error.response.body))
        }
      } else {
        bot.editMessageText(`${lang[lnk].info}`, params).catch((error) => console.log(error.response.body))
      }
      break
    case 'manpage_':
      if (!config.plugins.usr) { buildKbdPage(lang, 'user') }
      const usrKbd = JSON.parse(config.plugins.usr)
      const usrCmdNum = msg.data.slice(8)
      params.reply_markup = { inline_keyboard: usrKbd[usrCmdNum] }
      bot.editMessageText(`${lang.cmds.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'mainMenu_':
      const initKbd = utils.initialKeyboard(lang)
      params.reply_markup = { inline_keyboard: initKbd }
      bot.editMessageText(`<b>Hai ${utils.escapeHtml(msg.from.first_name)},</b>\n\n${lang.start.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'setlang_':
      const setlangCode = msg.data.slice(8)
      lang = locale[`${setlangCode}`]
      const setlangParams = params
      navi.unshift({
        text: `${lang.back.btn}`,
        callback_data: 'settings_'
      })
      setlangParams.reply_markup = { inline_keyboard: [navi] }
      db.push(`/${msg.from.id}/`, { lang: setlangCode }, false)

      let choosenLang = ''
      if (setlangCode === 'en') choosenLang = '🇬🇧 English'
      if (setlangCode === 'id') choosenLang = '🇮🇩 Bahasa Indonesia'
      bot.editMessageText(`${lang.settedlang.info} <b>${choosenLang}</b>!`, setlangParams).catch((error) => console.log(error.response.body))
      break
    case 'settings_':
      params.reply_markup = { inline_keyboard: langKeyboard }
      bot.editMessageText(`<b>${lang.selectlang.btn}:</b>`, params).catch((error) => console.log(error.response.body))
      break
  }
})
