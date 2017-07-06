'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')

const cfg = 'data/config.json'
let config = utils.readJSONFile(cfg)
let db = utils.readJSONFile(config.database.DB)

// Build menus keyboard
function buildKbdPage (pluginType) {
  let man, plugins, usr

  // There are two types of plugins for; (1) administrator, (2) regular user
  if (pluginType === 'user') {
    man = 'manpage'
    plugins = config.plugins.user
    usr = 'usr'
  } else {
    man = 'admmanpage'
    plugins = config.plugins.admin
    usr = 'adm'
  }

  config.plugins[usr] = { en: '', id: '' }
  const languageCode = ['en', 'id']

  languageCode.forEach((lc) => {
    let kbd = []
    let lang = utils.locale[lc]
    let manpage = []
    let size = 3

    // Slice plugins array into 3 columns arrays
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
    // Slice kbd array into 3 columns x 3 rows arrays pages)
    for (let b = 0; b < kbd.length; b += 3) {
      manpage.push(kbd.slice(b, b + 3))
    }
    // Add navigation button to each pages
    for (let p = 0; p < manpage.length; p++) {
      let mainmenuBtn = [{
        text: `${lang.mainmenu.btn}`,
        callback_data: 'mainMenu_'
      }]
      let prev = p - 1
      prev = (prev < 0) ? 'mainMenu_' : `${man}_${prev}`
      let next = p + 1
      // After first page
      if (next > 1) {
        mainmenuBtn.unshift({
          text: `${lang.dialog.prev}`,
          callback_data: prev
        })
      }
      // Before last page
      if (next < manpage.length) {
        mainmenuBtn.push({
          text: `${lang.dialog.next}`,
          callback_data: `${man}_${next}`
        })
      }
      manpage[p].push(mainmenuBtn)
    }
    config.plugins[usr][lc] = JSON.stringify(manpage)
    utils.saveToFile(cfg, config, true)
  })
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
  let command = msg.data.match(/^.+?_/)
  let lang = utils.getUserLang(msg)
  let navi = [{
    text: `${lang.mainmenu.btn}`,
    callback_data: 'mainMenu_'
  }]
  let params = {
    chat_id: msg.message.chat.id,
    disable_web_page_preview: 'true',
    message_id: msg.message.message_id,
    parse_mode: 'HTML'
  }
  let text

  switch (command[0]) {
    case 'admmanpage_':
      if (!config.plugins.adm) { buildKbdPage('admin') }
      const admKbd = JSON.parse(config.plugins.adm[lang.code])
      const admCmdNum = msg.data.substr(11)
      params.reply_markup = {
        inline_keyboard: admKbd[admCmdNum]
      }
      bot.editMessageText(`${lang.admin.info}`, params).catch((error) => {
        console.log(`=> menu.js: ${error.response.body.description}`)
      })
      break
    case 'cmd_':
      const plug = msg.data.substr(10)
      let type = msg.data.substr(4, 3)
      type = (type === 'usr') ? 'manpage' : 'admmanpage'
      navi.unshift({
        text: `${lang.dialog.back}`,
        callback_data: `${type}_${msg.data.charAt(8)}`
      })
      params.reply_markup = {
        inline_keyboard: [navi]
      }
      bot.editMessageText(`${lang[plug].info}`, params).catch((error) => {
        console.log(`=> menu.js: ${error.response.body.description}`)
      })
      break
    case 'links_':
      params.reply_markup = {
        inline_keyboard: [[{
          text: `${lang.dialog.source}`,
          url: 'https://github.com/rizaumami/TGramIndoBot'
        }, {
          text: 'TGramIndo',
          url: 'https://t.me/tgramindo'
        }], [{
          text: `${lang.groups.btn}`,
          callback_data: 'lnk_groups'
        }, {
          text: `${lang.about.btn}`,
          callback_data: 'lnk_about'
        }], [{
          text: `${lang.dialog.back}`,
          callback_data: 'mainMenu_'
        }]]
      }
      bot.editMessageText(`${lang.links.info}`, params).catch((error) => {
        console.log(`=> menu.js: ${error.response.body.description}`)
      })
      break
    case 'lnk_':
      const lnk = msg.data.substr(4)
      navi.unshift({
        text: `${lang.dialog.back}`,
        callback_data: 'links_'
      })
      params.reply_markup = {
        inline_keyboard: [navi]
      }

      if (lnk === 'groups') {
        config = utils.readJSONFile(cfg)

        if (config.groups) {
          bot.editMessageText(config.groups, params).catch((error) => {
            console.log(`=> menu.js: ${error.response.body.description}`)
          })
        } else {
          bot.editMessageText(`${lang.groups.dlg[0]}`, params).catch((error) => {
            console.log(`=> menu.js: ${error.response.body.description}`)
          })
        }
      } else {
        bot.editMessageText(`${lang[lnk].info}`, params).catch((error) => {
          console.log(`=> menu.js: ${error.response.body.description}`)
        })
      }
      break
    case 'manpage_':
      if (!config.plugins.usr) { buildKbdPage('user') }
      const usrKbd = JSON.parse(config.plugins.usr[lang.code])
      const usrCmdNum = msg.data.substr(8)
      params.reply_markup = {
        inline_keyboard: usrKbd[usrCmdNum]
      }
      bot.editMessageText(`${lang.cmds.info}`, params).catch((error) => {
        console.log(`=> menu.js: ${error.response.body.description}`)
      })
      break
    case 'mainMenu_':
      const initKbd = utils.initialKeyboard(lang)
      text = `<b>Hai ${utils.escapeHtml(msg.from.first_name)},</b>\n\n${lang.start.info}`
      params.reply_markup = {
        inline_keyboard: initKbd
      }
      bot.editMessageText(text, params).catch((error) => {
        console.log(`=> menu.js: ${error.response.body.description}`)
      })
      break
    case 'setlang_':
      const setlangCode = msg.data.substr(8)
      lang = utils.locale[`${setlangCode}`]
      const setlangParams = params
      navi.unshift({
        text: `${lang.dialog.back}`,
        callback_data: 'settings_'
      })
      setlangParams.reply_markup = {
        inline_keyboard: [navi]
      }
      db[msg.from.id] = {lang: setlangCode}
      utils.saveToFile(config.database.DB, db)

      let choosenLang = ''
      if (setlangCode === 'en') choosenLang = '🇬🇧 English'
      if (setlangCode === 'id') choosenLang = '🇮🇩 Bahasa Indonesia'

      text = `${lang.settedlang.info} <b>${choosenLang}</b>!`
      bot.editMessageText(text, setlangParams).catch((error) => {
        console.log(`=> menu.js: ${error.response.body.description}`)
      })
      break
    case 'settings_':
      text = `<b>${lang.selectlang.btn}:</b>`
      params.reply_markup = {
        inline_keyboard: langKeyboard
      }
      bot.editMessageText(text, params).catch((error) => {
        console.log(`=> menu.js: ${error.response.body.description}`)
      })
      break
  }
})
