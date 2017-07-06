'use strict'

const bot = require('../core/telegram')
const request = require('request')
const utils = require('../core/utils')

bot.onText(/^[/!#](yify|yts) (.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  const query = encodeURIComponent(match[2])
  const url = 'https://yts.ag/api/v2/list_movies.json?limit=1&query_term='

  request(`${url}${query}`, (error, response, body) => {
    if (error) {
      bot.reply(msg, `API query failure: <code>${error.message}</code>`)
      return
    }
    if (response.statusCode !== 200) {
      bot.reply(msg, `<code>${response.statusMessage}</code>`)
      return
    }

    const jts = JSON.parse(body)

    if (jts.data.movie_count === 0) {
      bot.reply(msg, `${lang.yify.dlg[0]}`)
      return
    }

    const movies = jts.data.movies[0]
    let torrents = ''

    for (let i = 0; i < movies.torrents.length; i++) {
      let torrent = movies.torrents[i]
      torrents += `• <a href="${torrent.url}">${torrent.quality}</a>: ${torrent.size}, seeds: ${torrent.seeds}, peers: ${torrent.peers}\n`
    }

    let movie = []
    movie.push(`<b>${movies.title}</b>\n`)
    movie.push(`${movies.year} | ${movies.rating}/10 | ${movies.runtime} min | <a href="${movies.large_cover_image}">Poster</a>\n`)
    movie.push(`${movies.summary} <a href="${movies.url}">${lang.dialog.more}</a>\n`)
    movie.push(`<b>Torrents</b>:\n${torrents}`)

    bot.reply(msg, movie.join('\n'), true)
  })
})
