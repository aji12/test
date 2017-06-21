'use strict'

const bot = require('../core/telegram')
const adhan = require('adhan')
const moment = require('moment')
const request = require('request')
const utils = require('../core/utils')

// Gets timezone for a location.
function getTime (msg, area, lat, lng, callback) {
  const lang = utils.getUserLang(msg)
  const url = 'https://maps.googleapis.com/maps/api/timezone/json?'
  const parameters = 'location=' + lat + ',' + lng + '&timestamp=' + msg.date

  request(url + parameters, (error, response, body) => {
    if (error) {
      bot.sendMessage(msg.chat.id, `${lang.error[0]}`, utils.optionalParams(msg))
    } else {
      const tz = JSON.parse(body)
      if (tz.status === 'ZERO_RESULTS') {
        bot.sendMessage(msg.chat.id, `${tz.status} "<i>${area}</i>".`, utils.optionalParams(msg))
      } else {
        const timezone = tz
        callback(timezone)
      }
    }
  })
}

bot.onText(/^[/!#]s(a|o|ha|ho)lat (.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  let params = adhan.CalculationMethod.MuslimWorldLeague()
  let area = match[2]
  let method, methodNum

  if (match[2].match(/^\d+/)) {
    methodNum = `${match[2].replace(/ .+/, '')}`
  }

  if (methodNum) {
    area = match[2].match(/ \w+/)

    switch (methodNum) {
      case '1':
        params = adhan.CalculationMethod.MuslimWorldLeague()
        method = `${lang.salat.dlg[0]}`
        break
      case '2':
        params = adhan.CalculationMethod.Egyptian()
        method = `${lang.salat.dlg[1]}`
        break
      case '3':
        params = adhan.CalculationMethod.Karachi()
        method = `${lang.salat.dlg[2]}`
        break
      case '4':
        params = adhan.CalculationMethod.UmmAlQura()
        method = `${lang.salat.dlg[3]}`
        break
      case '5':
        params = adhan.CalculationMethod.Gulf()
        method = `${lang.salat.dlg[4]}`
        break
      case '6':
        params = adhan.CalculationMethod.Qatar()
        method = `${lang.salat.dlg[5]}`
        break
      case '7':
        params = adhan.CalculationMethod.Kuwait()
        method = `${lang.salat.dlg[6]}`
        break
      case '8':
        params = adhan.CalculationMethod.MoonsightingCommittee()
        method = `${lang.salat.dlg[7]}`
        break
      case '9':
        params = adhan.CalculationMethod.NorthAmerica()
        method = `${lang.salat.dlg[8]}`
        break
      case '10':
        params = adhan.CalculationMethod.Other()
        method = `${lang.salat.dlg[9]}`
        break
    }
  }

  utils.getCoord(msg, area, (geo) => {
    const date = new Date()
    const coordinates = new adhan.Coordinates(geo.lat, geo.lon)
    params.madhab = adhan.Madhab.Shafi
    const prayerTimes = new adhan.PrayerTimes(coordinates, date, params)
    const formattedTime = adhan.Date.formattedTime
    method = method ? `${lang.salat.dlg[10]}: ${method}.` : ''

    getTime(msg, area, geo.lat, geo.lon, (tz) => {
      const offset = Math.round((tz.rawOffset + tz.dstOffset) / 3600)
      const salat = `<b>${lang.salat.dlg[11]} ${geo.formatted_address}</b>\n` +
                  `\n${lang.salat.dlg[12]}: <code>${moment.utc((msg.date + tz.rawOffset + tz.dstOffset) * 1000).format('YYYY-MM-DD HH:mm:ss')}</code>` +
                  `\n• <b>${lang.salat.dlg[13]}</b>: <code>${formattedTime(prayerTimes.fajr, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat.dlg[14]}</b>: <code>${formattedTime(prayerTimes.sunrise, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat.dlg[15]}</b>: <code>${formattedTime(prayerTimes.dhuhr, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat.dlg[16]}</b>: <code>${formattedTime(prayerTimes.asr, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat.dlg[17]}</b>: <code>${formattedTime(prayerTimes.maghrib, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat.dlg[18]}</b>: <code>${formattedTime(prayerTimes.isha, offset, '24h')}</code>\n\n` + method

      bot.sendMessage(msg.chat.id, salat, utils.optionalParams(msg))
    })
  })
})
