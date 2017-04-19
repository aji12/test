'use strict'

const bot = require('../core/telegram')
const escapeHtml = require('escape-html')
const JsonDB = require('node-json-db')
const locale = require('../core/locale.json')
const utils = require('../core/utils')

let db = new JsonDB('db.json', true, false)

// Menu #1
function initialKeyboard (lang) {
  return [[{
    text: `${lang.links}`,
    callback_data: 'links'
  }, {
    text: `${lang.admin}`,
    callback_data: 'ahelps'
  }, {
    text: `${lang.cmds}`,
    callback_data: 'cmds'
  }], [{
    text: 'Inline Mode',
    switch_inline_query: '/'
  }, {
    text: `${lang.settings}`,
    callback_data: 'settings'
  }]]
}

// Language settings
const langKeyboard = [[{
  text: '🇬🇧 English',
  callback_data: 'setlang_en'
}, {
  text: '🇮🇩 Bahasa Indonesia',
  callback_data: 'setlang_id'
}]]

// Common request options
function cbOptions (msg) {
  return {
    disable_web_page_preview: 'true',
    parse_mode: 'HTML',
    message_id: msg.message.message_id,
    chat_id: msg.message.chat.id
  }
}

bot.onText(/^[/!#]start$/, msg => {
  bot.sendMessage(msg.from.id, `*Select language:*`, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: langKeyboard
    }
  })
})

bot.onText(/^[/!#]help$/, msg => {
  const name = escapeHtml(msg.from.first_name)
  let lang = utils.getUserLang(msg)
  const initKbd = initialKeyboard(lang)

  bot.sendMessage(msg.from.id, `<b>Hai ${name},</b>\n\n${lang.start}`, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: initKbd
    }
  }).catch((error) => {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Please message me privately for a list of commands.', {
        reply_to_message_id: msg.message_id}
      )
    }
  })
})

bot.on('callback_query', msg => {
  const name = escapeHtml(msg.from.first_name)
  let params = cbOptions(msg)
  let lang = utils.getUserLang(msg)

  if (msg.data.match(/^setlang_/)) {
    const setlangCode = msg.data.slice(8)
    const settedLang = locale[`${setlangCode}`]
    const setlangParams = params
    setlangParams.reply_markup = {
      inline_keyboard: [[{
        text: `${settedLang.back}`,
        callback_data: 'settings'
      }, {
        text: `${settedLang.mainmenu}`,
        callback_data: 'mainMenu'
      }]]
    }

    db.push(`/${msg.from.id}/`, {lang: setlangCode})

    let choosenLang = ''
    if (setlangCode === 'en') choosenLang = '🇬🇧 English'
    if (setlangCode === 'id') choosenLang = '🇮🇩 Bahasa Indonesia'
    bot.editMessageText(`${settedLang.settedlang} <b>${choosenLang}</b>!`, setlangParams).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'mainMenu') {
    const initKbd = initialKeyboard(lang)
    params.reply_markup = {
      inline_keyboard: initKbd
    }
    bot.editMessageText(`<b>Hai ${name},</b>\n\n${lang.start}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'links') {
    params.reply_markup = {
      inline_keyboard: [[{
        text: `${lang.source}`,
        url: 'https://github.com/rizaumami/TGramIndoBot'
      }, {
        text: 'TGramIndo',
        url: 'https://t.me/tgramindo'
      }], [{
        text: `${lang.back}`,
        callback_data: 'mainMenu'
      }, {
        text: `${lang.about_help}`,
        callback_data: 'about_about'
      }]]
    }
    bot.editMessageText(`${lang.link}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'ahelps') {
    params.reply_markup = {
      inline_keyboard: [[{
        text: `🔨 ${lang.banhammer_help}`,
        callback_data: 'adm_banhammer'
      }, {
        text: `🔰 ${lang.superuser_help}`,
        callback_data: 'adm_superuser'
      }], [{
        text: `🛃 ${lang.globaladmin_help}`,
        callback_data: 'adm_globaladmin'
      }, {
        text: `👥 ${lang.ingroup_help}`,
        callback_data: 'adm_ingroup'
      }], [{
        text: `${lang.back}`,
        callback_data: 'mainMenu'
      }]]
    }
    bot.editMessageText(`${lang.ahelp}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'cmds') {
    params.reply_markup = {
      inline_keyboard: [[{
        text: 'Bing',
        callback_data: 'cmd_bing'
      }, {
        text: 'Get',
        callback_data: 'cmd_get'
      }], [{
        text: 'ID',
        callback_data: 'cmd_id'
      }, {
        text: 'JSON dump',
        callback_data: 'cmd_jsondump'
      }, {
        text: 'Kaskus',
        callback_data: 'cmd_kaskus'
      }], [{
        text: 'KBBI',
        callback_data: 'cmd_kbbi'
      }, {
        text: 'Math',
        callback_data: 'cmd_math'
      }, {
        text: 'Patterns',
        callback_data: 'cmd_patterns'
      }], [{
        text: 'Reddit',
        callback_data: 'cmd_reddit'
      }, {
        text: 'Repost',
        callback_data: 'cmd_repost'
      }, {
        text: 'Urban Dictionary',
        callback_data: 'cmd_urbandictionary'
      }], [{
        text: `${lang.back}`,
        callback_data: 'mainMenu'
      }]]
    }
    bot.editMessageText(`${lang.cmdhelp}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'settings') {
    params.reply_markup = {
      inline_keyboard: langKeyboard
    }
    bot.editMessageText(`<b>${lang.selectlang}:</b>`, params).catch((error) => console.log(error.response.body))
  }

  const cmdParams = params
  cmdParams.reply_markup = {
    inline_keyboard: [[{
      text: `${lang.back}`,
      callback_data: 'cmds'
    }, {
      text: `${lang.mainmenu}`,
      callback_data: 'mainMenu'
    }]]
  }

  if (msg.data.match(/^cmd_/)) {
    const plug = msg.data.slice(4)
    bot.editMessageText(`${lang[plug]}`, cmdParams).catch((error) => console.log(error.response.body))
  }

  const ahelpParams = params
  ahelpParams.reply_markup = {
    inline_keyboard: [[{
      text: `${lang.back}`,
      callback_data: 'ahelps'
    }, {
      text: `${lang.mainmenu}`,
      callback_data: 'mainMenu'
    }]]
  }

  if (msg.data.match(/^adm_/)) {
    const plug = msg.data.slice(4) + 'info'
    bot.editMessageText(`${lang[plug]}`, cmdParams).catch((error) => console.log(error.response.body))
  }

  const lnkParams = params
  lnkParams.reply_markup = {
    inline_keyboard: [[{
      text: `${lang.back}`,
      callback_data: 'links'
    }, {
      text: `${lang.mainmenu}`,
      callback_data: 'mainMenu'
    }]]
  }

  if (msg.data.match(/^about_/)) {
    const plug = msg.data.slice(6) + 'info'
    bot.editMessageText(`${lang[plug]}`, lnkParams).catch((error) => console.log(error.response.body))
  }
})
