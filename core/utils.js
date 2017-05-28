'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')
const escapeHtml = require('escape-html')
const JsonDB = require('node-json-db')
const locale = require('../core/locale.json')
const request = require('request')

const Util = {}

Util.db = new JsonDB(config.DATABASE, true, false)
Util.locale = locale

Util.startsWith = function (string, what) {
  return string.slice(0, what.length) === what
}

Util.parseInline = function (message, commandName, options = {}) {
  options.noRequireTrigger = true

  return this.parseCommand(message, commandName, options)
}

// http://stackoverflow.com/a/2117523
Util.makeUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
  /[xy]/g,
  c => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  }
)

Util.buildUserName = function (user, parse) {
  let name = ''

  if (user.first_name) name += escapeHtml(user.first_name) + ' '
  if (user.last_name) name += escapeHtml(user.last_name) + ' '

  if (parse === 'html') {
    if (user.username) name = `<b>${name}</b> @${user.username} [<code>${user.id}</code>] `
  } else {
    if (user.username) name += `@${user.username} [${user.id}] `
  }

  return name.trim()
}

Util.buildChatName = function (chat, parse) {
  let name = ''

  if (chat.first_name) name += escapeHtml(chat.first_name) + ' '
  if (chat.last_name) name += escapeHtml(chat.last_name) + ' '
  if (chat.title) name = escapeHtml(chat.title) + ' '

  if (parse === 'html') {
    if (chat.username) name = `<b>${name}</b> @${chat.username} [<code>${chat.id}</code>] `
  } else {
    if (chat.username) name += `@${chat.username} [${chat.id}] `
  }
  // if (chat.type) name += `(${chat.type}) `;

  return name.trim()
}

Util.getUserLang = function (msg) {
  let lang = msg.from.language_code ? msg.from.language_code.toLowerCase() : 'en'
  lang = lang.match(/id/) ? 'id' : 'en'

  try {
    Util.db.reload()
    const dbLang = Util.db.getData(`/${msg.from.id}/lang`, false)
    if (dbLang) {
      lang = dbLang
    }
  } catch (error) {
    console.error(error.message)
  }

  return locale[`${lang}`]
}

Util.sendError = function (msg, error) {
  let err = JSON.parse(error.response.body)

  bot.sendMessage(msg.chat.id, `${err.description}`, {
    reply_to_message_id: msg.message_id,
    parse_mode: 'HTML'
  })
}

Util.optionalParams = function (msg) {
  const opts = {
    reply_to_message_id: msg.message_id,
    disable_web_page_preview: 'true',
    parse_mode: 'HTML'
  }
  return opts
}

// https://stackoverflow.com/questions/3561493
Util.regexEscape = function (str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

// Gets coordinates for a location.
Util.getCoord = function (msg, input, callback) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(input)

  request(url, function (error, response, body) {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Connection error.', Util.optionalParams(msg))
    } else {
      const coord = JSON.parse(body)
      if (coord.status === 'ZERO_RESULTS') {
        bot.sendMessage(msg.chat.id, coord.status, Util.optionalParams(msg))
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

module.exports = Util
