'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const request = require('request')
const utils = require('../core/utils')

bot.onText(/^[/!#](forecast|weather) (.+)/, (msg, match) => {
  const address = encodeURIComponent(match[2])

  utils.getGeoLocation(msg, address, (geo) => {
    if (geo.status !== 'OK') {
      return bot.reply(msg, `<code>${geo.status}</code>`)
    }
    const baseUrl = 'https://api.darksky.net/forecast/'
    const units = '?units=si'
    const url = `${baseUrl}${config.forecast.KEY}/${geo.latitude},${geo.longitude}${units}`

    request(url, (error, response, body) => {
      if (error) {
        bot.reply(msg, `API query failure: <code>${error.message}</code>`)
        return
      }
      if (response.statusCode !== 200) {
        bot.reply(msg, `<code>${response.statusMessage}</code>`)
        return
      }

      const jcast = JSON.parse(body)
      let forecast = `It's currently ${jcast.currently.temperature}°C (feels like ${jcast.currently.apparentTemperature}°C) in ${geo.formatted_address}.`
      forecast += `\n${jcast.currently.summary}. ${jcast.daily.summary}`

      bot.reply(msg, forecast)
    })
  })
})
