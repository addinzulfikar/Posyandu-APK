# Aplikasi Posyandu Digital

Aplikasi Posyandu Digital adalah solusi mobile berbasis React Native untuk memodernisasi pencatatan data kesehatan di Posyandu. Aplikasi ini memungkinkan pencatatan data balita, ibu hamil, dan lansia, serta mencatat hasil penimbangan/pemeriksaan secara real-time.

## Fitur Utama

### 1. Modul Balita
- **List Data Balita**: Menampilkan daftar semua balita dengan fitur pencarian
- **Detail Balita**: Informasi lengkap balita dengan tab:
  - Detail: Data pribadi dan keluarga
  - Grafik: Grafik pertumbuhan berat & tinggi badan (menggunakan react-native-chart-kit)
  - Riwayat: Riwayat penimbangan lengkap
- **Form Input Balita**: Form untuk menambah/edit data balita
- **Penimbangan Balita**: Input data penimbangan dengan:
  - Tanggal penimbangan
  - Usia saat ditimbang
  - Berat badan (kg)
  - Tinggi badan (cm)
  - Status kehadiran
  - Status BB & TB otomatis

### 2. Modul Ibu Hamil
- **List Data Ibu Hamil**: Daftar ibu hamil dengan informasi usia kehamilan
- **Detail Ibu Hamil**: Informasi lengkap dengan tab Informasi dan Riwayat
- **Form Input Ibu Hamil**: Form untuk menambah data ibu hamil dengan field:
  - Nama lengkap
  - Tanggal lahir
  - Usia kehamilan (bulan)
  - Alamat
  - No. telepon
- **Pemeriksaan Ibu Hamil**: Input data pemeriksaan dengan:
  - Tanggal pemeriksaan
  - Berat badan
  - Tinggi badan
  - Tekanan darah
  - Status kehadiran

### 3. Modul Lansia
- **List Data Lansia**: Daftar lansia dengan fitur pencarian
- **Detail Lansia**: Informasi lengkap dengan tab Informasi dan Riwayat
- **Form Input Lansia**: Form untuk menambah data lansia
- **Pemeriksaan Lansia**: Input data pemeriksaan dengan:
  - Tanggal pemeriksaan
  - Berat badan
  - Tinggi badan
  - Tekanan darah (Tensi)
  - Gula darah (mg/dL)
  - Status kehadiran

## Teknologi yang Digunakan

- **React Native** (v0.81.5)
- **Expo** (~54.0.22)
- **React Navigation** (v7.x)
  - Stack Navigator
  - Bottom Tab Navigator
- **React Native Chart Kit**: Untuk grafik pertumbuhan
- **React Native SVG**: Dependency untuk chart
- **React Native DateTimePicker**: Untuk input tanggal
- **Expo Vector Icons (Ionicons)**: Icon set

## Struktur Proyek

```
NetworkTestExpo/
├── App.js                          # Entry point aplikasi
├── src/
│   ├── components/
│   │   ├── CommonComponents.js    # Komponen Card, InfoRow, SectionHeader, dll
│   │   └── CommonComponentsExtended.js  # Button, Input, SearchBar, Badge, dll
│   ├── context/
│   │   └── DataContext.js         # State management global
│   ├── navigation/
│   │   └── AppNavigator.js        # Konfigurasi navigasi
│   ├── screens/
│   │   ├── BalitaListScreen.js
│   │   ├── BalitaDetailScreen.js
│   │   ├── BalitaFormScreen.js
│   │   ├── BalitaPenimbanganScreen.js
│   │   ├── IbuHamilListScreen.js
│   │   ├── LansiaListScreen.js
│   │   ├── LansiaDetailScreen.js
│   │   ├── LansiaFormScreen.js
│   │   ├── LansiaPenimbanganScreen.js
│   │   └── PlaceholderScreens.js  # Screens untuk Ibu Hamil
│   └── utils/
│       ├── chartHelper.js         # Helper functions untuk grafik & kalkulasi
│       └── responsive.js          # Utility responsive design
└── package.json
```

## Cara Install dan Menjalankan

### Prerequisites
- Node.js (v20.x)
- npm atau yarn
- Expo CLI
- Emulator Android/iOS atau Expo Go di smartphone

### Langkah Install

1. Clone atau extract project

2. Install dependencies:
```bash
cd "NetworkTestExpo"
npm install
```

3. Jalankan aplikasi:
```bash
npm start
```

## Backend API (untuk Postman & koneksi app)

Project ini sekarang punya REST API lokal (Express) untuk kebutuhan testing Postman dan (opsional) sebagai sumber data aplikasi.

### Menjalankan API
```bash
npm run api
```
Default URL: `http://localhost:3001/api/health`

### Android via USB (tanpa QR / tanpa Wi‑Fi)
Jika app dijalankan di HP Android via Expo Go dan ingin akses API PC melalui kabel USB, gunakan ADB reverse:

1. Pastikan `adb devices` mendeteksi device
2. Jalankan:
```bash
adb reverse tcp:3001 tcp:3001
```
3. Jalankan Expo seperti biasa.

4. Pilih platform:
   - Tekan `a` untuk Android
   - Tekan `i` untuk iOS
   - Tekan `w` untuk Web
   - Scan QR code dengan Expo Go app

## Komponen Reusable

### CommonComponents
- `Card`: Komponen kartu dengan shadow
- `InfoRow`: Menampilkan label-value dengan icon
- `StatusBadge`: Badge untuk status (Normal, Kurang, Berlebih)
- `SectionHeader`: Header section dengan tombol aksi

### CommonComponentsExtended
- `Button`: Tombol dengan berbagai variant (primary, secondary, danger, success)
- `Input`: Text input dengan label, icon, dan error handling
- `SearchBar`: Search bar dengan clear button
- `TabView`: Tab navigation horizontal
- `Badge`: Badge dengan berbagai variant warna
- `EmptyState`: Komponen untuk state kosong
- `StatsCard`: Card untuk menampilkan statistik
- `ListItem`: Item list dengan icon dan action

## Data Context

Data disimpan dalam React Context (DataContext) dengan struktur:

### Balita
```javascript
{
  id: string,
  nama: string,
  tanggalLahir: string,
  jenisKelamin: 'Laki-laki' | 'Perempuan',
  namaOrtu: string,
  alamat: string,
  noTelp: string,
  riwayatPenimbangan: [
    {
      id: string,
      tanggal: string,
      usia: number (bulan),
      beratBadan: number (kg),
      tinggiBadan: number (cm),
      statusBB: string,
      statusTB: string,
      kehadiran: boolean
    }
  ]
}
```

### Ibu Hamil
```javascript
{
  id: string,
  nama: string,
  tanggalLahir: string,
  alamat: string,
  noTelp: string,
  usiaKehamilan: number (bulan),
  riwayatPenimbangan: [
    {
      id: string,
      tanggal: string,
      beratBadan: number (kg),
      tinggiBadan: number (cm),
      tekananDarah: string,
      kehadiran: boolean
    }
  ]
}
```

### Lansia
```javascript
{
  id: string,
  nama: string,
  tanggalLahir: string,
  jenisKelamin: 'Laki-laki' | 'Perempuan',
  alamat: string,
  noTelp: string,
  riwayatPenimbangan: [
    {
      id: string,
      tanggal: string,
      beratBadan: number (kg),
      tinggiBadan: number (cm),
      tensi: string,
      gulaDarah: number (mg/dL),
      kehadiran: boolean
    }
  ]
}
```

## Helper Functions (chartHelper.js)

- `calculateAge(birthDate)`: Menghitung usia dalam bulan
- `calculateAgeInYears(birthDate)`: Menghitung usia dalam tahun
- `formatDate(date)`: Format tanggal ke DD/MM/YYYY
- `prepareChartData(riwayat, dataKey)`: Menyiapkan data untuk grafik
- `getLatestPenimbangan(riwayat)`: Mendapatkan data penimbangan terakhir
- `determineStatusBB(bb, usia, jenisKelamin)`: Menentukan status berat badan
- `determineStatusTB(tb, usia, jenisKelamin)`: Menentukan status tinggi badan
- `getStatusBadgeVariant(status)`: Menentukan variant badge berdasarkan status

## Navigasi

Aplikasi menggunakan Bottom Tab Navigator dengan 3 tab utama:
1. **Balita** (Icon: people)
2. **Ibu Hamil** (Icon: woman)
3. **Lansia** (Icon: accessibility)

Setiap tab memiliki Stack Navigator dengan screens:
- List Screen
- Detail Screen
- Form Screen
- Penimbangan/Pemeriksaan Screen

## Fitur yang Dapat Dikembangkan

1. **Backend Integration**: Integrasi dengan API backend untuk menyimpan data ke server
2. **Authentication**: Sistem login untuk Pengurus Posyandu dan Orang Tua
3. **Push Notifications**: Notifikasi jadwal penimbangan
4. **Export Data**: Export data ke PDF atau Excel
5. **Offline Mode**: Sinkronisasi data offline
6. **Foto Profil**: Upload dan tampilkan foto balita/lansia/ibu hamil
7. **Reminder**: Pengingat jadwal pemeriksaan
8. **Dashboard Statistik**: Dashboard dengan grafik statistik keseluruhan
9. **Role-based Access**: Pembatasan akses berdasarkan role (Pengurus vs Orang Tua)
10. **Grafik WHO**: Implementasi kurva pertumbuhan WHO yang akurat

## Catatan Pengembangan

- Status berat badan dan tinggi badan saat ini menggunakan kalkulasi sederhana. Untuk produksi, sebaiknya menggunakan standar WHO growth charts.
- Data saat ini disimpan di memory (React Context). Untuk produksi, gunakan AsyncStorage atau backend database.
- Form validation sudah diterapkan pada semua input form.
- Responsive design sudah diimplementasikan untuk mendukung berbagai ukuran layar.

## Kontribusi

Untuk kontribusi, silakan:
1. Fork repository
2. Buat branch fitur baru
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi

[Tentukan lisensi yang sesuai]

---

**Dibuat dengan ❤️ untuk Posyandu Indonesia**
