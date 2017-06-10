'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')
const locale = utils.locale
let db = utils.db

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
  const name = utils.escapeHtml(msg.from.first_name)
  let params = utils.optionalParams(msg.message)
  params.chat_id = msg.message.chat.id
  params.message_id = msg.message.message_id
  let lang = utils.getUserLang(msg)

  if (msg.data.match(/^setlang_/)) {
    const setlangCode = msg.data.slice(8)
    const settedLang = locale[`${setlangCode}`]
    const setlangParams = params
    setlangParams.reply_markup = {
      inline_keyboard: [[{
        text: `${settedLang.back.btn}`,
        callback_data: 'settings'
      }, {
        text: `${settedLang.mainmenu.btn}`,
        callback_data: 'mainMenu'
      }]]
    }

    db.push(`/${msg.from.id}/`, {lang: setlangCode}, false)

    let choosenLang = ''
    if (setlangCode === 'en') choosenLang = '🇬🇧 English'
    if (setlangCode === 'id') choosenLang = '🇮🇩 Bahasa Indonesia'
    bot.editMessageText(`${settedLang.settedlang.info} <b>${choosenLang}</b>!`, setlangParams).catch((error) => console.log(error.response.body))
  }

  switch (msg.data) {
    case 'mainMenu':
      const initKbd = utils.initialKeyboard(lang)
      params.reply_markup = {
        inline_keyboard: initKbd
      }
      bot.editMessageText(`<b>Hai ${name},</b>\n\n${lang.start.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'links':
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
          callback_data: 'mainMenu'
        }]]
      }
      bot.editMessageText(`${lang.links.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'ahelps':
      params.reply_markup = {
        inline_keyboard: [[{
          text: `${lang.banhammer.btn}`,
          callback_data: 'adm_banhammer'
        }, {
          text: `${lang.superuser.btn}`,
          callback_data: 'adm_superuser'
        }, {
          text: `${lang.globaladmin.btn}`,
          callback_data: 'adm_globaladmin'
        }], [{
          text: 'Group Roll',
          callback_data: 'adm_grouproll'
        }, {
          text: `${lang.ingroup.btn}`,
          callback_data: 'adm_ingroup'
        }, {
          text: `${lang.repost.btn}`,
          callback_data: 'adm_repost'
        }], [{
          text: `${lang.back.btn}`,
          callback_data: 'mainMenu'
        }]]
      }
      bot.editMessageText(`${lang.admin.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'cmds_1':
      params.reply_markup = {
        inline_keyboard: [[{
          text: `${lang.bing.btn}`,
          callback_data: 'cmd_1_bing'
        }, {
          text: `${lang.dictionary.btn}`,
          callback_data: 'cmd_1_dictionary'
        }, {
          text: `${lang.get.btn}`,
          callback_data: 'cmd_1_get'
        }], [{
          text: `${lang.hackernews.btn}`,
          callback_data: 'cmd_1_hackernews'
        }, {
          text: `${lang.help.btn}`,
          callback_data: 'cmd_1_help'
        }, {
          text: `${lang.id.btn}`,
          callback_data: 'cmd_1_id'
        }], [{
          text: `${lang.jsondump.btn}`,
          callback_data: 'cmd_1_jsondump'
        }, {
          text: `${lang.kaskus.btn}`,
          callback_data: 'cmd_1_kaskus'
        }, {
          text: `${lang.kbbi.btn}`,
          callback_data: 'cmd_1_kbbi'
        }], [{
          text: `${lang.mainmenu.btn}`,
          callback_data: 'mainMenu'
        }, {
          text: `${lang.next.btn}`,
          callback_data: 'cmds_2'
        }]]
      }
      bot.editMessageText(`${lang.cmds.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'cmds_2':
      params.reply_markup = {
        inline_keyboard: [[{
          text: `${lang.maps.btn}`,
          callback_data: 'cmd_1_maps'
        }, {
          text: `${lang.math.btn}`,
          callback_data: 'cmd_2_math'
        }, {
          text: `${lang.patterns.btn}`,
          callback_data: 'cmd_2_patterns'
        }], [{
          text: `${lang.quran.btn}`,
          callback_data: 'cmd_2_quran'
        }, {
          text: `${lang.reddit.btn}`,
          callback_data: 'cmd_2_reddit'
        }], [{
          text: `${lang.salat.btn}`,
          callback_data: 'cmd_2_salat'
        }, {
          text: `${lang.urbandictionary.btn}`,
          callback_data: 'cmd_2_urbandictionary'
        }], [{
          text: `${lang.prev.btn}`,
          callback_data: 'cmds_1'
        }, {
          text: `${lang.mainmenu.btn}`,
          callback_data: 'mainMenu'
        }]]
      }
      bot.editMessageText(`${lang.cmds.info}`, params).catch((error) => console.log(error.response.body))
      break
    case 'settings':
      params.reply_markup = {
        inline_keyboard: langKeyboard
      }
      bot.editMessageText(`<b>${lang.selectlang.btn}:</b>`, params).catch((error) => console.log(error.response.body))
      break
  }

  if (msg.data.match(/^cmd_/)) {
    const plug = msg.data.slice(6)
    params.reply_markup = {
      inline_keyboard: [[{
        text: `${lang.back.btn}`,
        callback_data: `cmds_${msg.data.charAt(4)}`
      }, {
        text: `${lang.mainmenu.btn}`,
        callback_data: 'mainMenu'
      }]]
    }
    bot.editMessageText(`${lang[plug].info}`, params).catch((error) => console.log(error.response.body))
  }

  let navi = [{text: `${lang.mainmenu.btn}`, callback_data: 'mainMenu'}]

  if (msg.data.match(/^adm_/)) {
    const plug = msg.data.slice(4)
    navi.unshift({
      text: `${lang.back.btn}`,
      callback_data: 'ahelps'
    })
    params.reply_markup = {inline_keyboard: [navi]}

    bot.editMessageText(`${lang[plug].info}`, params).catch((error) => console.log(error.response.body))
  }

  if (msg.data.match(/^lnk_/)) {
    const plug = msg.data.slice(4)
    navi.unshift({
      text: `${lang.back.btn}`,
      callback_data: 'links'
    })
    params.reply_markup = {inline_keyboard: [navi]}

    if (plug === 'grouproll') {
      try {
        db.reload()
        const data = db.getData('/grouproll')

        bot.editMessageText(data, params).catch((error) => console.log(error.response.body))
      } catch (error) {
        bot.editMessageText('Still empty, please comeback latter.', params).catch((error) => console.log(error.response.body))
      }
    } else {
      bot.editMessageText(`${lang[plug].info}`, params).catch((error) => console.log(error.response.body))
    }
  }
})
