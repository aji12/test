'use strict'

const bot = require('../core/telegram')
const adhan = require('adhan')
const moment = require('moment')
const request = require('request')
const utils = require('../core/utils')

// Gets coordinates for a location.
function getCoord (msg, area, callback) {
  let lang = utils.getUserLang(msg)
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(area)

  request(url, (error, response, body) => {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Connection error.', utils.optionalParams(msg))
    } else {
      const coord = JSON.parse(body)
      if (coord.status === 'ZERO_RESULTS') {
        bot.sendMessage(msg.chat.id, `${lang.salat.dlg[1]} "<i>${area}</i>".`, utils.optionalParams(msg))
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

// Gets timezone for a location.
function getTime (msg, area, lat, lng, callback) {
  let lang = utils.getUserLang(msg)
  const url = 'https://maps.googleapis.com/maps/api/timezone/json?'
  const parameters = 'location=' + lat + ',' + lng + '&timestamp=' + msg.date

  request(url + parameters, (error, response, body) => {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Connection error.', utils.optionalParams(msg))
    } else {
      const tz = JSON.parse(body)
      if (tz.status === 'ZERO_RESULTS') {
        bot.sendMessage(msg.chat.id, `${lang.salat.dlg[0]} "<i>${area}</i>".`, utils.optionalParams(msg))
      } else {
        const timezone = tz
        callback(timezone)
      }
    }
  })
}

bot.onText(/^[/!#]s(a|o|ha|ho)lat (.+)/, (msg, match) => {
  let lang = utils.getUserLang(msg)
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
        method = 'Muslim World League'
        break
      case '2':
        params = adhan.CalculationMethod.Egyptian()
        method = 'Egyptian General Authority of Survey'
        break
      case '3':
        params = adhan.CalculationMethod.Karachi()
        method = 'University of Islamic Sciences, Karachi'
        break
      case '4':
        params = adhan.CalculationMethod.UmmAlQura()
        method = 'Umm al-Qura University, Makkah'
        break
      case '5':
        params = adhan.CalculationMethod.Gulf()
        method = 'Modified version of Umm al-Qura used in UAE'
        break
      case '6':
        params = adhan.CalculationMethod.Qatar()
        method = 'Modified version of Umm al-Qura used in Qatar'
        break
      case '7':
        params = adhan.CalculationMethod.Kuwait()
        method = 'Method used by the country of Kuwait'
        break
      case '8':
        params = adhan.CalculationMethod.MoonsightingCommittee()
        method = 'Moonsighting Committee'
        break
      case '9':
        params = adhan.CalculationMethod.NorthAmerica()
        method = 'North America (ISNA)'
        break
      case '10':
        params = adhan.CalculationMethod.Other()
        method = 'Other'
        break
    }
  }

  getCoord(msg, area, (geo) => {
    const dialog = lang.salat.dlg
    const date = new Date()
    const coordinates = new adhan.Coordinates(geo.lat, geo.lon)
    params.madhab = adhan.Madhab.Shafi
    const prayerTimes = new adhan.PrayerTimes(coordinates, date, params)
    const formattedTime = adhan.Date.formattedTime
    method = method ? `${dialog[1]}: ${method}.` : ''

    getTime(msg, area, geo.lat, geo.lon, (tz) => {
      const offset = Math.round((tz.rawOffset + tz.dstOffset) / 3600)
      const salat = `<b>${dialog[2]} ${geo.formatted_address}</b>\n` +
                  `\n${dialog[3]}: <code>${moment.utc((msg.date + tz.rawOffset + tz.dstOffset) * 1000).format('YYYY-MM-DD HH:mm:ss')}</code>` +
                  `\n• <b>${dialog[4]}</b>: <code>${formattedTime(prayerTimes.fajr, offset, '24h')}</code>` +
                  `\n• <b>${dialog[5]}</b>: <code>${formattedTime(prayerTimes.sunrise, offset, '24h')}</code>` +
                  `\n• <b>${dialog[6]}</b>: <code>${formattedTime(prayerTimes.dhuhr, offset, '24h')}</code>` +
                  `\n• <b>${dialog[7]}</b>: <code>${formattedTime(prayerTimes.asr, offset, '24h')}</code>` +
                  `\n• <b>${dialog[8]}</b>: <code>${formattedTime(prayerTimes.maghrib, offset, '24h')}</code>` +
                  `\n• <b>${dialog[9]}</b>: <code>${formattedTime(prayerTimes.isha, offset, '24h')}</code>\n\n` + method

      bot.sendMessage(msg.chat.id, salat, utils.optionalParams(msg))
    })
  })
})
