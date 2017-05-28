'use strict'

const bot = require('../core/telegram')
const config = require('../core/config')
const escapeHtml = require('escape-html')
const request = require('request')
const utils = require('../core/utils')

function getDescription (msg, word, source, target) {
  let url = 'https://od-api.oxforddictionaries.com/api/v1/entries/'
  const input = encodeURIComponent(word)

  if (source && target) {
    url = url + source + '/' + input + '/translations=' + target
  } else {
    url = 'https://od-api.oxforddictionaries.com/api/v1/entries/' + 'en/' + input
  }

  request({
    uri: url,
    headers: {
      'app_id': config.OXFORDID,
      'app_key': config.OXFORDKEY
    }
  }, (error, response, body) => {
    if (error) {
      return console.log(error)
    }
    if (response.statusCode === 404) {
      bot.sendMessage(msg.chat.id, 'No exact matches found for "' + word + '"', utils.optionalParams(msg))
      return
    }
    if (response.statusCode === 500) {
      bot.sendMessage(msg.chat.id, 'An error occurred while processing the data.', utils.optionalParams(msg))
      return
    }

    const oxdat = JSON.parse(body)
    const title = escapeHtml(oxdat.results[0].word)
    let results = oxdat.results[0].lexicalEntries
    let oxford = []
    const max = (results.length > 4) ? 4 : results.length

    if (source && target) {
      for (let i = 0; i < max; i++) {
        let trans = results[i].entries[0].senses
        for (let n = 0; n < trans.length; n++) {
          if (trans[n].translations) {
            oxford.push(escapeHtml(trans[n].translations[0].text))
          }
        }
      }
      oxford = '<i>' + oxford.join(', ') + '</i>'
    } else {
      for (let i = 0; i < max; i++) {
        let sense = oxdat.results[0].lexicalEntries[i].entries[0].senses[0]
        if (sense.definitions) {
          oxford.push('• ' + sense.definitions[0])
        } else {
          oxford.push('• ' + sense.crossReferences[0].text)
        }
      }
      oxford = oxford.join('\n')
    }
    const output = '<b>' + title + '</b>\n' + escapeHtml(oxford)
    bot.sendMessage(msg.chat.id, output, utils.optionalParams(msg))
  })
}

bot.onText(/^[/!#](d|dict|dictionary) (.+)/, (msg, match) => {
  getDescription(msg, `${match[2]}`.toLowerCase())
})

bot.onText(/^[/!#](t|trans|translate) (en|es|ro|ms|id)-(en|es|ro|ms|id) (.+)/, (msg, match) => {
  // https://developer.oxforddictionaries.com/documentation/languages
  const source = `${match[2]}`
  const target = `${match[3]}`

  if (source !== target) getDescription(msg, `${match[4]}`.toLowerCase(), source, target)
})
