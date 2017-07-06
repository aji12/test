'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const request = require('request')

bot.onText(/^[/!#]apo(.+)/, (msg, match) => {
  const command = match[0].match(/\w+/)[0]
  let url = `https://api.nasa.gov/planetary/apod?api_key=${config.apod.KEY}`

  if ((command !== 'apod') && (command !== 'apodtext')) { return }
  if (match[1].match(/\d+/)) {
    if (match[1].match(/(\d+)-(\d+)-(\d+)$/)) {
      const timeStamp = match[1].match(/\d+-\d+-\d+$/)
      url += `&date=${timeStamp}`
    } else {
      bot.reply(msg, `Request must be in the following format:\n<code>/${command} YYYY-MM-DD</code>`)
      return
    }
  }

  request(url, (error, response, body) => {
    if (error) {
      bot.reply(msg, `API query failure: <code>${error.message}</code>`)
      return
    }
    if (response.statusCode !== 200) {
      bot.reply(msg, `<code>Error ${response.statusCode}: ${response.statusMessage}</code>`)
      return
    }

    const japod = JSON.parse(body)
    let image = `<a href="${japod.url}">Image</a> • <a href="${japod.hdurl}">Image HD</a>`
    let apod = `<b>${japod.title}</b>\n\n${image}`

    if (command === 'apodtext') {
      apod += `\n${japod.explanation}`
    }
    if (japod.copyright) {
      apod += `\n\n<i>Copyright: ${japod.copyright}</i>`
    }
    bot.reply(msg, apod, true)
  })
})
