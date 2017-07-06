'use strict'

const config = require('../data/config.json')
const fs = require('fs')
const locale = require('../core/locale.json')
const moment = require('moment')
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

// Temporary function until node-telegram-bot-api provide this
utilities.deleteMessage = function (chatId, messageId) {
  const url = `https://api.telegram.org/bot${config.bot.TOKEN}/deleteMessage`

  request.post(url, {
    form: {
      chat_id: chatId,
      message_id: messageId
    }
  }, (error, response, body) => {
    if (error) {
      return console.log(`=> utils.js: ${error.response.body.description}`)
    }
  })
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

// Convert msg.date to human readable format
utilities.formatMsgDate = function (msg, utc) {
  let ft
  const lang = utilities.getUserLang(msg)
  moment.locale(`${lang.code}`)

  if (utc) {
    ft = `${moment.utc(msg.date * 1000).format('LLLL')}`
  } else {
    ft = `${moment(msg.date * 1000).format('LLLL')}`
  }
  return ft
}

// Gets coordinates for a location.
utilities.getGeoLocation = function (msg, address, callback) {
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(address)
  let geo = {}

  request(url, function (error, response, body) {
    if (error) {
      geo = { status: error }
    } else {
      const jgeo = JSON.parse(body)

      if (jgeo.status !== 'OK') {
        geo = { status: jgeo.status }
      } else {
        geo = {
          status: jgeo.status,
          latitude: jgeo.results[0].geometry.location.lat,
          longitude: jgeo.results[0].geometry.location.lng,
          formatted_address: jgeo.results[0].formatted_address
        }
      }
      callback(geo)
    }
  })
}

// Gets timezone for a location.
utilities.getTime = function (msg, latitude, longitude, callback) {
  const parameters = `location=${latitude},${longitude}&timestamp=${msg.date}`
  const url = 'https://maps.googleapis.com/maps/api/timezone/json?'

  request(url + parameters, (error, response, body) => {
    let time = {}

    if (error) {
      time = { status: error }
    } else {
      const tz = JSON.parse(body)

      if (tz.status !== 'OK') {
        time = { status: tz.status }
      } else {
        time = tz
      }
      callback(time)
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
    console.log(`=> utils.js: Data saved to ${file}`)
  } catch (err) {
    console.log(`=> utils.js: Can't save the data`)
  }
}

utilities.startsWith = function (string, what) {
  return string.slice(0, what.length) === what
}

module.exports = utilities
