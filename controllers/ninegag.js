'use strict'

const bot = require('../core/telegram')
const request = require('request')
const utils = require('../core/utils')

bot.onText(/^[/!#]9gag$/, msg => {
  const lang = utils.getUserLang(msg)
  const url = 'http://api-9gag.herokuapp.com/'

  request(url, (error, response, body) => {
    if ((error) || (response.statusCode !== 200)) {
      bot.reply(msg, lang.dialog.connection)
    }

    const ninegags = JSON.parse(body)
    const i = Math.floor(ninegags.length * Math.random())
    let image = ninegags[i].src
    const title = ninegags[i].title

    if (image.substr(0, 2) === '//') {
      image = image.substr(3, -1)
    }
    bot.sendPhoto(msg.chat.id, image, {
      caption: title,
      reply_to_message_id: msg.message_id
    })
  })
})
