# 🔥 Firebase Domain Setup untuk Netlify

## ❌ Error: Firebase: Error (auth/unauthorized-domain)

Error ini muncul setelah deploy ke Netlify karena domain production belum diauthorize di Firebase Console.

## 🛠️ Solusi Langkah per Langkah

### **1. Dapatkan URL Netlify Anda**

Setelah deploy, Anda akan mendapat URL seperti:

- `https://amazing-app-123abc.netlify.app`
- `https://your-custom-domain.com` (jika sudah setup custom domain)

### **2. Login ke Firebase Console**

1. Buka [console.firebase.google.com](https://console.firebase.google.com)
2. Pilih project aplikasi Anda
3. Pastikan Anda login dengan akun yang sama

### **3. Tambahkan Authorized Domains**

1. **Navigate**: Klik **Authentication** di sidebar kiri
2. **Settings**: Klik tab **Settings** di bagian atas
3. **Scroll down**: Cari section **"Authorized domains"**
4. **Add domain**: Klik tombol **"Add domain"**
5. **Input**: Masukkan domain Netlify tanpa `https://`
   ```
   amazing-app-123abc.netlify.app
   ```
6. **Save**: Klik **"Add"**

### **4. Domain yang Perlu Ditambahkan**

Tambahkan semua domain berikut:

✅ **Domain Netlify:**

```
your-app-name.netlify.app
```

✅ **Custom Domain (jika ada):**

```
yourdomain.com
www.yourdomain.com
```

✅ **Development (opsional):**

```
localhost
```

### **5. Verifikasi Google Sign-In Provider**

1. **Sign-in method**: Klik tab **"Sign-in method"**
2. **Google**: Pastikan status "Enabled"
3. **Web SDK configuration**: Pastikan sudah diisi:
   - Web client ID
   - Web client secret

### **6. Test Firebase Auth**

1. **Deploy ulang** (optional, kadang perlu refresh)
2. **Clear browser cache** dan cookies
3. **Test Google Sign-In** di production URL
4. **Check browser console** untuk error lain

## 📝 Checklist Troubleshooting

### ✅ Firebase Console

- [ ] Project sudah dipilih dengan benar
- [ ] Authentication sudah enabled
- [ ] Google provider sudah enabled
- [ ] Domain Netlify sudah ditambahkan ke authorized domains
- [ ] Web client ID/secret sudah configured

### ✅ Environment Variables

- [ ] `VITE_FIREBASE_API_KEY` sudah diset di Netlify
- [ ] `VITE_FIREBASE_AUTH_DOMAIN` sudah diset
- [ ] `VITE_FIREBASE_PROJECT_ID` sudah diset
- [ ] Semua Firebase config variables sesuai dengan Firebase Console

### ✅ Netlify Settings

- [ ] Environment variables sudah diset dengan prefix `VITE_`
- [ ] Build berhasil tanpa error
- [ ] Deploy preview berfungsi

## 🔧 Troubleshooting Tambahan

### **Error Persist setelah Add Domain**

1. **Wait 5-10 menit** untuk propagasi
2. **Hard refresh** browser (`Ctrl+Shift+R`)
3. **Clear cache** dan cookies
4. **Try incognito mode**

### **Multiple Firebase Projects**

Pastikan Anda mengedit project yang benar:

- Check project ID di Firebase Console
- Compare dengan `VITE_FIREBASE_PROJECT_ID` di Netlify

### **Custom Domain Issues**

Jika menggunakan custom domain:

1. Tambahkan **both** `domain.com` dan `www.domain.com`
2. Check DNS configuration
3. Pastikan SSL certificate active

## 📱 Testing

### **Production Testing Checklist:**

1. ✅ **Home page** loads correctly
2. ✅ **Login page** accessible
3. ✅ **Google Sign-In button** clickable
4. ✅ **No console errors** related to Firebase
5. ✅ **Redirect after login** works
6. ✅ **User authentication** persistent

### **Browser Console Check:**

Buka Developer Tools dan pastikan tidak ada error:

```javascript
// Good - no errors
Firebase initialized successfully

// Bad - need to fix
Firebase: Error (auth/unauthorized-domain)
```

## 🎯 Pro Tips

### **Multiple Environments:**

Setup domain untuk berbagai environment:

```
# Development
localhost

# Staging
staging-app-name.netlify.app

# Production
app-name.netlify.app
yourdomain.com
```

### **Netlify Preview Deploys:**

Untuk branch preview deploys, tambahkan pattern:

```
deploy-preview-*--app-name.netlify.app
```

### **Security Best Practices:**

1. **Jangan** tambahkan wildcard domains (`*.netlify.app`)
2. **Hanya** tambahkan domain yang benar-benar digunakan
3. **Remove** domain lama yang tidak terpakai
4. **Monitor** Firebase Console untuk suspicious activity

## 🔗 Useful Links

- [Firebase Auth Domain Documentation](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Firebase Console](https://console.firebase.google.com)

---

🎉 **Setelah mengikuti langkah di atas, Google Sign-In seharusnya sudah berfungsi normal di production!**

Jika masih ada masalah, check kembali:

1. Domain spelling di Firebase Console
2. Environment variables di Netlify
3. Browser cache dan cookies
