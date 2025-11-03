# 🔧 Node 20 tabanlı hafif imaj kullan
FROM node:20-alpine

# 2️⃣ Container içindeki çalışma dizini
WORKDIR /usr/src/app

# 3️⃣ package.json ve package-lock.json dosyalarını kopyala
COPY package*.json ./

# 4️⃣ Bağımlılıkları yükle (production ortamında)
RUN npm install --production

# 5️⃣ Geri kalan tüm dosyaları kopyala
COPY . .

# 6️⃣ Ortam değişkeni
ENV NODE_ENV=production

# 7️⃣ Uygulamanın portunu aç
EXPOSE 3002

# 8️⃣ Uygulamayı başlat
CMD ["npm", "start"]
