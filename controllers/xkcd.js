'use strict'

const bot = require('../core/telegram')
const request = require('request')

function getXkcd (msg, id) {
  let url = 'https://xkcd.com/info.0.json'
  url = (id) ? `https://xkcd.com/${id}/info.0.json` : url

  request(url, (error, response, body) => {
    if (error) { return console.log(`=> xkcd.js: ${error}`) }
    if (response.statusCode !== 200) {
      bot.reply(msg, `<code>Error ${response.statusCode}: ${response.statusMessage}</code>`)
      return
    }

    const jxkcd = JSON.parse(body)
    const date = `${jxkcd.year}-${jxkcd.month}-${jxkcd.day}`
    let image = jxkcd.img

    if (image.substr(0, 2) === '//') {
      image = image.substr(2)
    }

    const xkcd = `<a href="${image}">${jxkcd.num}</a>. <b>${jxkcd.title}</b>, ${date}`

    bot.reply(msg, `${xkcd}\n${jxkcd.alt}`, true)
  })
}

function searchXkcd (msg, query) {
  let url = 'https://relevantxkcd.appspot.com/process?action=xkcd&query='
  query = `inurl:xkcd.com${query}`
  url += encodeURIComponent(query)

  request(url, (error, response, body) => {
    if (error) { return console.log(`=> xkcd.js: ${error}`) }
    if (response.statusCode !== 200) {
      bot.reply(msg, `<code>Error ${response.statusCode}: ${response.statusMessage}</code>`)
      return
    }

    const ids = response.body.match(/\d+/g)

    getXkcd(msg, ids[3])
  })
}

bot.onText(/^[/!#]xkc(.+)/, (msg, match) => {
  let id

  if (match[1].match(/d$/)) {
    getXkcd(msg)
  }
  if (match[1].match(/d \w+/)) {
    if (match[1].match(/d \d+/)) {
      id = match[1].match(/\d+/)
      getXkcd(msg, id)
    } else {
      id = match[1].match(/ \w+/)
      searchXkcd(msg, id)
    }
  }
})
