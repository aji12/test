'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const fs = require('fs')
const locale = require('../core/locale.json')
const request = require('request')

const utilities = {}

utilities.locale = locale

utilities.buildUserName = function (user) {
  let name = `<b>${utilities.escapeHtml(user.first_name)}</b>`

  if (user.last_name) name += ` <b>${utilities.escapeHtml(user.last_name)}</b>`
  if (user.username) name += ` (@${user.username})`

  name += ` [<code>${user.id}</code>]`

  return name
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
  const lang = utilities.getUserLang(msg)
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(input)

  request(url, function (error, response, body) {
    if (error) {
      bot.sendMessage(msg.chat.id, `${lang.error[0]}`, utilities.optionalParams(msg))
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
  let db = utilities.readJSONFile(config.database.DB)
  let lang = msg.from.language_code ? msg.from.language_code : 'en'
  lang = lang.match(/^id/i) ? 'id' : 'en'

  try {
    const dbLang = db[msg.from.id].lang
    if (dbLang) {
      lang = dbLang
    }
  } catch (error) {
    console.error(error.message)
    db[msg.from.id] = {lang: lang}
    utilities.saveToFile(config.database.DB, db)
  }

  return locale[`${lang}`]
}

// Menu #1
utilities.initialKeyboard = function (lang) {
  return [[{
    text: `${lang.admin.btn}`,
    callback_data: 'admmanpage_0'
  }, {
    text: `${lang.cmds.btn}`,
    callback_data: 'manpage_0'
  }], [{
    text: `${lang.links.btn}`,
    callback_data: 'links_'
  }, {
    text: `${lang.settings.btn}`,
    callback_data: 'settings_'
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

utilities.readJSONFile = function (file) {
  const json = JSON.parse(fs.readFileSync(file, 'utf8'))
  return json
}

// https://stackoverflow.com/questions/3561493
utilities.regexEscape = function (str) {
  return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
}

utilities.reloadModule = function (module) {
  delete require.cache[require.resolve(module)]
  return require(module)
}

utilities.saveToFile = function (file, data, humanReadable) {
  try {
    if (humanReadable) {
      data = JSON.stringify(data, null, 2)
    } else {
      data = JSON.stringify(data)
    }
    fs.writeFileSync(file, data, 'utf8')
    console.log(`Data saved to ${file}`)
  } catch (err) {
    console.log("Can't save the data")
  }
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
