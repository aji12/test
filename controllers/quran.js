'use strict'

const bot = require('../core/telegram')
const config = require('../data/config.json')
const request = require('request')
const utils = require('../core/utils')

const surahName = {
  1: 'Al-Fatihah',
  2: 'Al-Baqarah',
  3: 'Ali-Imran',
  4: 'An-Nisaa\'',
  5: 'Al-Maaidah',
  6: 'Al-An\'aam',
  7: 'Al-A\'raaf',
  8: 'Al-Anfaal',
  9: 'At-Taubah',
  10: 'Yunus',
  11: 'Huud',
  12: 'Yusuf',
  13: 'Ar-Ra\'d',
  14: 'Ibrahim',
  15: 'Al-Hijr',
  16: 'An-Nahl',
  17: 'Al-Israa\'',
  18: 'Al-Kahfi',
  19: 'Maryam',
  20: 'Thaahaa',
  21: 'Al-Anbiyaa\'',
  22: 'Al-Hajj',
  23: 'Al-Mukminuun',
  24: 'An-Nuur',
  25: 'Al-Furqaan',
  26: 'Ash-Shu\'araa',
  27: 'An-Naml',
  28: 'Al-Qashash',
  29: 'Al-Ankabuut',
  30: 'Ar-Ruum',
  31: 'Luqman',
  32: 'As-Sajdah',
  33: 'Al-Ahzaab',
  34: 'Saba\'',
  35: 'Faathir',
  36: 'Yasiin',
  37: 'As-Shaaffaat',
  38: 'Shaad',
  39: 'Az-Zumar',
  40: 'Al-Ghaafir',
  41: 'Fushshilat',
  42: 'Asy-Syuura',
  43: 'Az-Zukhruf',
  44: 'Ad-Dukhaan',
  45: 'Al-Jaatsiyah',
  46: 'Al-Ahqaaf',
  47: 'Muhammad',
  48: 'Al-Fath',
  49: 'Al-Hujuraat',
  50: 'Qaaf',
  51: 'Adz-Dzaariyat',
  52: 'Ath-Thur',
  53: 'An-Najm',
  54: 'Al-Qamar',
  55: 'Ar-Rahmaan',
  56: 'Al-Waaqi\'ah',
  57: 'Al-Hadiid',
  58: 'Al-Mujaadilah',
  59: 'Al-Hasyr',
  60: 'Al-Mumtahanah',
  61: 'Ash-Shaff',
  62: 'Al-Jumu\'ah',
  63: 'Al-Munaafiquun',
  64: 'At-Taghaabuun',
  65: 'Ath-Thaalaq',
  66: 'At-Tahrim',
  67: 'Al-Mulk',
  68: 'Al-Qalam',
  69: 'Al-Haaqqah',
  70: 'Al-Ma\'aarij',
  71: 'Nuuh',
  72: 'Al-Jin',
  73: 'Al-Muzzammil',
  74: 'Al-Muddatstsir',
  75: 'Al-Qiyaamah',
  76: 'Al-Insaan',
  77: 'Al-Mursalaat',
  78: 'An-Naba\'',
  79: 'An-Naazi\'aat',
  80: '\'Abasa',
  81: 'At-Takwir',
  82: 'Al-Infithaar',
  83: 'Al-Mutaffifin',
  84: 'Al-Insyiqaaq',
  85: 'Al-Buruuj',
  86: 'Ath-Thaariq',
  87: 'Al-A\'laa',
  88: 'Al-Ghaashiyah',
  89: 'Al-Fajr',
  90: 'Al-Balad',
  91: 'Asy-Syams',
  92: 'Al-Lail',
  93: 'Ad-Dhuhaa',
  94: 'Alam Nasyrah',
  95: 'At-Tiin',
  96: 'Al-\'Alaq',
  97: 'Al-Qadr',
  98: 'Al-Bayyinah',
  99: 'Al-Zalzalah',
  100: 'Al-\'Aadiyaat',
  101: 'Al-Qaari\'ah',
  102: 'At-Takaatsur',
  103: 'Al-\'Ashr',
  104: 'Al-Humazah',
  105: 'Al-Fiil',
  106: 'Quraisy',
  107: 'Al-Maa\'uun',
  108: 'Al-Kautsar',
  109: 'Al-Kaafiruun',
  110: 'An-Nashr',
  111: 'Al-Lahab',
  112: 'Al-Ikhlaas',
  113: 'Al-Falaq',
  114: 'An-Naas'
}

const language = {
  'ar': 'ar.muyassar',
  'az': 'az.musayev',
  'bg': 'bg.theophanov',
  'bn': 'bn.bengali',
  'bs': 'bs.mlivo',
  'cs': 'cs.hrbek',
  'de': 'de.aburida',
  'dv': 'dv.divehi',
  'en': 'en.yusufali',
  'es': 'es.cortes',
  'fa': 'fa.makarem',
  'fr': 'fr.hamidullah',
  'ha': 'ha.gumi',
  'hi': 'hi.hindi',
  'id': 'id.indonesian',
  'it': 'it.piccardo',
  'ja': 'ja.japanese',
  'ko': 'ko.korean',
  'ku': 'ku.asan',
  'ml': 'ml.abdulhameed',
  'ms': 'ms.basmeih',
  'nl': 'nl.keyzer',
  'no': 'no.berg',
  'pl': 'pl.bielawskiego',
  'pt': 'pt.elhayek',
  'ro': 'ro.grigore',
  'ru': 'ru.kuliev',
  'sd': 'sd.amroti',
  'so': 'so.abduh',
  'sq': 'sq.ahmeti',
  'sv': 'sv.bernstrom',
  'sw': 'sw.barwani',
  'ta': 'ta.tamil',
  'tg': 'tg.ayati',
  'th': 'th.thai',
  'tr': 'tr.ozturk',
  'tt': 'tt.nugman',
  'ug': 'ug.saleh',
  'ur': 'ur.ahmedali',
  'uz': 'uz.sodik',
  'zh': 'zh.majian'
}

function getVerseNum (verse) {
  for (let i = 0; i < 6666; i++) {
    if (verse.quran['quran-simple'][i]) {
      return i
    }
  }
}

function getAyahOrLang (msg, number, callback) {
  request(number, (error, response, body) => {
    if (error) {
      bot.reply(msg, `API query failure: <code>${error.message}</code>`)
      return
    }
    if (response.statusCode !== 200) {
      bot.reply(msg, `<code>Error ${response.statusCode}: ${response.statusMessage}</code>`)
      return
    }
    const jayah = JSON.parse(body)
    callback(jayah)
  })
}

function quran (msg, surah, ayah, verse, lang) {
  let malformQuery, gqLang, gqAyah
  let dialog = utils.getUserLang(msg).quran.dlg

  if ((lang) && (!language[`${lang}`])) {
    malformQuery = `${dialog[0]}`
  } else if (verse) {
    if ((Number(verse) < 1) || (Number(verse) > 6236)) {
      malformQuery = `${dialog[1]}`
    }
  } else if (surah) {
    if ((Number(surah) < 1) || (Number(surah) > 114)) {
      malformQuery = `${dialog[2]}`
    }
  }

  if (malformQuery) {
    bot.reply(msg, malformQuery)
    return
  }

  const gq = 'http://api.globalquran.com/ayah/'
  const translation = language[`${lang}`]

  if (verse) {
    gqAyah = gq + verse + '/quran-simple?key=' + config.quran.KEY
    if (translation) {
      gqLang = gq + verse + '/' + translation + '?key=' + config.quran.KEY
    }
  }

  if (surah && ayah) {
    gqAyah = gq + surah + ':' + ayah + '/quran-simple?key=' + config.quran.KEY
    if (translation) {
      gqLang = gq + surah + ':' + ayah + '/' + translation + '?key=' + config.quran.KEY
    }
  }

  getAyahOrLang(msg, gqAyah, (verse) => {
    const verseNum = getVerseNum(verse)
    const surahNum = verse.quran['quran-simple'][`${verseNum}`].surah
    const ayahNum = verse.quran['quran-simple'][`${verseNum}`].ayah

    if (gqLang) {
      getAyahOrLang(msg, gqLang, (language) => {
        const verseTrans = language.quran[translation][`${verseNum}`].verse
        const gqOutput = verse.quran['quran-simple'][`${verseNum}`].verse + '\n\n' + verseTrans + ' (<b>' + surahName[surahNum] + ':' + ayahNum + '</b>)'
        bot.reply(msg, gqOutput)
      })
    } else {
      const gqOutput = verse.quran['quran-simple'][`${verseNum}`].verse + '\n\n(<b>' + surahName[surahNum] + ':' + ayahNum + '</b>)'
      bot.reply(msg, gqOutput)
    }
  })
}

bot.onText(/^[/!#]quran (.+)/, (msg, match) => {
  const matches = match[1].split(/[\s:]/)

  switch (matches.length) {
    case 1:
      quran(msg, null, null, matches[0], null)
      break
    case 2:
      if (matches[1].match(/\D+/)) {
        quran(msg, null, null, matches[0], matches[1])
      } else {
        quran(msg, matches[0], matches[1], null, null)
      }
      break
    case 3:
      quran(msg, matches[0], matches[1], null, matches[2])
      break
  }
})
