'use strict'

const bot = require('../core/telegram')
const request = require('request')
const utils = require('../core/utils')

bot.onText(/^[/!#]wiki(.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  let query, wikilang

  if (match[1].match(/^[.]/)) {
    query = match[1].substr(4)
    wikilang = match[1].substr(1, 2)
  } else {
    query = match[1].trim()
    wikilang = 'en'
  }
  if (!query) { return }

  // https://www.mediawiki.org/wiki/Extension:TextExtracts#API
  const searchUrl = `https://${wikilang}.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=`
  const resUrl = `https://${wikilang}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exchars=1200&exlimit=1&titles=`
  const artUrl = `https://${wikilang}.wikipedia.org/wiki/`

  // Search wiki entry
  request(searchUrl + encodeURIComponent(query), (error, response, body) => {
    if (error) {
      bot.reply(msg, `API query failure: <code>${error.message}</code>`)
      return
    }
    if (response.statusCode !== 200) {
      bot.reply(msg, `<code>Error ${response.statusCode}: ${response.statusMessage}</code>`)
      return
    }

    const jwiki = JSON.parse(body)

    if (jwiki.query.searchinfo.totalhits === 0) {
      bot.reply(msg, `${lang.wikipedia.dlg[0]}`)
      return
    }

    const firstResult = encodeURIComponent(jwiki.query.search[0].title)

    // Get the summary
    request(resUrl + firstResult, (error, response, body) => {
      if (error) {
        bot.reply(msg, `API query failure: <code>${error.message}</code>`)
        return
      }
      if (response.statusCode !== 200) {
        bot.reply(msg, `<code>Error ${response.statusCode}: ${response.statusMessage}</code>`)
        return
      }

      const pages = JSON.parse(body)
      const page = pages.query.pages
      let next, text, plaintext, title, wikilink

      for (let v in page) {
        if (page[v].extract.match(/may refer to:/)) {
          text = ''
          title = `<b>${page[v].title}</b> may refer to:`
        } else {
          // Get only the first paragraph
          const extract = page[v].extract.match(/<\/p>/)
          // Remove HTML tags Telegram won't be able to parse
          text = extract.input.substr(3, extract.index - 3)
          text = text.replace(/<\/?span.*?>/g, '')
          text = text.replace(/<\/?small.*?>/g, '')
          title = `<b>${page[v].title}</b>`
        }
        wikilink = `${artUrl}${encodeURIComponent(page[v].title)}`
        next = `\n<a href="${wikilink}">${lang.dialog.more}</a>`
      }

      plaintext = text.replace(/<\/?.*?>/g, '')
      text = [
        `${title}\n${text}${next}`,
        `${title}\n${plaintext}${next}`
      ]

      bot.reply(msg, text)
    })
  })
})
