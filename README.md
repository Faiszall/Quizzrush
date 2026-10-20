# Quizzrush

Aplikasi kuis edukasi statis untuk belajar di browser. Tidak perlu instalasi paket atau server: buka `index.html` di browser modern.

## Fitur

- Pilihan jenjang SD, SMP, SMA, dan SMK, kelas, mata pelajaran, kesulitan, mode, jumlah soal, dan timer.
- Pilihan Kurikulum Merdeka/Kurikulum 2013, pemetaan fase, katalog mata pelajaran per jenjang/kelas, dan program/konsentrasi SMK.
- Untuk SMK, sekolah mengaktifkan hanya program yang tersedia. Pemetaan Dasar-Dasar Program Keahlian kelas 10 dan materi kejuruan lanjutan kelas 11–12 dipisahkan per program/kelas; konsentrasi mengikuti konfigurasi sekolah. Ringkasan bahan bacaan awal tersedia untuk setiap program contoh dan kelas, serta dapat disunting per konsentrasi kelas 11–12.
- Bank soal awal Teknik Elektronika memuat soal berbeda per kelas: 14 soal kelas 10, 14 soal kelas 11, dan 15 soal kelas 12, mencakup komponen, pengukuran, rangkaian, elektronika digital, keselamatan, serta troubleshooting. Soal ditandai belum diverifikasi dan dapat ditinjau guru sebelum digunakan.
- Bank soal awal TJKT memuat 12 soal berbeda untuk masing-masing kelas 10, 11, dan 12. Topiknya mengikuti pengantar jaringan kelas 10, konfigurasi layanan dan administrasi kelas 11, serta implementasi, keamanan, fiber optik, pemantauan, dan dokumentasi kelas 12.
- Pengelolaan katalog lokal: sesuaikan mata pelajaran wajib/pilihan, tambahkan/edit/hapus program serta konsentrasi, atur materi khusus kelas 11–12 untuk tiap konsentrasi, edit bahan bacaan/ringkasan pembelajaran, tambahkan materi/tujuan/referensi sekolah, dan impor/ekspor konfigurasi JSON. Perubahan struktur bawaan mata pelajaran dapat dimuat sebagai `subjectOverrides` dari berkas konfigurasi.
- Penyaringan soal berdasarkan topik, pengacakan opsi yang tetap terhubung ke kunci jawaban, serta pemeriksaan jumlah soal terhadap bank yang tersedia.
- Mode latihan, tantangan, dan ujian; pertanyaan/pilihan dapat diacak, dengan skor, pembahasan, dan ringkasan hasil.
- Profil pemain, XP, level, lencana, misi harian, dan papan peringkat lokal.
- Editor kuis pilihan ganda dengan validasi, pratinjau, penyusunan ulang soal, duplikasi, impor, dan ekspor JSON.
- Enam avatar karakter bergambar (elang, singa, serigala, harimau, rubah, dan panda) tersedia untuk profil pemain, hasil kuis, dan papan peringkat.
- Tema terang/gelap, efek suara yang dapat dimatikan, serta tata letak responsif.

## Penyimpanan dan batasan

Profil, hasil, pengaturan, pencapaian, dan kuis disimpan di `localStorage` browser pada perangkat ini. Papan peringkat bukan peringkat global. Multiplayer real-time memerlukan backend/server dan belum tersedia pada aplikasi mandiri ini.

Bank bawaan berisi soal contoh untuk mencoba mekanisme permainan; cakupannya tidak lengkap dan belum diverifikasi sebagai kurikulum resmi. Jumlah soal yang dapat dimainkan menyesuaikan soal yang tersedia. Tambahkan materi melalui editor, atau impor berkas JSON hasil ekspor aplikasi.

## Kurikulum dan verifikasi

Katalog aplikasi menyediakan pilihan Kurikulum Merdeka dan K13 secara kondisional, serta metadata kelas/fase, kategori, materi, tujuan pembelajaran, dan referensi. Mata pelajaran pilihan perlu diaktifkan sesuai kondisi sekolah. Untuk SMK, program contoh dinonaktifkan secara bawaan; sekolah perlu mengaktifkan program yang tersedia, lalu menyesuaikan nama, konsentrasi, kurikulum, mata pelajaran tiap kelas, bab, dan ringkasan bahan bacaan melalui pengelola katalog. Ringkasan awal tersedia untuk tiap program dan kelas; kelas 10 berlaku untuk program, sedangkan kelas 11–12 dapat disesuaikan lebih lanjut per konsentrasi dengan materi default program sebagai fallback. Semua contoh bahan bacaan berstatus draf dan perlu ditinjau guru, bukan pemetaan resmi terverifikasi atau pengganti modul, SOP, dan ATP sekolah. Bank Teknik Elektronika memiliki 14 soal kelas 10, 14 soal kelas 11, dan 15 soal kelas 12; bank TJKT memiliki 12 soal berbeda per kelas 10, 11, dan 12. Topik dan tingkat soal disesuaikan sebagai contoh per kelas; semua soal belum diverifikasi. Bab materi dapat dipilih di pengaturan kuis; soal lainnya perlu ditambahkan atau diimpor guru dengan konteks kelas, kurikulum, program, dan konsentrasi yang cocok. Katalog ini adalah titik awal yang dapat dikonfigurasi, bukan daftar resmi lengkap semua satuan pendidikan.

Portal Kurikulum Kemendikdasmen merangkum Permendikdasmen Nomor 13 Tahun 2025 sebagai tidak mengubah kurikulum dan menyebut penambahan mata pelajaran pilihan Koding dan Kecerdasan Artifisial. Namun sumber yang tersedia tidak memverifikasi pemetaan setiap mata pelajaran, fase, ATP, atau soal untuk seluruh sekolah pada tahun ajaran 2026/2027. Status katalog dan soal bawaan karena itu ditandai belum diverifikasi; guru/sekolah perlu mencocokkan capaian, materi, dan referensi setempat sebelum digunakan.

Katalog yang ditambahkan/diaktifkan pengguna disimpan lokal di `localStorage` browser dan dapat dicadangkan lewat ekspor JSON (termasuk konfigurasi program keahlian versi 2). Ini bukan basis data server: perubahan tidak tersinkron antarperangkat dan pengelola katalog lokal tidak memiliki autentikasi atau sinkronisasi peran admin. Soal bawaan, buatan pengguna, dan hasil impor dinilai di browser; aplikasi tidak dapat memvalidasi kunci jawaban secara independen dan tidak cocok untuk penilaian resmi atau kompetitif.

Referensi yang diperiksa:

- [Portal Kurikulum Kemendikdasmen](https://kurikulum.kemendikdasmen.go.id/)
- [Ringkasan Permendikdasmen Nomor 13 Tahun 2025](https://kurikulum.kemendikdasmen.go.id/berita/detail/ringkasan-permendikdasmen-nomor-13-tahun-2025-tentang-perubahan-atas-peraturan-menteri-pendidikan-kebudayaan-riset-dan-teknologi-nomor-12-tahun-2024-tentang-kurikulum-pada-pendidikan-anak-usia-dini-jenjang-pendidikan-dasar-dan-jenjang-pendidikan-menengah)
- [Portal Guru Kemendikdasmen](https://guru.kemendikdasmen.go.id/)
- [Daftar Materi Sumber Belajar Rumah Pendidikan](https://pusatinformasi.rumahpendidikan.kemendikdasmen.go.id/hc/id/sections/52341323555097-Daftar-Materi-Sumber-Belajar) (akses otomatis ditolak saat pemeriksaan; konten belum diverifikasi)

Saat mengekspor, aplikasi mengunduh satu berkas JSON berisi kuis tersimpan. Impor menerima satu kuis atau daftar kuis dengan jenjang, kelas, mata pelajaran yang tersedia, dan soal pilihan ganda berisi empat opsi berbeda serta kunci jawaban.
