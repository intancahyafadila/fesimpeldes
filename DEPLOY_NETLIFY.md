# 🚀 Tutorial Deploy SiPelMasD ke Netlify

Tutorial lengkap untuk mendeploy aplikasi **Sistem Informasi Pelayanan Masyarakat Digital (SiPelMasD)** ke Netlify.

## 📋 Prasyarat

Sebelum memulai, pastikan Anda memiliki:

- [x] Akun GitHub (untuk menyimpan kode)
- [x] Akun Netlify (gratis di [netlify.com](https://netlify.com))
- [x] Aplikasi SiPelMasD sudah siap dan berjalan di local
- [x] Node.js dan npm terinstall

## 🛠️ Persiapan Project

### 1. Pastikan Build Script Tersedia

Buka `package.json` dan pastikan script build ada:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

### 2. Test Build Lokal

Sebelum deploy, pastikan aplikasi bisa di-build tanpa error:

```bash
npm run build
```

Jika berhasil, akan terbuat folder `dist/` yang berisi file production.

### 3. Test Preview Lokal

```bash
npm run preview
```

Akses `http://localhost:4173` untuk memastikan build berjalan dengan baik.

## 🔧 Konfigurasi Netlify

### 1. Buat File Konfigurasi Netlify

Buat file `netlify.toml` di root project:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 5173
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Update .gitignore (Opsional)

Pastikan file yang tidak perlu tidak di-commit:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Netlify
.netlify/
```

## 🌐 Deploy via GitHub (Recommended)

### 1. Push ke GitHub

```bash
# Inisialisasi git (jika belum)
git init

# Add semua file
git add .

# Commit
git commit -m "feat: prepare for netlify deployment"

# Add remote origin (ganti dengan repo GitHub Anda)
git remote add origin https://github.com/username/web-desa-intan.git

# Push ke GitHub
git push -u origin main
```

### 2. Connect GitHub ke Netlify

1. **Login ke Netlify**: Buka [netlify.com](https://netlify.com) dan login
2. **New Site**: Klik "New site from Git"
3. **Choose Provider**: Pilih "GitHub"
4. **Authorize**: Izinkan Netlify mengakses GitHub Anda
5. **Select Repository**: Pilih repository `web-desa-intan`

### 3. Configure Build Settings

Di halaman deploy settings Netlify:

```
Branch to deploy: main
Build command: npm run build
Publish directory: dist
```

### 4. Advanced Build Settings (Environment Variables)

Jika menggunakan environment variables, tambahkan di **Site settings > Environment variables**:

```
NODE_VERSION = 18
VITE_API_URL = https://api-test-production-ccbf.up.railway.app
VITE_FIREBASE_API_KEY = your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN = your_project.firebaseapp.com
# tambahkan variable lainnya sesuai kebutuhan
```

### 5. Deploy

Klik **"Deploy site"** dan tunggu proses build selesai.

## 🚀 Deploy Manual (Drag & Drop)

Jika tidak ingin menggunakan GitHub:

### 1. Build Project

```bash
npm run build
```

### 2. Deploy ke Netlify

1. Buka [netlify.com](https://netlify.com)
2. Scroll ke bawah ke section **"Want to deploy a new site without connecting to Git?"**
3. Drag & drop folder `dist/` ke area deploy
4. Tunggu upload selesai

## 🔗 Custom Domain (Opsional)

### 1. Setup Custom Domain

1. **Site settings**: Masuk ke dashboard site Anda
2. **Domain management**: Klik "Domain settings"
3. **Add custom domain**: Masukkan domain Anda (contoh: `sipelmasd.com`)

### 2. Configure DNS

Di registrar domain Anda, update DNS records:

```
Type: CNAME
Name: www
Value: your-site-name.netlify.app

Type: A
Name: @
Value: 75.2.60.5
```

Atau gunakan Netlify DNS untuk kemudahan.

## ⚡ Optimasi Performa

### 1. Environment Variables untuk Production

Buat file `.env.production`:

```env
VITE_API_URL=https://api-production.your-domain.com
VITE_FIREBASE_API_KEY=your_production_firebase_key
```

### 2. Build Optimizations

Update `vite.config.ts` untuk optimasi production:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          firebase: ["firebase/app", "firebase/auth"],
        },
      },
    },
  },
});
```

## 🔍 Troubleshooting

### ❌ Build Gagal

**Error: Node.js version is incorrect (v22.16.0)**

```bash
# Solusi: Pastikan file konfigurasi sudah benar
# 1. netlify.toml sudah ada dengan NODE_VERSION = "18.18.0"
# 2. .nvmrc berisi "18.18.0"
# 3. Di Netlify dashboard > Site settings > Environment variables
#    Tambahkan: NODE_VERSION = 18.18.0
```

**Error: TypeScript errors**

```bash
# Fix TypeScript errors dulu
npm run lint
# Atau skip TypeScript check (tidak recommended)
# Edit package.json: "build": "vite build"
```

**Error: Missing dependencies**

```bash
# Install ulang dependencies
rm -rf node_modules package-lock.json
npm install
```

### ❌ 404 pada Route

Pastikan file `netlify.toml` ada dan berisi redirects:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### ❌ Environment Variables tidak terbaca

1. Pastikan variable dimulai dengan `VITE_`
2. Check di Netlify dashboard: **Site settings > Environment variables**
3. Redeploy site setelah menambah env vars

### ❌ Firebase tidak berfungsi

1. **Check Firebase config**: Pastikan environment variables Firebase sudah benar
2. **Domain authorization**: Tambahkan domain Netlify ke Firebase Console > Authentication > Settings > Authorized domains

## 📊 Monitoring dan Analytics

### 1. Netlify Analytics

Enable di **Site settings > Analytics** untuk tracking:

- Page views
- Unique visitors
- Top pages
- Bandwidth usage

### 2. Performance Monitoring

Gunakan Lighthouse untuk check performa:

```bash
npm install -g lighthouse
lighthouse https://your-site.netlify.app
```

## 🔄 Continuous Deployment

Setelah setup GitHub integration:

1. **Setiap push ke branch `main`** akan trigger auto-deploy
2. **Preview deploy**: Push ke branch lain akan create deploy preview
3. **Pull request**: Otomatis generate preview URL

### Branch Protection

Setup di GitHub untuk production safety:

1. **Settings > Branches**
2. **Add rule** untuk branch `main`
3. **Require pull request reviews**
4. **Require status checks** (Netlify deploy preview)

## 🎯 Best Practices

### ✅ Do's

- ✅ Selalu test build lokal sebelum push
- ✅ Gunakan environment variables untuk config
- ✅ Setup monitoring dan error tracking
- ✅ Optimize images dan assets
- ✅ Setup custom domain dengan HTTPS
- ✅ Gunakan branch protection untuk production
- ✅ Monitor bundle size dan performance

### ❌ Don'ts

- ❌ Jangan commit sensitive data (API keys, passwords)
- ❌ Jangan skip TypeScript errors
- ❌ Jangan ignore build warnings
- ❌ Jangan deploy tanpa testing
- ❌ Jangan lupa setup redirects untuk SPA

## 🔗 Useful Links

- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router Netlify Setup](https://ui.dev/react-router-cannot-read-property-match-of-undefined)
- [Firebase Hosting Alternative](https://firebase.google.com/docs/hosting)

## 📞 Support

Jika mengalami kendala:

1. **Check build logs** di Netlify dashboard
2. **Netlify Community Forum**: [community.netlify.com](https://community.netlify.com)
3. **Documentation**: [docs.netlify.com](https://docs.netlify.com)

---

🎉 **Selamat!** Aplikasi SiPelMasD Anda sekarang sudah live di Netlify!

**Example URL**: `https://sipelmasd-amazing.netlify.app`

_Happy Deploying!_ 🚀
