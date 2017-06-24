'use strict'

const axios = require('axios')
const bot = require('../core/telegram')
const utils = require('../core/utils')

bot.onText(/^[/!#](reddit|r) (.+)/, (msg, match) => {
  const lang = utils.getUserLang(msg)
  // Returns 8 results if in private, and 4 if in groups
  const limit = (msg.chat.type === 'private') ? 8 : 4
  // If no r/ in front of the query, search reddit for query
  let input = `${match[2]}`
  let title = `<b>${lang.reddit.dlg[0]} -</b> ${input}:`
  let url = `https://www.reddit.com/search.json?q=${input}&limit=${limit}`

  // If there is r/ in front of the query, get the query
  if (input.match(/^r\//)) {
    // Clean up the query from unwanted characters
    input = input.replace(/^.+\//, '')
    title = `<b>r/${input}</b>`
    url = `https://www.reddit.com/r/${input}/.json?limit=${limit}`
  }

  axios.get(url)
    .then(response => {
      if (response.status !== 200) {
        bot.sendMessage(msg.chat.id, `<code>Error ${response.status}: ${response.statusText}</code>`, utils.optionalParams(msg))
        return
      }

      const reddit = response.data.data.children
      let sub = []

      if (reddit.length === 0) {
        if (response.data.data.facets) {
          bot.sendMessage(msg.chat.id, `${lang.reddit.dlg[1]}`, utils.optionalParams(msg))
          return
        } else {
          bot.sendMessage(msg.chat.id, `${lang.reddit.dlg[2]}`, utils.optionalParams(msg))
          return
        }
      }
      for (let i = 0; i < reddit.length; i++) {
        sub.push('• <a href="https://redd.it/' + reddit[i].data.id + '">' + utils.escapeHtml(reddit[i].data.title) + '</a>')
      }

      let subreddit = sub.join('\n')

      bot.sendMessage(msg.chat.id, `${title}\n${subreddit}`, utils.optionalParams(msg))
    })
    .catch(error => {
      bot.sendMessage(msg.chat.id, `<code>${error}</code>`, utils.optionalParams(msg))
    })
})
