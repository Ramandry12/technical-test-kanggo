# Task Management Console

Aplikasi full-stack interaktif untuk manajemen tugas menggunakan express.js, mariadb, dan react.js yang terintegrasi dengan docker compose.

---

## ⚡ Cara Running Aplikasi

Pastikan **Docker Desktop** sudah aktif, lalu jalankan perintah berikut di root folder:

```bash
# Menyalakan aplikasi (DB + Backend + Frontend)
docker compose up -d --build

# Menghentikan aplikasi
docker compose down
```

Setelah berjalan, Anda dapat mengakses:

- **Frontend Web**: [http://localhost:5173](http://195.88.211.106:5173)
- **Dokumentasi API (Swagger)**: [http://localhost:5002/api-docs](http://195.88.211.106:5002/api-docs)

---

## ⚙️ Konfigurasi Environment & Database

Aplikasi ini menggunakan berkas `.env` untuk konfigurasi environment di masing-masing direktori:

### 1. Backend (`/backend/.env`)

Salin dari `.env.example` ke `.env` dan sesuaikan konfigurasinya:

- **`DATABASE_URL`**: URL koneksi database MySQL/MariaDB. _(Catatan: Jika dijalankan via Docker, host `localhost` akan otomatis diarahkan ke nama container `db`)_.
- **`PORT`**: Port server backend (default: `5001`).
- **`JWT_SECRET`**: Kunci enkripsi token JWT.
- **`SALT_ROUNDS`**: Jumlah putaran salt bcrypt untuk hashing password (default: `10`).

### 2. Frontend (`/frontend/.env`)

Salin dari `.env.example` ke `.env` dan sesuaikan endpoint API:

- **`VITE_API_URL`**: URL backend API (`http://localhost:5001/api`).

### 3. Setup Database (Prisma ORM)

- **Menggunakan Docker**: Migrasi dan tabel database otomatis dibuat saat container dinyalakan.
- **Secara Manual**: Jalankan perintah `yarn prisma migrate dev` di folder `backend` untuk membuat skema database pada MySQL/MariaDB lokal Anda.
