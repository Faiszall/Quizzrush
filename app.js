"use strict";

const STORAGE_KEY = "quiz-master-indonesia-v1";
const AVATARS = [
  { id: "eagle", name: "Elang", src: "assets/avatars/eagle.jpeg" },
  { id: "lion", name: "Singa", src: "assets/avatars/lion.jpeg" },
  { id: "wolf", name: "Serigala", src: "assets/avatars/wolf.jpeg" },
  { id: "tiger", name: "Harimau", src: "assets/avatars/tiger.jpeg" },
  { id: "fox", name: "Rubah", src: "assets/avatars/fox.jpeg" },
  { id: "panda", name: "Panda", src: "assets/avatars/panda.jpeg" }
];
const LEVELS = [
  { name: "Pemula", xp: 0 },
  { name: "Penjelajah Ilmu", xp: 100 },
  { name: "Pelajar Hebat", xp: 300 },
  { name: "Ahli Pengetahuan", xp: 650 },
  { name: "Master Quiz", xp: 1100 },
  { name: "Legenda Pendidikan", xp: 1800 }
];
const BADGES = [
  { id: "first", icon: "🌱", name: "Jawaban Pertama", description: "Jawab soal pertamamu" },
  { id: "perfect", icon: "🧠", name: "Jenius", description: "Jawab semua soal dengan benar" },
  { id: "speed", icon: "⚡", name: "Kilat", description: "Jawab 3 soal benar dalam 5 detik" },
  { id: "ten-games", icon: "🔥", name: "Rajin Belajar", description: "Selesaikan 10 kuis" },
  { id: "expert", icon: "🎓", name: "Ahli Materi", description: "Raih nilai minimal 80" },
  { id: "comeback", icon: "💪", name: "Pantang Menyerah", description: "Selesaikan kuis setelah mencoba lagi" }
];

function question(topic, difficulty, prompt, correct, distractors, explanation) {
  return { topic, difficulty, prompt, options: [correct, ...distractors], answer: correct, explanation, verificationStatus: "unverified" };
}

function phaseFor(education, grade) {
  const numericGrade = Number(grade);
  if (education === "SD") return numericGrade <= 2 ? "A" : numericGrade <= 4 ? "B" : "C";
  if (education === "SMP") return "D";
  return numericGrade === 10 ? "E" : "F";
}

const BANKS = {
  matematika: [
    question("Operasi hitung", "Mudah", "Berapakah hasil dari 48 ÷ 6?", "8", ["6", "7", "9"], "48 dibagi menjadi 6 kelompok sama besar menghasilkan 8."),
    question("Pecahan", "Mudah", "Berapakah ¾ jika ditulis sebagai bilangan desimal?", "0,75", ["0,34", "0,43", "1,25"], "¾ = 3 ÷ 4 = 0,75."),
    question("Keliling", "Sedang", "Persegi memiliki sisi 7 cm. Berapa kelilingnya?", "28 cm", ["14 cm", "21 cm", "49 cm"], "Keliling persegi adalah 4 × sisi, jadi 4 × 7 = 28 cm."),
    question("Persentase", "Sedang", "Berapakah 20% dari 150?", "30", ["20", "25", "35"], "20% = 0,2. Maka 0,2 × 150 = 30."),
    question("Aljabar", "Sedang", "Jika 3x + 4 = 19, berapakah nilai x?", "5", ["3", "4", "6"], "Kurangi 4 dari kedua sisi: 3x = 15, sehingga x = 5."),
    question("Pola bilangan", "Sedang", "Angka berikutnya pada pola 2, 5, 8, 11, ... adalah?", "14", ["12", "13", "15"], "Pola bertambah 3 setiap langkah, jadi 11 + 3 = 14."),
    question("Luas", "Sedang", "Panjang persegi panjang 9 cm dan lebarnya 4 cm. Berapa luasnya?", "36 cm²", ["26 cm²", "32 cm²", "36 cm"], "Luas persegi panjang = panjang × lebar = 9 × 4 = 36 cm²."),
    question("Bilangan", "Mudah", "Manakah bilangan prima di bawah ini?", "13", ["15", "21", "27"], "13 hanya memiliki dua faktor, yaitu 1 dan 13."),
    question("Persamaan", "Sulit", "Jika 2(x − 3) = 10, berapakah nilai x?", "8", ["5", "7", "10"], "Bagi kedua sisi dengan 2 sehingga x − 3 = 5. Jadi x = 8."),
    question("Rasio", "Sulit", "Rasio siswa laki-laki dan perempuan adalah 2 : 3. Jika ada 25 siswa, berapa siswa perempuan?", "15", ["10", "12", "18"], "Jumlah bagian = 5. Setiap bagian berisi 25 ÷ 5 = 5 siswa; perempuan = 3 × 5 = 15.")
  ],
  indonesia: [
    question("Kata baku", "Mudah", "Manakah penulisan kata baku yang tepat?", "aktivitas", ["aktifitas", "aktifvitas", "aktipitas"], "Bentuk baku menurut ejaan bahasa Indonesia adalah aktivitas."),
    question("Ide pokok", "Mudah", "Kalimat utama dalam sebuah paragraf biasanya memuat ...", "ide pokok paragraf", ["contoh tambahan saja", "daftar pustaka", "judul buku"], "Kalimat utama berisi gagasan utama yang dijelaskan oleh kalimat lain."),
    question("Tanda baca", "Mudah", "Tanda baca yang tepat untuk mengakhiri kalimat tanya adalah ...", "tanda tanya (?)", ["titik (.)", "koma (,)", "titik dua (:)"], "Kalimat yang menanyakan sesuatu diakhiri tanda tanya."),
    question("Sinonim", "Sedang", "Kata yang memiliki makna paling dekat dengan 'cermat' adalah ...", "teliti", ["lalai", "tergesa", "ragu"], "Cermat berarti teliti atau berhati-hati."),
    question("Teks laporan", "Sedang", "Tujuan utama teks laporan hasil observasi adalah ...", "menyampaikan fakta hasil pengamatan", ["menceritakan khayalan", "mengajak membeli barang", "menyampaikan dialog drama"], "Laporan observasi menyajikan informasi faktual dari pengamatan."),
    question("Kalimat efektif", "Sedang", "Kalimat manakah yang paling efektif?", "Para siswa mengikuti upacara.", ["Para siswa-siswa mengikuti upacara.", "Semua para siswa mengikuti upacara.", "Siswa-siswa semua mengikuti upacara bersama-sama."], "Kata 'para' sudah menunjukkan jamak sehingga tidak perlu pengulangan."),
    question("Majas", "Sedang", "Kalimat 'Angin malam berbisik di telingaku' menggunakan majas ...", "personifikasi", ["hiperbola", "litotes", "metonimia"], "Personifikasi memberikan sifat manusia, yaitu berbisik, kepada angin."),
    question("Pantun", "Mudah", "Dua baris pertama pada pantun disebut ...", "sampiran", ["isi", "amanat", "tema"], "Pantun umumnya terdiri atas sampiran pada dua baris awal dan isi pada dua baris akhir."),
    question("Simpulan", "Sulit", "Simpulan yang baik dari sebuah teks harus ...", "sesuai isi dan merangkum gagasan utama", ["memuat informasi baru yang tidak dibahas", "menyalin setiap kalimat", "berisi pendapat yang tidak terkait"], "Simpulan merangkum gagasan utama berdasarkan informasi dalam teks."),
    question("Kata hubung", "Sedang", "Kata hubung yang menyatakan sebab adalah ...", "karena", ["tetapi", "kemudian", "atau"], "Kata 'karena' menghubungkan sebab dengan akibat.")
  ],
  science: [
    question("Makhluk hidup", "Mudah", "Bagian tumbuhan yang paling banyak menyerap air dari tanah adalah ...", "akar", ["bunga", "buah", "daun"], "Akar menyerap air dan mineral dari tanah."),
    question("Ekosistem", "Mudah", "Makhluk hidup yang dapat membuat makanannya sendiri disebut ...", "produsen", ["konsumen", "pengurai", "predator"], "Produsen seperti tumbuhan membuat makanan melalui fotosintesis."),
    question("Wujud benda", "Mudah", "Air yang membeku berubah menjadi ...", "padat", ["gas", "plasma", "cair"], "Pembekuan mengubah air cair menjadi es yang berwujud padat."),
    question("Gaya", "Sedang", "Gaya yang membuat benda jatuh menuju permukaan Bumi adalah ...", "gravitasi", ["magnet", "gesek", "listrik"], "Gravitasi menarik benda bermassa ke arah Bumi."),
    question("Energi", "Sedang", "Sumber energi utama bagi kehidupan di Bumi adalah ...", "Matahari", ["Bulan", "bintang laut", "batu bara saja"], "Matahari memasok cahaya dan panas serta mendukung fotosintesis."),
    question("Rantai makanan", "Sedang", "Pada rantai rumput → belalang → katak, katak berperan sebagai ...", "konsumen tingkat II", ["produsen", "konsumen tingkat I", "pengurai"], "Belalang memakan produsen; katak memakan belalang, sehingga menjadi konsumen tingkat II."),
    question("Pernapasan", "Sedang", "Organ utama pertukaran oksigen dan karbon dioksida pada manusia adalah ...", "paru-paru", ["lambung", "ginjal", "pankreas"], "Pertukaran gas berlangsung di alveolus dalam paru-paru."),
    question("Listrik", "Sedang", "Bahan yang mudah menghantarkan listrik disebut ...", "konduktor", ["isolator", "resistor", "transparan"], "Konduktor, seperti tembaga, memungkinkan muatan listrik mengalir."),
    question("Siklus air", "Sulit", "Perubahan uap air menjadi titik-titik air di atmosfer disebut ...", "kondensasi", ["evaporasi", "infiltrasi", "presipitasi"], "Kondensasi adalah perubahan gas menjadi cair, membentuk awan."),
    question("Adaptasi", "Sedang", "Kaki bebek berselaput membantu bebek untuk ...", "berenang", ["memanjat pohon", "menggali tanah", "menangkap cahaya"], "Selaput memperluas permukaan dorongan kaki di air.")
  ],
  ips: [
    question("Peta", "Mudah", "Gambar permukaan bumi pada bidang datar dengan skala tertentu disebut ...", "peta", ["globe", "atlas langit", "diagram alur"], "Peta menggambarkan permukaan Bumi pada bidang datar dengan skala."),
    question("Sejarah Indonesia", "Sedang", "Proklamasi Kemerdekaan Indonesia dibacakan pada tanggal ...", "17 Agustus 1945", ["20 Mei 1908", "1 Juni 1945", "10 November 1945"], "Proklamasi dibacakan Soekarno pada 17 Agustus 1945."),
    question("Kegiatan ekonomi", "Mudah", "Orang yang menggunakan barang atau jasa untuk memenuhi kebutuhan disebut ...", "konsumen", ["produsen", "distributor", "investor"], "Konsumen menggunakan atau mengonsumsi barang dan jasa."),
    question("Geografi", "Sedang", "Garis khayal yang membagi Bumi menjadi belahan utara dan selatan adalah ...", "khatulistiwa", ["garis bujur utama", "garis tanggal internasional", "garis balik utara"], "Khatulistiwa atau ekuator berada pada lintang 0 derajat."),
    question("Sosiologi", "Sedang", "Proses seseorang mempelajari nilai dan norma masyarakat disebut ...", "sosialisasi", ["urbanisasi", "industrialisasi", "modernisasi"], "Sosialisasi membantu seseorang memahami nilai dan norma kelompoknya."),
    question("Sejarah dunia", "Sulit", "Revolusi Industri pertama kali berkembang di ...", "Britania Raya", ["Jepang", "Brasil", "Mesir"], "Revolusi Industri bermula di Britania Raya pada abad ke-18."),
    question("Ekonomi", "Sedang", "Kelangkaan terjadi karena ...", "kebutuhan tidak terbatas, sedangkan sumber daya terbatas", ["barang selalu tersedia tanpa batas", "manusia tidak memiliki kebutuhan", "semua harga selalu sama"], "Kelangkaan timbul dari keterbatasan sumber daya untuk memenuhi banyak kebutuhan."),
    question("Interaksi sosial", "Mudah", "Kerja bakti membersihkan lingkungan merupakan contoh ...", "kerja sama", ["persaingan", "konflik", "kontravensi"], "Warga bekerja bersama untuk mencapai tujuan yang sama."),
    question("Peta", "Sedang", "Skala 1 : 100.000 berarti 1 cm pada peta mewakili ...", "1 km di lapangan", ["100 m di lapangan", "10 km di lapangan", "100 km di lapangan"], "100.000 cm sama dengan 1.000 m atau 1 km."),
    question("Demografi", "Sulit", "Perpindahan penduduk dari desa menuju kota disebut ...", "urbanisasi", ["emigrasi", "transmigrasi", "imigrasi"], "Urbanisasi adalah perpindahan penduduk dari desa ke kota.")
  ],
  english: [
    question("Vocabulary", "Mudah", "What is the English word for 'perpustakaan'?", "library", ["laboratory", "bookstore", "classroom"], "A library is a place where people can read or borrow books."),
    question("Vocabulary", "Mudah", "The opposite of 'early' is ...", "late", ["fast", "soon", "quick"], "'Late' means happening after the expected time; it is the opposite of 'early'."),
    question("Grammar", "Mudah", "Choose the correct sentence.", "She goes to school every day.", ["She go to school every day.", "She going to school every day.", "She gone to school every day."], "In the simple present, 'she' takes a verb ending in -s."),
    question("Vocabulary", "Sedang", "What does 'environment' mean in Indonesian?", "lingkungan", ["perjalanan", "perdagangan", "peralatan"], "'Environment' means the natural or surrounding conditions: lingkungan."),
    question("Grammar", "Sedang", "Complete the sentence: They ___ football yesterday.", "played", ["play", "plays", "playing"], "'Yesterday' signals past time, so use the past form 'played'."),
    question("Vocabulary", "Mudah", "Which word means 'jujur'?", "honest", ["hungry", "heavy", "healthy"], "'Honest' means truthful or tidak berbohong."),
    question("Grammar", "Sedang", "Choose the correct comparative form: This bag is ___ than that one.", "heavier", ["heavy", "heaviest", "more heavy"], "For many short adjectives ending in -y, change y to i and add -er."),
    question("Expression", "Mudah", "A polite response to 'Thank you' is ...", "You're welcome.", ["Good night.", "See you yesterday.", "I'm sorry you are."], "'You're welcome' is a common polite response to thanks."),
    question("Grammar", "Sedang", "Complete the sentence: We ___ studying when the lights went out.", "were", ["was", "is", "be"], "Use 'were' with 'we' in the past continuous."),
    question("Vocabulary", "Sedang", "A person who designs buildings is an ...", "architect", ["accountant", "farmer", "librarian"], "An architect plans and designs buildings.")
  ],
  pancasila: [
    question("Pancasila", "Mudah", "Berapa jumlah sila dalam Pancasila?", "Lima", ["Tiga", "Empat", "Enam"], "Pancasila memiliki lima sila."),
    question("Lambang negara", "Mudah", "Lambang negara Indonesia adalah ...", "Garuda Pancasila", ["Harimau Nusantara", "Rajawali Merdeka", "Burung Cenderawasih"], "Garuda Pancasila memuat perisai dengan simbol lima sila."),
    question("Pancasila", "Sedang", "Menghargai teman yang berbeda agama mencerminkan sila ke ...", "1", ["2", "3", "5"], "Sila pertama mengajarkan kepercayaan kepada Tuhan dan sikap saling menghormati."),
    question("Musyawarah", "Sedang", "Keputusan bersama sebaiknya diambil melalui ...", "musyawarah", ["paksaan", "pertengkaran", "keinginan satu orang"], "Musyawarah memberi kesempatan untuk menyampaikan pendapat dan mencapai kesepakatan."),
    question("Persatuan", "Mudah", "Semboyan Bhinneka Tunggal Ika memiliki arti ...", "berbeda-beda tetapi tetap satu", ["bersatu karena semuanya sama", "berbeda lalu berpisah", "satu daerah satu budaya"], "Semboyan ini mengajarkan persatuan di tengah keberagaman."),
    question("Hak dan kewajiban", "Sedang", "Menaati aturan sekolah merupakan contoh ...", "kewajiban siswa", ["hak istimewa", "hukuman", "hadiah"], "Siswa berkewajiban menaati tata tertib yang berlaku."),
    question("Gotong royong", "Mudah", "Manfaat gotong royong adalah ...", "pekerjaan terasa lebih ringan dan kebersamaan terjaga", ["membuat pekerjaan selalu tertunda", "menghilangkan tanggung jawab", "membuat semua orang bersaing"], "Gotong royong membagi pekerjaan dan memperkuat kebersamaan."),
    question("Konstitusi", "Sulit", "Undang-Undang Dasar Negara Republik Indonesia Tahun 1945 berfungsi sebagai ...", "hukum dasar tertulis negara", ["peraturan kelas", "perjanjian perdagangan", "buku sejarah daerah"], "UUD 1945 merupakan konstitusi atau hukum dasar tertulis Indonesia."),
    question("Keberagaman", "Sedang", "Sikap tepat saat teman menyampaikan pendapat berbeda adalah ...", "mendengarkan dengan hormat", ["mengejek pendapatnya", "memotong pembicaraan", "memaksanya setuju"], "Menghargai perbedaan pendapat menjaga diskusi tetap baik."),
    question("Pancasila", "Sedang", "Membantu korban bencana tanpa membedakan latar belakang mencerminkan nilai ...", "kemanusiaan dan persatuan", ["perpecahan", "persaingan bebas", "kepentingan pribadi"], "Tindakan tersebut menghargai martabat manusia sekaligus memperkuat persatuan.")
  ],
  informatika: [
    question("Berpikir komputasional", "Mudah", "Urutan langkah logis untuk menyelesaikan masalah disebut ...", "algoritma", ["perangkat keras", "browser", "jaringan"], "Algoritma adalah rangkaian langkah terurut untuk menyelesaikan suatu masalah."),
    question("Perangkat komputer", "Mudah", "Manakah yang termasuk perangkat masukan (input)?", "papan ketik", ["monitor", "speaker", "printer"], "Papan ketik digunakan untuk memasukkan teks atau perintah ke komputer."),
    question("Internet", "Sedang", "Kata sandi yang lebih aman sebaiknya ...", "unik, panjang, dan sulit ditebak", ["sama dengan nama pengguna", "dibagikan kepada teman", "berisi tanggal lahir saja"], "Kata sandi yang kuat tidak mudah ditebak dan tidak digunakan ulang."),
    question("Data", "Sedang", "Representasi informasi menggunakan angka 0 dan 1 disebut sistem ...", "biner", ["desimal", "romawi", "heksadesimal saja"], "Sistem biner memakai dua simbol, yaitu 0 dan 1."),
    question("Jaringan", "Mudah", "Perangkat yang meneruskan lalu lintas data antarjaringan adalah ...", "router", ["keyboard", "kamera", "proyektor"], "Router mengarahkan paket data di antara jaringan."),
    question("Pemrograman", "Sedang", "Dalam pemrograman, perintah untuk mengulang langkah disebut ...", "perulangan", ["variabel", "komentar", "masukan"], "Perulangan menjalankan satu blok instruksi berkali-kali."),
    question("Keamanan digital", "Sedang", "Informasi pribadi sebaiknya ...", "dibagikan hanya saat perlu dan kepada pihak tepercaya", ["dikirim ke semua orang", "ditulis di ruang publik", "digunakan sebagai kata sandi"], "Membatasi informasi pribadi membantu menjaga keamanan digital."),
    question("Pemrograman", "Mudah", "Tempat menyimpan nilai yang dapat digunakan program disebut ...", "variabel", ["algoritma", "piksel", "peramban"], "Variabel adalah nama untuk nilai/data yang digunakan program."),
    question("Etika digital", "Sedang", "Sebelum meneruskan berita yang mengejutkan, sebaiknya kita ...", "memeriksa sumber dan kebenarannya", ["langsung menyebarkannya", "mengubah judulnya", "menghapus nama sumber"], "Memeriksa fakta membantu mencegah penyebaran informasi keliru."),
    question("Data", "Sulit", "Dalam tabel, kolom biasanya berisi ...", "data untuk satu atribut yang sama", ["semua jenis data secara acak", "hanya judul dokumen", "langkah algoritma saja"], "Kolom mengelompokkan nilai dari atribut yang sama pada setiap baris.")
  ],
  biology: [
    question("Sel", "Mudah", "Unit struktural dan fungsional terkecil makhluk hidup adalah ...", "sel", ["jaringan", "organ", "sistem organ"], "Sel adalah unit dasar penyusun makhluk hidup."),
    question("Fotosintesis", "Mudah", "Organel tempat berlangsungnya fotosintesis pada tumbuhan adalah ...", "kloroplas", ["mitokondria", "ribosom", "lisosom"], "Kloroplas mengandung klorofil untuk menangkap energi cahaya."),
    question("Ekologi", "Sedang", "Hubungan saling menguntungkan antara dua organisme disebut ...", "mutualisme", ["parasitisme", "kompetisi", "predasi"], "Dalam mutualisme, kedua organisme memperoleh manfaat."),
    question("Genetika", "Sedang", "Unit pewarisan sifat yang terdapat pada DNA disebut ...", "gen", ["enzim", "hormon", "vitamin"], "Gen adalah bagian DNA yang membawa informasi sifat tertentu."),
    question("Sistem tubuh", "Sedang", "Pembuluh darah yang membawa darah menjauhi jantung disebut ...", "arteri", ["vena", "kapiler limfa", "alveolus"], "Arteri membawa darah keluar dari jantung menuju jaringan tubuh."),
    question("Ekosistem", "Sedang", "Organisme pengurai berperan untuk ...", "menguraikan sisa makhluk hidup menjadi zat sederhana", ["membuat cahaya matahari", "menghentikan daur materi", "menghasilkan mineral baru dari udara"], "Pengurai mendaur ulang unsur hara dari sisa organisme."),
    question("Keanekaragaman", "Sulit", "Keanekaragaman gen dapat terlihat pada ...", "variasi warna bunga dalam satu spesies", ["perbedaan ekosistem hutan dan laut", "beragam jenis hewan di suatu benua", "perbedaan suhu siang dan malam"], "Keanekaragaman gen adalah variasi sifat dalam satu spesies."),
    question("Respirasi", "Sedang", "Respirasi sel terutama menghasilkan energi dalam bentuk ...", "ATP", ["DNA", "klorofil", "selulosa"], "ATP menjadi pembawa energi yang dapat digunakan sel."),
    question("Sistem tubuh", "Sulit", "Jika jumlah produsen dalam ekosistem menurun tajam, dampak awal yang mungkin terjadi adalah ...", "ketersediaan energi bagi konsumen berkurang", ["energi konsumen bertambah tanpa batas", "pengurai langsung menghilang", "semua predator bertambah"], "Produsen memasukkan energi ke rantai makanan, sehingga penurunannya memengaruhi konsumen."),
    question("Enzim", "Sedang", "Enzim bekerja sebagai ...", "katalis biologis yang mempercepat reaksi", ["sumber energi utama", "materi genetik", "zat pembangun tulang"], "Enzim mempercepat reaksi kimia dalam organisme tanpa habis terpakai.")
  ],
  physics: [
    question("Gerak", "Mudah", "Satuan SI untuk kecepatan adalah ...", "meter per sekon (m/s)", ["kilogram (kg)", "newton (N)", "joule (J)"], "Kecepatan adalah jarak dibagi waktu, dengan satuan SI m/s."),
    question("Gaya", "Sedang", "Gaya 10 N bekerja pada benda bermassa 2 kg. Percepatannya adalah ...", "5 m/s²", ["2 m/s²", "8 m/s²", "20 m/s²"], "Menurut F = ma, percepatan a = F/m = 10/2 = 5 m/s²."),
    question("Energi", "Mudah", "Satuan SI untuk energi adalah ...", "joule", ["watt", "pascal", "ampere"], "Energi dalam SI diukur menggunakan joule."),
    question("Listrik", "Sedang", "Arus 2 A mengalir pada hambatan 6 Ω. Tegangannya adalah ...", "12 V", ["3 V", "8 V", "18 V"], "Hukum Ohm: V = I × R = 2 × 6 = 12 volt."),
    question("Gelombang", "Sedang", "Gelombang yang memerlukan medium untuk merambat adalah gelombang ...", "bunyi", ["cahaya", "radio", "elektromagnetik"], "Bunyi adalah gelombang mekanik sehingga memerlukan medium."),
    question("Suhu", "Mudah", "Alat untuk mengukur suhu adalah ...", "termometer", ["barometer", "amperemeter", "dinamometer"], "Termometer digunakan untuk mengukur suhu."),
    question("Optik", "Sedang", "Bayangan pada cermin datar bersifat ...", "maya, tegak, dan sama besar", ["nyata dan terbalik", "maya dan selalu diperbesar", "nyata dan sama besar"], "Cermin datar menghasilkan bayangan maya, tegak, dan sama besar."),
    question("Usaha", "Sulit", "Gaya 20 N memindahkan benda sejauh 3 m searah gaya. Usaha yang dilakukan adalah ...", "60 J", ["6 J", "23 J", "60 W"], "Usaha = gaya × perpindahan = 20 × 3 = 60 joule."),
    question("Daya", "Sedang", "Jika usaha 100 J dilakukan dalam 5 sekon, dayanya adalah ...", "20 W", ["5 W", "50 W", "500 W"], "Daya = usaha ÷ waktu = 100 ÷ 5 = 20 watt."),
    question("Tekanan", "Sulit", "Untuk gaya yang sama, tekanan terbesar terjadi pada bidang dengan ...", "luas permukaan paling kecil", ["luas permukaan paling besar", "massa jenis paling kecil", "suhu paling tinggi"], "Tekanan = gaya ÷ luas; luas lebih kecil menghasilkan tekanan lebih besar.")
  ],
  chemistry: [
    question("Atom", "Mudah", "Partikel bermuatan negatif di dalam atom adalah ...", "elektron", ["proton", "neutron", "nukleon"], "Elektron memiliki muatan negatif dan berada di sekitar inti atom."),
    question("Unsur", "Mudah", "Lambang kimia untuk oksigen adalah ...", "O", ["Ox", "Og", "Ok"], "Simbol unsur oksigen adalah O."),
    question("Asam-basa", "Sedang", "Larutan dengan pH kurang dari 7 bersifat ...", "asam", ["basa", "netral", "jenuh"], "Pada skala pH, nilai di bawah 7 menunjukkan sifat asam."),
    question("Perubahan zat", "Mudah", "Perubahan es menjadi air disebut ...", "mencair", ["menguap", "mengembun", "menyublim"], "Mencair adalah perubahan wujud padat menjadi cair."),
    question("Ikatan kimia", "Sedang", "Ikatan yang terbentuk karena pemakaian pasangan elektron bersama disebut ...", "ikatan kovalen", ["ikatan ion", "ikatan logam", "ikatan hidrogen"], "Ikatan kovalen terbentuk saat atom memakai pasangan elektron bersama."),
    question("Campuran", "Sedang", "Campuran yang komponennya tercampur merata disebut ...", "homogen", ["heterogen", "suspensi kasar", "unsur"], "Campuran homogen mempunyai komposisi seragam di seluruh bagian."),
    question("Reaksi kimia", "Sedang", "Zat yang berada di sebelah kiri tanda panah persamaan reaksi disebut ...", "reaktan", ["produk", "katalis saja", "pelarut"], "Reaktan adalah zat awal yang mengalami reaksi."),
    question("Tabel periodik", "Sulit", "Unsur-unsur dalam satu golongan tabel periodik umumnya memiliki ...", "jumlah elektron valensi yang sama", ["nomor massa yang sama", "jumlah neutron yang sama", "jumlah kulit yang berbeda selalu"], "Unsur segolongan memiliki konfigurasi elektron valensi yang mirip."),
    question("Larutan", "Sedang", "Zat yang jumlahnya lebih sedikit dan dilarutkan disebut ...", "zat terlarut", ["pelarut", "endapan", "produk"], "Zat terlarut adalah komponen yang dilarutkan oleh pelarut."),
    question("Stoikiometri", "Sulit", "Dalam reaksi kimia setara, jumlah atom tiap unsur di kedua sisi persamaan adalah ...", "sama", ["selalu berbeda", "nol", "bergantung pada warna zat"], "Persamaan setara memenuhi kekekalan atom dan massa.")
  ],
  history: [
    question("Sejarah Indonesia", "Mudah", "Sumpah Pemuda diikrarkan pada tahun ...", "1928", ["1908", "1945", "1955"], "Kongres Pemuda II menghasilkan Sumpah Pemuda pada 28 Oktober 1928."),
    question("Sejarah Indonesia", "Sedang", "Organisasi Budi Utomo berdiri pada tahun ...", "1908", ["1928", "1942", "1945"], "Budi Utomo didirikan pada 20 Mei 1908."),
    question("Sejarah dunia", "Sedang", "Revolusi Prancis dimulai pada tahun ...", "1789", ["1492", "1776", "1815"], "Revolusi Prancis secara umum ditandai mulai pada 1789."),
    question("Pergerakan nasional", "Sulit", "Kongres Pemuda II terutama penting karena ...", "menguatkan cita-cita persatuan pemuda Indonesia", ["membentuk pemerintahan daerah", "mengakhiri Perang Diponegoro", "menetapkan mata uang nasional"], "Kongres Pemuda II menegaskan satu tanah air, bangsa, dan bahasa Indonesia."),
    question("Sejarah Indonesia", "Mudah", "Hari Pahlawan diperingati setiap tanggal ...", "10 November", ["1 Juni", "17 Agustus", "21 April"], "Hari Pahlawan mengenang pertempuran Surabaya pada 10 November 1945."),
    question("Sumber sejarah", "Sedang", "Benda atau dokumen yang digunakan untuk meneliti masa lalu disebut ...", "sumber sejarah", ["ramalan", "legenda masa depan", "fiksi ilmiah"], "Sumber sejarah memberi bukti atau informasi tentang masa lalu."),
    question("Sejarah Indonesia", "Sedang", "Kerajaan maritim Sriwijaya berkembang di sekitar wilayah ...", "Sumatra", ["Sulawesi Utara", "Papua Barat", "Nusa Tenggara Timur"], "Pusat penting Sriwijaya berada di Sumatra bagian selatan."),
    question("Sejarah dunia", "Sulit", "Salah satu perubahan penting akibat Revolusi Industri adalah ...", "produksi barang semakin banyak menggunakan mesin", ["semua kota ditinggalkan", "perdagangan laut berhenti", "mesin dilarang digunakan"], "Mekanisasi mengubah cara produksi dan mendorong tumbuhnya industri."),
    question("Kronologi", "Mudah", "Urutan peristiwa berdasarkan waktu terjadinya disebut ...", "kronologi", ["geologi", "biografi", "demografi"], "Kronologi menyusun peristiwa secara urut menurut waktu."),
    question("Sejarah Indonesia", "Sedang", "BPUPKI dibentuk dalam rangka ...", "mempersiapkan kemerdekaan Indonesia", ["mendirikan organisasi olahraga", "mengatur perdagangan rempah", "membangun jalan raya lintas pulau"], "BPUPKI membahas persiapan kemerdekaan, termasuk dasar negara.")
  ],
  geography: [
    question("Peta", "Mudah", "Garis bujur digunakan untuk menentukan ...", "letak timur-barat dan pembagian waktu", ["ketinggian gelombang", "jenis tanah", "curah hujan saja"], "Garis bujur membantu menentukan lokasi timur-barat serta zona waktu."),
    question("Bentuk muka bumi", "Mudah", "Gunung yang dapat meletus karena aktivitas magma disebut gunung ...", "api", ["kapur", "pasir", "es"], "Gunung api terbentuk dan dipengaruhi aktivitas magma."),
    question("Iklim", "Sedang", "Penguapan air laut yang didorong panas matahari merupakan bagian dari ...", "siklus hidrologi", ["siklus batuan", "pergerakan lempeng", "erosi angin saja"], "Penguapan merupakan salah satu proses dalam siklus air."),
    question("Kependudukan", "Sedang", "Kepadatan penduduk dihitung dengan membandingkan jumlah penduduk terhadap ...", "luas wilayah", ["jumlah sungai", "curah hujan", "jumlah gunung"], "Kepadatan penduduk umumnya dihitung sebagai penduduk per satuan luas."),
    question("Peta", "Sulit", "Pada peta kontur, garis yang rapat menunjukkan lereng yang ...", "curam", ["landai", "datar sepenuhnya", "selalu berupa pantai"], "Garis kontur rapat berarti perubahan ketinggian terjadi pada jarak horizontal pendek."),
    question("Bencana", "Sedang", "Saat terjadi gempa di dalam bangunan, tindakan awal yang dianjurkan adalah ...", "berlindung di bawah meja yang kokoh dan melindungi kepala", ["menggunakan lift", "berdiri dekat kaca", "berlari ke tangga saat guncangan"], "Lindungi diri dari benda jatuh dan tunggu guncangan berhenti sebelum evakuasi."),
    question("Lingkungan", "Sedang", "Pengikisan tanah oleh air atau angin disebut ...", "erosi", ["sedimentasi", "infiltrasi", "kondensasi"], "Erosi memindahkan tanah atau batuan oleh air, angin, atau es."),
    question("Bumi", "Sulit", "Pergerakan lempeng tektonik dapat menyebabkan ...", "gempa tektonik", ["gerhana Matahari", "pasang surut harian saja", "perubahan fase Bulan"], "Pergeseran dan tumbukan lempeng dapat melepaskan energi sebagai gempa."),
    question("Iklim", "Mudah", "Alat untuk mengukur curah hujan adalah ...", "ombrometer", ["termometer", "anemometer", "seismograf"], "Ombrometer atau pluviometer mengukur jumlah curah hujan."),
    question("Geografi Indonesia", "Sedang", "Indonesia disebut negara kepulauan karena ...", "wilayahnya terdiri atas banyak pulau", ["seluruh wilayahnya berupa satu pulau", "tidak memiliki wilayah laut", "berada di satu benua saja"], "Indonesia memiliki ribuan pulau yang dipisahkan dan dihubungkan oleh perairan.")
  ],
  economy: [
    question("Kebutuhan", "Mudah", "Barang yang harus dipenuhi agar manusia dapat bertahan hidup disebut kebutuhan ...", "primer", ["tersier", "tambahan", "sekunder saja"], "Kebutuhan primer meliputi kebutuhan pokok seperti pangan, sandang, dan papan."),
    question("Pasar", "Sedang", "Tempat bertemunya penjual dan pembeli untuk melakukan transaksi disebut ...", "pasar", ["bank sentral", "pabrik", "koperasi sekolah saja"], "Pasar dapat berupa tempat nyata maupun sistem pertemuan penjual dan pembeli."),
    question("Kelangkaan", "Sedang", "Nilai dari pilihan terbaik yang dilepas ketika mengambil keputusan disebut ...", "biaya peluang", ["harga tetap", "biaya produksi", "laba kotor"], "Biaya peluang adalah manfaat dari alternatif terbaik yang tidak dipilih."),
    question("Uang", "Mudah", "Salah satu fungsi uang adalah sebagai ...", "alat tukar", ["alat untuk menghapus kebutuhan", "pengganti seluruh barang", "penentu cuaca"], "Uang memudahkan pertukaran barang dan jasa."),
    question("Permintaan", "Sulit", "Jika harga barang naik dan faktor lain tetap, jumlah yang diminta umumnya ...", "turun", ["naik tanpa batas", "tetap selalu", "menjadi nol untuk semua barang"], "Hukum permintaan menyatakan harga dan jumlah yang diminta cenderung bergerak berlawanan."),
    question("Produksi", "Sedang", "Kegiatan menghasilkan atau menambah nilai guna barang disebut ...", "produksi", ["konsumsi", "distribusi", "investasi"], "Produksi menciptakan barang atau jasa maupun meningkatkan nilai gunanya."),
    question("Lembaga keuangan", "Mudah", "Lembaga yang umumnya menerima simpanan dan menyalurkan kredit adalah ...", "bank", ["pasar loak", "koperasi konsumsi saja", "bursa barang"], "Bank menghimpun dana masyarakat dan menyalurkannya sesuai ketentuan."),
    question("Perdagangan", "Sedang", "Kegiatan menyalurkan barang dari produsen kepada konsumen disebut ...", "distribusi", ["produksi", "konsumsi", "spesialisasi"], "Distribusi menjembatani produsen dan konsumen."),
    question("Pajak", "Sulit", "Pajak digunakan pemerintah antara lain untuk ...", "membiayai layanan dan kebutuhan publik", ["menghapus seluruh kegiatan ekonomi", "menggantikan semua upah", "membuat barang menjadi gratis"], "Penerimaan pajak membantu membiayai layanan dan pembangunan publik."),
    question("Koperasi", "Mudah", "Asas utama koperasi di Indonesia adalah ...", "kekeluargaan", ["persaingan", "keuntungan pribadi", "monopoli"], "Pasal 33 UUD 1945 menyebut perekonomian disusun sebagai usaha bersama berdasar asas kekeluargaan.")
  ],
  sociology: [
    question("Interaksi sosial", "Mudah", "Syarat utama terjadinya interaksi sosial adalah ...", "kontak sosial dan komunikasi", ["persaingan dan konflik", "uang dan jabatan", "jarak dan cuaca"], "Interaksi sosial memerlukan kontak sosial dan komunikasi."),
    question("Nilai sosial", "Sedang", "Anggapan masyarakat tentang sesuatu yang baik dan penting disebut ...", "nilai sosial", ["mobilitas sosial", "konflik sosial", "status ekonomi"], "Nilai sosial menjadi pedoman tentang hal yang dianggap baik atau penting."),
    question("Norma", "Mudah", "Aturan yang mengatur perilaku anggota masyarakat disebut ...", "norma", ["stratifikasi", "populasi", "mobilitas"], "Norma merupakan pedoman atau aturan perilaku dalam masyarakat."),
    question("Sosialisasi", "Sedang", "Keluarga disebut agen sosialisasi primer karena ...", "umumnya menjadi lingkungan awal anak belajar nilai dan perilaku", ["selalu menentukan pekerjaan anak", "menggantikan semua lembaga sosial", "hanya mengajarkan aturan formal"], "Keluarga biasanya menjadi lingkungan pertama tempat anak belajar."),
    question("Mobilitas sosial", "Sedang", "Perubahan kedudukan sosial seseorang disebut ...", "mobilitas sosial", ["integrasi budaya", "pengendalian sosial", "diferensiasi ekonomi"], "Mobilitas sosial adalah perpindahan posisi atau status dalam masyarakat."),
    question("Kelompok sosial", "Mudah", "Sekelompok orang yang berinteraksi dan memiliki kesadaran sebagai anggota disebut ...", "kelompok sosial", ["kerumunan acak", "benda koleksi", "wilayah iklim"], "Interaksi dan kesadaran bersama merupakan ciri kelompok sosial."),
    question("Konflik sosial", "Sulit", "Salah satu cara penyelesaian konflik melalui pihak ketiga netral yang memberi saran adalah ...", "mediasi", ["kompetisi", "segregasi", "dominasi sepihak"], "Mediator membantu pihak bertikai berunding, tetapi keputusan tetap pada mereka."),
    question("Perubahan sosial", "Sedang", "Perubahan sosial yang berlangsung lambat dalam waktu panjang disebut ...", "evolusi", ["revolusi", "konflik", "akulturasi saja"], "Evolusi sosial terjadi secara bertahap dalam waktu relatif lama."),
    question("Keberagaman", "Sedang", "Sikap menerima perbedaan budaya dan tetap hidup berdampingan disebut ...", "toleransi", ["etnosentrisme", "diskriminasi", "isolasi paksa"], "Toleransi berarti menghargai perbedaan dan hak orang lain."),
    question("Lembaga sosial", "Sulit", "Lembaga sosial terbentuk terutama untuk ...", "memenuhi kebutuhan dan mengatur kehidupan bersama", ["menghapus interaksi", "membatasi semua kerja sama", "menggantikan seluruh keluarga"], "Lembaga sosial mengatur pola perilaku dan memenuhi kebutuhan masyarakat.")
  ],
  tjkt: [
    question("Jaringan komputer", "Mudah", "Perangkat yang menghubungkan beberapa perangkat dalam satu jaringan lokal adalah ...", "switch", ["scanner", "speaker", "plotter"], "Switch meneruskan frame data antarperangkat pada jaringan lokal."),
    question("Alamat jaringan", "Sedang", "IPv4 memiliki panjang alamat sebanyak ...", "32 bit", ["16 bit", "64 bit", "128 bit"], "Alamat IPv4 terdiri dari 32 bit yang biasa ditulis dalam empat oktet."),
    question("Kabel jaringan", "Mudah", "Konektor yang umum digunakan pada kabel Ethernet twisted pair adalah ...", "RJ-45", ["USB-C", "HDMI", "VGA"], "Kabel Ethernet twisted pair umumnya menggunakan konektor RJ-45."),
    question("Keamanan jaringan", "Sedang", "Fungsi firewall pada jaringan adalah ...", "menyaring lalu lintas berdasarkan aturan keamanan", ["memperkuat sinyal listrik saja", "menyimpan semua dokumen", "mengubah monitor menjadi server"], "Firewall mengendalikan lalu lintas jaringan berdasarkan kebijakan."),
    question("Jaringan nirkabel", "Sedang", "SSID pada jaringan Wi-Fi adalah ...", "nama jaringan nirkabel", ["kata sandi administrator", "alamat fisik antena", "kecepatan internet"], "SSID mengidentifikasi nama sebuah jaringan Wi-Fi."),
    question("Topologi", "Sulit", "Pada topologi star, banyak perangkat terhubung melalui ...", "perangkat pusat seperti switch", ["satu kabel lingkaran tertutup", "koneksi langsung ke setiap perangkat lain", "satu antena tanpa titik pusat"], "Topologi star menghubungkan perangkat ke satu titik pusat."),
    question("Model jaringan", "Mudah", "Jaringan yang mencakup wilayah terbatas seperti satu ruang atau gedung disebut ...", "LAN", ["WAN", "MAN", "PAN luar angkasa"], "LAN adalah jaringan lokal dengan cakupan relatif kecil."),
    question("Keamanan jaringan", "Sedang", "Kata sandi bawaan access point sebaiknya ...", "diganti dengan kata sandi kuat", ["dibiarkan dan dibagikan", "ditulis pada nama Wi-Fi", "dibuat sama dengan SSID"], "Mengganti kredensial bawaan mengurangi risiko akses tidak sah."),
    question("Protokol", "Sulit", "Layanan DHCP umumnya digunakan untuk ...", "membagikan konfigurasi IP secara otomatis", ["mengenkripsi semua file", "mengukur daya antena", "mencetak dokumen jaringan"], "DHCP memberi konfigurasi jaringan seperti alamat IP kepada klien."),
    question("Troubleshooting", "Sedang", "Langkah awal yang masuk akal saat satu komputer tidak terhubung ke jaringan adalah ...", "memeriksa sambungan kabel atau status Wi-Fi", ["langsung mengganti seluruh switch", "menghapus sistem operasi", "mengubah semua alamat IP"], "Periksa sambungan fisik atau status koneksi terlebih dahulu sebelum tindakan besar.")
  ],
  rpl: [
    question("Pemrograman", "Mudah", "Dalam program, variabel digunakan untuk ...", "menyimpan nilai yang dapat digunakan", ["menghubungkan kabel jaringan", "mengatur kecerahan layar", "menghapus sistem operasi"], "Variabel memberi nama pada data yang digunakan program."),
    question("Algoritma", "Sedang", "Diagram yang memakai simbol untuk menggambarkan alur algoritma disebut ...", "flowchart", ["spreadsheet", "wireframe", "database"], "Flowchart memvisualisasikan urutan proses menggunakan simbol."),
    question("Basis data", "Mudah", "Pada tabel basis data, satu baris data disebut ...", "record", ["field", "query saja", "server"], "Record berisi kumpulan nilai untuk satu entitas pada tabel."),
    question("Pemrograman web", "Sedang", "HTML terutama digunakan untuk ...", "menyusun struktur konten halaman web", ["mengatur jaringan listrik", "mengelola perangkat keras server saja", "mengedit foto raster"], "HTML menandai struktur dan elemen konten pada halaman web."),
    question("Pengujian perangkat lunak", "Sedang", "Tujuan utama pengujian perangkat lunak adalah ...", "menemukan cacat dan memeriksa perilaku sesuai kebutuhan", ["menambah ukuran berkas", "menghilangkan dokumentasi", "mengganti nama semua variabel"], "Pengujian membantu memastikan perangkat lunak bekerja sesuai persyaratan."),
    question("Basis data", "Sulit", "Kunci utama (primary key) pada tabel harus ...", "mengidentifikasi setiap record secara unik", ["selalu berisi teks panjang", "boleh sama untuk seluruh record", "berisi kata sandi pengguna"], "Primary key membedakan setiap baris dan tidak boleh duplikat."),
    question("Pemrograman", "Mudah", "Struktur yang menjalankan instruksi hanya ketika kondisi terpenuhi disebut ...", "percabangan", ["perulangan", "komentar", "deklarasi warna"], "Percabangan memilih jalur tindakan berdasarkan kondisi."),
    question("Version control", "Sedang", "Sistem version control membantu tim untuk ...", "melacak perubahan kode dan bekerja bersama", ["memperbesar resolusi gambar", "mengganti bahasa komputer", "menghapus riwayat perubahan"], "Version control mencatat revisi dan membantu kolaborasi pengembangan."),
    question("Pemrograman web", "Sulit", "CSS digunakan terutama untuk ...", "mengatur tampilan dan tata letak halaman web", ["menyimpan data permanen server", "menjalankan kabel jaringan", "menggantikan semua HTML"], "CSS mengatur gaya visual, seperti warna, ukuran, dan tata letak."),
    question("Etika perangkat lunak", "Sedang", "Sebelum memakai pustaka kode pihak lain, pengembang sebaiknya ...", "memeriksa lisensi dan ketentuan penggunaannya", ["menghapus nama pembuat", "menganggap semua kode bebas", "mengunggah kredensial ke repositori"], "Lisensi menjelaskan izin dan kewajiban saat memakai perangkat lunak.")
  ],
  akl: [
    question("Akuntansi", "Mudah", "Persamaan dasar akuntansi adalah ...", "Aset = Liabilitas + Ekuitas", ["Aset = Pendapatan − Beban", "Ekuitas = Aset + Liabilitas", "Liabilitas = Aset + Ekuitas"], "Persamaan dasar menunjukkan sumber aset berasal dari liabilitas dan ekuitas."),
    question("Akuntansi", "Sedang", "Pembelian perlengkapan secara tunai akan menyebabkan ...", "kas berkurang dan perlengkapan bertambah", ["kas bertambah dan utang bertambah", "pendapatan bertambah", "modal selalu berkurang"], "Transaksi menukar sebagian kas dengan perlengkapan."),
    question("Jurnal", "Mudah", "Pencatatan transaksi pertama kali dalam akuntansi dilakukan pada ...", "jurnal", ["neraca saldo saja", "laporan perubahan modal", "faktur pajak saja"], "Jurnal mencatat transaksi secara kronologis sebelum dipindahkan ke buku besar."),
    question("Akun", "Sedang", "Akun yang normalnya bertambah di sisi debit adalah ...", "aset", ["pendapatan", "modal", "utang"], "Aset bertambah di debit dan berkurang di kredit."),
    question("Laporan keuangan", "Sedang", "Laporan yang menunjukkan pendapatan dan beban selama suatu periode adalah ...", "laporan laba rugi", ["neraca saldo", "buku pembantu kas", "surat jalan"], "Laporan laba rugi merangkum pendapatan dan beban untuk menentukan laba atau rugi."),
    question("Persediaan", "Sulit", "Dalam sistem periodik, harga pokok penjualan antara lain dihitung dari ...", "persediaan awal + pembelian bersih − persediaan akhir", ["kas awal + modal akhir", "penjualan + utang", "aset tetap − penyusutan"], "Rumus HPP periodik mengurangi persediaan akhir dari barang tersedia untuk dijual."),
    question("Akuntansi", "Mudah", "Bukti transaksi penerimaan uang dari pelanggan secara tunai dapat berupa ...", "kuitansi", ["surat lamaran", "daftar hadir", "peta lokasi"], "Kuitansi menjadi bukti penerimaan pembayaran."),
    question("Kas", "Sedang", "Tujuan rekonsiliasi bank adalah ...", "mencocokkan saldo kas menurut catatan dan rekening koran", ["menghitung jumlah pegawai", "menentukan nilai persediaan akhir saja", "menghapus semua transaksi"], "Rekonsiliasi menjelaskan perbedaan waktu atau kesalahan antara catatan dan bank."),
    question("Penyusutan", "Sedang", "Alokasi biaya aset tetap selama masa manfaatnya disebut ...", "penyusutan", ["amortisasi utang", "revaluasi kas", "distribusi modal"], "Penyusutan membebankan biaya aset berwujud selama masa manfaat."),
    question("Etika profesi", "Sulit", "Akuntan menemukan kesalahan material pada laporan. Sikap profesional yang tepat adalah ...", "melaporkan dan mengoreksi sesuai prosedur", ["menyembunyikan kesalahan", "menghapus bukti transaksi", "mengubah angka tanpa dokumentasi"], "Integritas dan dokumentasi diperlukan untuk menjaga keandalan laporan.")
  ],
  vocational: [
    question("Keselamatan kerja", "Mudah", "Perlengkapan yang digunakan untuk mengurangi risiko saat bekerja disebut ...", "alat pelindung diri (APD)", ["alat tulis harian", "lembar promosi", "peralatan dekorasi"], "APD melindungi pekerja dari bahaya sesuai jenis pekerjaannya."),
    question("Keselamatan kerja", "Sedang", "Saat menemukan kabel listrik terkelupas di area kerja, tindakan tepat adalah ...", "menjauhkan orang dan melaporkannya agar ditangani dengan aman", ["menyentuh untuk memastikan arus", "menyiramnya dengan air", "menutupnya dengan kertas"], "Jangan menyentuh kabel berbahaya; amankan area dan minta penanganan yang kompeten."),
    question("Prosedur kerja", "Mudah", "Instruksi tertulis yang menguraikan langkah kerja baku dikenal sebagai ...", "SOP", ["SKU", "KTP", "RAM"], "SOP atau prosedur operasional standar menjelaskan urutan kerja yang konsisten."),
    question("Komunikasi kerja", "Sedang", "Komunikasi profesional kepada pelanggan sebaiknya ...", "jelas, sopan, dan sesuai kebutuhan", ["menggunakan istilah yang membingungkan", "mengabaikan pertanyaan", "membagikan data pribadi orang lain"], "Komunikasi yang jelas dan sopan membantu memenuhi kebutuhan pelanggan."),
    question("Mutu kerja", "Sedang", "Pemeriksaan hasil kerja sebelum diserahkan bertujuan untuk ...", "memastikan hasil memenuhi kriteria mutu", ["menambah kesalahan", "menghindari semua dokumentasi", "menghapus spesifikasi"], "Pemeriksaan membantu menemukan masalah sebelum hasil diterima pengguna.")
  ],
  mplb: [
    question("Administrasi", "Mudah", "Dokumen yang mencatat pesan masuk dan keluar suatu kantor dapat berupa ...", "buku agenda surat", ["buku gambar", "peta topografi", "kartu permainan"], "Buku agenda membantu mencatat dan melacak surat masuk serta keluar."),
    question("Kearsipan", "Sedang", "Tujuan utama pengarsipan dokumen adalah ...", "agar dokumen tersimpan teratur dan mudah ditemukan kembali", ["agar dokumen sulit diakses", "mengurangi semua bukti kerja", "mengganti tanda tangan"], "Sistem arsip yang baik memudahkan penyimpanan dan temu kembali."),
    question("Layanan pelanggan", "Mudah", "Sikap yang baik saat menerima keluhan pelanggan adalah ...", "mendengarkan dengan tenang dan mencatat inti keluhan", ["menyela dan menyalahkan pelanggan", "mengabaikan keluhan", "menyebarkan keluhan ke publik"], "Mendengarkan membantu memahami masalah sebelum mencari solusi."),
    question("Komunikasi bisnis", "Sedang", "Subjek email kerja yang baik seharusnya ...", "ringkas dan menggambarkan isi pesan", ["kosong agar cepat", "selalu memakai huruf kapital", "berisi kata sandi"], "Subjek yang jelas membantu penerima memahami prioritas dan isi email."),
    question("Rapat", "Sedang", "Catatan ringkas mengenai jalannya dan hasil rapat disebut ...", "notula", ["brosur", "invoice", "memo pribadi"], "Notula mencatat pokok pembahasan, keputusan, serta tindak lanjut rapat.")
  ],
  dkv: [
    question("Desain visual", "Mudah", "Unsur visual yang menunjukkan terang atau gelap disebut ...", "nilai (value)", ["tekstur suara", "tempo", "aroma"], "Value menggambarkan tingkat terang-gelap suatu warna atau bidang."),
    question("Tipografi", "Sedang", "Pemilihan huruf untuk menjaga keterbacaan teks disebut ...", "tipografi", ["fotografi", "litografi", "geografi"], "Tipografi mengatur pemilihan dan penyusunan huruf."),
    question("Warna", "Mudah", "Warna primer dalam model pigmen tradisional adalah ...", "merah, kuning, dan biru", ["hijau, jingga, dan ungu", "hitam, putih, dan abu-abu", "sian, magenta, dan putih saja"], "Dalam model seni tradisional, merah, kuning, dan biru diajarkan sebagai warna primer."),
    question("Komposisi", "Sedang", "Prinsip desain yang membagi bidang menjadi bagian seimbang dikenal sebagai ...", "keseimbangan", ["kontras saja", "ritme suara", "perspektif waktu"], "Keseimbangan mengatur bobot visual agar komposisi terasa stabil."),
    question("Desain digital", "Sedang", "Format gambar yang mendukung latar transparan dan umum untuk grafis web adalah ...", "PNG", ["TXT", "WAV", "DOC"], "PNG mendukung transparansi dan cocok untuk ilustrasi atau ikon digital.")
  ],
  electronics: [
    question("Elektronika dasar", "Mudah", "Komponen yang membatasi besar arus listrik dalam rangkaian adalah ...", "resistor", ["kapasitor", "dioda cahaya", "saklar"], "Resistor memberikan hambatan dan membatasi arus."),
    question("Keselamatan kerja", "Sedang", "Sebelum memperbaiki rangkaian listrik, langkah aman pertama adalah ...", "memutus sumber daya dan memastikan rangkaian tidak bertegangan", ["menyentuh konduktor langsung", "menambah tegangan", "membasahi meja kerja"], "Pastikan catu daya terputus dan kondisi aman sebelum bekerja."),
    question("Pengukuran", "Mudah", "Alat untuk mengukur tegangan, arus, dan hambatan antara lain adalah ...", "multimeter", ["mikroskop", "termometer ruangan", "jangka sorong"], "Multimeter dapat digunakan mengukur besaran listrik tertentu."),
    question("Rangkaian", "Sedang", "Komponen yang hanya mengalirkan arus dengan mudah ke satu arah adalah ...", "dioda", ["resistor", "induktor", "potensiometer"], "Dioda ideal menghantarkan arus terutama pada arah maju."),
    question("Daya listrik", "Sedang", "Jika tegangan 12 V dan arus 2 A, daya listriknya adalah ...", "24 W", ["6 W", "10 W", "14 W"], "Daya listrik P = V × I = 12 × 2 = 24 watt.")
  ],
  automotive: [
    question("Sistem kendaraan", "Mudah", "Komponen yang menyimpan energi listrik untuk menghidupkan sistem kendaraan adalah ...", "aki", ["radiator", "knalpot", "filter udara"], "Aki menyimpan dan memasok energi listrik pada kendaraan."),
    question("Keselamatan kerja", "Sedang", "Saat mengangkat kendaraan menggunakan dongkrak, kendaraan juga perlu ...", "ditopang jack stand pada titik yang tepat", ["ditahan dengan tangan", "diparkir di permukaan miring", "dibiarkan pada posisi gigi netral saja"], "Jack stand memberi penopang aman; dongkrak saja tidak cukup untuk menyangga kendaraan."),
    question("Mesin", "Mudah", "Fungsi utama oli mesin adalah ...", "melumasi bagian bergerak dan mengurangi gesekan", ["mengisi bahan bakar", "mendinginkan kabin saja", "menambah tekanan ban"], "Oli membantu pelumasan dan mengurangi gesekan komponen mesin."),
    question("Perawatan kendaraan", "Sedang", "Tekanan angin ban sebaiknya diperiksa saat ban ...", "dingin sesuai rekomendasi pabrikan", ["sangat panas setelah perjalanan panjang", "terendam air", "sudah terlihat kempis"], "Tekanan ban dingin lebih konsisten untuk dibandingkan dengan spesifikasi."),
    question("Sistem rem", "Sedang", "Tanda pedal rem terasa lembek dapat mengindikasikan ...", "masalah pada sistem hidraulis yang perlu diperiksa", ["aki terlalu penuh", "lampu kabin putus", "tekanan ban selalu berlebih"], "Pedal lembek bisa terkait udara atau kebocoran pada sistem hidraulis rem.")
  ],
  knowledge: [
    question("Pengetahuan umum", "Mudah", "Apa nama ibu kota Indonesia saat ini?", "Jakarta", ["Bandung", "Surabaya", "Medan"], "Jakarta merupakan ibu kota Indonesia saat ini. Soal ini adalah contoh pengetahuan umum."),
    question("Pengetahuan umum", "Mudah", "Berapa jumlah warna pada bendera Indonesia?", "Dua", ["Satu", "Tiga", "Empat"], "Bendera Merah Putih terdiri dari dua warna."),
    question("Pengetahuan umum", "Sedang", "Alat untuk menunjukkan arah mata angin adalah ...", "kompas", ["termometer", "barometer", "mikroskop"], "Kompas menunjukkan arah utara, selatan, timur, dan barat."),
    question("Pengetahuan umum", "Mudah", "Hari Pendidikan Nasional di Indonesia diperingati setiap ...", "2 Mei", ["21 April", "1 Juni", "10 November"], "Hari Pendidikan Nasional diperingati pada 2 Mei."),
    question("Pengetahuan umum", "Sedang", "Samudra terluas di Bumi adalah ...", "Samudra Pasifik", ["Samudra Atlantik", "Samudra Hindia", "Samudra Arktik"], "Samudra Pasifik adalah samudra terluas di planet Bumi.")
  ],
  religion: [
    question("Sikap saling menghormati", "Mudah", "Sikap yang baik kepada teman yang sedang beribadah adalah ...", "memberi ruang dan menghormati ibadahnya", ["mengganggu agar cepat selesai", "mengejek keyakinannya", "memaksanya mengikuti ibadah lain"], "Menghormati hak orang lain untuk beribadah membantu menjaga kerukunan."),
    question("Nilai kebaikan", "Mudah", "Jika menemukan barang milik teman, tindakan yang jujur adalah ...", "mengembalikannya kepada pemilik atau guru", ["menyimpannya diam-diam", "membuangnya", "mengaku sebagai pemilik"], "Kejujuran berarti menyampaikan yang benar dan mengembalikan barang yang bukan milik kita."),
    question("Kerukunan", "Sedang", "Cara tepat bekerja bersama teman dengan keyakinan berbeda adalah ...", "fokus pada tujuan bersama dan saling menghormati", ["melarangnya ikut serta", "memaksakan keyakinan sendiri", "menghindari semua kerja kelompok"], "Kerja sama dan penghormatan menjaga kerukunan dalam keberagaman."),
    question("Tanggung jawab", "Sedang", "Contoh tanggung jawab terhadap lingkungan sekitar adalah ...", "menjaga kebersihan dan tidak merusak fasilitas", ["membuang sampah di sungai", "mencoret fasilitas umum", "membiarkan kerusakan tanpa melapor"], "Menjaga kebersihan dan fasilitas merupakan tanggung jawab bersama."),
    question("Empati", "Mudah", "Saat teman mengalami kesulitan, sikap yang mencerminkan kepedulian adalah ...", "menawarkan bantuan dengan sopan", ["menertawakan kesulitannya", "menyebarkan ceritanya", "berpura-pura tidak melihat"], "Empati mendorong kita memahami keadaan orang lain dan membantu secara tepat.")
  ],
  arts: [
    question("Seni rupa", "Mudah", "Warna yang diperoleh dari campuran merah dan kuning adalah ...", "jingga", ["ungu", "hijau", "biru"], "Campuran merah dan kuning menghasilkan warna jingga."),
    question("Seni musik", "Mudah", "Alat musik yang dimainkan dengan cara dipukul adalah ...", "kendang", ["seruling", "biola", "gitar"], "Kendang dimainkan dengan cara dipukul."),
    question("Seni rupa", "Sedang", "Gambar yang dibuat untuk menyampaikan pesan melalui bentuk dan simbol disebut ...", "ilustrasi", ["notasi", "tempo", "dialog"], "Ilustrasi membantu menjelaskan atau menyampaikan pesan secara visual."),
    question("Seni musik", "Sedang", "Cepat atau lambatnya sebuah lagu disebut ...", "tempo", ["warna", "garis", "tekstur"], "Tempo menunjukkan cepat atau lambatnya musik dimainkan."),
    question("Seni budaya", "Mudah", "Kegiatan membuat karya tari secara berkelompok melibatkan ...", "gerak, irama, dan kerja sama", ["angka dan rumus saja", "alat ukur listrik", "proses jual beli"], "Tari memadukan gerak dan irama; kerja sama penting dalam pertunjukan kelompok.")
  ],
  sports: [
    question("Kebugaran", "Mudah", "Kegiatan pemanasan sebelum olahraga bertujuan untuk ...", "mempersiapkan tubuh dan mengurangi risiko cedera", ["menggantikan latihan inti", "membuat tubuh langsung kelelahan", "menghindari minum air"], "Pemanasan menyiapkan otot dan tubuh sebelum melakukan aktivitas lebih intens."),
    question("Permainan bola", "Mudah", "Jumlah pemain satu tim sepak bola yang berada di lapangan saat bermain adalah ...", "11 pemain", ["5 pemain", "7 pemain", "9 pemain"], "Satu tim sepak bola memainkan 11 pemain di lapangan termasuk penjaga gawang."),
    question("Kesehatan", "Sedang", "Setelah berolahraga, tubuh perlu ...", "melakukan pendinginan dan memenuhi kebutuhan cairan", ["langsung berbaring tanpa jeda", "menghindari air sepanjang hari", "melanjutkan latihan berat tanpa istirahat"], "Pendinginan membantu tubuh kembali bertahap dan cairan menggantikan yang hilang."),
    question("Permainan bola", "Mudah", "Dalam bola basket, menggiring bola sambil bergerak disebut ...", "dribel", ["servis", "smash", "heading"], "Dribel adalah teknik memantulkan bola sambil bergerak."),
    question("Keselamatan olahraga", "Sedang", "Saat berolahraga di luar ruangan pada cuaca panas, sebaiknya ...", "beristirahat dan minum air secara berkala", ["memaksakan diri tanpa jeda", "memakai pakaian sangat tebal", "mengabaikan tanda pusing"], "Istirahat dan cairan membantu mengurangi risiko kelelahan akibat panas.")
  ]
};

const electronicsFoundationQuestions = [
  question("Komponen elektronika", "Mudah", "Komponen yang menyimpan muatan listrik adalah …", "Kapasitor", ["Sekring saja", "Sakelar saja", "Konektor"], "Kapasitor menyimpan energi dalam medan listrik."),
  question("Pengukuran listrik dasar", "Mudah", "Satuan kuat arus listrik adalah …", "Ampere", ["Volt", "Ohm", "Watt"], "Arus listrik diukur dalam ampere."),
  question("Rangkaian elektronika", "Mudah", "Fungsi resistor dalam rangkaian adalah …", "Menghambat atau membatasi arus", ["Menyimpan file", "Mengukur suhu tubuh", "Mengirim data internet"], "Resistor memberikan hambatan listrik pada rangkaian.")
];

const VOCATIONAL_QUESTION_BANKS = {
  tjkt: {
    "10": [
      question("Pengenalan perangkat komputer dan jaringan", "Mudah", "Perangkat yang meneruskan data antarjaringan berdasarkan alamat IP adalah …", "Router", ["Monitor", "Keyboard", "Printer"], "Router membaca informasi jaringan pada paket untuk meneruskan data menuju jaringan tujuan."),
      question("Pengenalan perangkat komputer dan jaringan", "Mudah", "Perangkat yang menghubungkan beberapa perangkat dalam satu jaringan lokal kabel adalah …", "Switch", ["Proyektor", "Pemindai", "Pengeras suara"], "Switch menghubungkan perangkat pada LAN dan meneruskan frame ke port tujuan."),
      question("Dasar jaringan kabel dan nirkabel", "Mudah", "Media yang umum digunakan untuk menghubungkan komputer ke switch pada LAN kabel adalah …", "Kabel twisted pair dengan konektor yang sesuai", ["Kabel audio tanpa adaptor", "Kabel daya sebagai jalur data", "Kabel antena televisi tanpa perangkat jaringan"], "Kabel twisted pair seperti UTP dengan terminasi yang benar umum digunakan untuk Ethernet."),
      question("Dasar jaringan kabel dan nirkabel", "Mudah", "Perangkat yang menyediakan akses jaringan nirkabel bagi klien Wi-Fi adalah …", "Access point", ["Sakelar lampu", "Penguat audio", "Papan ketik"], "Access point menyediakan koneksi nirkabel dan menjembatani klien Wi-Fi ke jaringan."),
      question("Pengalamatan IP", "Mudah", "Alamat IPv4 memiliki panjang …", "32 bit", ["8 bit", "16 bit", "128 bit"], "Alamat IPv4 tersusun dari 32 bit dan biasanya ditulis sebagai empat oktet desimal."),
      question("Pengalamatan IP", "Sedang", "Alamat 192.168.1.10 dengan subnet mask 255.255.255.0 berada pada jaringan …", "192.168.1.0/24", ["192.168.0.0/16", "192.168.1.10/32 saja", "192.168.10.0/24"], "Subnet mask /24 menunjukkan tiga oktet pertama sebagai bagian jaringan, yaitu 192.168.1.0."),
      question("Pengalamatan IP", "Sedang", "Dalam sebuah LAN, alamat default gateway pada komputer biasanya menunjuk ke …", "Antarmuka router yang menghubungkan LAN ke jaringan lain", ["Alamat printer pada jaringan yang sama", "Alamat broadcast jaringan", "Alamat server DNS publik dalam semua keadaan"], "Default gateway adalah alamat perangkat router yang menjadi jalur keluar dari subnet lokal."),
      question("Perangkat jaringan", "Mudah", "Fungsi utama modem pada layanan akses internet tertentu adalah …", "Mengubah atau menyesuaikan sinyal agar dapat digunakan pada media akses penyedia", ["Mencetak dokumen jaringan", "Menyimpan halaman web secara permanen", "Menggantikan semua fungsi switch"], "Modem memodulasi dan demodulasi atau menyesuaikan sinyal untuk teknologi akses yang digunakan."),
      question("Perangkat jaringan", "Mudah", "Perangkat yang menghubungkan komputer ke jaringan dan memiliki alamat MAC adalah …", "Kartu antarmuka jaringan (NIC)", ["Heatsink", "Kipas casing", "Catu daya"], "NIC menyediakan antarmuka jaringan dan identitas lapisan tautan berupa alamat MAC."),
      question("Dasar sistem operasi", "Mudah", "Salah satu fungsi sistem operasi pada komputer server adalah …", "Mengelola sumber daya perangkat keras dan layanan perangkat lunak", ["Mengubah kabel UTP menjadi fiber optik", "Menghilangkan kebutuhan konfigurasi jaringan", "Menggantikan fungsi semua perangkat jaringan"], "Sistem operasi mengelola proses, memori, perangkat, akun, dan layanan pada komputer."),
      question("Dasar sistem operasi", "Sedang", "Mengapa akun pengguna pada komputer laboratorium sebaiknya memiliki hak akses sesuai kebutuhan saja?", "Untuk membatasi perubahan yang tidak diperlukan dan mengurangi risiko kesalahan", ["Agar semua pengguna dapat mengubah konfigurasi inti", "Supaya kata sandi tidak diperlukan", "Agar komputer tidak perlu diperbarui"], "Hak akses minimum membatasi dampak kesalahan dan membantu menjaga konfigurasi sistem."),
      question("Keselamatan kerja dan budaya kerja industri", "Mudah", "Sebelum memasang atau melepas komponen komputer, langkah aman yang tepat adalah …", "Matikan perangkat, lepaskan sumber daya sesuai prosedur, dan ikuti arahan guru", ["Menyentuh pin komponen saat komputer menyala", "Membuka catu daya tanpa kewenangan", "Menarik kabel dengan paksa"], "Mematikan perangkat dan mengikuti prosedur keselamatan mengurangi risiko sengatan dan kerusakan komponen.")
    ],
    "11": [
      question("Perancangan jaringan sesuai konsentrasi", "Sedang", "Sebelum menentukan perangkat dan topologi jaringan kantor kecil, langkah awal yang paling tepat adalah …", "Mengumpulkan kebutuhan pengguna, jumlah perangkat, layanan, dan cakupan area", ["Membeli router dengan spesifikasi tertinggi tanpa analisis", "Menetapkan semua komputer memakai satu alamat IP", "Menyambungkan kabel sebelum membuat rancangan"], "Rancangan jaringan sebaiknya didasarkan pada kebutuhan, skala, layanan, dan batasan lokasi."),
      question("Perancangan jaringan sesuai konsentrasi", "Sedang", "Mengapa dokumentasi denah dan label port penting pada jaringan terstruktur?", "Memudahkan penelusuran koneksi dan pemeliharaan", ["Membuat alamat IP tidak diperlukan", "Meningkatkan kecepatan internet secara otomatis", "Menggantikan kebutuhan pengujian kabel"], "Denah dan label membantu teknisi mengidentifikasi jalur serta port saat perubahan atau gangguan."),
      question("Routing dan switching", "Mudah", "Perangkat yang memilih jalur penerusan paket di antara subnet berbeda adalah …", "Router", ["Switch lapisan fisik tanpa fungsi routing", "Patch panel", "Access point dalam mode bridge saja"], "Router meneruskan paket antarjaringan berdasarkan tabel routing."),
      question("Routing dan switching", "Sedang", "Sebuah komputer dapat berkomunikasi dengan perangkat satu subnet tetapi tidak dapat mencapai subnet lain. Pengaturan yang perlu diperiksa lebih dahulu adalah …", "Default gateway dan rute menuju jaringan tujuan", ["Resolusi layar komputer", "Nama berkas pada desktop", "Kecepatan kipas prosesor"], "Komunikasi lintas subnet memerlukan gateway dan rute yang sesuai."),
      question("VLAN dan layanan jaringan", "Mudah", "VLAN digunakan pada switch terkelola untuk …", "Memisahkan jaringan logis pada infrastruktur fisik yang sama", ["Mengganti alamat MAC setiap perangkat", "Membuat kabel jaringan menjadi nirkabel", "Menyimpan cadangan listrik"], "VLAN membagi domain siaran secara logis sehingga kelompok jaringan dapat dipisahkan."),
      question("VLAN dan layanan jaringan", "Sedang", "Port trunk pada switch umumnya digunakan untuk …", "Membawa lalu lintas beberapa VLAN di antara perangkat jaringan", ["Menghubungkan hanya satu komputer tanpa tag VLAN", "Mengukur panjang kabel", "Memberi daya ke monitor"], "Link trunk membawa lalu lintas beberapa VLAN, biasanya dengan penandaan sesuai konfigurasi perangkat."),
      question("VLAN dan layanan jaringan", "Sedang", "Layanan DHCP membantu perangkat klien dengan cara …", "Memberikan konfigurasi IP secara otomatis dari lingkup yang disediakan", ["Menerjemahkan nama domain menjadi alamat IP", "Mengenkripsi semua berkas komputer", "Mengukur kualitas sinyal kabel"], "DHCP dapat membagikan alamat IP, subnet mask, gateway, dan parameter jaringan lain kepada klien."),
      question("VLAN dan layanan jaringan", "Sedang", "Fungsi DNS pada jaringan adalah …", "Menerjemahkan nama domain menjadi informasi alamat yang diperlukan klien", ["Membagikan alamat IP secara dinamis", "Menyaring debu di ruang server", "Menghubungkan kabel fiber ke konektor"], "DNS membantu klien menemukan alamat yang terkait dengan nama domain."),
      question("Administrasi sistem dan server", "Sedang", "Mengapa server perlu menerima pembaruan sistem melalui prosedur terencana?", "Untuk mengurangi kerentanan dan menjaga kestabilan layanan dengan risiko perubahan terkendali", ["Agar semua layanan selalu dimatikan permanen", "Supaya akun administrator dibagikan ke semua pengguna", "Untuk menghapus kebutuhan pencadangan"], "Pembaruan perlu diuji dan dijadwalkan agar perbaikan keamanan dilakukan sambil menjaga ketersediaan layanan."),
      question("Administrasi sistem dan server", "Mudah", "Tujuan utama pencadangan konfigurasi server adalah …", "Memulihkan pengaturan ketika terjadi kerusakan atau perubahan yang gagal", ["Meningkatkan jangkauan Wi-Fi tanpa perangkat tambahan", "Mengganti semua proses pemantauan", "Menghapus kebutuhan dokumentasi"], "Cadangan yang teruji membantu pemulihan konfigurasi setelah gangguan atau kesalahan perubahan."),
      question("Instalasi media jaringan", "Mudah", "Setelah kabel Ethernet diterminasi, cara yang tepat untuk memeriksa urutan dan kontinuitas kabel adalah …", "Menggunakan cable tester yang sesuai", ["Menghubungkan kabel ke stopkontak", "Mengukur kabel dengan termometer", "Menguji dengan menarik konektor sekuat-kuatnya"], "Cable tester memeriksa kontinuitas dan pemetaan pasangan kabel tanpa menghubungkannya ke sumber daya berbahaya."),
      question("Instalasi media jaringan", "Sedang", "Saat merapikan kabel UTP untuk mengurangi gangguan, praktik yang baik adalah …", "Menghindari tekukan tajam dan menjaga kabel data dari sumber interferensi sesuai standar pemasangan", ["Menjepit kabel sampai jaketnya rusak", "Mengupas seluruh kabel agar lebih lentur", "Menyatukan kabel data dengan kabel daya tanpa jarak"], "Radius tekuk yang sesuai dan pemisahan dari sumber interferensi membantu menjaga kualitas transmisi.")
    ],
    "12": [
      question("Implementasi dan pemeliharaan jaringan", "Sedang", "Sebelum mengubah konfigurasi router produksi, tindakan yang paling bertanggung jawab adalah …", "Mencadangkan konfigurasi dan menyiapkan rencana perubahan serta pemulihan", ["Mengubah banyak parameter tanpa catatan", "Menghapus konfigurasi lama sebelum membuat cadangan", "Membagikan kredensial administrator kepada pengguna"], "Cadangan, rencana, dan dokumentasi membantu membatasi dampak perubahan yang gagal."),
      question("Implementasi dan pemeliharaan jaringan", "Sedang", "Dalam jadwal pemeliharaan jaringan, pemeriksaan log dan status perangkat berguna untuk …", "Menemukan gejala gangguan atau perubahan yang perlu ditindaklanjuti", ["Menghapus seluruh riwayat tanpa pemeriksaan", "Menggantikan semua pengujian koneksi", "Menjamin jaringan tidak akan pernah bermasalah"], "Log dan status memberi petunjuk untuk diagnosis, tetapi temuan tetap perlu diverifikasi."),
      question("Implementasi dan pemeliharaan jaringan", "Sedang", "Setelah mengganti switch, langkah validasi yang tepat adalah …", "Memeriksa link, VLAN, konektivitas layanan, dan dokumentasi sesuai rencana uji", ["Menganggap semua layanan pasti normal karena lampu menyala", "Mengubah alamat semua klien secara acak", "Menghapus label port"], "Rencana uji memeriksa fungsi koneksi dan konfigurasi, tidak hanya indikator fisik perangkat."),
      question("Keamanan jaringan", "Mudah", "Praktik yang tepat untuk akun administrator jaringan adalah …", "Menggunakan akun pribadi yang terlindungi dan hak akses terbatas sesuai tugas", ["Memakai satu kata sandi sederhana untuk semua orang", "Mengirim kata sandi melalui grup umum", "Membiarkan sesi administrator terbuka"], "Akun unik, perlindungan kredensial, dan pembatasan hak membantu akuntabilitas serta keamanan."),
      question("Keamanan jaringan", "Sedang", "Mengapa firmware perangkat jaringan perlu diperbarui melalui sumber resmi dan prosedur sekolah?", "Untuk memperoleh perbaikan yang sah dan mengurangi risiko berkas atau perubahan yang tidak tepercaya", ["Agar semua port jaringan terbuka", "Supaya kata sandi dapat dihilangkan", "Untuk membuat perangkat tidak memerlukan konfigurasi"], "Sumber resmi dan prosedur uji mengurangi risiko memasang firmware yang salah atau tidak tepercaya."),
      question("Keamanan jaringan", "Sedang", "Segmentasi VLAN untuk jaringan tamu sebaiknya dirancang agar …", "Akses tamu dibatasi hanya ke layanan yang diperlukan dan terpisah dari jaringan internal", ["Tamu dapat mengelola switch inti", "Semua perangkat memakai kata sandi yang sama", "Jaringan internal tidak memiliki kontrol akses"], "Pemisahan jaringan dan aturan akses membatasi jangkauan perangkat tamu."),
      question("Fiber optik", "Mudah", "Sebelum melihat ujung serat optik, teknisi harus …", "Memastikan sumber cahaya optik dimatikan dan mengikuti prosedur keselamatan", ["Melihat langsung ke konektor untuk memeriksa cahaya", "Menyentuh permukaan ujung serat dengan jari", "Mengarahkan laser ke mata untuk menguji koneksi"], "Sumber optik dapat tidak terlihat; jangan melihat langsung ke konektor dan ikuti prosedur keselamatan."),
      question("Fiber optik", "Sedang", "Fungsi alat ukur optical power meter adalah …", "Mengukur tingkat daya optik pada jalur fiber", ["Mengukur panjang alamat IP", "Menguji tegangan baterai laptop", "Membaca konfigurasi VLAN"], "Optical power meter mengukur daya optik pada panjang gelombang yang sesuai dengan alat dan prosedur."),
      question("Fiber optik", "Sedang", "Mengapa radius tekuk minimum kabel fiber optik perlu dipatuhi saat pemasangan?", "Tekukan berlebihan dapat meningkatkan redaman atau merusak serat", ["Agar konektor berubah menjadi switch", "Supaya panjang gelombang bertambah", "Untuk menghilangkan kebutuhan pengujian"], "Tekukan tajam dapat menyebabkan kehilangan optik dan kerusakan fisik pada kabel."),
      question("Monitoring dan troubleshooting", "Mudah", "Jika satu komputer tidak memperoleh alamat IP tetapi komputer lain normal, pemeriksaan awal yang tepat adalah …", "Memeriksa sambungan fisik, status adaptor, dan konfigurasi IP komputer tersebut", ["Mengganti router inti tanpa pemeriksaan", "Menghapus konfigurasi seluruh jaringan", "Menaikkan daya listrik perangkat"], "Gangguan yang hanya terjadi pada satu klien sebaiknya diawali dengan pemeriksaan lokal sebelum perubahan luas."),
      question("Monitoring dan troubleshooting", "Sedang", "Perintah ping berhasil ke gateway tetapi gagal ke nama domain. Hal yang layak diperiksa berikutnya adalah …", "Resolusi DNS dan konektivitas menuju layanan tujuan", ["Warna kabel patch cord", "Resolusi layar monitor", "Pengaturan keyboard"], "Keberhasilan mencapai gateway menunjukkan koneksi lokal bekerja; kegagalan nama domain dapat berkaitan dengan DNS atau jalur lebih lanjut."),
      question("Dokumentasi proyek dan budaya kerja industri", "Mudah", "Informasi yang sebaiknya dicatat setelah perubahan konfigurasi jaringan adalah …", "Waktu, perangkat, perubahan, hasil pengujian, dan pelaksana sesuai aturan sekolah", ["Kata sandi rahasia dalam catatan yang dibagikan umum", "Data pribadi pengguna yang tidak diperlukan", "Hanya nama teknisi tanpa rincian perubahan"], "Catatan perubahan yang relevan mendukung audit dan pemulihan; rahasia akses dan data pribadi harus dilindungi.")
    ]
  },
  electronics: {
    "10": [
      ...electronicsFoundationQuestions,
      question("Komponen elektronika", "Mudah", "Satuan hambatan listrik adalah …", "Ohm", ["Ampere", "Volt", "Watt"], "Hambatan listrik dinyatakan dalam ohm dengan simbol Ω."),
      question("Komponen elektronika", "Mudah", "Komponen yang dirancang untuk mengalirkan arus terutama ke satu arah adalah …", "Dioda", ["Resistor", "Kapasitor", "Potensiometer"], "Dioda memiliki karakteristik penghantaran utama pada arah maju."),
      question("Komponen elektronika", "Mudah", "LED sebaiknya dipasang bersama resistor pembatas arus agar …", "Arus LED tidak melebihi batas yang diizinkan", ["Tegangan sumber selalu menjadi nol", "LED dapat menyimpan program", "Frekuensi listrik berubah otomatis"], "Resistor seri membantu membatasi arus yang melewati LED."),
      question("Pengukuran listrik dasar", "Sedang", "Resistor 6 Ω dialiri arus 2 A. Berapakah tegangan pada resistor?", "12 V", ["3 V", "8 V", "24 V"], "Menurut hukum Ohm, V = I × R = 2 A × 6 Ω = 12 V."),
      question("Pengukuran listrik dasar", "Sedang", "Arus 0,5 A mengalir pada resistor 20 Ω. Daya yang dilepas resistor adalah …", "5 W", ["2,5 W", "10 W", "40 W"], "P = I² × R = (0,5 A)² × 20 Ω = 5 W."),
      question("Penggunaan alat ukur", "Mudah", "Untuk mengukur tegangan pada sebuah komponen, voltmeter dipasang secara …", "Paralel terhadap komponen", ["Seri dengan komponen", "Terbuka tanpa menyentuh rangkaian", "Seri dengan sumber saja"], "Voltmeter mengukur beda potensial antara dua ujung komponen sehingga dipasang paralel."),
      question("Penggunaan alat ukur", "Mudah", "Untuk mengukur arus yang melewati beban, amperemeter umumnya dipasang secara …", "Seri dengan beban", ["Paralel dengan sumber", "Paralel dengan beban", "Terpisah dari rangkaian"], "Arus beban harus melewati amperemeter, sehingga alat dipasang seri."),
      question("Rangkaian elektronika", "Mudah", "Pada rangkaian seri, jika satu sambungan terputus, maka …", "Arus pada seluruh rangkaian berhenti", ["Arus otomatis menjadi dua kali lipat", "Semua komponen berubah menjadi sumber", "Tegangan sumber selalu hilang permanen"], "Rangkaian seri memiliki satu jalur; jalur yang terputus menghentikan arus."),
      question("Rangkaian elektronika", "Sedang", "Dua resistor 100 Ω dan 220 Ω disusun seri. Hambatan totalnya adalah …", "320 Ω", ["120 Ω", "220 Ω", "22.000 Ω"], "Pada susunan seri, hambatan dijumlahkan: 100 Ω + 220 Ω = 320 Ω."),
      question("Keselamatan kerja kelistrikan", "Mudah", "Sebelum mengubah sambungan pada rangkaian praktik, tindakan yang tepat adalah …", "Matikan sumber dan ikuti instruksi keselamatan guru", ["Memegang kabel terbuka untuk mencari arus", "Menghubungkan semua terminal sekaligus", "Melepas komponen saat rangkaian bertegangan"], "Sumber harus dimatikan dan prosedur keselamatan praktik harus diikuti sebelum mengubah rangkaian."),
      question("Penggunaan alat ukur", "Sedang", "Sebelum mengukur resistansi komponen di dalam rangkaian, sebaiknya …", "Matikan sumber daya dan pastikan kapasitor telah ditangani sesuai arahan guru", ["Atur multimeter ke mode arus lalu hubungkan paralel", "Biarkan rangkaian menyala agar hasil lebih cepat", "Hubungkan probe tanpa memeriksa mode ukur"], "Pengukuran resistansi dilakukan tanpa rangkaian diberi daya; ikuti prosedur aman untuk kapasitor.")
    ],
    "11": [
      ...electronicsFoundationQuestions,
      question("Analisis rangkaian", "Mudah", "Resistor 1 kΩ dan 2,2 kΩ disusun seri. Hambatan totalnya adalah …", "3,2 kΩ", ["1,2 kΩ", "2,2 kΩ", "2,2 MΩ"], "Hambatan seri dijumlahkan: 1 kΩ + 2,2 kΩ = 3,2 kΩ."),
      question("Analisis rangkaian", "Sedang", "Sumber 9 V dipasang pada resistor 3 kΩ. Arus ideal yang mengalir adalah …", "3 mA", ["0,33 mA", "3 A", "27 mA"], "I = V/R = 9 V/3000 Ω = 0,003 A atau 3 mA."),
      question("Analisis rangkaian", "Sedang", "Pembagi tegangan memakai dua resistor sama besar secara seri pada sumber 12 V. Tegangan pada titik tengah terhadap negatif sumber adalah …", "6 V", ["3 V", "12 V", "24 V"], "Dua resistor sama membagi tegangan sumber secara sama, sehingga titik tengah idealnya 6 V."),
      question("Analisis rangkaian", "Sedang", "Kapasitor ideal yang sudah terisi penuh oleh sumber DC tetap pada kondisi tunak akan bersifat seperti …", "Rangkaian terbuka terhadap arus DC", ["Hubung singkat permanen", "Sumber arus tanpa batas", "Resistor nol ohm"], "Setelah transien pengisian selesai, arus DC ideal melalui kapasitor menjadi nol."),
      question("Komponen elektronika", "Sedang", "Penyearah setengah gelombang menggunakan dioda untuk …", "Melewatkan satu bagian polaritas gelombang AC", ["Mengubah AC menjadi gelombang persegi sempurna", "Menyimpan seluruh energi sebagai data", "Menaikkan frekuensi sumber tanpa rangkaian lain"], "Dioda pada penyearah setengah gelombang melewatkan satu polaritas dan menahan polaritas lainnya."),
      question("Komponen elektronika", "Sedang", "Dioda Zener pada rangkaian regulator sederhana biasanya dimanfaatkan pada daerah …", "Tembus balik sesuai tegangan Zener dan batas arusnya", ["Bias maju tanpa resistor seri", "Hubung singkat dua arah", "Tidak diberi bias sama sekali"], "Pada daerah tembus balik yang dirancang dan dibatasi arus, tegangan Zener dapat menjadi acuan regulator."),
      question("Komponen elektronika", "Sedang", "Pada transistor BJT yang digunakan sebagai penguat, perubahan kecil arus basis dapat mengendalikan …", "Perubahan arus kolektor yang lebih besar pada daerah kerja yang sesuai", ["Nilai hambatan bumi", "Warna kabel rangkaian", "Frekuensi sumber listrik rumah"], "BJT dapat mengendalikan arus kolektor melalui arus basis saat bias dan daerah kerjanya tepat."),
      question("Komponen elektronika", "Sedang", "Untuk transistor silikon NPN mulai menghantar pada rangkaian emitor bersama, tegangan basis umumnya dibuat …", "Lebih positif sekitar 0,7 V daripada emitor", ["Lebih negatif tepat 12 V daripada emitor", "Sama dengan tegangan kolektor dalam semua keadaan", "Tepat 0 V tanpa memperhatikan emitor"], "Sambungan basis-emitor silikon biasanya mulai forward-bias pada sekitar 0,7 V; nilai sebenarnya bergantung arus dan komponen."),
      question("Analisis rangkaian", "Sedang", "Konstanta waktu rangkaian RC dengan R = 1 kΩ dan C = 100 µF adalah …", "0,1 s", ["0,001 s", "1 s", "10 s"], "τ = R × C = 1000 Ω × 0,0001 F = 0,1 s."),
      question("Penggunaan alat ukur", "Sedang", "Saat memakai osiloskop untuk melihat bentuk gelombang tegangan, probe dihubungkan …", "Melintang pada dua titik yang ingin dibandingkan", ["Seri agar seluruh arus beban melewati osiloskop", "Hanya ke satu titik tanpa referensi", "Ke terminal arus multimeter saja"], "Osiloskop menampilkan tegangan sebagai beda potensial antara ujung probe dan referensi ground."),
      question("Keselamatan kerja kelistrikan", "Mudah", "Pemeriksaan kontinuitas kabel dengan multimeter dilakukan ketika …", "Rangkaian tidak diberi daya", ["Rangkaian diberi daya maksimum", "Probe arus dipasang paralel pada sumber", "Kabel sedang dihubung-singkatkan"], "Mode kontinuitas menggunakan sinyal kecil dari meter dan harus digunakan pada rangkaian tanpa daya.")
    ],
    "12": [
      ...electronicsFoundationQuestions,
      question("Rangkaian elektronika", "Sedang", "Penyearah jembatan satu fase menggunakan berapa dioda?", "Empat dioda", ["Satu dioda", "Dua dioda", "Enam dioda"], "Penyearah jembatan satu fase menggunakan empat dioda untuk menyearahkan kedua setengah gelombang."),
      question("Rangkaian elektronika", "Sedang", "Pada catu daya penyearah, kapasitor filter terutama berfungsi untuk …", "Mengurangi riak tegangan keluaran", ["Mengubah semua arus menjadi arus bolak-balik", "Menghilangkan kebutuhan beban", "Menaikkan frekuensi sumber"], "Kapasitor mengisi dan melepaskan muatan di antara puncak sehingga riak keluaran berkurang."),
      question("Rangkaian elektronika", "Sedang", "Komparator berbasis op-amp digunakan untuk …", "Membandingkan dua tegangan masukan", ["Menyimpan data tanpa catu daya", "Mengukur arus tanpa sensor", "Mengubah resistor menjadi kapasitor"], "Komparator membandingkan tegangan pada masukan dan mengubah keluaran mengikuti masukan yang lebih besar."),
      question("Rangkaian elektronika", "Sedang", "Umpan balik negatif pada penguat op-amp umumnya membantu …", "Menstabilkan penguatan sesuai rancangan umpan balik", ["Membuat keluaran selalu sama dengan catu maksimum", "Menghilangkan semua komponen eksternal", "Membalik sumber DC menjadi AC"], "Umpan balik negatif mengendalikan penguatan tertutup dan memperbaiki kestabilan pada rentang kerja."),
      question("Elektronika digital", "Mudah", "Keluaran gerbang AND bernilai logika 1 ketika …", "Semua masukannya bernilai 1", ["Sedikitnya satu masukan bernilai 1", "Semua masukannya bernilai 0", "Masukan selalu bergantian"], "Gerbang AND hanya menghasilkan 1 jika seluruh masukannya 1."),
      question("Elektronika digital", "Sedang", "Pada kendali PWM, kenaikan duty cycle biasanya membuat …", "Nilai rata-rata daya ke beban meningkat pada kondisi sumber dan beban yang sama", ["Frekuensi sumber selalu menjadi nol", "Beban terputus permanen", "Tegangan sumber berubah polaritas"], "Duty cycle yang lebih besar memperpanjang waktu aktif tiap periode dan umumnya meningkatkan nilai rata-rata yang diterima beban."),
      question("Komponen elektronika", "Sedang", "Transistor yang digunakan sebagai sakelar elektronik idealnya dioperasikan bergantian pada kondisi …", "Cut-off dan saturasi", ["Breakdown dan mengambang", "Kapasitif dan induktif", "Terbuka dan tanpa terminal"], "Sebagai sakelar, transistor umumnya dirancang pada kondisi cut-off (mati) dan saturasi (menyala)."),
      question("Analisis dan troubleshooting", "Sedang", "Pada perangkat praktik tegangan rendah yang mati total, langkah awal yang aman adalah …", "Matikan sumber lalu periksa catu, konektor, dan sekring sesuai prosedur", ["Mengganti komponen secara acak saat rangkaian menyala", "Menyentuh semua titik untuk menemukan tegangan", "Menaikkan tegangan sumber tanpa batas"], "Mulailah dari pemeriksaan visual dan catu daya dalam keadaan aman, mengikuti prosedur serta arahan guru."),
      question("Rangkaian elektronika", "Sulit", "Pada penyearah gelombang penuh satu fase dengan sumber 50 Hz, frekuensi riak sebelum filter ideal adalah …", "100 Hz", ["25 Hz", "50 Hz", "200 Hz"], "Penyearah gelombang penuh menghasilkan dua puncak keluaran tiap siklus, sehingga riaknya 2 × 50 Hz = 100 Hz."),
      question("Pengukuran listrik dasar", "Sedang", "Jika keluaran sensor berubah menjadi sinyal tegangan kecil, rangkaian pengondisi sinyal dapat digunakan untuk …", "Menyesuaikan atau memperkuat sinyal agar dapat dibaca tahap berikutnya", ["Menghapus kebutuhan pengukuran", "Mengubah sensor menjadi sumber energi tanpa batas", "Menjamin pembacaan benar tanpa kalibrasi"], "Pengondisian dapat memperkuat, menyaring, atau menyesuaikan rentang sinyal; hasil tetap perlu diuji dan dikalibrasi."),
      question("Komponen elektronika", "Mudah", "Kapasitor bypass/decoupling yang dipasang dekat pin catu IC terutama membantu …", "Mengurangi gangguan tegangan lokal berfrekuensi tinggi", ["Menggantikan semua kapasitor pada rangkaian", "Membuat IC bekerja tanpa catu", "Mengubah masukan digital menjadi mekanis"], "Kapasitor decoupling menyediakan jalur impedansi rendah lokal untuk gangguan cepat pada jalur catu."),
      question("Komponen elektronika", "Sedang", "Pada MOSFET, terminal gate terutama mengendalikan kanal melalui …", "Tegangan listrik pada gate", ["Arus basis seperti BJT dalam semua kondisi", "Putaran mekanis pada drain", "Cahaya yang selalu mengenai source"], "Medan listrik akibat tegangan gate mengendalikan kanal MOSFET; gate idealnya menarik arus DC sangat kecil.")
    ]
  }
};

const BANK_KEY = {
  "Matematika": "matematika",
  "Bahasa Indonesia": "indonesia",
  "IPAS": "science",
  "IPA": "science",
  "Pendidikan Pancasila": "pancasila",
  "Bahasa Inggris": "english",
  "Pendidikan Agama": "religion",
  "Pendidikan Agama dan Budi Pekerti": "religion",
  "Seni Budaya": "arts",
  "Seni dan Budaya": "arts",
  "PJOK": "sports",
  "Pengetahuan Umum": "knowledge",
  "IPS": "ips",
  "Informatika": "informatika",
  "Biologi": "biology",
  "Fisika": "physics",
  "Kimia": "chemistry",
  "Sejarah": "history",
  "Geografi": "geography",
  "Ekonomi": "economy",
  "Sosiologi": "sociology",
  "TJKT": "tjkt",
  "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)": "tjkt",
  "RPL": "rpl",
  "PPLG": "rpl",
  "Pengembangan Perangkat Lunak dan Gim (PPLG)": "rpl",
  "AKL": "akl",
  "Akuntansi dan Keuangan Lembaga (AKL)": "akl",
  "MPLB": "mplb",
  "Manajemen Perkantoran dan Layanan Bisnis (MPLB)": "mplb",
  "DKV": "dkv",
  "Desain Komunikasi Visual (DKV)": "dkv",
  "Teknik Elektronika": "electronics",
  "Teknik Otomotif": "automotive",
  "Dasar-Dasar Kejuruan": "vocational"
};
const LEGACY_SUBJECT_NAMES = {
  SD: ["Matematika", "Bahasa Indonesia", "IPAS", "Pendidikan Pancasila", "Bahasa Inggris", "Pendidikan Agama", "Seni Budaya", "PJOK", "Pengetahuan Umum"],
  SMP: ["Matematika", "Bahasa Indonesia", "IPA", "IPS", "Bahasa Inggris", "Informatika", "Pendidikan Pancasila", "Pendidikan Agama", "Seni Budaya", "PJOK"],
  SMA: ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Biologi", "Fisika", "Kimia", "Sejarah", "Geografi", "Ekonomi", "Sosiologi", "Informatika", "Pendidikan Pancasila"],
  SMK: ["Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Informatika", "Dasar-Dasar Kejuruan", "TJKT", "RPL", "PPLG", "AKL", "MPLB", "DKV", "Teknik Elektronika", "Teknik Otomotif"]
};

const DEFAULT_STATE = {
  player: { name: "Pemain", avatar: "eagle", xp: 0, badges: [], games: 0, totalAnswers: 0, totalCorrect: 0, hasRetried: false },
  settings: { theme: "light", sound: true, education: "SD", grade: "6", curriculum: "", programId: "", concentration: "" },
  schoolCatalog: {
    enabledSubjectIds: [],
    excludedSubjectIds: [],
    subjectOverrides: {},
    customSubjects: [],
    enabledProgramIds: [],
    programOverrides: {},
    customPrograms: []
  },
  history: [],
  quizzes: [],
  daily: { date: "", done: false }
};

let storageLoadError = null;

function avatarFor(value) {
  const legacyAvatarMap = { "🦁": "lion", "🦊": "fox", "🐼": "panda" };
  const avatarId = legacyAvatarMap[value] || value;
  return AVATARS.find(avatar => avatar.id === avatarId) || AVATARS[0];
}

function avatarMarkup(value, className) {
  const avatar = avatarFor(value);
  return `<img class="${className}" src="${avatar.src}" alt="${avatar.name}" loading="lazy">`;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved || typeof saved !== "object") return structuredClone(DEFAULT_STATE);
    const loadedState = {
      ...structuredClone(DEFAULT_STATE),
      ...saved,
      player: { ...DEFAULT_STATE.player, ...(saved.player || {}) },
      settings: { ...DEFAULT_STATE.settings, ...(saved.settings || {}) },
      schoolCatalog: {
        ...DEFAULT_STATE.schoolCatalog,
        ...(saved.schoolCatalog || {}),
        enabledSubjectIds: Array.isArray(saved.schoolCatalog?.enabledSubjectIds) ? saved.schoolCatalog.enabledSubjectIds : [],
        excludedSubjectIds: Array.isArray(saved.schoolCatalog?.excludedSubjectIds) ? saved.schoolCatalog.excludedSubjectIds : [],
        subjectOverrides: saved.schoolCatalog?.subjectOverrides && typeof saved.schoolCatalog.subjectOverrides === "object" ? saved.schoolCatalog.subjectOverrides : {},
        customSubjects: Array.isArray(saved.schoolCatalog?.customSubjects) ? saved.schoolCatalog.customSubjects : [],
        enabledProgramIds: Array.isArray(saved.schoolCatalog?.enabledProgramIds) ? saved.schoolCatalog.enabledProgramIds : [],
        programOverrides: saved.schoolCatalog?.programOverrides && typeof saved.schoolCatalog.programOverrides === "object" ? saved.schoolCatalog.programOverrides : {},
        customPrograms: Array.isArray(saved.schoolCatalog?.customPrograms) ? saved.schoolCatalog.customPrograms : []
      },
      history: Array.isArray(saved.history) ? saved.history : [],
      quizzes: Array.isArray(saved.quizzes) ? saved.quizzes : [],
      daily: { ...DEFAULT_STATE.daily, ...(saved.daily || {}) }
    };
    loadedState.player.avatar = avatarFor(loadedState.player.avatar).id;
    return loadedState;
  } catch (error) {
    storageLoadError = error;
    console.error("Gagal membaca data Quiz Master Indonesia dari penyimpanan lokal.", error);
    return structuredClone(DEFAULT_STATE);
  }
}

const state = loadState();
const ui = {
  view: "home",
  setup: { education: state.settings.education, grade: state.settings.grade, curriculum: state.settings.curriculum, programId: state.settings.programId, concentration: state.settings.concentration, subject: "", topic: "Semua topik", includeUnmapped: false, mode: "challenge", difficulty: "Campuran", count: 10, duration: 20, order: "acak", hints: true, explanations: true },
  selectedCustomId: null,
  editorQuizId: null,
  game: null,
  lastResult: null,
  showReview: true,
  programEditorId: null,
  programEditorConcentration: "",
  leaderboardPeriod: "Semua waktu",
  leaderboardSubject: "Semua mata pelajaran",
  leaderboardMode: "Semua mode",
  leaderboardClass: "Semua kelas",
  countdownTimer: null,
  timerInterval: null,
  toastTimer: null
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const choiceLetters = ["A", "B", "C", "D"];
const educationNames = { SD: "Sekolah Dasar", SMP: "Sekolah Menengah Pertama", SMA: "Sekolah Menengah Atas", SMK: "Sekolah Menengah Kejuruan" };

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast("Penyimpanan perangkat tidak tersedia atau sudah penuh.");
  }
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function currentLevel(xp = state.player.xp) {
  let result = 0;
  LEVELS.forEach((level, index) => { if (xp >= level.xp) result = index; });
  return result;
}

function progressForLevel(xp = state.player.xp) {
  const index = currentLevel(xp);
  const current = LEVELS[index];
  const next = LEVELS[index + 1];
  return { index, current, next, percent: next ? Math.max(0, Math.min(100, ((xp - current.xp) / (next.xp - current.xp)) * 100)) : 100 };
}

function schoolPrograms() {
  const programs = VOCATIONAL_PROGRAMS.map(program => ({
    ...program,
    curriculums: program.curriculums || ["merdeka", "k13"],
    ...state.schoolCatalog.programOverrides[program.id],
    subjectsByGrade: {
      ...Object.fromEntries(Object.entries(program.subjectsByGrade).map(([grade, offering]) => [grade, {
        ...offering,
        learningContent: VOCATIONAL_LEARNING_CONTENT[program.id]?.[grade] || "",
        ...(state.schoolCatalog.programOverrides[program.id]?.subjectsByGrade?.[grade] || {})
      }]))
    },
    subjectsByConcentration: {
      ...program.subjectsByConcentration,
      ...(state.schoolCatalog.programOverrides[program.id]?.subjectsByConcentration || {})
    }
  }));
  return [...programs, ...state.schoolCatalog.customPrograms.map(program => ({
    curriculums: ["merdeka", "k13"],
    ...program
  }))];
}

function normalizeSchoolProgram(program, id) {
  if (!program || typeof program !== "object" || typeof id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    throw new Error("ID program keahlian tidak valid.");
  }
  const name = typeof program.name === "string" ? program.name.trim().slice(0, 100) : "";
  const field = typeof program.field === "string" ? program.field.trim().slice(0, 80) : "";
  const concentrations = Array.isArray(program.concentrations)
    ? [...new Set(program.concentrations.filter(item => typeof item === "string").map(item => item.trim().slice(0, 80)).filter(Boolean))].slice(0, 20)
    : null;
  const curriculums = Array.isArray(program.curriculums)
    ? [...new Set(program.curriculums.filter(item => ["merdeka", "k13"].includes(item)))]
    : [];
  if (!name || !field || !concentrations || !curriculums.length) {
    throw new Error("Nama, bidang, konsentrasi, dan setidaknya satu kurikulum program wajib diisi.");
  }
  const subjectsByGrade = {};
  for (const grade of ["10", "11", "12"]) {
    const offering = program.subjectsByGrade?.[grade];
    const subjectName = typeof offering?.name === "string" ? offering.name.trim().slice(0, 100) : "";
    if (offering?.learningContent !== undefined && typeof offering.learningContent !== "string") {
      throw new Error(`Ringkasan materi kelas ${grade} harus berupa teks.`);
    }
    const learningContent = (offering?.learningContent || VOCATIONAL_LEARNING_CONTENT[id]?.[grade] || "").trim().slice(0, 4000);
    const materials = Array.isArray(offering?.materials)
      ? [...new Set(offering.materials.filter(item => typeof item === "string").map(item => item.trim().slice(0, 160)).filter(Boolean))].slice(0, 30)
      : [];
    if (!subjectName || !materials.length) {
      throw new Error(`Nama mata pelajaran dan bab/materi kelas ${grade} wajib diisi.`);
    }
    subjectsByGrade[grade] = { name: subjectName, materials, learningContent };
  }
  const subjectsByConcentration = {};
  if (program.subjectsByConcentration !== undefined &&
      (!program.subjectsByConcentration || typeof program.subjectsByConcentration !== "object" || Array.isArray(program.subjectsByConcentration))) {
    throw new Error("Pemetaan konsentrasi program tidak valid.");
  }
  for (const [concentration, grades] of Object.entries(program.subjectsByConcentration || {})) {
    if (!concentrations.includes(concentration) || !grades || typeof grades !== "object" || Array.isArray(grades)) {
      throw new Error("Pemetaan konsentrasi program tidak cocok dengan daftar konsentrasi.");
    }
    const configuredGrades = {};
    for (const [grade, offering] of Object.entries(grades)) {
      if (!["10", "11", "12"].includes(grade)) throw new Error("Pemetaan materi hanya menerima kelas 10, 11, dan 12.");
      const subjectName = typeof offering?.name === "string" ? offering.name.trim().slice(0, 100) : "";
      if (offering?.learningContent !== undefined && typeof offering.learningContent !== "string") {
        throw new Error(`Ringkasan materi kelas ${grade} untuk konsentrasi ${concentration} harus berupa teks.`);
      }
      const learningContent = (offering?.learningContent || "").trim().slice(0, 4000);
      const materials = Array.isArray(offering?.materials)
        ? [...new Set(offering.materials.filter(item => typeof item === "string").map(item => item.trim().slice(0, 160)).filter(Boolean))].slice(0, 30)
        : [];
      if (!subjectName || !materials.length) throw new Error(`Nama mapel dan materi kelas ${grade} untuk konsentrasi ${concentration} wajib diisi.`);
      configuredGrades[grade] = { name: subjectName, materials, learningContent };
    }
    subjectsByConcentration[concentration] = configuredGrades;
  }
  return { id, name, field, concentrations, curriculums, subjectsByGrade, subjectsByConcentration };
}

function programNeedsConcentration(education, grade, programId) {
  return education === "SMK" && String(grade) !== "10" &&
    Boolean(schoolPrograms().find(program => program.id === programId)?.concentrations?.length);
}

function validProgramConcentration(programId, concentration) {
  if (!concentration) return true;
  return Boolean(schoolPrograms().find(program => program.id === programId)?.concentrations.includes(concentration));
}

function vocationalSubjectFor(grade, curriculum, programId, concentration) {
  if (!state.schoolCatalog.enabledProgramIds.includes(programId)) return null;
  const program = schoolPrograms().find(item => item.id === programId);
  const offering = program?.subjectsByConcentration?.[concentration]?.[String(grade)] ||
    program?.subjectsByGrade[String(grade)];
  if (!program || !offering || !program.curriculums.includes(curriculum)) return null;
  const name = offering.name.trim();
  return {
    id: `smk-${program.id}-${grade}`,
    name,
    education: "SMK",
    grades: [String(grade)],
    phases: [phaseForGrade("SMK", grade)],
    phase: phaseForGrade("SMK", grade),
    curriculums: program.curriculums,
    schoolYear: CURRICULUM_SCHOOL_YEAR,
    category: "kejuruan",
    programId: program.id,
    concentration: String(grade) === "10" ? "" : concentration,
    learningContent: offering.learningContent || program.subjectsByGrade[String(grade)]?.learningContent || "",
    icon: "⚙️",
    description: `Contoh pemetaan kejuruan kelas ${grade} untuk ${program.name}. Cocokkan dengan kurikulum dan konsentrasi sekolah.`,
    optional: false,
    sourceUrl: "",
    learningObjectives: [],
    materials: [...offering.materials],
    verificationStatus: "draft",
    bankKey: BANK_KEY[name] || "",
    bankCount: BANKS[BANK_KEY[name]]?.length || 0
  };
}

function subjectsFor(education, grade, curriculum, programId = "", concentration = "") {
  if (!curriculum) return [];
  const enabled = new Set(state.schoolCatalog.enabledSubjectIds);
  const excluded = new Set(state.schoolCatalog.excludedSubjectIds);
  const builtIn = catalogEntries().filter(subject =>
    subject.education === education &&
    subject.grades.includes(String(grade)) &&
    subject.curriculums.includes(curriculum) &&
    !excluded.has(subject.id) &&
    (!subject.optional || enabled.has(subject.id) || Boolean(subject.programId && subject.programId === programId)) &&
    (subject.category !== "kejuruan" || (subject.programId === "foundation" || subject.programId === programId))
  );
  const custom = state.schoolCatalog.customSubjects.filter(subject =>
    subject.education === education &&
    String(subject.grade) === String(grade) &&
    subject.curriculum === curriculum &&
    (!subject.programId || subject.programId === programId) &&
    (!subject.concentration || subject.concentration === concentration) &&
    (education !== "SMK" || (subject.programId && state.schoolCatalog.enabledProgramIds.includes(subject.programId)))
  );
  const vocationalSubject = education === "SMK" && programId
    ? vocationalSubjectFor(grade, curriculum, programId, concentration)
    : null;
  return [...builtIn, ...(vocationalSubject ? [vocationalSubject] : []), ...custom.map(subject => ({
    ...subject,
    phase: phaseFor(subject.education, subject.grade),
    schoolYear: subject.schoolYear || CURRICULUM_SCHOOL_YEAR,
    bankKey: BANK_KEY[subject.name] || "",
    bankCount: BANKS[BANK_KEY[subject.name]]?.length || 0
  }))];
}

function catalogEntries() {
  return CURRICULUM_SUBJECTS.map(subject => {
    const updated = { ...subject, ...(state.schoolCatalog.subjectOverrides[subject.id] || {}) };
    return {
      ...updated,
      phases: updated.grades.map(grade => phaseFor(updated.education, grade)),
      bankKey: BANK_KEY[updated.name] || "",
      bankCount: BANKS[BANK_KEY[updated.name]]?.length || 0
    };
  });
}

function classesFor(education) {
  if (education === "SD") return ["1", "2", "3", "4", "5", "6"];
  if (education === "SMP") return ["7", "8", "9"];
  return ["10", "11", "12"];
}

function schoolLabel(education, grade) {
  return `${education} kelas ${grade}`;
}

function normalizeQuestion(item) {
  if (!item || typeof item.prompt !== "string" || !Array.isArray(item.options) || item.options.length !== 4 || typeof item.answer !== "string") return null;
  if (!item.prompt.trim() || item.options.some(option => typeof option !== "string" || !option.trim()) || new Set(item.options.map(option => option.trim().toLowerCase())).size !== 4 || !item.options.includes(item.answer)) return null;
  return {
    topic: String(item.topic || "Topik umum"),
    difficulty: ["Mudah", "Sedang", "Sulit"].includes(item.difficulty) ? item.difficulty : "Sedang",
    prompt: item.prompt.trim(),
    options: item.options.map(option => option.trim()),
    answer: item.answer.trim(),
    explanation: String(item.explanation || "Periksa kembali konsep pada soal ini."),
    learningObjective: String(item.learningObjective || ""),
    sourceReference: String(item.sourceReference || ""),
    source: String(item.questionSource || item.source || ""),
    verificationStatus: "unverified"
  };
}

function hasDuplicatePrompts(questions) {
  const prompts = questions.map(item => item.prompt.trim().toLocaleLowerCase("id"));
  return new Set(prompts).size !== prompts.length;
}

function allAvailableQuestions(subject) {
  const selectedSubject = subjectsFor(
    ui.setup.education,
    ui.setup.grade,
    ui.setup.curriculum,
    ui.setup.programId,
    ui.setup.concentration
  ).find(item => item.name === subject);
  const vocationalQuestions = ui.setup.education === "SMK" && selectedSubject?.programId
    ? (VOCATIONAL_QUESTION_BANKS[selectedSubject.programId]?.[String(ui.setup.grade)] || [])
    : [];
  const builtin = [
    ...(ui.setup.includeUnmapped
      ? (BANKS[BANK_KEY[subject]] || []).map(item => ({ ...item, questionSource: "unmapped-sample" }))
      : []),
    ...vocationalQuestions.map(item => ({ ...item, questionSource: "builtin-vocational" }))
  ];
  const custom = state.quizzes
    .filter(quiz =>
      quiz.subject === subject &&
      quiz.education === ui.setup.education &&
      String(quiz.grade) === String(ui.setup.grade) &&
      (quiz.curriculum === ui.setup.curriculum || (!quiz.curriculum && ui.setup.includeUnmapped)) &&
      (quiz.curriculum || ui.setup.includeUnmapped) &&
      (ui.setup.education !== "SMK" || (quiz.curriculum
        ? quiz.programId === ui.setup.programId && (String(ui.setup.grade) === "10" || quiz.concentration === ui.setup.concentration)
        : ui.setup.includeUnmapped))
    )
    .flatMap(quiz => quiz.questions.map(q => ({ ...q, topic: q.topic || quiz.title, sourceQuiz: quiz.title })));
  const unique = new Map();
  [...builtin, ...custom].forEach(item => {
    const normalized = normalizeQuestion(item);
    if (normalized) unique.set(`${normalized.prompt}|${normalized.answer}`, {
      ...normalized,
      source: item.sourceQuiz ? "custom" : normalized.source || "unmapped-sample",
      custom: Boolean(item.sourceQuiz),
      sourceQuiz: item.sourceQuiz || ""
    });
  });
  return Array.from(unique.values());
}

function renderSchoolCatalogManager() {
  const programs = schoolPrograms();
  const available = catalogEntries().filter(subject =>
    subject.education === ui.setup.education &&
    subject.grades.includes(String(ui.setup.grade)) &&
    (!ui.setup.curriculum || subject.curriculums.includes(ui.setup.curriculum)) &&
    subject.category !== "kejuruan"
  );
  const editingProgram = ui.programEditorId && ui.programEditorId !== "new"
    ? programs.find(program => program.id === ui.programEditorId)
    : null;
  const showProgramEditor = ui.setup.education === "SMK" && ui.programEditorId !== null;
  const programEditor = showProgramEditor ? `<div class="divider"></div><h3>${editingProgram ? "Perbarui" : "Tambah"} program keahlian sekolah</h3>
    <p class="muted-small">Contoh awal berstatus draf. Sesuaikan nomenklatur, konsentrasi, kurikulum, mata pelajaran, dan materi dengan dokumen resmi sekolah sebelum digunakan.</p>
    <label class="form-label" for="program-name">Nama program keahlian *</label><input class="form-control" id="program-name" maxlength="100" value="${escapeHtml(editingProgram?.name || "")}" placeholder="Nama sesuai daftar program sekolah">
    <label class="form-label" for="program-field">Bidang keahlian *</label><input class="form-control" id="program-field" maxlength="80" value="${escapeHtml(editingProgram?.field || "")}" placeholder="Contoh: Teknologi Informasi">
    <label class="form-label" for="program-concentrations">Konsentrasi keahlian (satu per baris; kosong jika tidak ada)</label><textarea class="form-control" id="program-concentrations" rows="2" maxlength="1000" placeholder="Daftar sesuai konsentrasi yang dibuka sekolah">${escapeHtml((editingProgram?.concentrations || []).join("\n"))}</textarea>
    <div class="form-label">Kurikulum yang tersedia</div><div class="setting-grid"><label><input type="checkbox" id="program-curriculum-merdeka" ${(editingProgram?.curriculums || ["merdeka", "k13"]).includes("merdeka") ? "checked" : ""}> Kurikulum Merdeka</label><label><input type="checkbox" id="program-curriculum-k13" ${(editingProgram?.curriculums || ["merdeka", "k13"]).includes("k13") ? "checked" : ""}> Kurikulum 2013</label></div>
    ${editingProgram?.concentrations?.length ? `<label class="form-label" for="program-edit-concentration">Pemetaan kelas 11–12 untuk konsentrasi</label><select class="form-control" id="program-edit-concentration"><option value="">Materi umum / default program</option>${editingProgram.concentrations.map(concentration => `<option value="${escapeHtml(concentration)}" ${ui.programEditorConcentration === concentration ? "selected" : ""}>${escapeHtml(concentration)}</option>`).join("")}</select><p class="muted-small">Pilih konsentrasi sebelum mengedit materi. Simpan perubahan sebelum berpindah konsentrasi. Jika belum ada pemetaan khusus, materi menggunakan default program.</p>` : ""}
    ${["10", "11", "12"].map(grade => {
      const offering = grade === "10"
        ? editingProgram?.subjectsByGrade?.[grade]
        : (editingProgram?.subjectsByConcentration?.[ui.programEditorConcentration]?.[grade] || editingProgram?.subjectsByGrade?.[grade]);
      const gradeTenDisabled = grade === "10" && ui.programEditorConcentration ? "disabled" : "";
      return `<div class="divider"></div><h4>Kelas ${grade}${gradeTenDisabled ? " · berlaku untuk semua konsentrasi" : ""}</h4><label class="form-label" for="program-subject-${grade}">Nama mata pelajaran *</label><input class="form-control" id="program-subject-${grade}" maxlength="100" value="${escapeHtml(offering?.name || "")}" placeholder="Nama mapel kejuruan untuk kelas ${grade}" ${gradeTenDisabled}>
        <label class="form-label" for="program-materials-${grade}">Bab dan materi (satu per baris) *</label><textarea class="form-control" id="program-materials-${grade}" rows="3" maxlength="1800" placeholder="Materi yang berbeda dan sesuai kelas ${grade}" ${gradeTenDisabled}>${escapeHtml((offering?.materials || []).join("\n"))}</textarea>
        <label class="form-label" for="program-content-${grade}">Bahan bacaan / ringkasan pembelajaran</label><textarea class="form-control" id="program-content-${grade}" rows="4" maxlength="4000" placeholder="Ringkasan konsep dan kegiatan belajar kelas ${grade}" ${gradeTenDisabled}>${escapeHtml(offering?.learningContent || "")}</textarea>`;
    }).join("")}
    <div class="modal-actions"><button class="button button-ghost" data-action="cancel-school-program">Batal</button><button class="button button-primary" data-action="save-school-program">${editingProgram ? "Simpan perubahan" : "Tambah program"}</button></div>` : "";
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal preview-modal" role="dialog" aria-modal="true" aria-labelledby="catalog-title">
    <h2 id="catalog-title">Katalog sekolah di perangkat ini</h2>
    <p>${escapeHtml(ui.setup.education)} kelas ${escapeHtml(ui.setup.grade)} · ${escapeHtml(ui.setup.curriculum || "pilih kurikulum")}. Atur daftar sesuai struktur pembelajaran sekolah; pilihan opsional hanya muncul setelah diaktifkan.</p>
    <div class="notice warning">Pengaturan ini hanya disimpan di browser ini. Tidak ada akun/peran admin, sinkronisasi sekolah, atau hak akses server pada aplikasi lokal.</div>
    ${ui.setup.education === "SMK" ? `<div class="divider"></div><h3>Program keahlian yang tersedia di sekolah</h3><p class="muted-small">Contoh program nonaktif sampai sekolah memilih yang benar-benar tersedia. Gunakan edit untuk mengganti data contoh atau matikan program dengan tidak mencentangnya.</p><div class="preview-question-list">${programs.map(program => `<article class="review-item"><label><input type="checkbox" data-program-toggle="${escapeHtml(program.id)}" ${state.schoolCatalog.enabledProgramIds.includes(program.id) ? "checked" : ""}> <b>${escapeHtml(program.name)}</b> · ${escapeHtml(program.field)}</label><p class="muted-small">Konsentrasi: ${escapeHtml(program.concentrations.join(", ") || "ditentukan sekolah")} · kurikulum: ${escapeHtml(program.curriculums.join(", "))}</p><button class="button button-ghost" data-action="edit-school-program" data-id="${escapeHtml(program.id)}">Atur nama, konsentrasi, kelas, dan materi</button>${!VOCATIONAL_PROGRAMS.some(item => item.id === program.id) ? `<button class="button button-ghost" data-action="remove-school-program" data-id="${escapeHtml(program.id)}">Hapus program lokal</button>` : ""}</article>`).join("")}</div><button class="button button-primary" style="margin-top:10px" data-action="edit-school-program" data-id="new">Tambah program sekolah</button>${programEditor}` : ""}
    <div class="preview-question-list">${available.map(subject => `<label class="review-item"><input type="checkbox" data-catalog-toggle="${escapeHtml(subject.id)}" ${subject.optional ? (state.schoolCatalog.enabledSubjectIds.includes(subject.id) ? "checked" : "") : (state.schoolCatalog.excludedSubjectIds.includes(subject.id) ? "" : "checked")}> <b>${escapeHtml(subject.name)}</b> · ${escapeHtml(subject.category)}${subject.optional ? " · pilihan" : ""} · belum diverifikasi</label>`).join("") || `<p class="muted-small">Tidak ada mata pelajaran pada konteks ini.</p>`}</div>
    <div class="divider"></div><h3>Tambah mata pelajaran sekolah</h3>
    <label class="form-label" for="school-subject-name">Nama mata pelajaran</label><input class="form-control" id="school-subject-name" maxlength="80" placeholder="Contoh: Bahasa Daerah">
    <label class="form-label" for="school-subject-category">Kategori</label><select class="form-control" id="school-subject-category"><option value="umum">Umum</option><option value="pilihan">Pilihan</option><option value="kejuruan">Kejuruan</option><option value="muatan-lokal">Muatan lokal</option></select>
    <label class="form-label" for="school-subject-reference">Referensi sekolah/resmi (opsional)</label><input class="form-control" id="school-subject-reference" maxlength="300" placeholder="URL atau dokumen sekolah">
    <label class="form-label" for="school-subject-materials">Bab dan materi (satu per baris)</label><textarea class="form-control" id="school-subject-materials" rows="2" maxlength="1000" placeholder="Materi sesuai ATP sekolah"></textarea>
    <label class="form-label" for="school-subject-objectives">Tujuan/capaian pembelajaran (satu per baris)</label><textarea class="form-control" id="school-subject-objectives" rows="2" maxlength="1000" placeholder="Salin dari dokumen kurikulum/ATP sekolah"></textarea>
    <button class="button button-primary" style="margin-top:10px" data-action="add-school-subject">Tambah untuk kelas ini</button>
    <div class="divider"></div><h3>Materi khusus yang ditambahkan</h3>
    <div class="preview-question-list">    ${state.schoolCatalog.customSubjects.filter(subject => subject.education === ui.setup.education && String(subject.grade) === String(ui.setup.grade) && (!ui.setup.curriculum || subject.curriculum === ui.setup.curriculum) && (!subject.programId || subject.programId === ui.setup.programId) && (!subject.concentration || subject.concentration === ui.setup.concentration)).map(subject => `<article class="review-item"><b>${escapeHtml(subject.name)}</b> · ${escapeHtml(subject.category)}<p class="muted-small">Fase ${phaseFor(subject.education, subject.grade)} · ${escapeHtml(subject.sourceReference || "Tanpa referensi")} · ${escapeHtml(subject.verificationStatus || "unverified")}</p><p>Materi: ${escapeHtml((subject.materials || []).join(", ") || "belum diisi")}<br>Tujuan: ${escapeHtml((subject.learningObjectives || []).join("; ") || "belum diisi")}</p><button class="button button-ghost"  data-action="remove-school-subject" data-id="${escapeHtml(subject.id)}">Hapus</button></article>`).join("") || `<p class="muted-small">Belum ada mata pelajaran tambahan.</p>`}</div>
    <div class="divider"></div><p class="muted-small">Mata pelajaran, bidang, kelas, kurikulum, konsentrasi, dan materi dapat disesuaikan di sini atau melalui ekspor/impor JSON. Semua perubahan lokal berstatus belum diverifikasi dan tidak mengubah sumber resmi.</p>
    <div class="modal-actions"><button class="button button-ghost" data-action="export-catalog">Ekspor konfigurasi</button><label class="button button-ghost" for="catalog-import-file">Impor konfigurasi</label><input id="catalog-import-file" type="file" accept="application/json,.json" class="hidden"><button class="button button-primary" data-action="close-modal">Selesai</button></div>
  </div></div>`;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function shuffledQuestion(item) {
  const options = shuffle(item.options.map(text => ({ text, correct: text === item.answer })));
  return { ...item, options };
}

function showToast(message, duration = 2500) {
  const region = $("#toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.remove(), duration);
}

function beep(correct = true) {
  if (!state.settings.sound) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = correct ? 660 : 230;
  gain.gain.value = 0.045;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
  oscillator.onended = () => context.close();
}

function setView(name) {
  stopGameTimers();
  ui.view = name;
  $$(".view").forEach(view => view.classList.toggle("hidden", view.id !== `view-${name}`));
  $$(".nav-link").forEach(button => button.classList.toggle("active", button.dataset.action === (name === "creator" ? "creator" : name === "leaderboard" ? "leaderboard" : "home")));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function refreshHeader() {
  $("#header-avatar").innerHTML = avatarMarkup(state.player.avatar, "avatar-image");
  $("#header-name").textContent = state.player.name;
}

function refreshHome() {
  refreshHeader();
  $("#progress-avatar").innerHTML = avatarMarkup(state.player.avatar, "avatar-image");
  $("#progress-name").textContent = state.player.name;
  const progress = progressForLevel();
  $("#level-name").textContent = `${progress.current.name} · Level ${progress.index + 1}`;
  $("#xp-fill").style.width = `${progress.percent}%`;
  $("#xp-label").textContent = progress.next ? `${state.player.xp - progress.current.xp} / ${progress.next.xp - progress.current.xp} XP menuju level berikutnya` : "Level tertinggi telah tercapai!";
  $("#stat-xp").textContent = state.player.xp.toLocaleString("id-ID");
  $("#stat-games").textContent = state.player.games;
  $("#stat-correct").textContent = state.player.totalCorrect;
  $("#stat-badges").textContent = state.player.badges.length;
  const today = todayKey();
  if (state.daily.date !== today) state.daily = { date: today, done: false };
  $("#mission-fill").style.width = state.daily.done ? "100%" : "0%";
  $("#mission-label").textContent = state.daily.done ? "Misi hari ini selesai. Hebat!" : "0 dari 1 kuis hari ini";
  $("#badge-count").textContent = `${state.player.badges.length} lencana`;
  $("#badge-list").innerHTML = BADGES.map(badge => {
    const earned = state.player.badges.includes(badge.id);
    return `<div class="badge-item ${earned ? "earned" : ""}" title="${escapeHtml(badge.description)}"><span class="badge-icon">${badge.icon}</span><span>${escapeHtml(badge.name)}${earned ? " ✓" : ""}</span></div>`;
  }).join("");
  $(".icon-button[data-action='sound']").textContent = state.settings.sound ? "🔊" : "🔇";
  $(".icon-button[data-action='theme']").textContent = state.settings.theme === "dark" ? "🌙" : "☀️";
  document.body.classList.toggle("dark", state.settings.theme === "dark");
}

function openHome() {
  refreshHome();
  setView("home");
}

function openSetup() {
  ui.setup.education = state.settings.education || "SD";
  ui.setup.grade = state.settings.grade || classesFor(ui.setup.education)[classesFor(ui.setup.education).length - 1];
  ui.setup.curriculum = state.settings.curriculum || "";
  ui.setup.programId = state.settings.programId || "";
  ui.setup.concentration = state.settings.concentration || "";
  const subjects = subjectsFor(ui.setup.education, ui.setup.grade, ui.setup.curriculum, ui.setup.programId, ui.setup.concentration);
  ui.setup.subject = subjects.some(subject => subject.name === ui.setup.subject) ? ui.setup.subject : subjects[0]?.name || "";
  ui.selectedCustomId = null;
  renderSetup();
  setView("setup");
}

function renderSetup() {
  const setup = ui.setup;
  const subjects = subjectsFor(setup.education, setup.grade, setup.curriculum, setup.programId, setup.concentration);
  if (!subjects.some(subject => subject.name === setup.subject)) setup.subject = subjects[0]?.name || "";
  const selected = subjects.find(subject => subject.name === setup.subject) || subjects[0];
  const programs = schoolPrograms().filter(program => state.schoolCatalog.enabledProgramIds.includes(program.id));
  const currentProgram = programs.find(program => program.id === setup.programId);
  const allPool = setup.subject ? allAvailableQuestions(setup.subject) : [];
  const difficultyPool = setup.difficulty === "Campuran" ? allPool : allPool.filter(item => item.difficulty === setup.difficulty);
  const topics = ["Semua topik", ...new Set([
    ...(selected?.materials || []),
    ...difficultyPool.map(item => item.topic).filter(Boolean)
  ].sort((a, b) => a.localeCompare(b, "id")))];
  if (!topics.includes(setup.topic)) setup.topic = "Semua topik";
  const pool = setup.topic === "Semua topik" ? difficultyPool : difficultyPool.filter(item => item.topic === setup.topic);
  const counts = Array.from({ length: 10 }, (_, index) => (index + 1) * 10)
    .map(value => ({ value, disabled: value > pool.length }));
  if (pool.length && pool.length % 10 !== 0) {
    counts.push({ value: pool.length, disabled: false, label: `Semua soal · ${pool.length}` });
  }
  counts.sort((a, b) => a.value - b.value);
  const requestedCount = Number(setup.count) || 10;
  const count = pool.length
    ? pool.length < 10
      ? pool.length
      : Math.min(pool.length, Math.min(100, Math.max(10, Math.ceil(requestedCount / 10) * 10)))
    : 0;
  setup.count = count;
  const formatSubjectLabel = selected?.name || "Pilih mata pelajaran";
  const validSetup = Boolean(setup.curriculum && selected &&
    (setup.education !== "SMK" || (setup.programId && (!programNeedsConcentration("SMK", setup.grade, setup.programId) || setup.concentration))) &&
    pool.length > 0);
  $("#view-setup").innerHTML = `
    <button class="back-button" data-action="home">← Kembali ke beranda</button>
    <div class="screen-heading"><div><p class="section-kicker">TAHUN AJARAN 2026/2027</p><h1>Atur permainanmu</h1><p>Pilih konteks sekolah supaya daftar pelajaran sesuai pilihanmu.</p></div><button class="button button-ghost" data-action="manage-curriculum">Kelola katalog sekolah</button></div>
    <div class="setup-layout"><div class="setup-main">
      <div class="step-progress"><span class="step active"><span class="step-num">1</span> Tingkatan</span><span class="step-line"></span><span class="step active"><span class="step-num">2</span> Mata pelajaran</span><span class="step-line"></span><span class="step active"><span class="step-num">3</span> Pengaturan</span></div>
      <h2 class="step-title">Pilih kurikulum yang digunakan sekolah</h2>
      <label class="form-label" for="curriculum-select">Kurikulum sekolah *</label><select class="form-control" id="curriculum-select"><option value="">Pilih kurikulum sekolah</option><option value="merdeka" ${setup.curriculum === "merdeka" ? "selected" : ""}>Kurikulum Merdeka</option><option value="k13" ${setup.curriculum === "k13" ? "selected" : ""}>Kurikulum 2013 (K13) — jika masih digunakan sekolah</option></select>
      <div class="notice warning" style="margin-top:8px">Pilih kurikulum sekolahmu; aplikasi tidak mengasumsikan semua sekolah memakai kurikulum yang sama. Katalog dan bank bawaan belum diverifikasi untuk setiap sekolah/tahun ajaran.</div>
      <h2 class="step-title">Pilih tingkatan pendidikan</h2>
      <div class="option-grid">${["SD", "SMP", "SMA", "SMK"].map(education => `<button class="choice-card education-choice ${setup.education === education ? "selected" : ""}" data-action="education" data-value="${education}"><strong>${education}</strong><small>${educationNames[education]}</small></button>`).join("")}</div>
      <label class="form-label" for="grade-select">Pilih kelas</label><select class="form-control" id="grade-select">${classesFor(setup.education).map(grade => `<option value="${grade}" ${setup.grade === grade ? "selected" : ""}>${educationNames[setup.education]} · Kelas ${grade}</option>`).join("")}</select>
      ${setup.education === "SMK" ? `<label class="form-label" for="program-select">Program keahlian yang tersedia di sekolah *</label><select class="form-control" id="program-select"><option value="">Pilih program sekolah</option>${programs.map(program => `<option value="${program.id}" ${setup.programId === program.id ? "selected" : ""}>${escapeHtml(program.name)}</option>`).join("")}</select><label class="form-label" for="concentration-select">Konsentrasi keahlian${programNeedsConcentration("SMK", setup.grade, setup.programId) ? " *" : " (jika tersedia; opsional di kelas 10)"}</label><select class="form-control" id="concentration-select" ${setup.programId ? "" : "disabled"}><option value="">${programNeedsConcentration("SMK", setup.grade, setup.programId) ? "Pilih konsentrasi sesuai sekolah" : "Opsional / tidak ditetapkan"}</option>${(currentProgram?.concentrations || []).map(item => `<option value="${escapeHtml(item)}" ${setup.concentration === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select><div class="notice warning">Pilih hanya program dan konsentrasi yang diaktifkan sekolah. Contoh materi berstatus draf; kelas 10 menggunakan Dasar-Dasar Program Keahlian, sedangkan kelas 11–12 memiliki pemetaan terpisah.</div>` : ""}
      <div class="divider"></div><h2 class="step-title">Mata pelajaran untuk konteks ini</h2>
      <div class="subject-grid">${subjects.map(subject => `<button class="subject-card ${setup.subject === subject.name ? "selected" : ""}" data-action="subject" data-value="${escapeHtml(subject.name)}"><span class="subject-icon">${subject.iconImage ? `<img src="${escapeHtml(subject.iconImage)}" alt="" aria-hidden="true">` : subject.icon}</span><span><strong>${escapeHtml(subject.name)}</strong><small>${escapeHtml(subject.category)}${subject.optional ? " · pilihan sekolah" : ""} · ${subject.verificationStatus === "verified" ? "terverifikasi" : "belum diverifikasi"}</small></span></button>`).join("") || (setup.curriculum && setup.education === "SMK" && !setup.programId
        ? `<div class="empty-state"><strong>Pilih program keahlian yang benar-benar tersedia di sekolah</strong><p>Jika program belum tercantum, tambahkan dari pengelola katalog sekolah.</p><button class="button button-ghost" data-action="manage-curriculum">Kelola program sekolah</button></div>`
        : setup.curriculum
          ? `<div class="empty-state"><strong>Belum ada mata pelajaran yang diaktifkan</strong><p>Guru atau pengelola sekolah dapat mengaktifkan mata pelajaran di katalog lokal.</p></div>`
        : `<div class="empty-state curriculum-prompt"><strong>Pilih kurikulum sekolah untuk menampilkan mata pelajaran</strong><p>Pilih salah satu di sini—tidak perlu kembali ke bagian atas halaman.</p><div class="option-grid"><button class="choice-card" data-action="curriculum" data-value="merdeka"><strong>Kurikulum Merdeka</strong><small>Pilih jika digunakan sekolahmu</small></button><button class="choice-card" data-action="curriculum" data-value="k13"><strong>Kurikulum 2013 (K13)</strong><small>Pilih jika masih digunakan sekolahmu</small></button></div></div>`)}</div>
      <p class="muted-small">Fase SD: kelas 1–2 Fase A, 3–4 Fase B, 5–6 Fase C. Fase SMP: 7–9 Fase D. Fase SMA/SMK: 10 Fase E, 11–12 Fase F. Pemetaan fase ini belum menggantikan ATP/capaian sekolah.</p>
      <div class="divider"></div><h2 class="step-title">Pilih mode permainan</h2>
      <div class="mode-grid">${[
        ["practice", "📚 Latihan", "Berlatih dengan pembahasan setelah setiap soal."],
        ["challenge", "⚡ Tantangan", "Kejar skor dengan bonus kecepatan dan streak."],
        ["exam", "📝 Ujian", "Fokus pada ketepatan; pembahasan di akhir."]
      ].map(([mode, title, desc]) => `<button class="mode-card ${setup.mode === mode ? "selected" : ""}" data-action="mode" data-value="${mode}"><strong>${title}</strong><small>${desc}</small></button>`).join("")}</div>
      <div class="setting-grid">
        <div><label class="form-label" for="topic-select">Bab atau topik</label><select class="form-control" id="topic-select">${topics.map(item => `<option value="${escapeHtml(item)}" ${setup.topic === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></div>
        <div><label class="form-label" for="difficulty-select">Tingkat kesulitan</label><select class="form-control" id="difficulty-select">${["Campuran", "Mudah", "Sedang", "Sulit"].map(item => `<option ${setup.difficulty === item ? "selected" : ""}>${item}</option>`).join("")}</select></div>
        <div><label class="form-label" for="count-select">Jumlah soal</label><select class="form-control" id="count-select" ${pool.length ? "" : "disabled"}>${counts.map(item => `<option value="${item.value}" ${item.disabled ? "disabled" : ""} ${count === item.value ? "selected" : ""}>${item.label || `${item.value} soal`}${item.disabled ? " · soal tambahan diperlukan" : ""}</option>`).join("")}</select></div>
        <div><label class="form-label" for="duration-select">Waktu per soal</label><select class="form-control" id="duration-select">${[10, 15, 20, 30].map(item => `<option value="${item}" ${Number(setup.duration) === item ? "selected" : ""}>${item} detik</option>`).join("")}</select></div>
        <div><label class="form-label" for="order-select">Urutan soal</label><select class="form-control" id="order-select"><option value="acak" ${setup.order === "acak" ? "selected" : ""}>Acak</option><option value="urut" ${setup.order === "urut" ? "selected" : ""}>Berurutan</option></select></div>
      </div>
      <div class="setting-grid"><label class="form-label"><input type="checkbox" id="hints-checkbox" ${setup.hints ? "checked" : ""}> Tampilkan petunjuk</label><label class="form-label"><input type="checkbox" id="explanation-checkbox" ${setup.explanations ? "checked" : ""}> Tampilkan pembahasan</label></div>
      <label class="form-label"><input type="checkbox" id="unmapped-checkbox" ${setup.includeUnmapped ? "checked" : ""}> Izinkan bank/kuis lama yang belum dipetakan ke kurikulum dan kelas</label>
      ${pool.length ? `<div class="notice ${pool.length < 10 ? "warning" : "info"}">${pool.length} soal tersedia untuk ${escapeHtml(formatSubjectLabel)}${setup.topic !== "Semua topik" ? ` · topik ${escapeHtml(setup.topic)}` : ""}${setup.difficulty !== "Campuran" ? ` · ${escapeHtml(setup.difficulty)}` : ""}. Status materi: belum diverifikasi.</div>` : `<div class="notice warning">${allPool.length ? `Belum ada soal yang cocok dengan topik atau kesulitan ini. Pilih topik lain, pilih Campuran, atau tambahkan soal.` : `Belum ada soal untuk ${escapeHtml(formatSubjectLabel)} yang terpetakan ke ${escapeHtml(setup.curriculum || "kurikulum yang dipilih")} kelas ${escapeHtml(setup.grade)}. Tambahkan kuis untuk konteks ini${setup.includeUnmapped ? " atau periksa apakah materi lama cocok." : ""}.`}</div>`}
      <div class="notice info" style="margin-top:9px">${setup.mode === "exam" ? "Mode ujian: nilai akademik berdasarkan jawaban benar, tanpa bonus kecepatan. Pembahasan muncul setelah kuis selesai." : "Tantangan memakai bonus kecepatan; nilai akademik tetap dihitung dari akurasi jawaban."}</div>
    </div>
    <aside class="setup-aside"><div class="preview-cover">${selected?.icon || "🎯"}</div><div class="preview-meta"><span class="pill">${setup.education} · Kelas ${escapeHtml(setup.grade)}</span><span class="pill">${setup.curriculum ? (setup.curriculum === "k13" ? "Kurikulum 2013" : "Kurikulum Merdeka") : "Kurikulum belum dipilih"}</span><span class="pill">${setup.mode === "practice" ? "Latihan" : setup.mode === "exam" ? "Ujian" : "Tantangan"}</span></div>
      <h3 class="preview-title">${escapeHtml(formatSubjectLabel)}</h3><p class="preview-desc">${escapeHtml(selected?.description || "Pilih mata pelajaran untuk melihat ringkasan.")}. ${count || 0} soal dipilih dari ${pool.length} soal tersedia, ${setup.duration} detik per soal.</p>
      ${selected ? `<div class="notice info">Fase ${phaseFor(setup.education, setup.grade)} · ${escapeHtml(selected.category)} · ${escapeHtml(selected.verificationStatus || "unverified")}<br>Bab/materi: ${escapeHtml((selected.materials || []).join(", ") || "belum dipetakan")}<br>Tujuan/capaian: ${escapeHtml((selected.learningObjectives || []).join("; ") || "belum dicantumkan")}<br>Referensi: ${escapeHtml(selected.sourceReference || selected.sourceUrl || "belum dicantumkan")}</div>` : ""}
      ${selected?.category === "kejuruan" ? `<section class="notice warning" aria-label="Bahan bacaan kejuruan"><strong>Bahan bacaan · draf untuk ditinjau guru</strong><p style="white-space:pre-line;margin:7px 0 0">${escapeHtml(selected.learningContent || "Ringkasan belum ditambahkan. Guru atau pengelola dapat mengisinya melalui Kelola katalog sekolah.")}</p><small>Ringkasan ini merupakan bahan belajar awal, bukan pengganti modul, SOP, atau ATP sekolah.</small></section>` : ""}
      <div class="divider"></div><div class="muted-small">🎲 Pilihan jawaban dan urutan soal dapat diacak.<br>🏅 Raih XP dan kumpulkan lencana pencapaian.<br>💾 Progres disimpan di perangkat ini.</div>
      <button class="button button-primary button-full" data-action="begin" ${validSetup ? "" : "disabled"}>Mulai kuis <span>→</span></button>
      <button class="button button-ghost button-full" data-action="creator">Buat kuis sendiri</button>
      <p class="muted-small" style="margin:11px 0 0">${setup.education === "SMK" && (!setup.programId || (programNeedsConcentration("SMK", setup.grade, setup.programId) && !setup.concentration)) ? "Pilih program dan konsentrasi yang tersedia di sekolah untuk melanjutkan." : "Katalog sekolah tersimpan lokal; multiplayer real-time belum tersedia."}</p>
    </aside></div>`;
  state.settings.education = setup.education;
  state.settings.grade = setup.grade;
  state.settings.curriculum = setup.curriculum;
  state.settings.programId = setup.programId;
  state.settings.concentration = setup.concentration;
  saveState();
}

function getGamePool(subject = ui.setup.subject) {
  const questions = allAvailableQuestions(subject).map(q => ({
    ...q,
    source: q.source || (q.custom ? "custom" : "unmapped-sample")
  }));
  return questions.filter(q =>
    (ui.setup.difficulty === "Campuran" || q.difficulty === ui.setup.difficulty) &&
    (ui.setup.topic === "Semua topik" || q.topic === ui.setup.topic)
  );
}

function startGame(quizOverride = null, options = {}) {
  const customQuiz = quizOverride || state.quizzes.find(quiz => quiz.id === ui.selectedCustomId) || null;
  if (!customQuiz && !options.questions && (!ui.setup.curriculum || (ui.setup.education === "SMK" &&
    (!ui.setup.programId || (programNeedsConcentration("SMK", ui.setup.grade, ui.setup.programId) && !ui.setup.concentration))))) {
    showToast("Pilih kurikulum sekolah dan, untuk SMK, program keahlian terlebih dahulu.");
    return;
  }
  let pool = customQuiz ? customQuiz.questions.map(q => ({ ...q, topic: q.topic || customQuiz.title, sourceQuiz: customQuiz.title, custom: true })) : getGamePool();
  if (options.questions) pool = options.questions.map(q => ({ ...q }));
  if (!customQuiz && !options.questions && ui.setup.difficulty !== "Campuran") {
    const allSubjectQuestions = allAvailableQuestions(ui.setup.subject);
    if (!pool.length && allSubjectQuestions.length) {
      showToast(`Belum ada soal dengan tingkat kesulitan ${ui.setup.difficulty}. Pilih Campuran atau tambah soal.`);
      return;
    }
  }
  if (!pool.length) {
    showToast("Belum ada soal yang terpetakan ke mata pelajaran, kelas, dan kurikulum terpilih. Tambahkan atau impor kuis yang sesuai.");
    return;
  }
  const targetCount = options.questions ? pool.length : Math.min(Number(ui.setup.count) || 5, pool.length);
  if (!Number.isInteger(targetCount) || targetCount < 1 || ![10, 15, 20, 30].includes(Number(customQuiz?.duration || ui.setup.duration))) {
    showToast("Pengaturan kuis tidak valid. Periksa jumlah soal dan waktu per soal.");
    return;
  }
  const picked = ui.setup.order === "acak" || customQuiz || options.questions ? shuffle(pool).slice(0, targetCount) : pool.slice(0, targetCount);
  const deck = picked.map(shuffledQuestion);
  ui.game = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: customQuiz?.title || `${ui.setup.subject} · ${schoolLabel(ui.setup.education, ui.setup.grade)}`,
    subject: customQuiz?.subject || ui.setup.subject,
    education: customQuiz?.education || ui.setup.education,
    grade: customQuiz?.grade || ui.setup.grade,
    curriculum: customQuiz?.curriculum || ui.setup.curriculum,
    schoolYear: CURRICULUM_SCHOOL_YEAR,
    programId: customQuiz?.programId || ui.setup.programId,
    concentration: customQuiz?.concentration || ui.setup.concentration,
    mode: customQuiz ? (ui.setup.mode || "challenge") : ui.setup.mode,
    duration: Number(customQuiz?.duration || ui.setup.duration),
    difficulty: ui.setup.difficulty,
    questions: deck,
    hasUnmappedQuestions: picked.some(questionItem => questionItem.source === "unmapped-sample"),
    answers: [],
    index: 0,
    score: 0,
    streak: 0,
    fastestCorrect: 0,
    status: "ready",
    startedAt: Date.now(),
    questionStartedAt: 0,
    secondsLeft: Number(customQuiz?.duration || ui.setup.duration),
    answeredLocked: false,
    reviewOnly: Boolean(options.questions)
  };
  ui.lastResult = null;
  setView("game");
  runCountdown(3);
}

function runCountdown(number) {
  const view = $("#view-game");
  if (number <= 0) {
    renderQuestion();
    return;
  }
  if (ui.game) ui.game.status = "countdown";
  view.innerHTML = `<div class="countdown-screen"><div><div class="countdown-number">${number}</div><h2>Siapkan fokusmu!</h2><p class="muted-small">Kuis akan segera dimulai</p></div></div>`;
  if (state.settings.sound) beep(true);
  ui.countdownTimer = window.setTimeout(() => runCountdown(number - 1), 700);
}

function stopGameTimers() {
  if (ui.timerInterval) window.clearInterval(ui.timerInterval);
  if (ui.countdownTimer) window.clearTimeout(ui.countdownTimer);
  ui.timerInterval = null;
  ui.countdownTimer = null;
}

function currentQuestion() {
  return ui.game?.questions[ui.game.index] || null;
}

function renderQuestion() {
  const game = ui.game;
  if (!game) return;
  if (game.index >= game.questions.length) {
    finishGame();
    return;
  }
  stopGameTimers();
  const q = currentQuestion();
  if (!q) {
    finishGame();
    return;
  }
  game.answeredLocked = false;
  game.status = "active";
  game.questionStartedAt = Date.now();
  game.secondsLeft = game.duration;
  const progress = (game.index / game.questions.length) * 100;
  const answered = game.answers.filter(answer => answer.selected !== null).length;
  const showHints = ui.setup.hints && q.topic;
  $("#view-game").innerHTML = `<div class="game-wrap">
    <div class="game-topline"><button class="back-button" style="margin:0" data-action="confirm-exit">← Keluar</button><span>${escapeHtml(game.title)}</span><span class="game-score">⭐ ${game.score.toLocaleString("id-ID")} poin</span></div>
    ${game.hasUnmappedQuestions ? `<div class="notice warning" style="margin-bottom:12px">Kuis ini memuat contoh yang belum dipetakan ke kelas/kurikulum. Gunakan sebagai bahan latihan saja.</div>` : ""}
    <div class="game-progress" aria-label="Progres kuis"><span style="width:${progress}%"></span></div>
    <div class="question-card">
      <div class="question-overline"><span>SOAL ${game.index + 1} DARI ${game.questions.length} · ${escapeHtml(q.difficulty)} · Belum diverifikasi</span><span class="timer ${game.secondsLeft <= 5 ? "urgent" : ""}" id="question-timer"><span class="timer-ring">◷</span> ${game.secondsLeft} dtk</span></div>
      <h2 class="question-text">${escapeHtml(q.prompt)}</h2>
      ${showHints ? `<p class="muted-small">Topik: ${escapeHtml(q.topic)}</p>` : ""}
      <div class="answers-grid">${q.options.map((option, index) => `<button class="answer-option" data-action="answer" data-index="${index}"><span class="answer-letter">${choiceLetters[index]}</span><span>${escapeHtml(option.text)}</span></button>`).join("")}</div>
      <div id="answer-feedback"></div>
      <div class="game-bottom"><small>${answered} dijawab · ${game.questions.length - game.index - answered} tersisa</small><button class="button button-primary hidden" id="next-question" data-action="next-question">${game.index === game.questions.length - 1 ? "Lihat hasil" : "Soal berikutnya"} <span>→</span></button></div>
    </div></div>`;
  $("#question-timer").setAttribute("aria-live", "polite");
  ui.timerInterval = window.setInterval(tickTimer, 1000);
}

function tickTimer() {
  const game = ui.game;
  if (!game || game.answeredLocked) return;
  game.secondsLeft -= 1;
  const timer = $("#question-timer");
  if (timer) {
    timer.innerHTML = `<span class="timer-ring">◷</span> ${Math.max(0, game.secondsLeft)} dtk`;
    timer.classList.toggle("urgent", game.secondsLeft <= 5);
  }
  if (game.secondsLeft <= 0) submitAnswer(null, true);
}

function submitAnswer(optionIndex, timedOut = false) {
  const game = ui.game;
  const q = currentQuestion();
  if (!game || !q || game.answeredLocked) return;
  if (optionIndex !== null && (!Number.isInteger(optionIndex) || optionIndex < 0 || optionIndex >= q.options.length)) return;
  game.answeredLocked = true;
  game.status = "answered";
  if (ui.timerInterval) window.clearInterval(ui.timerInterval);
  ui.timerInterval = null;
  const elapsed = Math.min(game.duration, Math.max(0, (Date.now() - game.questionStartedAt) / 1000));
  const picked = optionIndex === null ? null : q.options[optionIndex];
  const isCorrect = Boolean(picked?.correct);
  const previousStreak = game.streak;
  game.streak = isCorrect ? previousStreak + 1 : 0;
  const remaining = Math.max(0, game.duration - elapsed);
  const speedBonus = isCorrect && game.mode === "challenge" ? Math.round(500 * (remaining / game.duration)) : 0;
  const streakBonus = isCorrect && game.mode === "challenge" && game.streak >= 3 ? Math.min(150, (game.streak - 2) * 50) : 0;
  const points = isCorrect ? 1000 + speedBonus + streakBonus : 0;
  game.score += points;
  const scoreLabel = $(".game-score");
  if (scoreLabel) scoreLabel.textContent = `⭐ ${game.score.toLocaleString("id-ID")} poin`;
  if (isCorrect && elapsed <= 5) game.fastestCorrect += 1;
  const response = { selected: picked?.text ?? null, correct: q.answer, isCorrect, elapsed: Math.round(elapsed * 10) / 10, points, speedBonus, streakBonus, explanation: q.explanation, prompt: q.prompt, topic: q.topic, learningObjective: q.learningObjective, sourceReference: q.sourceReference, options: q.options.map(option => option.text) };
  game.answers.push(response);
  game.status = "feedback";
  beep(isCorrect);
  const buttons = $$(".answer-option");
  buttons.forEach((button, index) => {
    const option = q.options[index];
    button.disabled = true;
    if (option.correct) button.classList.add("correct");
    else if (index === optionIndex) button.classList.add("incorrect");
    else button.classList.add("muted-answer");
  });
  const feedback = $("#answer-feedback");
  const next = $("#next-question");
  if (game.mode === "exam") {
    feedback.innerHTML = `<div class="feedback-box"><strong>${timedOut ? "Waktu habis, jawaban dikosongkan." : "Jawaban tersimpan."}</strong>Pembahasan akan ditampilkan setelah ujian selesai.</div>`;
  } else {
    const title = timedOut ? "Waktu habis!" : isCorrect ? "Benar! Hebat! 🎉" : "Belum tepat, tetap semangat!";
    const pointsLabel = points ? `+${points.toLocaleString("id-ID")} poin${streakBonus ? ` (termasuk bonus streak ${streakBonus})` : ""}. ` : "0 poin. ";
    feedback.innerHTML = `<div class="feedback-box ${isCorrect ? "correct" : "incorrect"}"><strong>${escapeHtml(title)} ${escapeHtml(pointsLabel)}</strong>Jawaban benar: <b>${escapeHtml(q.answer)}</b>. ${ui.setup.explanations ? escapeHtml(q.explanation) : ""}</div>`;
  }
  if (next) next.classList.remove("hidden");
  const bottom = $(".game-bottom small");
  if (bottom) bottom.textContent = `${game.answers.filter(answer => answer.selected !== null).length} dijawab · ${game.questions.length - game.index - 1} tersisa`;
  if (timedOut) showToast("Waktu habis — soal ini bernilai 0 poin.");
}

function advanceQuestion() {
  if (!ui.game?.answeredLocked || ui.game.status !== "feedback") return;
  ui.game.index += 1;
  renderQuestion();
}

function finishGame() {
  const game = ui.game;
  if (!game || game.status === "completed") return;
  game.status = "completed";
  stopGameTimers();
  const correct = game.answers.filter(answer => answer.isCorrect).length;
  const incorrect = game.answers.filter(answer => answer.selected !== null && !answer.isCorrect).length;
  const unanswered = game.questions.length - game.answers.filter(answer => answer.selected !== null).length;
  const accuracy = Math.round((correct / game.questions.length) * 100);
  const totalTime = Math.round((Date.now() - game.startedAt) / 1000);
  const completionBonus = unanswered === 0 ? 200 : 0;
  const score = game.score + completionBonus;
  const firstAnswer = state.player.totalAnswers === 0 && game.answers.some(answer => answer.selected !== null);
  const previousXp = state.player.xp;
  const previousLevel = currentLevel(previousXp);
  const xpEarned = (correct * 20) + 20 + (completionBonus > 0 ? 20 : 0);
  state.player.xp += xpEarned;
  state.player.games += 1;
  state.player.totalCorrect += correct;
  state.player.totalAnswers += game.answers.filter(answer => answer.selected !== null).length;
  const newlyEarned = [];
  const earn = badgeId => {
    if (!state.player.badges.includes(badgeId)) {
      state.player.badges.push(badgeId);
      newlyEarned.push(BADGES.find(badge => badge.id === badgeId));
    }
  };
  if (firstAnswer) earn("first");
  if (correct === game.questions.length && unanswered === 0) earn("perfect");
  if (game.fastestCorrect >= 3) earn("speed");
  if (state.player.games >= 10) earn("ten-games");
  if (accuracy >= 80) earn("expert");
  if (state.player.hasRetried) earn("comeback");
  const today = todayKey();
  if (state.daily.date !== today) state.daily = { date: today, done: false };
  let missionBonus = 0;
  if (!state.daily.done) {
    state.daily.done = true;
    state.player.xp += 40;
    missionBonus = 40;
  }
  const levelUp = currentLevel(state.player.xp) > previousLevel;
  const entry = {
    id: game.id,
    date: new Date().toISOString(),
    player: state.player.name,
    avatar: state.player.avatar,
    title: game.title,
    subject: game.subject,
    education: game.education,
    grade: game.grade,
    curriculum: game.curriculum || "",
    schoolYear: game.schoolYear || CURRICULUM_SCHOOL_YEAR,
    phase: phaseFor(game.education, game.grade),
    programId: game.programId || "",
    concentration: game.concentration || "",
    mode: game.mode,
    score,
    correct,
    incorrect,
    unanswered,
    accuracy,
    time: totalTime,
    questionCount: game.questions.length,
    level: currentLevel(state.player.xp) + 1
  };
  state.history.push(entry);
  state.history = state.history.slice(-100);
  ui.lastResult = { game, correct, incorrect, unanswered, accuracy, totalTime, completionBonus, score, xpEarned, missionBonus, newlyEarned, levelUp, entry, reviewVisible: true };
  saveState();
  renderResults();
  setView("results");
  if (accuracy >= 80) celebrate();
}

function celebrate() {
  const emojis = ["✨", "⭐", "🎉", "🌟", "🎊"];
  for (let index = 0; index < 18; index += 1) {
    const item = document.createElement("span");
    item.className = "confetti";
    item.textContent = emojis[index % emojis.length];
    item.style.left = `${Math.random() * 100}%`;
    item.style.animationDelay = `${Math.random() * 0.5}s`;
    document.body.append(item);
    window.setTimeout(() => item.remove(), 2300);
  }
}

function renderResults() {
  const result = ui.lastResult;
  if (!result) return;
  const { game, correct, incorrect, unanswered, accuracy, totalTime, completionBonus, score, xpEarned, missionBonus, newlyEarned, levelUp } = result;
  const recommendations = accuracy >= 80
    ? "Hebat! Kamu siap melanjutkan ke materi atau tingkat kesulitan berikutnya."
    : accuracy >= 50
      ? "Bagus, terus berlatih! Pelajari kembali soal yang belum tepat sebelum mencoba tingkat berikutnya."
      : "Jangan menyerah. Ulangi latihan dasar dan baca pembahasan untuk menguatkan pemahamanmu.";
  const reviews = game.answers.map((answer, index) => `<article class="review-item"><strong>${index + 1}. ${escapeHtml(answer.prompt)}</strong><p>Jawabanmu: <b>${answer.selected === null ? "Tidak dijawab" : escapeHtml(answer.selected)}</b><br>Jawaban benar: <b>${escapeHtml(answer.correct)}</b></p><span class="review-status ${answer.isCorrect ? "good" : "bad"}">${answer.isCorrect ? `✓ Benar · +${answer.points} poin` : answer.selected === null ? "○ Tidak dijawab · 0 poin" : "× Belum tepat · 0 poin"}</span>${result.reviewVisible ? `<p>${escapeHtml(answer.explanation)}${answer.learningObjective ? `<br>Tujuan: ${escapeHtml(answer.learningObjective)}` : ""}${answer.sourceReference ? `<br>Referensi: ${escapeHtml(answer.sourceReference)}` : ""}</p>` : ""}</article>`).join("");
  const earned = newlyEarned.length ? newlyEarned.map(badge => `${badge.icon} ${escapeHtml(badge.name)}`).join(" · ") : "Lanjutkan belajar untuk membuka lencana baru.";
  $("#view-results").innerHTML = `<div class="screen-heading"><div><p class="section-kicker">HASIL PERMAINAN</p><h1>Kerja bagus, ${escapeHtml(state.player.name)}!</h1><p>${escapeHtml(game.title)} · ${game.mode === "exam" ? "Ujian" : game.mode === "practice" ? "Latihan" : "Tantangan"} · ${escapeHtml(game.curriculum === "k13" ? "Kurikulum 2013" : game.curriculum === "merdeka" ? "Kurikulum Merdeka" : "Kurikulum belum dipetakan")} · Fase ${phaseFor(game.education, game.grade)}</p></div><button class="button button-ghost" data-action="home">Beranda</button></div>
    <div class="result-hero"><div class="result-copy"><span class="pill">${escapeHtml(LEVELS[currentLevel()].name)} · Level ${currentLevel() + 1}</span><h1>${accuracy >= 80 ? "Luar biasa! 🎉" : accuracy >= 50 ? "Terus berkembang! 🌱" : "Setiap latihan berarti 💪"}</h1><p>${correct} benar dari ${game.questions.length} soal · selesai dalam ${formatTime(totalTime)}</p></div><div class="result-score"><div><strong>${accuracy}</strong><span>Nilai / 100</span></div></div></div>
    <div class="results-stats"><div class="result-stat"><span>⭐</span><strong>${score.toLocaleString("id-ID")}</strong><small>Total poin${completionBonus ? " (termasuk bonus selesai)" : ""}</small></div><div class="result-stat"><span>✅</span><strong>${correct} benar</strong><small>${incorrect} salah · ${unanswered} kosong</small></div><div class="result-stat"><span>⚡</span><strong>+${xpEarned + missionBonus} XP</strong><small>${missionBonus ? "Termasuk bonus misi harian" : "XP dari kuis"}</small></div><div class="result-stat"><span>⏱️</span><strong>${formatTime(totalTime)}</strong><small>Waktu penyelesaian</small></div></div>
    ${levelUp ? `<div class="notice info" style="margin-bottom:13px">🎉 Level naik! Kamu sekarang ${escapeHtml(LEVELS[currentLevel()].name)} · Level ${currentLevel() + 1}.</div>` : ""}
    <div class="results-grid"><section class="panel"><div class="panel-heading"><div><p class="section-kicker">ANALISIS BELAJAR</p><h3>Pembahasan soal</h3></div><button class="subtle-button" data-action="toggle-review">${result.reviewVisible ? "Sembunyikan" : "Lihat pembahasan"}</button></div><div class="review-list">${reviews}</div></section>
      <aside><section class="panel"><div class="panel-heading"><div><p class="section-kicker">LANGKAH BERIKUTNYA</p><h3>Rekomendasi belajar</h3></div></div><div class="recommendation">${recommendations}</div><div class="divider"></div><p class="muted-small">XP dari kuis: +${xpEarned}. Misi harian: +${missionBonus}. ${game.mode === "exam" ? "Mode ujian tidak menggunakan bonus kecepatan." : "Bonus kecepatan hanya memengaruhi poin, bukan nilai akademik."}</p></section>
      <section class="panel" style="margin-top:13px"><div class="panel-heading"><div><p class="section-kicker">PENCAPAIAN</p><h3>Lencana baru</h3></div></div><p class="muted-small">${earned}</p><div class="divider"></div><p class="muted-small">Pemain: ${state.player.avatar} ${escapeHtml(state.player.name)} · ${escapeHtml(LEVELS[currentLevel()].name)}</p></section></aside></div>
    <div class="result-actions"><button class="button button-primary" data-action="play-again">Main lagi ↻</button>${incorrect + unanswered ? `<button class="button button-ghost" data-action="retry-wrong">Ulangi soal yang belum tepat</button>` : ""}<button class="button button-ghost" data-action="setup">Ganti mata pelajaran</button><button class="button button-ghost" data-action="leaderboard">Papan peringkat</button></div>
    <p class="muted-small" style="margin-top:13px">Papan peringkat dan hasil tersimpan hanya di perangkat ini. Nilai = jawaban benar ÷ jumlah soal × 100.</p>`;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes} m ${remainder} dtk` : `${remainder} dtk`;
}

function retryWrongAnswers() {
  if (!ui.lastResult) return;
  const game = ui.lastResult.game;
  const wrong = game.questions.filter((_, index) => !game.answers[index]?.isCorrect);
  if (!wrong.length) {
    showToast("Semua jawaban sudah benar. Tidak ada soal untuk diulang.");
    return;
  }
  state.player.hasRetried = true;
  saveState();
  ui.setup.mode = "practice";
  startGame(null, { questions: wrong });
}

function renderLeaderboard() {
  const periods = ["Hari ini", "Minggu ini", "Bulan ini", "Semua waktu"];
  const now = Date.now();
  const entries = state.history.filter(item => {
    if (ui.leaderboardSubject !== "Semua mata pelajaran" && item.subject !== ui.leaderboardSubject) return false;
    const modeMap = { "Latihan": "practice", "Tantangan": "challenge", "Ujian": "exam" };
    if (ui.leaderboardMode !== "Semua mode" && item.mode !== modeMap[ui.leaderboardMode]) return false;
    if (ui.leaderboardClass !== "Semua kelas" && `${item.education} kelas ${item.grade}` !== ui.leaderboardClass) return false;
    if (ui.leaderboardPeriod === "Semua waktu") return true;
    const timestamp = Date.parse(item.date);
    if (!Number.isFinite(timestamp)) return false;
    const date = new Date(now);
    let start;
    if (ui.leaderboardPeriod === "Hari ini") start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    else if (ui.leaderboardPeriod === "Minggu ini") {
      const mondayOffset = (date.getDay() + 6) % 7;
      start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - mondayOffset).getTime();
    } else start = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
    return timestamp >= start;
  }).sort((a, b) => b.score - a.score || b.correct - a.correct || a.time - b.time).slice(0, 30);
  const subjects = ["Semua mata pelajaran", ...new Set(state.history.map(item => item.subject).filter(Boolean))];
  const classes = ["Semua kelas", ...new Set(state.history.map(item => `${item.education} kelas ${item.grade}`).filter(value => !value.includes("undefined")))];
  $("#view-leaderboard").innerHTML = `<button class="back-button" data-action="home">← Kembali ke beranda</button><div class="screen-heading"><div><p class="section-kicker">PENCAPAIAN LOKAL</p><h1>Papan peringkat</h1><p>Bandingkan hasil kuis yang tersimpan pada perangkat ini.</p></div><span class="pill">💾 Perangkat ini</span></div>
    <div class="notice warning">Peringkat hanya berlaku di perangkat ini. Tidak ada akun atau server, jadi skor bukan peringkat global. Nama yang tampil adalah nama panggilan.</div>
    <div class="leader-filters">${periods.map(period => `<button class="filter-button ${ui.leaderboardPeriod === period ? "selected" : ""}" data-action="leader-period" data-value="${period}">${period}</button>`)}</div>
    <div class="panel"><div class="panel-heading"><div><p class="section-kicker">${ui.leaderboardPeriod.toUpperCase()}</p><h3>Para pejuang ilmu</h3></div><div style="display:flex;gap:7px;flex-wrap:wrap"><select class="form-control" id="leader-mode" aria-label="Filter mode permainan" style="width:auto">${["Semua mode", "Latihan", "Tantangan", "Ujian"].map(mode => `<option ${ui.leaderboardMode === mode ? "selected" : ""}>${mode}</option>`).join("")}</select><select class="form-control" id="leader-subject" aria-label="Filter mata pelajaran" style="width:auto">${subjects.map(subject => `<option ${ui.leaderboardSubject === subject ? "selected" : ""}>${escapeHtml(subject)}</option>`).join("")}</select><select class="form-control" id="leader-class" aria-label="Filter kelas" style="width:auto">${classes.map(item => `<option ${ui.leaderboardClass === item ? "selected" : ""}>${escapeHtml(item)}</option>`).join("")}</select></div></div>
      ${entries.length ? `<div class="table-wrap"><table class="leader-table"><thead><tr><th>PERINGKAT</th><th>PEMAIN</th><th>KELAS</th><th>MATA PELAJARAN</th><th>BENAR</th><th>SKOR</th></tr></thead><tbody>${entries.map((item, index) => `<tr><td class="rank-number">${index < 3 ? ["🥇", "🥈", "🥉"][index] : `#${index + 1}`}</td><td><div class="rank-player">${avatarMarkup(item.avatar, "rank-avatar")}<span><span class="rank-name">${escapeHtml(item.player || "Pemain")}</span><span class="rank-level">Level ${item.level || 1} · ${escapeHtml(item.mode === "exam" ? "Ujian" : item.mode === "practice" ? "Latihan" : "Tantangan")}</span></span></div></td><td>${escapeHtml(item.education)} · ${escapeHtml(item.grade)}</td><td>${escapeHtml(item.subject || "Kuis")}</td><td>${item.correct}/${item.questionCount}</td><td><b>${Number(item.score || 0).toLocaleString("id-ID")}</b></td></tr>`).join("")}</tbody></table></div>` : `<div class="empty-state"><span class="empty-icon">🏆</span><strong>Belum ada skor tersimpan</strong><p>Selesaikan kuis untuk mengisi papan peringkat lokal.</p><button class="button button-primary" data-action="start">Mulai kuis</button></div>`}</div>`;
  setView("leaderboard");
}

function showProfile() {
  const modal = $("#modal-root");
  modal.innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="profile-title"><h2 id="profile-title">Profil pemain</h2><p>Nama panggilan dan avatar ditampilkan di papan peringkat perangkat ini.</p><label class="form-label" for="player-name">Nama panggilan</label><input class="form-control" id="player-name" maxlength="18" value="${escapeHtml(state.player.name)}" placeholder="Contoh: BintangIlmu"><label class="form-label">Pilih avatar</label><div class="avatar-grid">${AVATARS.map(avatar => `<button class="avatar-choice ${avatar.id === avatarFor(state.player.avatar).id ? "selected" : ""}" data-action="avatar" data-value="${avatar.id}" aria-label="Pilih avatar ${avatar.name}"><img src="${avatar.src}" alt="${avatar.name}" loading="lazy"></button>`).join("")}</div><p class="muted-small" style="margin-top:11px">Jangan gunakan nama lengkap atau informasi pribadi.</p><div class="modal-actions"><button class="button button-ghost" data-action="close-modal">Batal</button><button class="button button-primary" data-action="save-profile">Simpan profil</button></div></div></div>`;
  $("#player-name").focus();
}

function renderHelp() {
  $("#view-help").innerHTML = `<button class="back-button" data-action="home">← Kembali ke beranda</button><div class="screen-heading"><div><p class="section-kicker">MULAI PETUALANGAN</p><h1>Petunjuk permainan</h1><p>Belajar dengan santai, kumpulkan poin, dan temukan hal baru.</p></div></div>
    <div class="help-grid"><article class="help-card"><span>🎯</span><h3>1. Pilih kelas dan mapel</h3><p>Tentukan jenjang SD, SMP, SMA, atau SMK, lalu pilih kelas dan mata pelajaran. Pilihan akan menentukan kumpulan soal contoh yang tersedia.</p></article>
    <article class="help-card"><span>🕹️</span><h3>2. Pilih mode bermain</h3><p>Latihan menampilkan pembahasan langsung. Tantangan memberi bonus kecepatan dan streak. Ujian menyimpan pembahasan sampai semua soal selesai.</p></article>
    <article class="help-card"><span>⭐</span><h3>3. Kumpulkan poin dan XP</h3><p>Jawaban benar bernilai 1.000 poin. Tantangan menambah bonus kecepatan maksimal 500 dan bonus streak terbatas. Ujian tidak memberi bonus kecepatan.</p></article>
    <article class="help-card"><span>📈</span><h3>4. Naikkan levelmu</h3><p>Jawaban benar dan kuis selesai memberi XP. Buka lencana dengan pencapaian nyata, seperti menjawab semua soal dengan benar atau menjawab cepat.</p></article>
    <article class="help-card"><span>✍️</span><h3>5. Buat kuis sendiri</h3><p>Tambahkan soal dengan empat opsi, satu kunci jawaban, dan pembahasan. Kuis dapat diedit, dihapus, dimainkan, atau dicadangkan melalui JSON.</p></article>
    <article class="help-card"><span>💾</span><h3>Privasi dan penyimpanan</h3><p>Profil, hasil, lencana, dan kuis tersimpan lokal di perangkat ini. Papan peringkat bukan global. Hindari memakai nama lengkap atau informasi pribadi.</p></article>
    <article class="help-card"><span>🌐</span><h3>Multiplayer</h3><p>Ruang permainan dengan kode dan pertandingan real-time memerlukan server yang tidak disediakan versi web mandiri ini. Fitur tersebut belum tersedia dan tidak ditampilkan seolah-olah aktif.</p></article>
    <article class="help-card"><span>📘</span><h3>Tentang soal contoh</h3><p>Bank soal bawaan berisi contoh untuk mencoba permainan, bukan bank lengkap atau kurikulum resmi yang telah diverifikasi. Gunakan editor untuk menambahkan materi yang sesuai dengan pembelajaranmu.</p></article></div>
    <section class="panel" style="margin-top:14px"><div class="panel-heading"><div><p class="section-kicker">RINGKASAN SKOR</p><h3>Cara poin dihitung</h3></div></div><table class="score-table"><tr><td>Jawaban benar</td><td>1.000 poin</td></tr><tr><td>Bonus kecepatan (tantangan)</td><td>maks. 500 poin</td></tr><tr><td>Bonus streak (tantangan)</td><td>maks. 150 poin/soal</td></tr><tr><td>Jawaban salah / kosong</td><td>0 poin</td></tr><tr><td>Selesaikan semua soal</td><td>+200 poin</td></tr><tr><td>Nilai akademik</td><td>Benar ÷ seluruh soal × 100</td></tr></table></section>
    <button class="button button-primary" style="margin-top:14px" data-action="start">Siap bermain? Mulai sekarang →</button>`;
  setView("help");
}

function freshEditorDraft() {
  const education = ui.setup.education || "SD";
  const grade = ui.setup.grade || "6";
  const curriculum = ui.setup.curriculum || "";
  const programId = ui.setup.programId || "";
  const subjects = subjectsFor(education, grade, curriculum, programId, ui.setup.concentration);
  return {
    title: "",
    description: "",
    education,
    grade,
    curriculum,
    programId,
    concentration: ui.setup.concentration || "",
    subject: subjects.some(subject => subject.name === ui.setup.subject)
      ? ui.setup.subject
      : subjects[0]?.name || "",
    duration: 20,
    questions: [{ topic: "", difficulty: "Sedang", prompt: "", options: ["", "", "", ""], answer: "", explanation: "", learningObjective: "", sourceReference: "" }]
  };
}

function renderEditorQuestion(item, index) {
  const safeItem = item || { topic: "", difficulty: "Sedang", prompt: "", options: ["", "", "", ""], answer: "", explanation: "", learningObjective: "", sourceReference: "" };
  return `<div class="question-editor">
    <div class="question-editor-head"><strong>Soal ${index + 1}</strong><span class="question-editor-tools"><button class="remove-question move-question" data-action="move-question" data-direction="up" data-index="${index}" aria-label="Pindahkan soal ke atas" ${index === 0 ? "disabled" : ""}>↑</button><button class="remove-question move-question" data-action="move-question" data-direction="down" data-index="${index}" aria-label="Pindahkan soal ke bawah" ${index === ui.editorDraft.questions.length - 1 ? "disabled" : ""}>↓</button><button class="remove-question" data-action="remove-question" data-index="${index}" aria-label="Hapus soal ${index + 1}" ${ui.editorDraft.questions.length === 1 ? "disabled" : ""}>×</button></span></div>
    <label class="form-label" for="q-prompt-${index}">Pertanyaan</label><textarea class="form-control" id="q-prompt-${index}" rows="2" maxlength="500" data-editor-field="prompt" data-index="${index}" placeholder="Tulis pertanyaan yang jelas...">${escapeHtml(safeItem.prompt)}</textarea>
    <div class="editor-options" style="margin-top:8px">${safeItem.options.map((option, optionIndex) => `<div class="editor-option"><span class="answer-letter">${choiceLetters[optionIndex]}</span><input class="form-control" type="text" maxlength="180" data-editor-field="option" data-index="${index}" data-option="${optionIndex}" value="${escapeHtml(option)}" placeholder="Pilihan ${choiceLetters[optionIndex]}"></div>`).join("")}</div>
    <div class="setting-grid"><div><label class="form-label" for="q-answer-${index}">Kunci jawaban</label><select class="form-control" id="q-answer-${index}" data-editor-field="answer" data-index="${index}"><option value="" disabled ${safeItem.answer && safeItem.options.includes(safeItem.answer) ? "" : "selected"}>Pilih jawaban benar</option>${safeItem.options.map((option, optionIndex) => `<option value="${optionIndex}" ${safeItem.answer && safeItem.answer === option ? "selected" : ""}>${choiceLetters[optionIndex]}${option.trim() ? ` · ${escapeHtml(option.trim().slice(0, 35))}` : ""}</option>`).join("")}</select></div><div><label class="form-label" for="q-difficulty-${index}">Kesulitan</label><select class="form-control" id="q-difficulty-${index}" data-editor-field="difficulty" data-index="${index}">${["Mudah", "Sedang", "Sulit"].map(difficulty => `<option ${safeItem.difficulty === difficulty ? "selected" : ""}>${difficulty}</option>`).join("")}</select></div></div>
    <div class="setting-grid"><div><label class="form-label" for="q-topic-${index}">Bab/materi *</label><input class="form-control" id="q-topic-${index}" type="text" maxlength="70" data-editor-field="topic" data-index="${index}" value="${escapeHtml(safeItem.topic)}" placeholder="Contoh: Pecahan"></div><div><label class="form-label" for="q-objective-${index}">Tujuan pembelajaran (opsional)</label><input class="form-control" id="q-objective-${index}" type="text" maxlength="240" data-editor-field="learningObjective" data-index="${index}" value="${escapeHtml(safeItem.learningObjective || "")}" placeholder="Tujuan/capaian yang dirujuk"></div></div>
    <div class="setting-grid"><div><label class="form-label" for="q-explanation-${index}">Pembahasan *</label><input class="form-control" id="q-explanation-${index}" type="text" maxlength="400" data-editor-field="explanation" data-index="${index}" value="${escapeHtml(safeItem.explanation)}" placeholder="Mengapa jawaban ini benar?"></div><div><label class="form-label" for="q-reference-${index}">Referensi materi (opsional)</label><input class="form-control" id="q-reference-${index}" type="text" maxlength="300" data-editor-field="sourceReference" data-index="${index}" value="${escapeHtml(safeItem.sourceReference || "")}" placeholder="URL/buku/ATP"></div></div>
  </div>`;
}

function renderCreator() {
  if (!ui.editorDraft) ui.editorDraft = freshEditorDraft();
  const draft = ui.editorDraft;
  const subjects = subjectsFor(draft.education, draft.grade, draft.curriculum, draft.programId, draft.concentration);
  const editorPrograms = schoolPrograms().filter(program => state.schoolCatalog.enabledProgramIds.includes(program.id));
  const editorProgram = editorPrograms.find(program => program.id === draft.programId);
  if (!subjects.some(subject => subject.name === draft.subject)) draft.subject = subjects[0]?.name || "";
  $("#view-creator").innerHTML = `<button class="back-button" data-action="home">← Kembali ke beranda</button><div class="screen-heading"><div><p class="section-kicker">KREASIKAN MATERI BELAJARMU</p><h1>${ui.editorQuizId ? "Edit kuis" : "Buat kuis sendiri"}</h1><p>Susun soal pilihan ganda dan simpan di perangkat ini.</p></div><button class="button button-ghost" data-action="export-all">Ekspor JSON ↓</button></div>
    <div class="creator-layout"><div class="creator-card">
      <label class="form-label" for="quiz-title">Judul kuis *</label><input class="form-control" id="quiz-title" maxlength="70" value="${escapeHtml(draft.title)}" placeholder="Contoh: Petualangan Pecahan">
      <label class="form-label" for="quiz-description">Deskripsi (opsional)</label><textarea class="form-control" id="quiz-description" rows="2" maxlength="240" placeholder="Ceritakan materi yang akan dipelajari">${escapeHtml(draft.description)}</textarea>
      <div class="setting-grid"><div><label class="form-label" for="quiz-education">Jenjang pendidikan *</label><select class="form-control" id="quiz-education">${["SD", "SMP", "SMA", "SMK"].map(education => `<option ${draft.education === education ? "selected" : ""}>${education}</option>`).join("")}</select></div>
      <div><label class="form-label" for="quiz-grade">Kelas *</label><select class="form-control" id="quiz-grade">${classesFor(draft.education).map(grade => `<option value="${grade}" ${draft.grade === grade ? "selected" : ""}>Kelas ${grade}</option>`).join("")}</select></div>
      <div><label class="form-label" for="quiz-curriculum">Kurikulum *</label><select class="form-control" id="quiz-curriculum"><option value="">Pilih kurikulum sekolah</option><option value="merdeka" ${draft.curriculum === "merdeka" ? "selected" : ""}>Kurikulum Merdeka</option><option value="k13" ${draft.curriculum === "k13" ? "selected" : ""}>Kurikulum 2013</option></select></div>
      <div><label class="form-label" for="quiz-subject">Mata pelajaran *</label><select class="form-control" id="quiz-subject" ${subjects.length ? "" : "disabled"}><option value="">Pilih mata pelajaran yang tersedia</option>${subjects.map(subject => `<option value="${escapeHtml(subject.name)}" ${draft.subject === subject.name ? "selected" : ""}>${escapeHtml(subject.name)} · ${escapeHtml(subject.category)}</option>`).join("")}</select></div>
      ${draft.education === "SMK" ? `<div><label class="form-label" for="quiz-program">Program keahlian</label><select class="form-control" id="quiz-program"><option value="">Pilih program sekolah yang aktif</option>${editorPrograms.map(program => `<option value="${program.id}" ${draft.programId === program.id ? "selected" : ""}>${escapeHtml(program.name)}</option>`).join("")}</select></div><div><label class="form-label" for="quiz-concentration">Konsentrasi keahlian${programNeedsConcentration("SMK", draft.grade, draft.programId) ? " *" : " (opsional jika belum ditetapkan)"}</label><select class="form-control" id="quiz-concentration"><option value="">${programNeedsConcentration("SMK", draft.grade, draft.programId) ? "Pilih konsentrasi sekolah" : "Tidak ditetapkan / opsional kelas 10"}</option>${(editorProgram?.concentrations || []).map(concentration => `<option value="${escapeHtml(concentration)}" ${draft.concentration === concentration ? "selected" : ""}>${escapeHtml(concentration)}</option>`).join("")}</select><small class="muted-small">Konsentrasi dan daftar program perlu dikonfirmasi oleh sekolah. Materi kejuruan berstatus draf.</small></div>` : ""}
      <div><label class="form-label" for="quiz-duration">Waktu per soal</label><select class="form-control" id="quiz-duration">${[10, 15, 20, 30].map(duration => `<option value="${duration}" ${Number(draft.duration) === duration ? "selected" : ""}>${duration} detik</option>`).join("")}</select></div></div>
      <div class="divider"></div><div class="panel-heading"><div><p class="section-kicker">EDITOR SOAL</p><h3>Empat pilihan · satu jawaban benar</h3></div><span class="pill">${draft.questions.length} soal</span></div>
      <div id="editor-question-list">${draft.questions.map(renderEditorQuestion).join("")}</div>
      <button class="button button-ghost" style="margin-top:11px" data-action="add-question">＋ Tambah soal</button>
      <div class="notice info" style="margin-top:13px">Validasi memastikan pertanyaan dan empat opsi terisi serta unik, dengan satu kunci jawaban yang tersedia. Soal buatanmu disimpan secara lokal.</div>
      <div class="result-actions"><button class="button button-primary" data-action="save-quiz">Simpan kuis</button><button class="button button-ghost" data-action="save-play">Simpan &amp; mainkan</button><button class="button button-ghost" data-action="preview-quiz">Pratinjau</button><button class="button button-ghost" data-action="reset-editor">Kuis baru</button><label class="button button-ghost" for="import-file">Impor JSON ↑</label><input id="import-file" type="file" accept="application/json,.json" class="hidden"></div>
    </div>
    <aside class="creator-card"><div class="panel-heading"><div><p class="section-kicker">KOLEKSI PRIBADIMU</p><h3>Kuis tersimpan</h3></div><span class="pill">${state.quizzes.length}</span></div><p class="muted-small">Kuis memuat konteks kelas/kurikulum. Materi tanpa pemetaan eksplisit tidak akan masuk bank kelas kecuali dipilih sebagai kuis lama yang belum dipetakan.</p>
      <div class="creator-saved">${state.quizzes.length ? state.quizzes.map(quiz => `<article class="saved-quiz"><strong>${escapeHtml(quiz.title)}</strong><small>${escapeHtml(quiz.subject)} · ${quiz.education} kelas ${escapeHtml(quiz.grade)} · ${escapeHtml(quiz.curriculum === "k13" ? "K13" : quiz.curriculum === "merdeka" ? "Merdeka" : "Belum dipetakan")} · ${quiz.questions.length} soal</small><div class="saved-actions"><button data-action="play-quiz" data-id="${escapeHtml(quiz.id)}">Mainkan</button><button data-action="edit-quiz" data-id="${escapeHtml(quiz.id)}">Edit</button><button data-action="duplicate-quiz" data-id="${escapeHtml(quiz.id)}">Salin</button><button data-action="export-quiz" data-id="${escapeHtml(quiz.id)}">Ekspor</button><button class="delete" data-action="delete-quiz" data-id="${escapeHtml(quiz.id)}">Hapus</button></div></article>`).join("") : `<div class="empty-state"><span class="empty-icon">✍️</span><strong>Belum ada kuis</strong><p>Kuis yang disimpan akan muncul di sini.</p></div>`}</div>
    </aside></div>`;
}

function draftFromForm() {
  const draft = ui.editorDraft;
  draft.title = $("#quiz-title").value.trim();
  draft.description = $("#quiz-description").value.trim();
  draft.education = $("#quiz-education").value;
  draft.grade = $("#quiz-grade").value;
  draft.curriculum = $("#quiz-curriculum").value;
  draft.subject = $("#quiz-subject").value;
  draft.programId = $("#quiz-program")?.value || "";
  draft.concentration = $("#quiz-concentration")?.value.trim() || "";
  draft.duration = Number($("#quiz-duration").value);
  return draft;
}

function validateDraft() {
  const draft = draftFromForm();
  const title = $("#quiz-title");
  if (!draft.title) {
    title.focus();
    showToast("Isi judul kuis terlebih dahulu.");
    return false;
  }
  if (!draft.curriculum || !subjectsFor(draft.education, draft.grade, draft.curriculum, draft.programId, draft.concentration).some(subject => subject.name === draft.subject)) {
    showToast("Pilih kurikulum dan mata pelajaran yang tersedia untuk jenjang serta kelas ini.");
    $("#quiz-curriculum").focus();
    return false;
  }
  if (draft.education === "SMK" &&
    (!state.schoolCatalog.enabledProgramIds.includes(draft.programId) ||
      !validProgramConcentration(draft.programId, draft.concentration) ||
      (programNeedsConcentration("SMK", draft.grade, draft.programId) && !draft.concentration))) {
    showToast("Pilih program sekolah yang aktif dan konsentrasi jika diwajibkan untuk kelas tersebut.");
    $("#quiz-program").focus();
    return false;
  }
  if (!draft.questions.length) {
    showToast("Tambahkan setidaknya satu soal.");
    return false;
  }
  for (let index = 0; index < draft.questions.length; index += 1) {
    const q = draft.questions[index];
    const normalized = normalizeQuestion(q);
    if (!normalized || typeof q.topic !== "string" || !q.topic.trim() || typeof q.explanation !== "string" || !q.explanation.trim()) {
      showToast(`Periksa soal ${index + 1}: isi pertanyaan, bab/materi, pembahasan, empat pilihan berbeda, dan kunci jawaban.`);
      const prompt = $(`[data-editor-field="prompt"][data-index="${index}"]`);
      if (prompt) prompt.focus();
      return false;
    }
  }
  if (hasDuplicatePrompts(draft.questions)) {
    showToast("Ada pertanyaan duplikat. Pastikan setiap soal dalam kuis berbeda.");
    return false;
  }
  return true;
}

function previewQuiz() {
  if (!validateDraft()) return;
  const draft = draftFromForm();
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal preview-modal" role="dialog" aria-modal="true" aria-labelledby="preview-title"><h2 id="preview-title">${escapeHtml(draft.title)}</h2><p>${escapeHtml(draft.education)} kelas ${escapeHtml(draft.grade)} · ${escapeHtml(draft.subject)} · ${draft.questions.length} soal</p><div class="preview-question-list">${draft.questions.map((questionItem, index) => `<article class="review-item"><strong>${index + 1}. ${escapeHtml(questionItem.prompt)}</strong><p>${questionItem.options.map((option, optionIndex) => `${choiceLetters[optionIndex]}. ${escapeHtml(option)}${option === questionItem.answer ? " ✓" : ""}`).join("<br>")}</p>${questionItem.explanation ? `<p>${escapeHtml(questionItem.explanation)}</p>` : ""}</article>`).join("")}</div><div class="modal-actions"><button class="button button-primary" data-action="close-modal">Kembali ke editor</button></div></div></div>`;
}

function saveQuiz(playAfterSave = false) {
  if (!validateDraft()) return;
  const draft = draftFromForm();
  const normalizedQuiz = {
    id: ui.editorQuizId || `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: draft.title,
    description: draft.description,
    education: draft.education,
    grade: String(draft.grade),
    curriculum: draft.curriculum,
    schoolYear: CURRICULUM_SCHOOL_YEAR,
    phase: phaseFor(draft.education, draft.grade),
    programId: draft.programId,
    concentration: draft.concentration,
    subject: draft.subject,
    subjectCategory: subjectsFor(draft.education, draft.grade, draft.curriculum, draft.programId, draft.concentration).find(subject => subject.name === draft.subject)?.category || "",
    subjectVerificationStatus: subjectsFor(draft.education, draft.grade, draft.curriculum, draft.programId, draft.concentration).find(subject => subject.name === draft.subject)?.verificationStatus || "unverified",
    duration: draft.duration,
    questions: draft.questions.map(questionItem => normalizeQuestion(questionItem))
  };
  const index = state.quizzes.findIndex(quiz => quiz.id === normalizedQuiz.id);
  if (index >= 0) state.quizzes[index] = normalizedQuiz;
  else state.quizzes.unshift(normalizedQuiz);
  ui.editorQuizId = normalizedQuiz.id;
  ui.setup.education = normalizedQuiz.education;
  ui.setup.grade = normalizedQuiz.grade;
  ui.setup.curriculum = normalizedQuiz.curriculum;
  ui.setup.programId = normalizedQuiz.programId;
  ui.setup.concentration = normalizedQuiz.concentration;
  ui.setup.subject = normalizedQuiz.subject;
  ui.setup.duration = normalizedQuiz.duration;
  saveState();
  showToast("Kuis tersimpan di perangkat ini.");
  if (playAfterSave) {
    ui.setup.mode = "challenge";
    startGame(normalizedQuiz);
  } else {
    renderCreator();
  }
}

function importQuizzes(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      const input = Array.isArray(parsed) ? parsed : [parsed];
      const imported = [];
      for (const candidate of input) {
        if (!candidate || typeof candidate.title !== "string" || !Array.isArray(candidate.questions) || candidate.questions.length === 0) throw new Error("Setiap kuis harus memiliki judul dan setidaknya satu soal.");
        const education = ["SD", "SMP", "SMA", "SMK"].includes(candidate.education) ? candidate.education : "SD";
        const curriculum = ["merdeka", "k13"].includes(candidate.curriculum) ? candidate.curriculum : "";
        const grade = classesFor(education).includes(String(candidate.grade)) ? String(candidate.grade) : classesFor(education)[0];
        const programId = education === "SMK" && schoolPrograms().some(program => program.id === candidate.programId && state.schoolCatalog.enabledProgramIds.includes(program.id)) ? candidate.programId : "";
        const concentration = String(candidate.concentration || "").trim().slice(0, 80);
        if (curriculum && education === "SMK" &&
          (!programId || !validProgramConcentration(programId, concentration) || (programNeedsConcentration("SMK", grade, programId) && !concentration))) {
          throw new Error(`Kuis SMK "${candidate.title}" harus memakai program yang diaktifkan sekolah dan konsentrasi jika diwajibkan.`);
        }
        const subjectExists = (curriculum && CURRICULUM_SUBJECTS.some(item =>
          item.education === education &&
          item.grades.includes(grade) &&
          item.name === candidate.subject &&
          (!curriculum || item.curriculums.includes(curriculum))
        )) || (curriculum && subjectsFor(education, grade, curriculum, programId, concentration).some(item => item.name === candidate.subject)) ||
          (!curriculum && LEGACY_SUBJECT_NAMES[education].includes(candidate.subject));
        const subject = subjectExists ? candidate.subject : null;
        if (!subject) throw new Error(`Kuis "${candidate.title}" memerlukan jenjang, kelas, kurikulum, dan mata pelajaran yang cocok pada katalog lokal.`);
        const questions = candidate.questions.map(normalizeQuestion);
        if (questions.some(questionItem => !questionItem)) throw new Error(`Kuis "${candidate.title}" memiliki soal yang tidak valid.`);
        if (hasDuplicatePrompts(questions)) throw new Error(`Kuis "${candidate.title}" memiliki pertanyaan duplikat.`);
        imported.push({
          id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          title: candidate.title.trim().slice(0, 70),
          description: String(candidate.description || "").slice(0, 240),
          education,
          grade,
          curriculum,
          schoolYear: CURRICULUM_SCHOOL_YEAR,
          phase: phaseFor(education, grade),
          programId,
          concentration,
          subject,
          subjectCategory: "",
          subjectVerificationStatus: "unverified",
          duration: [10, 15, 20, 30].includes(Number(candidate.duration)) ? Number(candidate.duration) : 20,
          questions
        });
      }
      state.quizzes.unshift(...imported);
      saveState();
      showToast(`${imported.length} kuis berhasil diimpor.`);
      renderCreator();
    } catch (error) {
      showToast(`Impor gagal: ${error.message}`);
    }
  };
  reader.onerror = () => showToast("Berkas tidak dapat dibaca.");
  reader.readAsText(file);
}

function importSchoolCatalog(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.enabledSubjectIds) || !Array.isArray(parsed.customSubjects)) {
        throw new Error("Format katalog tidak valid.");
      }
      const categories = ["umum", "pilihan", "kejuruan", "muatan-lokal"];
      const overrideInput = parsed.subjectOverrides || {};
      if (!overrideInput || typeof overrideInput !== "object" || Array.isArray(overrideInput)) throw new Error("Format subjectOverrides tidak valid.");
      const subjectOverrides = {};
      for (const [id, override] of Object.entries(overrideInput)) {
        const base = CURRICULUM_SUBJECTS.find(subject => subject.id === id);
        if (!base || !override || typeof override !== "object") throw new Error(`Override katalog tidak dikenal: ${id}.`);
        const updated = {};
        if (override.name !== undefined) {
          if (typeof override.name !== "string" || !override.name.trim()) throw new Error(`Nama untuk ${id} tidak valid.`);
          updated.name = override.name.trim().slice(0, 80);
        }
        if (override.grades !== undefined) {
          if (!Array.isArray(override.grades) || !override.grades.length || override.grades.some(grade => !classesFor(base.education).includes(String(grade)))) throw new Error(`Daftar kelas untuk ${id} tidak valid.`);
          updated.grades = [...new Set(override.grades.map(String))];
        }
        if (override.curriculums !== undefined) {
          if (!Array.isArray(override.curriculums) || !override.curriculums.length || override.curriculums.some(curriculum => !["merdeka", "k13"].includes(curriculum))) throw new Error(`Daftar kurikulum untuk ${id} tidak valid.`);
          updated.curriculums = [...new Set(override.curriculums)];
        }
        if (override.category !== undefined) {
          if (!categories.includes(override.category)) throw new Error(`Kategori untuk ${id} tidak valid.`);
          updated.category = override.category;
        }
        if (override.programId !== undefined) {
          if (base.education !== "SMK" || !["foundation", ...VOCATIONAL_PROGRAMS.map(program => program.id)].includes(override.programId)) throw new Error(`Program keahlian untuk ${id} tidak valid.`);
          updated.programId = override.programId;
        }
        if (override.optional !== undefined) {
          if (typeof override.optional !== "boolean") throw new Error(`Status pilihan untuk ${id} harus berupa boolean.`);
          updated.optional = override.optional;
        }
        for (const field of ["materials", "learningObjectives"]) {
          if (override[field] !== undefined) {
            if (!Array.isArray(override[field]) || override[field].some(item => typeof item !== "string")) throw new Error(`${field} untuk ${id} tidak valid.`);
            updated[field] = override[field].map(item => item.trim().slice(0, 240)).filter(Boolean).slice(0, 30);
          }
        }
        for (const field of ["description", "sourceUrl"]) {
          if (override[field] !== undefined) {
            if (typeof override[field] !== "string") throw new Error(`${field} untuk ${id} tidak valid.`);
            updated[field] = override[field].trim().slice(0, 500);
          }
        }
        if (override.verificationStatus !== undefined) {
          if (!["unverified", "reference-pending", "draft"].includes(override.verificationStatus)) throw new Error("Status verified tidak dapat ditetapkan melalui impor lokal.");
          updated.verificationStatus = override.verificationStatus;
        }
        subjectOverrides[id] = updated;
      }
      const programOverridesInput = parsed.programOverrides || {};
      if (!programOverridesInput || typeof programOverridesInput !== "object" || Array.isArray(programOverridesInput)) {
        throw new Error("Format programOverrides tidak valid.");
      }
      const programOverrides = {};
      for (const [id, override] of Object.entries(programOverridesInput)) {
        if (!VOCATIONAL_PROGRAMS.some(program => program.id === id)) throw new Error(`Override program tidak dikenal: ${id}.`);
        programOverrides[id] = normalizeSchoolProgram(override, id);
      }
      if (parsed.customPrograms !== undefined && !Array.isArray(parsed.customPrograms)) {
        throw new Error("Daftar customPrograms tidak valid.");
      }
      const customPrograms = (parsed.customPrograms || [])
        .map(program => normalizeSchoolProgram(program, program?.id));
      if (customPrograms.some(program =>
        !program.id.startsWith("school-program-") ||
        VOCATIONAL_PROGRAMS.some(base => base.id === program.id)
      ) || new Set(customPrograms.map(program => program.id)).size !== customPrograms.length) {
        throw new Error("ID program tambahan harus unik dan menggunakan awalan school-program-.");
      }
      const programIds = new Set([
        ...VOCATIONAL_PROGRAMS.map(program => program.id),
        ...customPrograms.map(program => program.id)
      ]);
      const enabledProgramIdsInput = parsed.enabledProgramIds ?? [];
      if (!Array.isArray(enabledProgramIdsInput) || enabledProgramIdsInput.some(id => typeof id !== "string" || !programIds.has(id))) {
        throw new Error("Daftar program sekolah aktif tidak valid.");
      }
      const customSubjects = parsed.customSubjects.map(subject => {
        const education = ["SD", "SMP", "SMA", "SMK"].includes(subject.education) ? subject.education : null;
        const grade = education && classesFor(education).includes(String(subject.grade)) ? String(subject.grade) : null;
        if (!subject || !education || !grade || !["merdeka", "k13"].includes(subject.curriculum) ||
            typeof subject.name !== "string" || !subject.name.trim() || !categories.includes(subject.category)) {
          throw new Error("Katalog berisi mata pelajaran dengan metadata yang tidak lengkap.");
        }
        if (education === "SMK" && subject.programId && !programIds.has(subject.programId)) {
          throw new Error(`Program untuk mata pelajaran "${subject.name}" tidak dikenal.`);
        }
        const concentration = typeof subject.concentration === "string" ? subject.concentration.trim().slice(0, 80) : "";
        if (concentration && (education !== "SMK" || !subject.programId)) {
          throw new Error(`Konsentrasi untuk mata pelajaran "${subject.name}" hanya berlaku pada program SMK.`);
        }
        if (concentration) {
          const program = customPrograms.find(item => item.id === subject.programId) ||
            programOverrides[subject.programId] ||
            VOCATIONAL_PROGRAMS.find(item => item.id === subject.programId);
          const configuredProgram = programOverrides[subject.programId] ? { ...program, ...programOverrides[subject.programId] } : program;
          if (!configuredProgram?.concentrations?.includes(concentration)) {
            throw new Error(`Konsentrasi mata pelajaran "${subject.name}" tidak ditemukan pada programnya.`);
          }
        }
        return {
          id: `school-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: subject.name.trim().slice(0, 80),
          education,
          grade,
          phase: phaseFor(education, grade),
          schoolYear: CURRICULUM_SCHOOL_YEAR,
          curriculum: subject.curriculum,
          programId: education === "SMK" ? subject.programId || "" : "",
          concentration,
          category: subject.category,
          description: "Diimpor dari konfigurasi sekolah; belum diverifikasi.",
          icon: "📘",
          optional: true,
          sourceReference: String(subject.sourceReference || "").slice(0, 300),
          materials: Array.isArray(subject.materials) ? subject.materials.filter(item => typeof item === "string").map(item => item.slice(0, 160)).slice(0, 20) : [],
          learningObjectives: Array.isArray(subject.learningObjectives) ? subject.learningObjectives.filter(item => typeof item === "string").map(item => item.slice(0, 240)).slice(0, 20) : [],
          verificationStatus: "unverified"
        };
      });
      state.schoolCatalog = {
        enabledSubjectIds: [...new Set(parsed.enabledSubjectIds.filter(id => typeof id === "string" && CURRICULUM_SUBJECTS.some(subject => subject.id === id)))],
        excludedSubjectIds: [...new Set((Array.isArray(parsed.excludedSubjectIds) ? parsed.excludedSubjectIds : []).filter(id => typeof id === "string" && CURRICULUM_SUBJECTS.some(subject => subject.id === id && !subject.optional)))],
        subjectOverrides,
        customSubjects,
        enabledProgramIds: [...new Set(enabledProgramIdsInput)],
        programOverrides,
        customPrograms
      };
      saveState();
      renderSchoolCatalogManager();
      renderSetup();
      showToast("Konfigurasi katalog berhasil dimuat pada perangkat ini.");
    } catch (error) {
      showToast(`Impor katalog gagal: ${error.message}`);
    }
  };
  reader.onerror = () => showToast("Berkas katalog tidak dapat dibaca.");
  reader.readAsText(file);
}

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function showConfirm(title, message, confirmText, callback) {
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-action="close-modal"><div class="modal" role="dialog" aria-modal="true"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(message)}</p><div class="modal-actions"><button class="button button-ghost" data-action="close-modal">Batal</button><button class="button button-primary" data-action="confirm-modal">${escapeHtml(confirmText)}</button></div></div></div>`;
  $("#modal-root").dataset.confirmAction = callback;
}

function syncTheme() {
  document.body.classList.toggle("dark", state.settings.theme === "dark");
  document.documentElement.style.colorScheme = state.settings.theme;
}

function handleClick(event) {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const value = target.dataset.value;
  const index = Number(target.dataset.index);
  switch (action) {
    case "home": openHome(); break;
    case "start":
    case "setup": openSetup(); break;
    case "leaderboard": renderLeaderboard(); break;
    case "creator":
      if (!ui.editorDraft || ui.view !== "creator") {
        ui.editorQuizId = null;
        ui.editorDraft = freshEditorDraft();
      }
      renderCreator();
      setView("creator");
      break;
    case "help": renderHelp(); break;
    case "profile": showProfile(); break;
    case "sound":
      state.settings.sound = !state.settings.sound;
      saveState();
      refreshHome();
      showToast(state.settings.sound ? "Suara dinyalakan." : "Suara dimatikan.");
      break;
    case "theme":
      state.settings.theme = state.settings.theme === "dark" ? "light" : "dark";
      saveState();
      syncTheme();
      refreshHome();
      if (storageLoadError) showToast("Data lokal sebelumnya tidak dapat dibaca. Permainan dimulai dengan profil baru.");
      showToast(state.settings.theme === "dark" ? "Mode gelap aktif." : "Mode terang aktif.");
      break;
    case "education":
      ui.setup.education = value;
      ui.setup.grade = classesFor(value)[classesFor(value).length - 1];
      ui.setup.programId = "";
      ui.setup.concentration = "";
      ui.setup.subject = subjectsFor(value, ui.setup.grade, ui.setup.curriculum)[0]?.name || "";
      ui.setup.topic = "Semua topik";
      renderSetup();
      break;
    case "subject":
      ui.setup.subject = value;
      ui.setup.topic = "Semua topik";
      renderSetup();
      break;
    case "mode":
      ui.setup.mode = value;
      renderSetup();
      break;
    case "curriculum":
      ui.setup.curriculum = value;
      ui.setup.subject = subjectsFor(ui.setup.education, ui.setup.grade, value, ui.setup.programId, ui.setup.concentration)[0]?.name || "";
      ui.setup.topic = "Semua topik";
      renderSetup();
      saveState();
      break;
    case "manage-curriculum":
      ui.programEditorId = null;
      renderSchoolCatalogManager();
      break;
    case "edit-school-program":
      ui.programEditorId = target.dataset.id || "new";
      ui.programEditorConcentration = "";
      renderSchoolCatalogManager();
      break;
    case "cancel-school-program":
      ui.programEditorId = null;
      ui.programEditorConcentration = "";
      renderSchoolCatalogManager();
      break;
    case "save-school-program": {
      const existing = schoolPrograms().find(program => program.id === ui.programEditorId);
      const selectedConcentration = ui.programEditorConcentration;
      const concentrations = $("#program-concentrations").value.split(/\r?\n/);
      const enteredSubjectsByGrade = Object.fromEntries(["10", "11", "12"].map(grade => [
        grade,
        {
          name: $(`#program-subject-${grade}`).value,
          materials: $(`#program-materials-${grade}`).value.split(/\r?\n/),
          learningContent: $(`#program-content-${grade}`).value
        }
      ]));
      const curriculums = [
        $("#program-curriculum-merdeka").checked ? "merdeka" : "",
        $("#program-curriculum-k13").checked ? "k13" : ""
      ].filter(Boolean);
      const rawProgram = {
        name: $("#program-name").value,
        field: $("#program-field").value,
        concentrations,
        curriculums,
        subjectsByGrade: selectedConcentration && existing ? existing.subjectsByGrade : enteredSubjectsByGrade,
        subjectsByConcentration: Object.fromEntries(Object.entries(existing?.subjectsByConcentration || {})
          .filter(([concentration]) => concentrations.some(item => item.trim() === concentration))
          .map(([concentration, grades]) => [concentration, { ...grades }]))
      };
      if (selectedConcentration) {
        rawProgram.subjectsByConcentration[selectedConcentration] = Object.fromEntries(["11", "12"].map(grade => [grade, enteredSubjectsByGrade[grade]]));
      }
      const slug = rawProgram.name.trim().toLocaleLowerCase("id")
        .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
      const id = existing?.id || `school-program-${slug || "keahlian"}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
      try {
        const configured = normalizeSchoolProgram(rawProgram, id);
        if (!existing && schoolPrograms().some(program => program.name.toLocaleLowerCase("id") === configured.name.toLocaleLowerCase("id"))) {
          throw new Error("Program dengan nama tersebut sudah ada di katalog lokal.");
        }
        if (existing && VOCATIONAL_PROGRAMS.some(program => program.id === id)) {
          state.schoolCatalog.programOverrides[id] = configured;
        } else if (existing) {
          state.schoolCatalog.customPrograms = state.schoolCatalog.customPrograms.map(program => program.id === id ? configured : program);
        } else {
          state.schoolCatalog.customPrograms.push(configured);
        }
        state.schoolCatalog.enabledProgramIds = [...new Set([...state.schoolCatalog.enabledProgramIds, id])];
        ui.setup.programId = id;
        ui.setup.concentration = "";
        ui.setup.subject = subjectsFor("SMK", ui.setup.grade, ui.setup.curriculum, id, "")[0]?.name || "";
        ui.programEditorId = null;
        ui.programEditorConcentration = "";
        saveState();
        renderSchoolCatalogManager();
        renderSetup();
        showToast("Program dan pemetaan materi lokal tersimpan sebagai draf.");
      } catch (error) {
        showToast(`Program belum disimpan: ${error.message}`);
      }
      break;
    }
    case "remove-school-program": {
      const id = target.dataset.id;
      state.schoolCatalog.customPrograms = state.schoolCatalog.customPrograms.filter(program => program.id !== id);
      state.schoolCatalog.enabledProgramIds = state.schoolCatalog.enabledProgramIds.filter(item => item !== id);
      delete state.schoolCatalog.programOverrides[id];
      if (ui.setup.programId === id) {
        ui.setup.programId = "";
        ui.setup.concentration = "";
        ui.setup.subject = "";
      }
      saveState();
      renderSchoolCatalogManager();
      renderSetup();
      showToast("Program lokal dihapus dari katalog perangkat ini.");
      break;
    }
    case "toggle-school-subject": {
      const id = target.dataset.id;
      const subject = CURRICULUM_SUBJECTS.find(item => item.id === id);
      if (!subject) break;
      if (subject.optional) {
        const enabled = state.schoolCatalog.enabledSubjectIds;
        state.schoolCatalog.enabledSubjectIds = enabled.includes(id) ? enabled.filter(item => item !== id) : [...enabled, id];
      } else {
        const excluded = state.schoolCatalog.excludedSubjectIds;
        state.schoolCatalog.excludedSubjectIds = excluded.includes(id) ? excluded.filter(item => item !== id) : [...excluded, id];
      }
      saveState();
      renderSchoolCatalogManager();
      break;
    }
    case "add-school-subject": {
      const name = $("#school-subject-name").value.trim();
      if (!name || !ui.setup.curriculum) {
        showToast("Isi nama dan pilih kurikulum sebelum menambahkan mata pelajaran.");
        break;
      }
      if (subjectsFor(ui.setup.education, ui.setup.grade, ui.setup.curriculum, ui.setup.programId, ui.setup.concentration).some(subject => subject.name.toLocaleLowerCase() === name.toLocaleLowerCase())) {
        showToast("Mata pelajaran tersebut sudah tersedia pada konteks ini.");
        break;
      }
      state.schoolCatalog.customSubjects.push({
        id: `school-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: name.slice(0, 80),
        education: ui.setup.education,
        grade: String(ui.setup.grade),
        phase: phaseFor(ui.setup.education, ui.setup.grade),
        schoolYear: CURRICULUM_SCHOOL_YEAR,
        curriculum: ui.setup.curriculum,
        programId: ui.setup.education === "SMK" ? ui.setup.programId : "",
        concentration: ui.setup.education === "SMK" ? ui.setup.concentration : "",
        category: $("#school-subject-category").value,
        description: "Ditambahkan untuk sekolah ini; belum diverifikasi.",
        icon: "📘",
        optional: true,
        sourceReference: $("#school-subject-reference").value.trim().slice(0, 300),
        materials: $("#school-subject-materials").value.split(/\r?\n/).map(item => item.trim()).filter(Boolean).slice(0, 20),
        learningObjectives: $("#school-subject-objectives").value.split(/\r?\n/).map(item => item.trim()).filter(Boolean).slice(0, 20),
        verificationStatus: "unverified"
      });
      saveState();
      renderSchoolCatalogManager();
      renderSetup();
      showToast("Mata pelajaran lokal ditambahkan.");
      break;
    }
    case "remove-school-subject":
      state.schoolCatalog.customSubjects = state.schoolCatalog.customSubjects.filter(subject => subject.id !== target.dataset.id);
      saveState();
      renderSchoolCatalogManager();
      renderSetup();
      break;
    case "export-catalog":
      downloadJson({ schemaVersion: 2, ...state.schoolCatalog }, "quiz-master-katalog-sekolah.json");
      break;
    case "begin":
      if (!ui.setup.curriculum || (ui.setup.education === "SMK" &&
        (!state.schoolCatalog.enabledProgramIds.includes(ui.setup.programId) ||
          (programNeedsConcentration("SMK", ui.setup.grade, ui.setup.programId) && !ui.setup.concentration))) ||
        !$("#count-select").value) {
        showToast("Lengkapi kurikulum, konteks sekolah, dan jumlah soal yang tersedia terlebih dahulu.");
        break;
      }
      ui.setup.hints = $("#hints-checkbox").checked;
      ui.setup.explanations = $("#explanation-checkbox").checked;
      ui.setup.includeUnmapped = $("#unmapped-checkbox").checked;
      ui.setup.count = Number($("#count-select").value);
      startGame();
      break;
    case "answer":
      submitAnswer(Number(target.dataset.index));
      break;
    case "next-question":
      advanceQuestion();
      break;
    case "confirm-exit":
      showConfirm("Akhiri permainan?", "Progres kuis yang sedang berlangsung tidak akan disimpan.", "Keluar", "exit-game");
      break;
    case "confirm-modal": {
      const callback = $("#modal-root").dataset.confirmAction;
      $("#modal-root").innerHTML = "";
      if (callback === "exit-game") {
        if (ui.game) ui.game.status = "abandoned";
        openHome();
      }
      else if (callback?.startsWith("delete-")) deleteQuiz(callback.slice(7));
      break;
    }
    case "play-again":
      startGame();
      break;
    case "retry-wrong":
      retryWrongAnswers();
      break;
    case "toggle-review":
      ui.lastResult.reviewVisible = !ui.lastResult.reviewVisible;
      renderResults();
      break;
    case "leader-period":
      ui.leaderboardPeriod = value;
      renderLeaderboard();
      break;
    case "avatar":
      $$(".avatar-choice").forEach(button => button.classList.toggle("selected", button === target));
      break;
    case "save-profile": {
      const name = $("#player-name").value.trim();
      const selectedAvatar = $(".avatar-choice.selected")?.dataset.value || avatarFor(state.player.avatar).id;
      if (!name) {
        showToast("Nama panggilan tidak boleh kosong.");
        $("#player-name").focus();
        break;
      }
      state.player.name = name.slice(0, 18);
      state.player.avatar = selectedAvatar;
      saveState();
      $("#modal-root").innerHTML = "";
      refreshHome();
      showToast("Profil pemain tersimpan.");
      break;
    }
    case "close-modal":
      if (target === event.target || target.tagName === "BUTTON") $("#modal-root").innerHTML = "";
      break;
    case "add-question":
      draftFromForm();
      ui.editorDraft.questions.push({ topic: "", difficulty: "Sedang", prompt: "", options: ["", "", "", ""], answer: "", explanation: "", learningObjective: "", sourceReference: "" });
      renderCreator();
      $(`[data-editor-field="prompt"][data-index="${ui.editorDraft.questions.length - 1}"]`)?.focus();
      break;
    case "move-question": {
      draftFromForm();
      const direction = target.dataset.direction === "up" ? -1 : 1;
      const destination = index + direction;
      if (destination >= 0 && destination < ui.editorDraft.questions.length) {
        [ui.editorDraft.questions[index], ui.editorDraft.questions[destination]] = [ui.editorDraft.questions[destination], ui.editorDraft.questions[index]];
        renderCreator();
      }
      break;
    }
    case "remove-question":
      if (ui.editorDraft.questions.length > 1) {
        draftFromForm();
        ui.editorDraft.questions.splice(index, 1);
        renderCreator();
      }
      break;
    case "save-quiz":
      saveQuiz(false);
      break;
    case "save-play":
      saveQuiz(true);
      break;
    case "preview-quiz":
      previewQuiz();
      break;
    case "reset-editor":
      ui.editorQuizId = null;
      ui.editorDraft = freshEditorDraft();
      renderCreator();
      break;
    case "edit-quiz": {
      const quiz = state.quizzes.find(item => item.id === target.dataset.id);
      if (!quiz) break;
      ui.editorQuizId = quiz.id;
      ui.editorDraft = structuredClone(quiz);
      renderCreator();
      window.scrollTo({ top: 0, behavior: "smooth" });
      break;
    }
    case "duplicate-quiz": {
      const quiz = state.quizzes.find(item => item.id === target.dataset.id);
      if (!quiz) break;
      const duplicate = structuredClone(quiz);
      duplicate.id = `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      duplicate.title = `${duplicate.title} (Salinan)`.slice(0, 70);
      state.quizzes.unshift(duplicate);
      saveState();
      renderCreator();
      showToast("Salinan kuis berhasil dibuat.");
      break;
    }
    case "play-quiz": {
      const quiz = state.quizzes.find(item => item.id === target.dataset.id);
      if (!quiz) break;
      ui.setup.education = quiz.education;
      ui.setup.grade = quiz.grade;
      ui.setup.subject = quiz.subject;
      ui.setup.curriculum = quiz.curriculum || "";
      ui.setup.programId = quiz.programId || "";
      ui.setup.concentration = quiz.concentration || "";
      ui.setup.duration = quiz.duration;
      ui.setup.mode = "challenge";
      startGame(quiz);
      break;
    }
    case "export-quiz": {
      const quiz = state.quizzes.find(item => item.id === target.dataset.id);
      if (quiz) downloadJson(quiz, `${quiz.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "kuis"}.json`);
      break;
    }
    case "export-all":
      downloadJson(state.quizzes, "quiz-master-indonesia.json");
      break;
    case "delete-quiz": {
      const quiz = state.quizzes.find(item => item.id === target.dataset.id);
      if (quiz) showConfirm("Hapus kuis?", `Kuis "${quiz.title}" akan dihapus dari perangkat ini.`, "Hapus", `delete-${quiz.id}`);
      break;
    }
  }
}

function deleteQuiz(id) {
  state.quizzes = state.quizzes.filter(quiz => quiz.id !== id);
  if (ui.editorQuizId === id) {
    ui.editorQuizId = null;
    ui.editorDraft = freshEditorDraft();
  }
  saveState();
  renderCreator();
  showToast("Kuis dihapus.");
}

function handleChange(event) {
  const target = event.target;
  if (target.id === "grade-select") {
    ui.setup.grade = target.value;
    ui.setup.concentration = "";
    ui.setup.subject = subjectsFor(ui.setup.education, ui.setup.grade, ui.setup.curriculum, ui.setup.programId, "")[0]?.name || "";
    ui.setup.topic = "Semua topik";
    renderSetup();
  } else if (target.id === "curriculum-select") {
    ui.setup.curriculum = target.value;
    ui.setup.subject = subjectsFor(ui.setup.education, ui.setup.grade, ui.setup.curriculum, ui.setup.programId, ui.setup.concentration)[0]?.name || "";
    ui.setup.topic = "Semua topik";
    renderSetup();
  } else if (target.id === "program-select") {
    ui.setup.programId = target.value;
    ui.setup.concentration = "";
    ui.setup.subject = subjectsFor(ui.setup.education, ui.setup.grade, ui.setup.curriculum, ui.setup.programId, "")[0]?.name || "";
    renderSetup();
  } else if (target.id === "concentration-select") {
    ui.setup.concentration = target.value;
    ui.setup.subject = subjectsFor(ui.setup.education, ui.setup.grade, ui.setup.curriculum, ui.setup.programId, ui.setup.concentration)[0]?.name || "";
    ui.setup.topic = "Semua topik";
    renderSetup();
  } else if (target.matches("[data-program-toggle]")) {
    const id = target.dataset.programToggle;
    state.schoolCatalog.enabledProgramIds = target.checked
      ? [...new Set([...state.schoolCatalog.enabledProgramIds, id])]
      : state.schoolCatalog.enabledProgramIds.filter(item => item !== id);
    if (!target.checked && ui.setup.programId === id) {
      ui.setup.programId = "";
      ui.setup.concentration = "";
      ui.setup.subject = "";
    }
    saveState();
    renderSchoolCatalogManager();
    renderSetup();
  } else if (target.id === "unmapped-checkbox") {
    ui.setup.includeUnmapped = target.checked;
    renderSetup();
  } else if (target.matches("[data-catalog-toggle]")) {
    const id = target.dataset.catalogToggle;
    const subject = CURRICULUM_SUBJECTS.find(item => item.id === id);
    if (!subject) return;
    if (subject.optional) {
      const enabled = state.schoolCatalog.enabledSubjectIds;
      state.schoolCatalog.enabledSubjectIds = target.checked
        ? [...new Set([...enabled, id])]
        : enabled.filter(item => item !== id);
    } else {
      const excluded = state.schoolCatalog.excludedSubjectIds;
      state.schoolCatalog.excludedSubjectIds = target.checked
        ? excluded.filter(item => item !== id)
        : [...new Set([...excluded, id])];
    }
    saveState();
    renderSchoolCatalogManager();
    renderSetup();
  } else if (target.id === "difficulty-select") {
    ui.setup.difficulty = target.value;
    renderSetup();
  } else if (target.id === "topic-select") {
    ui.setup.topic = target.value;
    renderSetup();
  } else if (target.id === "count-select") {
    ui.setup.count = Number(target.value);
    renderSetup();
  } else if (target.id === "duration-select") {
    ui.setup.duration = Number(target.value);
    renderSetup();
  } else if (target.id === "order-select") {
    ui.setup.order = target.value;
    renderSetup();
  } else if (target.id === "hints-checkbox") {
    ui.setup.hints = target.checked;
  } else if (target.id === "explanation-checkbox") {
    ui.setup.explanations = target.checked;
  } else if (target.id === "leader-subject") {
    ui.leaderboardSubject = target.value;
    renderLeaderboard();
  } else if (target.id === "leader-mode") {
    ui.leaderboardMode = target.value;
    renderLeaderboard();
  } else if (target.id === "leader-class") {
    ui.leaderboardClass = target.value;
    renderLeaderboard();
  } else if (target.id === "quiz-education") {
    draftFromForm();
    ui.editorDraft.education = target.value;
    ui.editorDraft.grade = classesFor(target.value)[0];
    ui.editorDraft.programId = "";
    ui.editorDraft.concentration = "";
    ui.editorDraft.subject = subjectsFor(target.value, ui.editorDraft.grade, ui.editorDraft.curriculum)[0]?.name || "";
    renderCreator();
  } else if (target.id === "quiz-grade") {
    ui.editorDraft.grade = target.value;
    ui.editorDraft.concentration = "";
    ui.editorDraft.subject = subjectsFor(ui.editorDraft.education, ui.editorDraft.grade, ui.editorDraft.curriculum, ui.editorDraft.programId, "")[0]?.name || "";
    renderCreator();
  } else if (target.id === "quiz-curriculum") {
    ui.editorDraft.curriculum = target.value;
    ui.editorDraft.subject = subjectsFor(ui.editorDraft.education, ui.editorDraft.grade, ui.editorDraft.curriculum, ui.editorDraft.programId, ui.editorDraft.concentration)[0]?.name || "";
    renderCreator();
  } else if (target.id === "quiz-program") {
    ui.editorDraft.programId = target.value;
    ui.editorDraft.concentration = "";
    ui.editorDraft.subject = subjectsFor(ui.editorDraft.education, ui.editorDraft.grade, ui.editorDraft.curriculum, ui.editorDraft.programId, "")[0]?.name || "";
    renderCreator();
  } else if (target.id === "quiz-subject") {
    ui.editorDraft.subject = target.value;
  } else if (target.id === "catalog-import-file" && target.files?.[0]) {
    importSchoolCatalog(target.files[0]);
    target.value = "";
  } else if (target.id === "quiz-concentration") {
    ui.editorDraft.concentration = target.value;
    ui.editorDraft.subject = subjectsFor(ui.editorDraft.education, ui.editorDraft.grade, ui.editorDraft.curriculum, ui.editorDraft.programId, ui.editorDraft.concentration)[0]?.name || "";
    renderCreator();
  } else if (target.id === "program-edit-concentration") {
    ui.programEditorConcentration = target.value;
    renderSchoolCatalogManager();
  } else if (target.id === "quiz-duration") {
    ui.editorDraft.duration = Number(target.value);
  } else if (target.matches("[data-editor-field]")) {
    updateEditorField(target);
  } else if (target.id === "import-file" && target.files?.[0]) {
    importQuizzes(target.files[0]);
    target.value = "";
  }
}

function handleInput(event) {
  const target = event.target;
  if (target.matches("[data-editor-field]")) updateEditorField(target);
  if (target.id === "quiz-title") ui.editorDraft.title = target.value;
  if (target.id === "quiz-description") ui.editorDraft.description = target.value;
}

function updateEditorField(target) {
  const questionItem = ui.editorDraft?.questions[Number(target.dataset.index)];
  if (!questionItem) return;
  const field = target.dataset.editorField;
  if (field === "option") {
    const previousAnswer = questionItem.answer;
    const optionIndex = Number(target.dataset.option);
    const previousOption = questionItem.options[optionIndex];
    questionItem.options[optionIndex] = target.value;
    if (previousAnswer === previousOption) questionItem.answer = target.value;
    const answerSelect = $(`[data-editor-field="answer"][data-index="${target.dataset.index}"]`);
    if (answerSelect) {
      answerSelect.innerHTML = questionItem.options.map((option, index) => `<option value="${index}" ${questionItem.answer === option ? "selected" : ""}>${choiceLetters[index]}${option.trim() ? ` · ${escapeHtml(option.trim().slice(0, 35))}` : ""}</option>`).join("");
    }
  } else if (field === "answer") {
    questionItem.answer = questionItem.options[Number(target.value)] || "";
  } else if (field === "difficulty") {
    questionItem.difficulty = target.value;
  } else {
    questionItem[field] = target.value;
  }
}

function handleKeydown(event) {
  if (ui.view !== "game" || !ui.game || ui.game.answeredLocked) {
    if (event.key === "Escape" && $("#modal-root").innerHTML) $("#modal-root").innerHTML = "";
    return;
  }
  if (/^[1-4]$/.test(event.key)) {
    submitAnswer(Number(event.key) - 1);
  }
}

document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);
document.addEventListener("input", handleInput);
document.addEventListener("keydown", handleKeydown);
syncTheme();
refreshHome();
