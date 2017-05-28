'use strict'

const bot = require('../core/telegram')
const adhan = require('adhan')
const moment = require('moment')
const request = require('request')
const utils = require('../core/utils')

// Gets coordinates for a location.
function getCoord (msg, input, callback) {
  let lang = utils.getUserLang(msg)
  const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURIComponent(input)

  request(url, (error, response, body) => {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Connection error.', utils.optionalParams(msg))
    } else {
      const coord = JSON.parse(body)
      if (coord.status === 'ZERO_RESULTS') {
        bot.sendMessage(msg.chat.id, `${lang.salat_1} "<i>${input}</i>".`, utils.optionalParams(msg))
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
function getTime (msg, lat, lng, callback) {
  let lang = utils.getUserLang(msg)
  const url = 'https://maps.googleapis.com/maps/api/timezone/json?'
  const parameters = 'location=' + lat + ',' + lng + '&timestamp=' + msg.date

  request(url + parameters, (error, response, body) => {
    if (error) {
      bot.sendMessage(msg.chat.id, 'Connection error.', utils.optionalParams(msg))
    } else {
      const tz = JSON.parse(body)
      if (tz.status === 'ZERO_RESULTS') {
        bot.sendMessage(msg.chat.id, `${lang.salat_1} "<i>${input}</i>".`, utils.optionalParams(msg))
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
  let method

  if (match[2].match(/^\d+/)) {
    const methodNum = match[2].match(/^\d+/)
    area = match[2].match(/ \w+/)

    if (methodNum == 1) {
      params = adhan.CalculationMethod.MuslimWorldLeague()
      method = 'Muslim World League'
    } else if (methodNum == 2) {
      params = adhan.CalculationMethod.Egyptian()
      method = 'Egyptian General Authority of Survey'
    } else if (methodNum == 3) {
      params = adhan.CalculationMethod.Karachi()
      method = 'University of Islamic Sciences, Karachi'
    } else if (methodNum == 4) {
      params = adhan.CalculationMethod.UmmAlQura()
      method = 'Umm al-Qura University, Makkah'
    } else if (methodNum == 5) {
      params = adhan.CalculationMethod.Gulf()
      method = 'Modified version of Umm al-Qura used in UAE'
    } else if (methodNum == 6) {
      params = adhan.CalculationMethod.Qatar()
      method = 'Modified version of Umm al-Qura used in Qatar'
    } else if (methodNum == 7) {
      params = adhan.CalculationMethod.Kuwait()
      method = 'Method used by the country of Kuwait'
    } else if (methodNum == 8) {
      params = adhan.CalculationMethod.MoonsightingCommittee()
      method = 'Moonsighting Committee'
    } else if (methodNum == 9) {
      params = adhan.CalculationMethod.NorthAmerica()
      method = 'North America (ISNA)'
    } else if (methodNum == 10) {
      params = adhan.CalculationMethod.Other()
      method = 'Other'
    }
  }

  getCoord(msg, area, (geo) => {
    const date = new Date()
    const coordinates = new adhan.Coordinates(geo.lat, geo.lon)
    params.madhab = adhan.Madhab.Shafi
    const prayerTimes = new adhan.PrayerTimes(coordinates, date, params)
    const formattedTime = adhan.Date.formattedTime
    method = method ? `${lang.salat_2}: ${method}.` : ''

    getTime(msg, geo.lat, geo.lon, (tz) => {
      const offset = Math.round((tz.rawOffset + tz.dstOffset) / 3600)
      const salat = `<b>${lang.salat_3} ${geo.formatted_address}</b>\n` +
                  `\n${lang.salat_4}: <code>${moment.utc((msg.date + tz.rawOffset + tz.dstOffset) * 1000).format('HH:mm:ss')}</code>` +
                  `\n• <b>${lang.salat[1]}</b>: <code>${formattedTime(prayerTimes.fajr, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat[2]}</b>: <code>${formattedTime(prayerTimes.sunrise, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat[3]}</b>: <code>${formattedTime(prayerTimes.dhuhr, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat[4]}</b>: <code>${formattedTime(prayerTimes.asr, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat[5]}</b>: <code>${formattedTime(prayerTimes.maghrib, offset, '24h')}</code>` +
                  `\n• <b>${lang.salat[6]}</b>: <code>${formattedTime(prayerTimes.isha, offset, '24h')}</code>\n\n` + method

      bot.sendMessage(msg.chat.id, salat, utils.optionalParams(msg))
    })
  })
})
