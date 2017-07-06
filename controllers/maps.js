'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')

bot.onText(/^[/!#]maps (.+)/, (msg, match) => {
  utils.getGeoLocation(msg, match[1], (geo) => {
    const lang = utils.getUserLang(msg)

    if (geo) {
      bot.sendVenue(msg.chat.id, geo.latitude, geo.longitude, geo.formatted_address, '', {
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [[{
            text: `${lang.maps.dlg[0]}`,
            url: 'https://www.google.com/maps?q=' + geo.latitude + ',' + geo.longitude
          }]]
        }
      })
    } else {
      console.log(`=> maps.js: Connection error.`)
    }
  })
})
