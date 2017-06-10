'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const JsonDB = require('node-json-db')
const locale = require('../core/locale.json')
const request = require('request')

const utilities = {}

utilities.db = new JsonDB(config.database.DB, true, false)
utilities.locale = locale

utilities.buildChatName = function (chat, parse) {
  let name = ''

  if (chat.first_name) name += utilities.escapeHtml(chat.first_name) + ' '
  if (chat.last_name) name += utilities.escapeHtml(chat.last_name) + ' '
  if (chat.title) name = utilities.escapeHtml(chat.title) + ' '

  if (parse === 'html') {
    if (chat.username) name = `<b>${name}</b> @${chat.username} [<code>${chat.id}</code>] `
  } else {
    if (chat.username) name += `@${chat.username} [${chat.id}] `
  }
  // if (chat.type) name += `(${chat.type}) `;

  return name.trim()
}

utilities.buildUserName = function (user, parse) {
  let name = ''

  if (user.first_name) name += utilities.escapeHtml(user.first_name) + ' '
  if (user.last_name) name += utilities.escapeHtml(user.last_name) + ' '

  if (parse === 'html') {
    if (user.username) name = `<b>${name}</b> @${user.username} [<code>${user.id}</code>] `
  } else {
    if (user.username) name += `@${user.username} [${user.id}] `
  }

  return name.trim()
}

utilities.escapeHtml = function (string) {
  const matchHtmlRegExp = /["'<>]/
  const str = '' + string
  const match = matchHtmlRegExp.exec(str)

  if (!match) {
    return str
  }

  let escape
  let html = ''
  let index = 0
  let lastIndex = 0

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot'
        break
      // case 38: // &
        // escape = '&amp'
        // break
      case 39: // '
        escape = '&#39'
        break
      case 60: // <
        escape = '&lt'
        break
      case 62: // >
        escape = '&gt'
        break
      default:
        continue
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index)
    }

    lastIndex = index + 1
    html += escape
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html
}

// Gets coordinates for a location.
utilities.getCoord = function (msg, input, callback) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(input)

  request(url, function (error, response, body) {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Connection error.', utilities.optionalParams(msg))
    } else {
      const coord = JSON.parse(body)
      if (coord.status === 'ZERO_RESULTS') {
        bot.sendMessage(msg.chat.id, coord.status, utilities.optionalParams(msg))
      } else {
        const geo = {
          lat: coord.results[0].geometry.location.lat,
          lon: coord.results[0].geometry.location.lng,
          formatted_address: coord.results[0].formatted_address
        }
        callback(geo)
      }
    }
  })
}
utilities.getUserLang = function (msg) {
  let lang = msg.from.language_code ? msg.from.language_code : 'en'
  lang = lang.match(/^id/i) ? 'id' : 'en'

  try {
    utilities.db.reload()
    const dbLang = utilities.db.getData(`/${msg.from.id}/lang`, false)
    if (dbLang) {
      lang = dbLang
    }
  } catch (error) {
    console.error(error.message)
  }

  return locale[`${lang}`]
}

// Menu #1
utilities.initialKeyboard = function (lang) {
  return [[{
    text: `${lang.admin.btn}`,
    callback_data: 'ahelps'
  }, {
    text: `${lang.cmds.btn}`,
    callback_data: 'cmds_1'
  }], [{
    text: `${lang.links.btn}`,
    callback_data: 'links'
  }, {
    text: `${lang.settings.btn}`,
    callback_data: 'settings'
  }]]
}

utilities.optionalParams = function (msg) {
  const opts = {
    reply_to_message_id: msg.message_id,
    disable_web_page_preview: 'true',
    parse_mode: 'HTML'
  }
  return opts
}

utilities.parseInline = function (message, commandName, options = {}) {
  options.noRequireTrigger = true

  return this.parseCommand(message, commandName, options)
}

// https://stackoverflow.com/questions/3561493
utilities.regexEscape = function (str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

utilities.sendError = function (msg, error) {
  let err = JSON.parse(error.response.body)

  bot.sendMessage(msg.chat.id, `${err.description}`, {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML'
  })
}

utilities.startsWith = function (string, what) {
  return string.slice(0, what.length) === what
}

module.exports = utilities
