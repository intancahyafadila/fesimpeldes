# Setup Firebase Authentication untuk SiPelMasD

## 📋 Langkah-langkah Setup Firebase

### 1. Buat Project Firebase

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Klik **"Create a project"** atau **"Add project"**
3. Masukkan nama project: `sipelmasd-[nama-desa]`
4. Nonaktifkan Google Analytics (opsional)
5. Klik **"Create project"**

### 2. Enable Authentication

1. Di Firebase Console, pilih project Anda
2. Klik **"Authentication"** di sidebar
3. Klik tab **"Sign-in method"**
4. Enable **Email/Password**:
   - Klik pada "Email/Password"
   - Toggle "Enable"
   - Klik "Save"

### 3. Konfigurasi Web App

1. Di Firebase Console, klik ikon ⚙️ **Settings**
2. Pilih **"Project settings"**
3. Scroll ke bawah ke bagian **"Your apps"**
4. Klik **"Web app"** (ikon </>)
5. Masukkan nickname: `sipelmasd-web`
6. Centang **"Also set up Firebase Hosting"** (opsional)
7. Klik **"Register app"**

### 4. Copy Konfigurasi

Setelah registrasi, Anda akan mendapat konfigurasi seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:...",
};
```

### 5. Setup Environment Variables

1. Buat file `.env.local` di root project
2. Copy konfigurasi Firebase ke format environment variables:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:...
```

### 6. Install Dependencies

```bash
npm install firebase
```

### 7. Test Authentication

1. Jalankan aplikasi: `npm run dev`
2. Buka halaman Register: `/register`
3. Coba daftar dengan email dan password
4. Check di Firebase Console > Authentication > Users

## 🔥 Fitur Firebase yang Sudah Diintegrasikan

### ✅ Email/Password Authentication

- Register dengan email dan password
- Login dengan email dan password
- Logout
- Reset password
- Auto login state management

### ✅ User Management

- Auth state persistence
- Loading states
- Error handling
- User profile management

## 🚀 Fitur Tambahan (Opsional)

### Google Sign-in

Untuk menambahkan Google Sign-in:

1. Enable Google provider di Firebase Console
2. Tambahkan Google OAuth client ID
3. Uncomment kode Google Sign-in di Login.tsx

### Firestore Database

Untuk menyimpan data user tambahan:

1. Enable Firestore di Firebase Console
2. Buat collection `users`
3. Setup security rules

## 🛡️ Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📞 Troubleshooting

### Error: Firebase not configured

- Pastikan file `.env.local` sudah dibuat
- Restart development server

### Error: Auth domain not authorized

- Check Firebase Console > Authentication > Settings
- Tambahkan domain ke Authorized domains

### Error: API key restrictions

- Check Firebase Console > Project Settings
- Pastikan API key tidak terbatas untuk web apps

## 📱 Testing

### Test Accounts

Untuk testing, buat beberapa akun test:

```
Email: test@sipelmasd.com
Password: 123456

Email: admin@sipelmasd.com
Password: admin123
```

### Production Checklist

- [ ] Setup proper security rules
- [ ] Enable email verification
- [ ] Configure password policies
- [ ] Setup admin SDK for server-side operations
- [ ] Monitor authentication usage
