'use strict'

const bot = require('../core/telegram')
const moment = require('moment')
const utils = require('../core/utils')

bot.onText(/^[/!#]time (.+)/, (msg, match) => {
  const address = encodeURIComponent(match[1])
  const lang = utils.getUserLang(msg)

  utils.getGeoLocation(msg, address, (geo) => {
    if (geo.status !== 'OK') {
      return bot.reply(msg, `<code>${geo.status}</code>`)
    }
    utils.getTime(msg, geo.latitude, geo.longitude, (time) => {
      if (time.status !== 'OK') {
        return bot.reply(msg, `<code>${geo.status}</code>`)
      }

      let utcOffset = Math.round((time.rawOffset + time.dstOffset) / 3600)
      utcOffset = (utcOffset === Math.abs(utcOffset)) ? `+${utcOffset}` : utcOffset
      moment.locale(`${lang.code}`)
      let localTime = `<b>${lang.time.dlg[0]} ${match[1]}</b>:`
      localTime += `\n${moment.utc((msg.date + time.rawOffset + time.dstOffset) * 1000).format('LLLL')}`
      localTime += `\n${time.timeZoneName} (UTC${utcOffset})`

      bot.reply(msg, localTime)
    })
  })
})
