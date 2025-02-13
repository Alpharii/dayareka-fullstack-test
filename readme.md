# Full-stack Developer Challenge - Point of Sale (POS)

## Overview
Aplikasi ini merupakan implementasi dari challenge Full-stack Developer untuk PT. Daya Rekadigital. Aplikasi ini terdiri dari **Frontend** menggunakan Next.js dan **Backend** menggunakan Express.js dengan TypeScript. Database yang digunakan adalah PostgreSQL.

---

## Prerequisites
Sebelum menjalankan aplikasi ini, pastikan Anda telah menginstal:

1. [Node.js](https://nodejs.org/) (v16 atau lebih tinggi)
2. [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
3. [PostgreSQL](https://www.postgresql.org/)
4. [Git](https://git-scm.com/)

---

## Installation & Setup

### 1. Clone Repository
Clone repository ini ke lokal Anda:
```bash
git clone https://github.com/Alpharii/dayareka-fullstack-test
cd dayareka-fullstack-test
```

---

### 2. Konfigurasi Database PostgreSQL
1. Pastikan PostgreSQL sudah terinstal di sistem Anda.
2. Masuk ke PostgreSQL shell:
   ```bash
   sudo -u postgres psql
   ```
3. Buat database baru:
   ```sql
   CREATE DATABASE nama_db;
   ```
   Ganti `nama_db` dengan nama database yang Anda inginkan.

---

### 3. Backend Setup
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Instal dependencies:
   ```bash
   npm install
   ```
3. Konfigurasi `.env`:
   - Salin file `.env.example` menjadi `.env`:
```bash
     cp .env.example .env
```
   - Edit file `.env` sesuai dengan konfigurasi database Anda:
     ```bash
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=postgres
     DB_PASSWORD=your_password
     DB_NAME=nama_db
     ```
4. Jalankan migrasi dan seeding:
```bash
   npm run generate
```
   Migrasi akan membuat tabel-tabel yang diperlukan, dan seeder akan mengisi data produk awal.
5. Jalankan server backend:
```bash
   npm run dev
```

Server backend akan berjalan di `http://localhost:8080`.

---

### 4. Frontend Setup
1. Buka terminal baru dan masuk ke direktori frontend:
```bash
   cd ../frontend
```
2. Instal dependencies:
```bash
   npm install
```
3. Jalankan server frontend:
```bash
   npm run dev
```

Server frontend akan berjalan di `http://localhost:3000`.

---

## Project Structure
### Backend
- **'/migrations'**: File migrasi SQL untuk membuat tabel.
- **'/seeders'**: File seeder untuk mengisi data awal.
- **'/src'**: Kode sumber backend.
  - **'/config'**: Config database postgresql.
  - **'/controllers'**: Logika bisnis API.
  - **'/routes'**: Definisi rute API.
- **'.env'**: File konfigurasi environment.

### Frontend
- **'/pages'**: Halaman-halaman aplikasi.
- **'/components'**: Komponen-komponen reusable.
- **'/public'**: File statis seperti gambar atau asset lainnya.

---

## Features
1. **Menambahkan Data Customer Baru**:
   - Endpoint: `POST /api/v1/customers`
2. **Melihat Detail Data Customer**:
   - Endpoint: `GET /api/v1/customers/:id`
3. **Mencari Pelanggan Berdasarkan Nama**:
   - Endpoint: `GET /api/v1/customers/search?name=<nama_pelanggan>`
4. **Menyaring Pelanggan Berdasarkan Level**:
   - Endpoint: `GET /api/v1/customers/filter?level=<level_pelanggan>`
5. **Mengambil Semua Data Pelanggan dengan Paginasi**:
   - Endpoint: `GET /api/v1/customers?page=<nomor_halaman>&limit=<jumlah_data_per_halaman>`
6. **Memperbarui Data Pelanggan**:
   - Endpoint: `PUT /api/v1/customers/:id`
7. **Menghapus Data Pelanggan (Soft Delete)**:
   - Endpoint: `DELETE /api/v1/customers/:id`
8. **Menambah/Mengurangi Kuantitas Produk pada Detail Customer**:
   - Endpoint: `PUT /api/v1/customers/:id/products`
9. **Membuat Transaksi Baru**:
   - Endpoint: `POST /api/v1/transactions`

---

## API Documentation
API dibangun menggunakan prinsip RESTful. Berikut adalah beberapa endpoint utama:

### Customers
- **GET `/api/v1/customers`**: Mendapatkan semua data pelanggan dengan paginasi.
  - Query Params:
    - `page`: Nomor halaman (default: 1).
    - `limit`: Jumlah data per halaman (default: 10).
- **GET `/api/v1/customers/search`**: Mencari pelanggan berdasarkan nama.
  - Query Params:
    - `name`: Nama pelanggan yang ingin dicari.
- **GET `/api/v1/customers/filter`**: Menyaring pelanggan berdasarkan level.
  - Query Params:
    - `level`: Level pelanggan (misalnya: "gold", "silver", "bronze").
- **GET `/api/v1/customers/:id`**: Mendapatkan detail pelanggan berdasarkan ID.
- **POST `/api/v1/customers`**: Menambahkan data pelanggan baru.
- **PUT `/api/v1/customers/:id`**: Memperbarui data pelanggan berdasarkan ID.
- **DELETE `/api/v1/customers/:id`**: Menghapus data pelanggan (soft delete).

### Transactions
- **POST `/api/v1/transactions`**: Membuat transaksi baru.

---


## Notes
1. Pastikan PostgreSQL berjalan di lokal Anda sebelum menjalankan migrasi.
2. Jika ada perubahan pada skema database, jalankan migrasi ulang:
   ```bash
   npm run migrate
   ```bash
3. Untuk menjalankan seeder ulang:
   ```bash
   npm run seed
   ```bash
