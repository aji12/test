'use strict'

const bot = require('../core/telegram')
const scrapy = require('node-scrapy')
const utils = require('../core/utils')

function tagCleaner (str) {
  const rem = new RegExp(/<font.+?>|<\/font>|<span.+?>|<\/span>|<\/?li>|<\/?sup>/, 'gim')
  let clean = str.replace(rem, '')
  const lnk = new RegExp(/<a href="..\/../, 'gim')
  clean = clean.replace(lnk, '<a href="https://kbbi.kemdikbud.go.id')
  return clean
}

bot.onText(/^[/!#]kbbi (.+)/, (msg, match) => {
  const url = 'https://kbbi.kemdikbud.go.id/entri/' + encodeURIComponent(`${match[1]}`)
  const model = {
    lema: {
      selector: 'h2',
      get: 'text',
      prefix: '<b>',
      suffix: '</b>'
    },
    artisatu: {
      selector: 'ol li',
      get: 'html',
      prefix: '• '
    },
    artidua: {
      selector: 'ul.adjusted-par',
      get: 'html',
      prefix: '• '
    }
  }

  scrapy.scrape(url, model, (err, data) => {
    if (err) { return console.log(err) }

    let artikata, lema, artisatu
    let kbbi = []
    let artilema = []

    if (data.artisatu === null && data.artidua === null) {
      artikata = 'Entri tidak ditemukan.'
    } else if (data.artisatu === null) {
      lema = data.lema

      if (Array.isArray(lema)) {
        if (Array.isArray(data.artidua)) {
          for (let i = 0; i < lema.length; i++) {
            kbbi.push('\n' + lema[i] + '\n' + data.artidua[i])
          }
        } else {
          kbbi.push('\n' + lema[0] + '\n' + data.artidua)
        }
        artikata = kbbi.join('\n')
      } else {
        artikata = lema + '\n' + data.artidua
      }
    } else if (data.artidua === null) {
      lema = data.lema

      if (Array.isArray(data.artisatu)) {
        for (let i = 0; i < data.artisatu.length; i++) {
          kbbi.push(data.artisatu[i])
        }
      } else {
        kbbi.push('\n' + lema[0] + '\n' + data.artisatu)
      }
      artikata = lema + '\n' + kbbi.join('\n')
    } else {
      lema = data.lema

      if (Array.isArray(data.artisatu)) {
        for (let i = 0; i < data.artisatu.length; i++) {
          artilema.push(data.artisatu[i])
        }
        artisatu = artilema.join('\n')
      } else {
        artisatu = data.artisatu + '\n'
      }

      if (Array.isArray(lema)) {
        if (lema.length > 2) {
          for (let i = 1; i < lema.length; i++) {
            kbbi.push('\n' + lema[i] + '\n' + data.artidua[i - 1])
          }
        } else {
          kbbi.push('\n' + lema[1] + '\n' + data.artidua)
        }
        artikata = lema[0] + '\n' + artisatu + '\n' + kbbi.join('\n')
      } else {
        if (artisatu) artikata = lema + '\n' + artisatu
      }
    }
    bot.sendMessage(msg.chat.id, tagCleaner(artikata), utils.optionalParams(msg))
  })
})
