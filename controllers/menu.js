'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')
const escapeHtml = require('escape-html')
const utils = require('../core/utils')
const locale = utils.locale
let db = utils.db

// Menu #1
function initialKeyboard (lang) {
  return [[{
    text: `${lang.links_btn}`,
    callback_data: 'links'
  }, {
    text: `${lang.admin_btn}`,
    callback_data: 'ahelps'
  }, {
    text: `${lang.cmds_btn}`,
    callback_data: 'cmds_1'
  }], [{
    text: 'Inline Mode',
    switch_inline_query: '/'
  }, {
    text: `${lang.settings_btn}`,
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

  bot.sendMessage(msg.from.id, `<b>Hai ${name},</b>\n\n${lang.start_info}`, {
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: initKbd
    }
  }).catch((error) => {
    if (error) {
      bot.getMe().then(me => { console.log(me) })
      bot.sendMessage(msg.chat.id, `Please <a href="https://t.me/${config.BOT_UNAME}?start=help">message me privately</a> for a list of commands.`, utils.optionalParams(msg))
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
        text: `${settedLang.back_btn}`,
        callback_data: 'settings'
      }, {
        text: `${settedLang.mainmenu_btn}`,
        callback_data: 'mainMenu'
      }]]
    }

    db.push(`/${msg.from.id}/`, {lang: setlangCode}, false)

    let choosenLang = ''
    if (setlangCode === 'en') choosenLang = '🇬🇧 English'
    if (setlangCode === 'id') choosenLang = '🇮🇩 Bahasa Indonesia'
    bot.editMessageText(`${settedLang.settedlang_info} <b>${choosenLang}</b>!`, setlangParams).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'mainMenu') {
    const initKbd = initialKeyboard(lang)
    params.reply_markup = {
      inline_keyboard: initKbd
    }
    bot.editMessageText(`<b>Hai ${name},</b>\n\n${lang.start_info}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'links') {
    params.reply_markup = {
      inline_keyboard: [[{
        text: `${lang.source_btn}`,
        url: 'https://github.com/rizaumami/TGramIndoBot'
      }, {
        text: 'TGramIndo',
        url: 'https://t.me/tgramindo'
      }], [{
        text: `${lang.grouproll_btn}`,
        callback_data: 'lnk_grouproll'
      }, {
        text: `${lang.about_btn}`,
        callback_data: 'lnk_about'
      }], [{
        text: `${lang.back_btn}`,
        callback_data: 'mainMenu'
      }]]
    }
    bot.editMessageText(`${lang.link_info}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'ahelps') {
    params.reply_markup = {
      inline_keyboard: [[{
        text: `${lang.banhammer_btn}`,
        callback_data: 'adm_banhammer'
      }, {
        text: `${lang.superuser_btn}`,
        callback_data: 'adm_superuser'
      }, {
        text: `${lang.globaladmin_btn}`,
        callback_data: 'adm_globaladmin'
      }], [{
        text: 'Group Roll',
        callback_data: 'adm_grouproll'
      }, {
        text: `${lang.ingroup_btn}`,
        callback_data: 'adm_ingroup'
      }, {
        text: `${lang.repost_btn}`,
        callback_data: 'adm_repost'
      }], [{
        text: `${lang.back_btn}`,
        callback_data: 'mainMenu'
      }]]
    }
    bot.editMessageText(`${lang.admin_info}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'cmds_1') {
    params.reply_markup = {
      inline_keyboard: [[{
        text: `${lang.bing_btn}`,
        callback_data: 'cmd_1_bing'
      }, {
        text: `${lang.dictionary_btn}`,
        callback_data: 'cmd_1_dictionary'
      }, {
        text: `${lang.get_btn}`,
        callback_data: 'cmd_1_get'
      }], [{
        text: `${lang.hackernews_btn}`,
        callback_data: 'cmd_1_hackernews'
      }, {
        text: `${lang.id_btn}`,
        callback_data: 'cmd_1_id'
      }, {
        text: `${lang.jsondump_btn}`,
        callback_data: 'cmd_1_jsondump'
      }], [{
        text: `${lang.kaskus_btn}`,
        callback_data: 'cmd_1_kaskus'
      }, {
        text: `${lang.kbbi_btn}`,
        callback_data: 'cmd_1_kbbi'
      }, {
        text: `${lang.maps_btn}`,
        callback_data: 'cmd_1_maps'
      }], [{
        text: `${lang.mainmenu_btn}`,
        callback_data: 'mainMenu'
      }, {
        text: `${lang.next_btn}`,
        callback_data: 'cmds_2'
      }]]
    }
    bot.editMessageText(`${lang.cmds_info}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'cmds_2') {
    params.reply_markup = {
      inline_keyboard: [[{
        text: `${lang.math_btn}`,
        callback_data: 'cmd_2_math'
      }, {
        text: `${lang.patterns_btn}`,
        callback_data: 'cmd_2_patterns'
      }, {
        text: `${lang.reddit_btn}`,
        callback_data: 'cmd_2_reddit'
      }], [{
        text: `${lang.salat_btn}`,
        callback_data: 'cmd_2_salat'
      }, {
        text: `${lang.urbandictionary_btn}`,
        callback_data: 'cmd_2_urbandictionary'
      }], [{
        text: `${lang.mainmenu_btn}`,
        callback_data: 'mainMenu'
      }, {
        text: `${lang.prev_btn}`,
        callback_data: 'cmds_1'
      }]]
    }
    bot.editMessageText(`${lang.cmds_info}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data === 'settings') {
    params.reply_markup = {
      inline_keyboard: langKeyboard
    }
    bot.editMessageText(`<b>${lang.selectlang_btn}:</b>`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data.match(/^cmd_/)) {
    const plug = msg.data.slice(6) + '_info'
    params.reply_markup = {
      inline_keyboard: [[{
        text: `${lang.back_btn}`,
        callback_data: `cmds_${msg.data.charAt(4)}`
      }, {
        text: `${lang.mainmenu_btn}`,
        callback_data: 'mainMenu'
      }]]
    }
    bot.editMessageText(`${lang[plug]}`, params).catch((error) => console.log(error.response.body))
  }

  const ahelpParams = params
  ahelpParams.reply_markup = {
    inline_keyboard: [[{
      text: `${lang.back_btn}`,
      callback_data: 'ahelps'
    }, {
      text: `${lang.mainmenu_btn}`,
      callback_data: 'mainMenu'
    }]]
  }

  if (msg.data.match(/^adm_/)) {
    const plug = msg.data.slice(4) + '_info'
    bot.editMessageText(`${lang[plug]}`, ahelpParams).catch((error) => console.log(error.response.body))
  }

  const lnkParams = params
  lnkParams.reply_markup = {
    inline_keyboard: [[{
      text: `${lang.back_btn}`,
      callback_data: 'links'
    }, {
      text: `${lang.mainmenu_btn}`,
      callback_data: 'mainMenu'
    }]]
  }

  if (msg.data.match(/^lnk_/)) {
    const plug = msg.data.slice(4) + '_info'

    if (plug === 'grouproll_info') {
      try {
        db.reload()
        const data = db.getData('/grouproll')

        bot.editMessageText(data, lnkParams).catch((error) => console.log(error.response.body))
      } catch (error) {
        bot.editMessageText('Still empty, please comeback latter.', lnkParams).catch((error) => console.log(error.response.body))
      }
    } else {
      bot.editMessageText(`${lang[plug]}`, lnkParams).catch((error) => console.log(error.response.body))
    }
  }
})
