# Whatsapp-WhiskeySocket

Bu proje, **Node.js** ve **Baileys** kullanarak çoklu WhatsApp hesapları ile mesaj gönderme, alma ve yönetme işlemlerini gerçekleştiren bir backend uygulamasıdır. MongoDB ile veri saklama ve Express.js ile API servisleri sunar.

---

## Özellikler

* Birden fazla WhatsApp hesabını yönetme
* QR kod ile oturum başlatma
* Mesaj gönderme (metin, resim, video)
* Mesajları MongoDB üzerinde saklama
* Hesap bazlı mesaj filtreleme
* REST API ile kolay entegrasyon

---

## Kurulum

1. Depoyu klonlayın:

```bash
git clone https://github.com/fathasss/whatsapp-whiskeysockets.git
cd whatsapp-whiskeysockets
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. `.env` dosyasını oluşturun ve gerekli ortam değişkenlerini ekleyin:

```env
MONGO_URI=mongodb://localhost:27017/whatsappbot
PORT=3002
```

---

## Kullanım

### Backend başlatma

```bash
node app.js
```

### API Endpoints

* **QR Kodu Alma:**
  `GET /whatsapp/qr/:accountId`
  QR kodu görüntüler. Hesap bağlı değilse hata mesajı döner.

* **Mesaj Listesi:**
  `GET /whatsapp/get-messages:accountId`
  Belirli bir hesaba ait veya tüm mesajları listeler.

* **WhatsApp Hesabı Başlatma:**
  `POST /whatsapp/start/:accountId`
  Belirtilen WhatsApp hesabını başlatır.

* **Mesaj Gönderme:**
  `POST /whatsapp/send/:accountId`
  Mesaj tipine göre (text, image, video) mesaj gönderir.
  Örnek body:


## Send Message For Json Format

### Text Message

```json
{
  "to": "905xxxxxxxxx@s.whatsapp.net",
  "type": "text",
  "content": {
    "caption": "Hello World"
  }
}
```
---
### Image Message
```json
{
  "to": "905xxxxxxxxx@s.whatsapp.net",
  "type": "image",
  "content": {
    "url": "https://example.com/image.jpg",
    "caption": "📷 Bu bir fotoğraf mesajıdır"
  }
}
```
**image base64 ise**

```json
{
  "to": "905546907573@s.whatsapp.net",
  "type": "image",
  "content": {
    "base64": "data:image/jpg;base64,...",
    "caption": "Merhaba 👋"
  }
}
```
---
### Video Message
```json
{
  "to": "905xxxxxxxxx@s.whatsapp.net",
  "type": "video",
  "content": {
    "url": "https://example.com/video.mp4",
    "caption": "📷 Bu bir video mesajıdır"
  }
}
```
---

### Document Message

**document => pdf**
```json
{
  "to": "905555555555@s.whatsapp.net",
  "type": "document",
  "content": {
    "base64": "data:application/pdf;base64,JVBERi0xLjQKJcTl8uXrp...",
    "fileName": "fatura_2025.pdf",
    "caption": "📄 Yeni fatura"
  }
}
```
**document => url pdf**
```json
{
  "to": "905555555555@s.whatsapp.net",
  "type": "document",
  "content": {
    "url": "https://example.com/files/fatura.pdf",
    "caption": "📎 PDF dosyası"
  }
}
```

## Teknolojiler

* Node.js
* Express.js
* MongoDB
* Mongoose
* Baileys (WhatsApp Web API)
* dotenv
* Swagger
---

## Lisans

MIT License © Fatih HAS
