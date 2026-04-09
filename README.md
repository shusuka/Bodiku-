# 🍭 Berat Badan Tracker

Tracker berat badan mingguan, candy theme, karakter BMI lucu, full gratis (cuma pakai Firestore, no Storage).

## 🚀 Setup Firebase (5 menit)

Project ID: **`berat-badan-1f062`**

### 1. Enable Firestore
1. Buka https://console.firebase.google.com/project/berat-badan-1f062/firestore
2. **Create database** → lokasi `asia-southeast2` (Jakarta) → **Start in test mode** → **Enable**

### 2. Set Firestore Rules
Firestore → tab **Rules** → paste → **Publish**:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### 3. Register Web App
1. https://console.firebase.google.com/project/berat-badan-1f062/settings/general
2. Scroll ke **Your apps** → klik `</>` → nama `berat-badan-web` → **Register app**
3. Copy `firebaseConfig` yang muncul, isi ke `.env`:
   - `apiKey` → `VITE_FIREBASE_API_KEY`
   - `messagingSenderId` → `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `VITE_FIREBASE_APP_ID`

> ⚠️ **Storage ga dipakai** — foto disimpen sebagai base64 di Firestore (auto-compress ke ~40 KB). Ga perlu upgrade ke Blaze plan / kartu kredit.

## 💻 Setup Lokal
```bash
npm install
cp .env.example .env
# edit .env, isi dari Firebase config
npm run dev
```

## 🚀 Deploy Vercel
1. Push ke GitHub
2. https://vercel.com/new → import repo → Framework: Vite
3. Environment Variables — tambahin semua `VITE_FIREBASE_*` dari `.env`
4. Deploy

## 🎨 Kategori BMI
| BMI | Kategori | Karakter |
|-----|----------|----------|
| < 18.5 | Kurus 🌱 | Badan kecil biru, gemeter |
| 18.5–24.9 | Ideal ✨ | Badan hijau + sparkle |
| 25–29.9 | Gemuk 🍩 | Badan kuning wobble |
| ≥ 30 | Obesitas 🎈 | Badan pink bouncy + keringet |
