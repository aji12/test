# <p align="center">TGramIndoBot

### <p align="center">Sebuah bot Telegram sederhana untuk memoderasi grup

`TGramIndoBot` adalah sebuah bot sederhana untuk memoderasi grup [Telegram Indonesia](https://t.me/tgramindo).  
Bot ini adalah _fork_ dari [ThorsHammer](https://github.com/kamikazechaser/ThorsHammer) _branch_ `openshift` yang ditulis dalam JavaScript dan menggunakan mongoDB sebagai _database_.

`TGramIndoBot` dikhususkan untuk diterapkan di [OpenShift](https://www.openshift.com/). Jika Anda membutuhkan bot yang bisa diterapkan ke layanan lain, silahkan rujuk [ThorsHammer](https://github.com/kamikazechaser/ThorsHammer).

Silakan coba [@tgramindobot](https://t.me/tgramindobot) untuk demo.

### Perintah

Awali perintah dengan `/`, `!`, atau `#`.

Perintah | Rincian | Status | Superuser | Admin Global | Admin Grup | Pengguna biasa
--- | --- | --- | --- | --- | --- | --- |
`/hammer` | `[menggunakan reply/username/id]`  _Ban_ secara global | ✅ | ✅ | ✅ | ❌ | ❌
`/unhammer` | `[menggunakan reply/username/id]`  _Unban_ secara global | ✅ | ✅ | ✅ | ❌ | ❌
`/leave` | Bot meninggalkan grup | ✅ | ✅ | ❌ | ❌ | ❌
`/promote` | `[menggunakan reply/username/id]`  Angkat _user_ sebagai admin global | ✅ | ✅ | ❌ | ❌ | ❌
`/demote` | `[menggunakan reply/username/id]`  Turunkan _user_ dari jabatan admin global | ✅ | ✅ | ❌ | ❌ | ❌
`/banlist` | Kirim berkas txt ke kanal pencatat, berisi nama _user_ yang di-_ban_ secara global | ✅ | ✅ | ✅ | ❌ | ❌
`/admins` | Tampilkan daftar admin-admin grup | ✅ | ✅ | ✅ | ✅ | ✅
`/globaladmins` | Tampilkan daftar admin-admin global | ✅ | ✅ | ✅ | ✅ | ✅
`/kick` | Keluarkan _user_ dari grup (dapat bergabung kembali) | ✅ | ❌ | ❌ | ✅ | ❌
`/ban` | _Ban user_ dari grup | ✅ | ❌ | ❌ | ✅ | ❌
`/start` or `/help` | Tampilkan bantuan dalam beragam bahasa | ✅ | ✅ | ✅ | ✅ | ✅

### Moda _Inline_

Anda bisa mendapatkan bantuan pada setiap grup dengan menggunakan _inline mode_: 

```bash
# Ketik dalam kolom pesan
@tgramindobot help [language-code]
```

### Filters

Aksi| Rincian | Status 
--- | --- | --- | 
**Entry Checks** | Secara otomatis melakukan _ban_ terhadap _user_ yang memasuki grup yang dimoderasi karena dia telah di-_ban_ secara global | ✅ 
**Message Checks** | Secara otomatis melakukan _ban_ terhadap _user_ yang telah di-_ban_ secara global ketika mendapati _user_ tersebut mengirim pesan | ✅ 


## Setup

### Node.JS

Anda perlu Node.js versi > 4, untuk mengunduh _dependencies_ dan menjalankan bot ini.  
Untuk pengguna Windows, cukup klik [berkas ini](https://nodejs.org/dist/v7.4.0/node-v7.4.0-x64.msi) untuk memasangnya.  
Untuk pengguna Unix, gunakan cara sesuai distro atau rujuk [laman ini](https://nodejs.org/en/download/).

### Telegram

<img src="http://i.imgur.com/84FFJo2.png" height="120">

- Buat bot, baca bagaimana caranya [di sini](https://core.telegram.org/bots/faq#how-do-i-create-a-bot)
- Matikan _bot privacy_, kirim `/setprivacy` ke [@BotFather](https://telegram.me/BotFather).  
Baca informasi lebih lanjut mengenai _privacy_ [di sini](https://core.telegram.org/bots/faq#what-messages-will-my-bot-get)
- Hidupkan moda _inline_, kirim `/setinline` ke [@BotFather](https://telegram.me/BotFather).  
Baca informasi lebih lanjut mengenai _inline_ [di sini](https://core.telegram.org/bots/inline)
- Buat sebuah kanal pencatat (_log channel_), dan dapatkan `chat_id` kanal tersebut dengan cara meneruskan pesan dari kanal tersebut ke [@getidsbot](https://telegram.me/getidsbot). `chat_id` selalu diawali dengan `-100`. 
- Dapatkan `user_id` Anda dengan cara yang sama tersebut di atas.
- Buka `core/config.js` dan masukkan _token_, `chat_id`, dan `user_id`.

### Openshift

<img src="http://www.opencloudconf.com/images/openshift_logo.png" width="200">

```bash
# Pastikan Anda telah memasang paket Node.JS! 
$ node -v

# Clone repo
$ git clone https://github.com/rizaumami/TGramIndoBot.git
$ cd TGramIndoBot
# Pastikan semua baris dalam core/config.js diisi! Kecuali MONGODB_URL, abaikan saja!

# Masuk ke dalam akun Openshift web console Anda
# Buat sebuah app
# Pilih Node.js [Latest]
# 
# jalankan app
# Tambahkan  cartridge > Install your own cartridge
# Masukkan laman ini => https://raw.githubusercontent.com/icflorescu/openshift-cartridge-mongodb/master/metadata/manifest.yml
# Tambahakan ssh keys Anda ke Openshift dan pastikan kunci tersebut ada di $HOME/.ssh
# Salin laman git yang berada di kolom kiri laman web console

$ git remote add openshift [LAMAN REMOTE GIT, SALIN DARI LANGKAH DI ATAS]
$ git push openshift master --force

```

## Lisensi

Dirilis dibawah lisensi AGPL-v3.0, lihat berkas [LICENSE](https://github.com/rizaumami/TGramIndoBot/blob/master/LICENSE).
