'use strict'

const bot = require('../core/telegram')
const utils = require('../core/utils')

bot.onText(/^[/!#](maps|loc) (.+)/, (msg, match) => {
  utils.getCoord(msg, match[2], (geo) => {
    const lang = utils.getUserLang(msg)

    if (geo) {
      bot.sendVenue(msg.chat.id, geo.lat, geo.lon, geo.formatted_address, '', {
        reply_to_message_id: msg.message_id,
        reply_markup: {
          inline_keyboard: [[{
            text: `${lang.maps_inline}`,
            url: 'https://www.google.com/maps?q=' + geo.lat + ',' + geo.lon
          }]]
        }
      })
    } else {
      console.log('Connection error.')
    }
  })
})
