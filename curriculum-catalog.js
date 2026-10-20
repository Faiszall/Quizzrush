"use strict";

const ALL_CURRICULA = ["merdeka", "k13"];
const CURRICULUM_SCHOOL_YEAR = "2026/2027";
const gradesFor = education => ({
  SD: ["1", "2", "3", "4", "5", "6"],
  SMP: ["7", "8", "9"],
  SMA: ["10", "11", "12"],
  SMK: ["10", "11", "12"]
})[education];
const phaseForGrade = (education, grade) => {
  const numericGrade = Number(grade);
  if (education === "SD") return numericGrade <= 2 ? "A" : numericGrade <= 4 ? "B" : "C";
  if (education === "SMP") return "D";
  return numericGrade === 10 ? "E" : "F";
};

function catalogSubject(education, name, category, options = {}) {
  return {
    id: `${education.toLowerCase()}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
    name,
    education,
    grades: options.grades || gradesFor(education),
    phases: (options.grades || gradesFor(education)).map(grade => phaseForGrade(education, grade)),
    curriculums: options.curriculums || ALL_CURRICULA,
    schoolYear: CURRICULUM_SCHOOL_YEAR,
    category,
    programId: options.programId || "",
    icon: options.icon || "📘",
    iconImage: options.iconImage || (name === "Pendidikan Pancasila" ? "assets/icons/garuda-pancasila.png" : ""),
    description: options.description || "Materi mengikuti pengaturan sekolah.",
    optional: Boolean(options.optional),
    sourceUrl: "https://kurikulum.kemendikdasmen.go.id/",
    learningObjectives: [],
    materials: [],
    verificationStatus: "reference-pending"
  };
}

const commonSubjects = [
  ["Pendidikan Agama dan Budi Pekerti", "umum", "🕌", false],
  ["Pendidikan Pancasila", "umum", "🇮🇩", false],
  ["Bahasa Indonesia", "umum", "📖", false],
  ["Matematika", "umum", "🔢", false],
  ["Bahasa Inggris", "umum", "🔤", false],
  ["PJOK", "umum", "⚽", false],
  ["Seni dan Budaya", "umum", "🎨", false],
  ["Sejarah", "umum", "🏛️", true],
  ["Muatan Lokal", "muatan-lokal", "🗺️", true],
  ["Bahasa Daerah", "muatan-lokal", "💬", true],
  ["Koding dan Kecerdasan Artifisial", "pilihan", "💻", true]
];

const CURRICULUM_SUBJECTS = [
  ...commonSubjects.map(([name, category, icon, optional]) => catalogSubject("SD", name, category, { icon, optional: optional || name === "Bahasa Inggris" })),
  catalogSubject("SD", "IPAS", "umum", { grades: ["3", "4", "5", "6"], curriculums: ["merdeka"], icon: "🌱" }),
  catalogSubject("SD", "IPA", "umum", { grades: ["4", "5", "6"], curriculums: ["k13"], icon: "🔬" }),
  catalogSubject("SD", "IPS", "umum", { grades: ["4", "5", "6"], curriculums: ["k13"], icon: "🗺️" }),
  ...commonSubjects.map(([name, category, icon, optional]) => catalogSubject("SMP", name, category, { icon, optional })),
  ...[
    ["IPA", "umum", "🔬", false],
    ["IPS", "umum", "🗺️", false],
    ["Informatika", "umum", "💻", false],
    ["Prakarya", "pilihan", "🧰", true]
  ].map(([name, category, icon, optional]) => catalogSubject("SMP", name, category, { icon, optional })),
  ...commonSubjects.map(([name, category, icon, optional]) => catalogSubject("SMA", name, category, {
    icon,
    optional: ["Muatan Lokal", "Bahasa Daerah", "Koding dan Kecerdasan Artifisial"].includes(name) ? optional : false
  })),
  ...[
    ["Matematika Tingkat Lanjut", "pilihan", "📐", ["10", "11", "12"]],
    ["Fisika", "pilihan", "⚛️", ["10", "11", "12"]],
    ["Kimia", "pilihan", "🧪", ["10", "11", "12"]],
    ["Biologi", "pilihan", "🧬", ["10", "11", "12"]],
    ["Ekonomi", "pilihan", "📈", ["10", "11", "12"]],
    ["Sosiologi", "pilihan", "👥", ["10", "11", "12"]],
    ["Geografi", "pilihan", "🌋", ["10", "11", "12"]],
    ["Antropologi", "pilihan", "🧑‍🤝‍🧑", ["11", "12"]],
    ["Bahasa Asing", "pilihan", "🌐", ["10", "11", "12"]],
    ["Informatika", "pilihan", "💻", ["10", "11", "12"]]
  ].map(([name, category, icon, grades]) => catalogSubject("SMA", name, category, { grades, icon, optional: true })),
  ...commonSubjects.filter(([name]) => !["Sejarah"].includes(name)).map(([name, category, icon, optional]) => catalogSubject("SMK", name, category, { icon, optional: optional || name === "Seni dan Budaya" })),
  catalogSubject("SMK", "Sejarah", "umum", { icon: "🏛️", optional: true }),
];

const VOCATIONAL_PROGRAMS = [
  {
    id: "tjkt", field: "Teknologi Informasi", name: "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)",
    concentrations: ["Teknik Komputer dan Jaringan", "Teknik Transmisi Telekomunikasi"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Teknik Jaringan Komputer dan Telekomunikasi", materials: ["Pengenalan perangkat komputer dan jaringan", "Dasar jaringan kabel dan nirkabel", "Pengalamatan IP", "Perangkat jaringan", "Dasar sistem operasi", "Keselamatan kerja dan budaya kerja industri"] },
      "11": { name: "Kejuruan Lanjutan TJKT · Kelas 11", materials: ["Perancangan jaringan sesuai konsentrasi", "Routing dan switching", "VLAN dan layanan jaringan", "Administrasi sistem dan server", "Instalasi media jaringan"] },
      "12": { name: "Kejuruan Lanjutan TJKT · Kelas 12", materials: ["Implementasi dan pemeliharaan jaringan", "Keamanan jaringan", "Fiber optik", "Monitoring dan troubleshooting", "Dokumentasi proyek dan budaya kerja industri"] }
    }
  },
  {
    id: "pplg", field: "Teknologi Informasi", name: "Pengembangan Perangkat Lunak dan Gim (PPLG)",
    concentrations: ["Rekayasa Perangkat Lunak", "Pengembangan Gim"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Pengembangan Perangkat Lunak dan Gim", materials: ["Algoritma dan logika pemrograman", "Dasar pemrograman", "Basis data", "Pengembangan web dasar", "Antarmuka pengguna", "Pengujian perangkat lunak"] },
      "11": { name: "Kejuruan Lanjutan PPLG · Kelas 11", materials: ["Pemrograman berorientasi objek", "Perancangan dan implementasi basis data", "Pengembangan aplikasi sesuai konsentrasi", "Antarmuka dan pengalaman pengguna", "Pengujian perangkat lunak"] },
      "12": { name: "Kejuruan Lanjutan PPLG · Kelas 12", materials: ["Integrasi dan deployment aplikasi", "Keamanan dan kualitas perangkat lunak", "Pengembangan produk sesuai konsentrasi", "Kolaborasi dan kendali versi", "Proyek dan portofolio industri"] }
    }
  },
  {
    id: "siaj", field: "Teknologi Informasi", name: "Sistem Informasi, Jaringan, dan Aplikasi",
    concentrations: [],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Sistem Informasi, Jaringan, dan Aplikasi", materials: ["Konsep sistem informasi", "Perangkat komputer dan jaringan", "Dasar sistem operasi", "Aplikasi perkantoran", "Keselamatan kerja digital"] },
      "11": { name: "Kejuruan Lanjutan SIAJ · Kelas 11", materials: ["Pengelolaan sistem informasi", "Administrasi jaringan", "Integrasi aplikasi", "Basis data", "Dokumentasi teknis"] },
      "12": { name: "Kejuruan Lanjutan SIAJ · Kelas 12", materials: ["Keamanan dan pemeliharaan sistem", "Troubleshooting layanan", "Otomasi dan integrasi", "Proyek sistem informasi", "Portofolio industri"] }
    }
  },
  {
    id: "akl", field: "Bisnis dan Manajemen", name: "Akuntansi dan Keuangan Lembaga (AKL)",
    concentrations: ["Akuntansi", "Perbankan"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Akuntansi dan Keuangan Lembaga", materials: ["Konsep dasar akuntansi", "Persamaan dasar akuntansi", "Dokumen transaksi", "Jurnal umum", "Buku besar", "Dasar penggunaan spreadsheet"] },
      "11": { name: "Kejuruan Lanjutan AKL · Kelas 11", materials: ["Jurnal penyesuaian", "Neraca saldo dan kertas kerja", "Laporan keuangan", "Spreadsheet untuk pengolahan transaksi", "Akuntansi sesuai konsentrasi"] },
      "12": { name: "Kejuruan Lanjutan AKL · Kelas 12", materials: ["Siklus akuntansi lanjutan", "Rekonsiliasi dan koreksi", "Komputer akuntansi", "Analisis laporan keuangan", "Praktik kerja dan portofolio"] }
    }
  },
  {
    id: "mplb", field: "Bisnis dan Manajemen", name: "Manajemen Perkantoran dan Layanan Bisnis (MPLB)",
    concentrations: ["Manajemen Perkantoran", "Layanan Bisnis"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Manajemen Perkantoran dan Layanan Bisnis", materials: ["Administrasi perkantoran", "Komunikasi bisnis", "Pengelolaan dokumen", "Kearsipan", "Aplikasi perkantoran", "Pelayanan pelanggan"] },
      "11": { name: "Kejuruan Lanjutan MPLB · Kelas 11", materials: ["Pengelolaan agenda dan rapat", "Korespondensi bisnis", "Sistem kearsipan digital", "Layanan pelanggan sesuai konsentrasi", "Pengolahan informasi perkantoran"] },
      "12": { name: "Kejuruan Lanjutan MPLB · Kelas 12", materials: ["Pengelolaan administrasi bisnis", "Otomasi dan arsip digital", "Evaluasi mutu layanan", "Praktik simulasi kantor", "Proyek dan portofolio layanan"] }
    }
  },
  {
    id: "marketing", field: "Bisnis dan Manajemen", name: "Pemasaran",
    concentrations: ["Bisnis Digital", "Retail"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Pemasaran", materials: ["Konsep pemasaran", "Perilaku konsumen", "Pelayanan pelanggan", "Penataan produk", "Penjualan", "Pemasaran digital dasar"] },
      "11": { name: "Kejuruan Lanjutan Pemasaran · Kelas 11", materials: ["Riset pasar dan segmentasi", "Strategi promosi", "Pengelolaan penjualan", "Pemasaran sesuai konsentrasi", "Layanan purnajual"] },
      "12": { name: "Kejuruan Lanjutan Pemasaran · Kelas 12", materials: ["Analisis kinerja pemasaran", "Kampanye pemasaran terpadu", "Pengelolaan pelanggan", "Perencanaan bisnis", "Proyek dan portofolio pemasaran"] }
    }
  },
  {
    id: "dkv", field: "Seni dan Ekonomi Kreatif", name: "Desain Komunikasi Visual (DKV)",
    concentrations: ["Desain Grafis", "Produksi Media"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Desain Komunikasi Visual", materials: ["Unsur dan prinsip desain", "Gambar dan ilustrasi", "Tipografi", "Fotografi dasar", "Desain grafis digital", "Komunikasi visual"] },
      "11": { name: "Kejuruan Lanjutan DKV · Kelas 11", materials: ["Pengembangan konsep visual", "Tata letak dan identitas visual", "Produksi media sesuai konsentrasi", "Pengolahan aset digital", "Umpan balik dan revisi desain"] },
      "12": { name: "Kejuruan Lanjutan DKV · Kelas 12", materials: ["Perencanaan proyek desain", "Produksi karya untuk klien", "Presentasi dan evaluasi karya", "Hak cipta dan etika desain", "Portofolio industri kreatif"] }
    }
  },
  {
    id: "animation", field: "Seni dan Ekonomi Kreatif", name: "Animasi", concentrations: ["Animasi 2D", "Animasi 3D"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Animasi", materials: ["Prinsip dasar animasi", "Gambar karakter", "Storyboard", "Gerak dan ekspresi", "Produksi animasi dasar"] },
      "11": { name: "Kejuruan Lanjutan Animasi · Kelas 11", materials: ["Desain karakter dan lingkungan", "Animasi sesuai konsentrasi", "Pencahayaan dan komposisi", "Alur produksi", "Penyuntingan dan evaluasi gerak"] },
      "12": { name: "Kejuruan Lanjutan Animasi · Kelas 12", materials: ["Perencanaan produksi animasi", "Produksi karya terintegrasi", "Pascaproduksi dan render", "Kolaborasi produksi", "Portofolio industri kreatif"] }
    }
  },
  {
    id: "film", field: "Seni dan Ekonomi Kreatif", name: "Produksi Film dan Program Televisi", concentrations: ["Produksi Film", "Produksi Program Televisi"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Produksi Film dan Program Televisi", materials: ["Penulisan naskah", "Dasar pengambilan gambar", "Tata suara", "Penyuntingan video", "Produksi konten audiovisual"] },
      "11": { name: "Kejuruan Lanjutan Produksi Film dan Program Televisi · Kelas 11", materials: ["Pengembangan naskah dan storyboard", "Tata kamera dan pencahayaan", "Produksi sesuai konsentrasi", "Tata suara produksi", "Penyuntingan audiovisual"] },
      "12": { name: "Kejuruan Lanjutan Produksi Film dan Program Televisi · Kelas 12", materials: ["Perencanaan produksi", "Manajemen kru dan lokasi", "Pascaproduksi", "Distribusi dan etika konten", "Portofolio audiovisual"] }
    }
  },
  {
    id: "automotive", field: "Teknologi Manufaktur dan Rekayasa", name: "Teknik Otomotif",
    concentrations: ["Teknik Kendaraan Ringan", "Teknik Sepeda Motor"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Teknik Otomotif", materials: ["Pengenalan alat dan peralatan bengkel", "Gambar teknik dasar", "Alat ukur", "Dasar mesin", "Dasar kelistrikan otomotif", "Keselamatan kerja"] },
      "11": { name: "Kejuruan Lanjutan Teknik Otomotif · Kelas 11", materials: ["Sistem kendaraan sesuai konsentrasi", "Pemeliharaan berkala", "Diagnosis kerusakan dasar", "Sistem kelistrikan kendaraan", "Penggunaan alat bengkel"] },
      "12": { name: "Kejuruan Lanjutan Teknik Otomotif · Kelas 12", materials: ["Diagnosis dan perbaikan lanjutan", "Perawatan sistem kendaraan", "Teknologi otomotif sesuai konsentrasi", "Kendali mutu dan keselamatan kerja", "Proyek dan praktik industri"] }
    }
  },
  {
    id: "electronics", field: "Teknologi Manufaktur dan Rekayasa", name: "Teknik Elektronika",
    concentrations: ["Teknik Elektronika Industri", "Teknik Audio Video"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Teknik Elektronika", materials: ["Komponen elektronika", "Pengukuran listrik dasar", "Rangkaian elektronika", "Penggunaan alat ukur", "Keselamatan kerja kelistrikan"] },
      "11": { name: "Kejuruan Lanjutan Teknik Elektronika · Kelas 11", materials: ["Analisis rangkaian elektronika", "Perakitan dan pengujian", "Sistem elektronika sesuai konsentrasi", "Penggunaan instrumen ukur", "Dokumentasi teknis"] },
      "12": { name: "Kejuruan Lanjutan Teknik Elektronika · Kelas 12", materials: ["Diagnosis dan perbaikan rangkaian", "Integrasi sistem elektronika", "Kendali mutu dan keselamatan", "Pemeliharaan peralatan", "Proyek praktik industri"] }
    }
  },
  {
    id: "electricity", field: "Teknologi Manufaktur dan Rekayasa", name: "Teknik Ketenagalistrikan",
    concentrations: ["Teknik Instalasi Tenaga Listrik", "Teknik Tenaga Listrik"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Teknik Ketenagalistrikan", materials: ["Besaran dan satuan listrik", "Rangkaian listrik dasar", "Komponen instalasi", "Alat ukur listrik", "Keselamatan instalasi listrik"] },
      "11": { name: "Kejuruan Lanjutan Teknik Ketenagalistrikan · Kelas 11", materials: ["Instalasi listrik sesuai konsentrasi", "Pengukuran dan pengujian instalasi", "Gambar dan diagram kelistrikan", "Perlindungan instalasi", "Keselamatan kerja"] },
      "12": { name: "Kejuruan Lanjutan Teknik Ketenagalistrikan · Kelas 12", materials: ["Pemeliharaan dan diagnosis instalasi", "Pengujian sistem kelistrikan", "Efisiensi dan kendali mutu", "Dokumentasi pekerjaan", "Proyek praktik industri"] }
    }
  },
  {
    id: "mechanical", field: "Teknologi Manufaktur dan Rekayasa", name: "Teknik Mesin",
    concentrations: ["Teknik Pemesinan", "Teknik Pengelasan"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Teknik Mesin", materials: ["Gambar teknik", "Pengukuran teknik", "Bahan teknik", "Peralatan kerja bangku", "Dasar proses pemesinan"] },
      "11": { name: "Kejuruan Lanjutan Teknik Mesin · Kelas 11", materials: ["Proses kerja sesuai konsentrasi", "Pengoperasian peralatan mesin", "Pembacaan gambar kerja", "Pengukuran dan toleransi", "Keselamatan kerja bengkel"] },
      "12": { name: "Kejuruan Lanjutan Teknik Mesin · Kelas 12", materials: ["Perencanaan proses produksi", "Pembuatan dan pemeriksaan komponen", "Perawatan mesin", "Kendali mutu hasil kerja", "Proyek praktik industri"] }
    }
  },
  {
    id: "construction", field: "Teknologi Manufaktur dan Rekayasa", name: "Teknik Konstruksi dan Perumahan",
    concentrations: ["Konstruksi Gedung", "Konstruksi dan Perawatan Bangunan Sipil"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Konstruksi dan Perumahan", materials: ["Gambar teknik bangunan", "Bahan bangunan", "Pengukuran dasar", "Keselamatan kerja konstruksi"] },
      "11": { name: "Kejuruan Lanjutan Teknik Konstruksi dan Perumahan · Kelas 11", materials: ["Pembacaan gambar konstruksi", "Pengukuran dan pematokan", "Pekerjaan konstruksi sesuai konsentrasi", "Perhitungan bahan", "Keselamatan proyek"] },
      "12": { name: "Kejuruan Lanjutan Teknik Konstruksi dan Perumahan · Kelas 12", materials: ["Perencanaan pekerjaan konstruksi", "Pengendalian mutu dan biaya", "Dokumentasi proyek", "Perawatan bangunan", "Praktik dan portofolio konstruksi"] }
    }
  },
  {
    id: "culinary", field: "Pariwisata dan Perhotelan", name: "Kuliner",
    concentrations: ["Kuliner", "Patiseri"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Kuliner", materials: ["Kebersihan dan sanitasi", "Bahan makanan", "Teknik pengolahan dasar", "Peralatan dapur", "Penyajian makanan"] },
      "11": { name: "Kejuruan Lanjutan Kuliner · Kelas 11", materials: ["Pengolahan menu sesuai konsentrasi", "Perencanaan bahan dan porsi", "Teknik penyajian", "Pengendalian mutu dan sanitasi", "Pelayanan makanan"] },
      "12": { name: "Kejuruan Lanjutan Kuliner · Kelas 12", materials: ["Perencanaan produksi kuliner", "Kendali biaya dan persediaan", "Pengembangan produk", "Keselamatan pangan", "Proyek layanan kuliner"] }
    }
  },
  {
    id: "hospitality", field: "Pariwisata dan Perhotelan", name: "Perhotelan",
    concentrations: ["Perhotelan"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Perhotelan", materials: ["Pengenalan industri perhotelan", "Layanan dasar hotel", "Tata graha dasar", "Front office dasar", "Pelayanan tamu"] },
      "11": { name: "Kejuruan Lanjutan Perhotelan · Kelas 11", materials: ["Operasional layanan sesuai konsentrasi", "Penanganan reservasi dan tamu", "Tata graha dan pemeriksaan kamar", "Komunikasi layanan", "Kesehatan dan keselamatan kerja"] },
      "12": { name: "Kejuruan Lanjutan Perhotelan · Kelas 12", materials: ["Pengendalian mutu layanan hotel", "Penanganan kebutuhan dan keluhan tamu", "Koordinasi operasional", "Administrasi layanan", "Praktik kerja industri"] }
    }
  },
  {
    id: "tourism", field: "Pariwisata dan Perhotelan", name: "Usaha Layanan Pariwisata",
    concentrations: ["Usaha Perjalanan Wisata", "Pemanduan Wisata"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Usaha Layanan Pariwisata", materials: ["Pengenalan industri pariwisata", "Pelayanan wisatawan", "Destinasi wisata", "Komunikasi dalam pariwisata"] },
      "11": { name: "Kejuruan Lanjutan Usaha Layanan Pariwisata · Kelas 11", materials: ["Perencanaan layanan sesuai konsentrasi", "Informasi destinasi dan perjalanan", "Komunikasi layanan wisata", "Pemesanan dan dokumen perjalanan", "Keselamatan wisatawan"] },
      "12": { name: "Kejuruan Lanjutan Usaha Layanan Pariwisata · Kelas 12", materials: ["Pengelolaan perjalanan wisata", "Pemanduan dan evaluasi layanan", "Penanganan kebutuhan wisatawan", "Pengembangan paket wisata", "Praktik kerja industri"] }
    }
  },
  {
    id: "beauty", field: "Pariwisata dan Perhotelan", name: "Tata Kecantikan",
    concentrations: ["Tata Kecantikan Kulit dan Rambut"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Tata Kecantikan", materials: ["Sanitasi dan higiene", "Perawatan dasar", "Pengenalan alat dan bahan", "Keselamatan kerja"] },
      "11": { name: "Kejuruan Lanjutan Tata Kecantikan · Kelas 11", materials: ["Perawatan sesuai konsentrasi", "Analisis kebutuhan pelanggan", "Penggunaan alat dan kosmetik", "Sanitasi layanan", "Konsultasi dan komunikasi pelanggan"] },
      "12": { name: "Kejuruan Lanjutan Tata Kecantikan · Kelas 12", materials: ["Perencanaan layanan kecantikan", "Evaluasi hasil perawatan", "Pengelolaan usaha layanan", "Etika dan keselamatan kerja", "Portofolio praktik"] }
    }
  },
  {
    id: "fashion", field: "Seni dan Ekonomi Kreatif", name: "Busana",
    concentrations: ["Desain dan Produksi Busana"],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Busana", materials: ["Pengenalan bahan tekstil", "Alat jahit", "Pengukuran tubuh", "Gambar desain busana", "Pola dan jahitan dasar"] },
      "11": { name: "Kejuruan Lanjutan Busana · Kelas 11", materials: ["Pola dan konstruksi busana", "Teknik produksi sesuai konsentrasi", "Pemilihan bahan dan aksesori", "Penyelesaian busana", "Pengendalian mutu"] },
      "12": { name: "Kejuruan Lanjutan Busana · Kelas 12", materials: ["Perencanaan koleksi busana", "Produksi dan evaluasi produk", "Presentasi desain", "Perhitungan biaya produksi", "Portofolio industri kreatif"] }
    }
  },
  {
    id: "agribusiness", field: "Bidang Lain", name: "Agribisnis dan Agriteknologi", concentrations: [],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Agribisnis dan Agriteknologi", materials: ["Pengenalan agribisnis", "Keselamatan kerja", "Alat dan bahan praktik", "Dasar produksi sesuai konsentrasi"] },
      "11": { name: "Kejuruan Lanjutan Agribisnis dan Agriteknologi · Kelas 11", materials: ["Produksi sesuai konsentrasi", "Pemeliharaan sarana produksi", "Pengendalian mutu", "Pencatatan kegiatan usaha"] },
      "12": { name: "Kejuruan Lanjutan Agribisnis dan Agriteknologi · Kelas 12", materials: ["Perencanaan produksi", "Pengolahan dan pemasaran hasil", "Analisis usaha", "Praktik dan portofolio agribisnis"] }
    }
  },
  {
    id: "maritime", field: "Bidang Lain", name: "Kemaritiman", concentrations: [],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Kemaritiman", materials: ["Pengenalan bidang kemaritiman", "Keselamatan kerja", "Peralatan dan prosedur dasar", "Lingkungan maritim"] },
      "11": { name: "Kejuruan Lanjutan Kemaritiman · Kelas 11", materials: ["Kompetensi teknis sesuai konsentrasi", "Prosedur operasional", "Perawatan peralatan", "Keselamatan kerja maritim"] },
      "12": { name: "Kejuruan Lanjutan Kemaritiman · Kelas 12", materials: ["Operasional lanjutan sesuai konsentrasi", "Pemecahan masalah teknis", "Pengendalian mutu", "Praktik dan portofolio kemaritiman"] }
    }
  },
  {
    id: "energy", field: "Bidang Lain", name: "Energi dan Pertambangan", concentrations: [],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Energi dan Pertambangan", materials: ["Pengenalan bidang energi dan pertambangan", "Keselamatan kerja", "Peralatan dan pengukuran dasar", "Lingkungan dan prosedur kerja"] },
      "11": { name: "Kejuruan Lanjutan Energi dan Pertambangan · Kelas 11", materials: ["Kompetensi teknis sesuai konsentrasi", "Pengukuran dan pemantauan", "Pengoperasian peralatan", "Keselamatan dan lingkungan kerja"] },
      "12": { name: "Kejuruan Lanjutan Energi dan Pertambangan · Kelas 12", materials: ["Operasional lanjutan sesuai konsentrasi", "Pemeliharaan dan diagnosis", "Pengendalian mutu", "Praktik dan portofolio industri"] }
    }
  },
  {
    id: "healthcare", field: "Bidang Lain", name: "Kesehatan dan Pekerjaan Sosial", concentrations: [],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Kesehatan dan Pekerjaan Sosial", materials: ["Pengenalan layanan kesehatan dan sosial", "Komunikasi layanan", "Etika dan kerahasiaan", "Kesehatan dan keselamatan kerja"] },
      "11": { name: "Kejuruan Lanjutan Kesehatan dan Pekerjaan Sosial · Kelas 11", materials: ["Prosedur layanan sesuai konsentrasi", "Komunikasi dan dokumentasi", "Keselamatan penerima layanan", "Etika praktik"] },
      "12": { name: "Kejuruan Lanjutan Kesehatan dan Pekerjaan Sosial · Kelas 12", materials: ["Koordinasi layanan", "Pemantauan mutu layanan", "Dokumentasi dan evaluasi", "Praktik terarah dan portofolio"] }
    }
  },
  {
    id: "pharmacy", field: "Bidang Lain", name: "Farmasi", concentrations: [],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Farmasi", materials: ["Pengenalan bidang farmasi", "Keselamatan dan higiene", "Alat dan bahan dasar", "Komunikasi dan etika layanan"] },
      "11": { name: "Kejuruan Lanjutan Farmasi · Kelas 11", materials: ["Kompetensi farmasi sesuai kurikulum sekolah", "Pengelolaan dan pencatatan", "Keselamatan layanan", "Etika dan komunikasi"] },
      "12": { name: "Kejuruan Lanjutan Farmasi · Kelas 12", materials: ["Praktik farmasi sesuai konsentrasi", "Pengendalian mutu dan dokumentasi", "Keselamatan dan etika kerja", "Praktik dan portofolio"] }
    }
  },
  {
    id: "health-services", field: "Bidang Lain", name: "Layanan Kesehatan", concentrations: [],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Layanan Kesehatan", materials: ["Pengenalan layanan kesehatan", "Komunikasi dan etika", "Higiene dan keselamatan", "Dokumentasi dasar"] },
      "11": { name: "Kejuruan Lanjutan Layanan Kesehatan · Kelas 11", materials: ["Prosedur layanan sesuai konsentrasi", "Dokumentasi dan komunikasi", "Keselamatan penerima layanan", "Etika praktik"] },
      "12": { name: "Kejuruan Lanjutan Layanan Kesehatan · Kelas 12", materials: ["Koordinasi dan evaluasi layanan", "Penerapan prosedur sesuai sekolah", "Dokumentasi dan mutu", "Praktik dan portofolio"] }
    }
  },
  {
    id: "performing-arts", field: "Bidang Lain", name: "Seni Pertunjukan", concentrations: [],
    subjectsByGrade: {
      "10": { name: "Dasar-Dasar Seni Pertunjukan", materials: ["Pengenalan seni pertunjukan", "Unsur dan teknik dasar", "Latihan dan ekspresi", "Keselamatan dan disiplin kerja"] },
      "11": { name: "Kejuruan Lanjutan Seni Pertunjukan · Kelas 11", materials: ["Teknik sesuai konsentrasi", "Interpretasi dan latihan", "Kolaborasi produksi", "Evaluasi pertunjukan"] },
      "12": { name: "Kejuruan Lanjutan Seni Pertunjukan · Kelas 12", materials: ["Perencanaan pertunjukan", "Produksi dan pementasan", "Evaluasi karya", "Portofolio seni pertunjukan"] }
    }
  }
];

const VOCATIONAL_LEARNING_CONTENT = {
  tjkt: {
    "10": "Kenali fungsi perangkat komputer, switch, router, dan media kabel maupun nirkabel. Latih pengalamatan IP dasar, penggunaan sistem operasi, serta kebiasaan kerja aman sebelum melakukan instalasi.",
    "11": "Rancang jaringan kecil sesuai kebutuhan dan konsentrasi sekolah. Pelajari hubungan routing, switching, VLAN, layanan jaringan, dan administrasi server melalui simulasi serta dokumentasi konfigurasi.",
    "12": "Terapkan pemeliharaan, pemantauan, keamanan, dan troubleshooting secara berurutan. Untuk media fiber optik, ikuti prosedur keselamatan dan alat praktik yang ditetapkan guru; catat hasil uji serta perbaikan."
  },
  pplg: {
    "10": "Uraikan masalah menjadi algoritma dan langkah logis. Praktikkan dasar pemrograman, struktur data sederhana, basis data, halaman web, antarmuka, serta pengujian fungsi dengan contoh kecil.",
    "11": "Kembangkan aplikasi terstruktur dengan konsep objek, rancangan basis data, dan antarmuka yang mudah digunakan. Sesuaikan produk dengan konsentrasi rekayasa perangkat lunak atau gim, lalu uji skenario pengguna.",
    "12": "Satukan komponen menjadi produk yang dapat diuji dan dipasang pada lingkungan yang sesuai. Gunakan kendali versi, tinjau keamanan dan kualitas, kolaborasikan pekerjaan, lalu susun dokumentasi serta portofolio."
  },
  siaj: {
    "10": "Pelajari bagaimana perangkat, aplikasi, data, dan pengguna membentuk sistem informasi. Praktikkan penggunaan sistem operasi dan aplikasi perkantoran, pengenalan jaringan, serta keselamatan kerja digital.",
    "11": "Kelola alur informasi dan data menggunakan basis data serta layanan jaringan dasar. Latih integrasi aplikasi dan pencatatan konfigurasi agar perubahan sistem dapat ditelusuri.",
    "12": "Rencanakan pemeliharaan dan penanganan gangguan layanan secara sistematis. Integrasikan otomasi atau aplikasi dalam proyek kecil, uji hasilnya, dan siapkan dokumentasi serta portofolio."
  },
  akl: {
    "10": "Gunakan bukti transaksi untuk mengenali akun dan dampaknya pada persamaan aset = liabilitas + ekuitas. Latih pencatatan debit-kredit, pemindahbukuan ke buku besar, dan pemeriksaan data dengan spreadsheet.",
    "11": "Susun neraca saldo dan jurnal penyesuaian dari data periode berjalan. Gunakan kertas kerja untuk menyiapkan laporan keuangan, kemudian bandingkan proses sesuai konsentrasi dan aturan sekolah.",
    "12": "Tuntaskan siklus akuntansi, koreksi, dan rekonsiliasi menggunakan dokumen yang dapat ditelusuri. Praktikkan aplikasi akuntansi dan analisis laporan secara hati-hati; validasi hasil terhadap bukti sumber."
  },
  mplb: {
    "10": "Latih komunikasi profesional, pengelolaan surat dan dokumen, kearsipan, serta aplikasi perkantoran. Gunakan prosedur layanan pelanggan dan jaga kerahasiaan informasi dalam simulasi kantor.",
    "11": "Atur agenda, rapat, korespondensi, dan arsip digital dengan penamaan serta alur penyimpanan yang konsisten. Pilih cara layanan berdasarkan kebutuhan pengguna dan catat tindak lanjut.",
    "12": "Jalankan simulasi proses administrasi bisnis dari penerimaan permintaan hingga dokumentasi hasil. Evaluasi mutu layanan, perbaiki alur kerja, dan susun portofolio yang tidak memuat data pribadi."
  },
  marketing: {
    "10": "Pahami kebutuhan konsumen dan nilai produk sebelum merancang pelayanan atau penjualan. Praktikkan penataan produk, komunikasi penawaran, serta pemasaran digital dasar secara jujur.",
    "11": "Gunakan riset sederhana untuk mengenali segmen pasar dan memilih promosi yang sesuai. Catat hasil penjualan, layanan purnajual, serta umpan balik untuk memperbaiki pengalaman pelanggan.",
    "12": "Rencanakan kampanye terpadu dengan sasaran dan indikator yang jelas. Analisis hasil, kelola hubungan pelanggan secara etis, dan susun rencana usaha berdasarkan data serta biaya yang realistis."
  },
  dkv: {
    "10": "Amati unsur garis, bentuk, warna, ruang, dan prinsip komposisi. Terapkan pada ilustrasi, tipografi, fotografi, dan desain digital untuk menyampaikan pesan visual yang terbaca.",
    "11": "Kembangkan konsep dan tata letak berdasarkan brief. Kelola aset visual, bangun identitas yang konsisten, lalu gunakan umpan balik untuk merevisi karya sesuai kebutuhan media dan konsentrasi.",
    "12": "Susun alur proyek dari brief, konsep, produksi, hingga presentasi kepada klien simulasi. Periksa lisensi aset dan hak cipta, evaluasi hasil, lalu kurasi portofolio dengan konteks karya."
  },
  animation: {
    "10": "Latih prinsip gerak melalui pose, timing, ekspresi, dan storyboard sederhana. Rancang karakter dan urutan adegan agar gerakan mudah dibaca sebelum diproduksi sebagai animasi dasar.",
    "11": "Bangun karakter dan lingkungan yang konsisten, lalu praktikkan alur animasi sesuai konsentrasi 2D atau 3D. Evaluasi gerak, komposisi, pencahayaan, dan kesinambungan adegan.",
    "12": "Rencanakan produksi terintegrasi dengan pembagian tugas, jadwal, dan spesifikasi keluaran. Selesaikan render dan pascaproduksi, lakukan pemeriksaan mutu, kemudian dokumentasikan kontribusi dalam portofolio."
  },
  film: {
    "10": "Ubah gagasan menjadi naskah singkat dan rencana gambar. Kenali ukuran shot, komposisi, suara, serta penyuntingan dasar untuk menyusun cerita audiovisual yang jelas.",
    "11": "Kembangkan naskah dan storyboard menjadi rencana produksi. Latih tata kamera, pencahayaan, suara, dan penyuntingan sesuai fokus film atau program televisi dengan koordinasi kru.",
    "12": "Susun jadwal, kebutuhan kru, lokasi, dan rencana pascaproduksi. Periksa kesinambungan, hak penggunaan materi, etika publikasi, serta mutu hasil sebelum menyajikannya sebagai portofolio."
  },
  automotive: {
    "10": "Kenali alat bengkel dan fungsi alat ukur sebelum digunakan. Baca gambar teknik sederhana, pahami prinsip mesin dan kelistrikan kendaraan, serta ikuti SOP dan APD bengkel.",
    "11": "Pelajari sistem kendaraan sesuai konsentrasi melalui pemeriksaan terarah dan perawatan berkala. Gunakan alat sesuai petunjuk, bandingkan gejala dengan hasil ukur, dan dokumentasikan diagnosis.",
    "12": "Susun urutan diagnosis, perbaikan, dan pemeriksaan akhir berdasarkan panduan pabrikan serta arahan guru. Verifikasi fungsi dan keselamatan kendaraan, lalu catat kendali mutu pekerjaan."
  },
  electronics: {
    "10": "Bedakan komponen dasar dan simbol rangkaian. Latih pengukuran tegangan, arus, dan resistansi pada rangkaian praktik bertegangan rendah sesuai arahan guru serta prosedur keselamatan.",
    "11": "Analisis hubungan komponen dalam rangkaian sebelum merakit. Gunakan instrumen ukur dengan rentang yang tepat, uji fungsi secara bertahap, dan dokumentasikan hasil sesuai konsentrasi.",
    "12": "Telusuri gangguan rangkaian dengan pemeriksaan visual dan pengukuran aman. Lakukan perbaikan hanya di bawah prosedur praktik, kemudian uji kembali, catat hasil, dan evaluasi mutu."
  },
  electricity: {
    "10": "Kenali besaran listrik, satuan, simbol, dan hubungan sederhana dalam rangkaian. Baca komponen instalasi serta alat ukur; praktik hanya pada media aman di bawah pengawasan guru.",
    "11": "Baca diagram instalasi dan cocokkan dengan komponen serta perlindungannya. Latih pemeriksaan dan pengujian pada papan praktik sesuai SOP, termasuk isolasi sumber dan penggunaan alat pelindung.",
    "12": "Rencanakan pemeliharaan dan diagnosis dengan merujuk gambar kerja serta standar sekolah. Catat hasil pengujian, temuan, dan tindakan; pekerjaan instalasi nyata harus mengikuti aturan dan pengawasan kompeten."
  },
  mechanical: {
    "10": "Baca garis, ukuran, dan simbol pada gambar teknik. Latih pengukuran serta pengenalan bahan dan kerja bangku; pahami penjepitan benda, penggunaan APD, dan keselamatan mesin.",
    "11": "Tafsirkan gambar kerja dan toleransi sebelum memilih proses pemesinan atau pengelasan sesuai konsentrasi. Rencanakan urutan kerja, ukur hasil, dan ikuti instruksi pengoperasian bengkel.",
    "12": "Rencanakan pembuatan komponen dari gambar hingga inspeksi. Pilih urutan proses yang sesuai arahan, periksa dimensi dan mutu, rawat peralatan, serta dokumentasikan penyimpangan dan perbaikannya."
  },
  construction: {
    "10": "Kenali gambar bangunan, bahan konstruksi, dan alat ukur dasar. Latih membaca ukuran serta membuat sketsa sederhana; terapkan pembatasan area kerja dan keselamatan proyek.",
    "11": "Baca gambar kerja untuk menentukan pengukuran, pematokan, dan kebutuhan bahan. Kerjakan simulasi sesuai konsentrasi, periksa ukuran beberapa kali, serta ikuti prosedur keselamatan.",
    "12": "Susun rencana pekerjaan dan kebutuhan bahan dari dokumen proyek. Pantau mutu, waktu, serta biaya dalam latihan; dokumentasikan perubahan dan rencana perawatan bangunan."
  },
  culinary: {
    "10": "Terapkan kebersihan diri, sanitasi area, dan pemisahan bahan mentah dari makanan siap santap. Kenali bahan, alat, teknik pengolahan, dan penyajian di bawah aturan dapur sekolah.",
    "11": "Rencanakan menu, porsi, bahan, dan urutan kerja sesuai konsentrasi. Praktikkan teknik pengolahan serta penyajian sambil menjaga suhu, kebersihan, dan konsistensi mutu.",
    "12": "Rencanakan produksi kuliner dengan pencatatan bahan, persediaan, dan biaya. Kembangkan produk, kendalikan keamanan pangan sesuai SOP sekolah, lalu evaluasi layanan dan hasil."
  },
  hospitality: {
    "10": "Kenali fungsi front office dan tata graha dalam perjalanan tamu. Latih salam, komunikasi, pemeriksaan kamar simulasi, dan pencatatan permintaan dengan menjaga privasi tamu.",
    "11": "Praktikkan alur reservasi dan layanan tamu menggunakan skenario. Periksa kamar memakai daftar periksa, koordinasikan informasi antardepartemen, serta patuhi prosedur keselamatan kerja.",
    "12": "Tangani simulasi kebutuhan dan keluhan dengan mendengar, mengonfirmasi, dan meneruskan sesuai kewenangan. Catat tindak lanjut, evaluasi mutu layanan, dan jaga keamanan data tamu."
  },
  tourism: {
    "10": "Kenali unsur destinasi dan kebutuhan wisatawan. Latih komunikasi yang ramah dan informasi faktual; bedakan informasi terverifikasi dari promosi dan hormati budaya serta lingkungan setempat.",
    "11": "Rancang layanan perjalanan atau pemanduan berdasarkan jadwal, dokumen, dan profil peserta. Periksa informasi destinasi dan siapkan komunikasi serta langkah keselamatan sesuai prosedur.",
    "12": "Susun paket perjalanan dengan rute, waktu, kebutuhan peserta, dan rencana cadangan. Evaluasi layanan dari umpan balik, kelola perubahan secara bertanggung jawab, lalu dokumentasikan portofolio."
  },
  beauty: {
    "10": "Pahami kebersihan tangan, sanitasi alat, dan penataan area layanan. Kenali bahan serta peralatan, lakukan konsultasi dasar, dan hentikan praktik bila ada risiko atau iritasi.",
    "11": "Mulai layanan dari konsultasi dan analisis kebutuhan, kemudian pilih prosedur serta produk yang diizinkan sekolah. Jaga sanitasi antar-pelanggan dan komunikasikan batas layanan secara etis.",
    "12": "Rencanakan layanan, evaluasi hasil berdasarkan kebutuhan pelanggan, dan dokumentasikan persetujuan serta tindak lanjut. Kelola biaya dan usaha sederhana dengan memprioritaskan keselamatan dan etika."
  },
  fashion: {
    "10": "Kenali karakter bahan tekstil dan alat jahit. Latih pengukuran, sketsa desain, pola dasar, serta jahitan sederhana; perhatikan keselamatan penggunaan jarum dan mesin.",
    "11": "Kembangkan pola dan konstruksi sesuai desain serta ukuran. Pilih bahan dan teknik produksi yang tepat, lakukan uji pas, lalu perbaiki hasil jahitan dan penyelesaian busana.",
    "12": "Rencanakan koleksi dari konsep, bahan, pola, hingga produksi. Hitung kebutuhan serta biaya, periksa mutu dan ukuran, lalu presentasikan karya beserta prosesnya dalam portofolio."
  },
  agribusiness: {
    "10": "Kenali alur agribisnis dari sarana produksi hingga hasil. Identifikasi alat, bahan, dan risiko kerja; praktikkan pencatatan sederhana serta prosedur aman sesuai bidang yang dibuka sekolah.",
    "11": "Laksanakan kegiatan produksi sesuai konsentrasi dan kalender praktik. Pantau kondisi sarana, catat input serta hasil, dan gunakan kriteria mutu yang ditetapkan guru.",
    "12": "Rencanakan skala produksi, pengolahan, dan pemasaran hasil berdasarkan data. Hitung biaya serta potensi usaha secara sederhana, evaluasi mutu, dan susun portofolio praktik."
  },
  maritime: {
    "10": "Kenali lingkungan kerja maritim, peralatan, istilah dasar, dan dampak kegiatan terhadap lingkungan. Pelajari prosedur keselamatan umum; praktik teknis hanya dengan instruktur dan SOP.",
    "11": "Latih prosedur operasional dan perawatan peralatan pada simulasi sesuai konsentrasi sekolah. Gunakan daftar periksa, komunikasikan kondisi tidak aman, dan catat pekerjaan.",
    "12": "Rencanakan tugas operasional dan pemeriksaan mutu berdasarkan prosedur yang berlaku di sekolah. Analisis masalah pada studi kasus, utamakan keselamatan, dan dokumentasikan praktik serta kompetensi."
  },
  energy: {
    "10": "Kenali proses dasar energi atau pertambangan, alat ukur, dan potensi bahaya di tempat kerja. Pelajari pengendalian risiko serta perlindungan lingkungan sebelum praktik simulasi.",
    "11": "Pelajari pemantauan dan pengoperasian peralatan melalui studi kasus sesuai konsentrasi sekolah. Baca instruksi, periksa kondisi alat, dan laporkan anomali; jangan melakukan operasi nyata tanpa supervisi.",
    "12": "Gunakan data simulasi untuk merencanakan pemeliharaan, diagnosis, dan kendali mutu. Dokumentasikan temuan serta dampak lingkungan; kegiatan lapangan harus tunduk pada prosedur dan pengawasan resmi."
  },
  healthcare: {
    "10": "Pelajari komunikasi yang menghormati penerima layanan, privasi, etika, dan keselamatan kerja. Kenali batas peran siswa serta pentingnya mengikuti arahan pembimbing dalam setiap simulasi.",
    "11": "Latih dokumentasi dan komunikasi layanan pada skenario terkontrol sesuai konsentrasi. Jaga kerahasiaan, minta bantuan untuk kondisi di luar kewenangan, dan ikuti prosedur keselamatan sekolah.",
    "12": "Koordinasikan skenario layanan dan evaluasi mutu menggunakan data simulasi yang aman. Refleksikan etika, dokumentasi, serta batas kompetensi; praktik nyata wajib mengikuti aturan dan supervisi."
  },
  pharmacy: {
    "10": "Kenali fungsi alat dan bahan farmasi dalam pembelajaran, kebersihan, pelabelan, serta etika layanan. Jangan menggunakan atau memberikan obat; semua praktik mengikuti arahan guru.",
    "11": "Pelajari pencatatan dan pengelolaan simulasi sesuai kurikulum sekolah. Periksa kelengkapan informasi dan prinsip penyimpanan pada skenario pembelajaran; pekerjaan terkait obat harus diawasi tenaga berwenang.",
    "12": "Evaluasi mutu dokumentasi dan keselamatan pada studi kasus farmasi. Latih komunikasi yang jelas dan rujukan kepada pembimbing; keputusan terapi dan penyerahan obat bukan kewenangan siswa."
  },
  "health-services": {
    "10": "Kenali alur layanan kesehatan, komunikasi sopan, higiene, dan dokumentasi dasar. Jaga privasi serta pahami batas peran siswa; lakukan simulasi hanya sesuai arahan pembimbing.",
    "11": "Latih pencatatan dan komunikasi antarpetugas pada skenario layanan yang disetujui sekolah. Terapkan keselamatan penerima layanan dan laporkan situasi yang melampaui kemampuan siswa.",
    "12": "Koordinasikan studi kasus layanan dan evaluasi kelengkapan dokumentasi serta mutu. Gunakan skenario tanpa data pribadi; tindakan nyata harus sesuai prosedur dan supervisi tenaga berwenang."
  },
  "performing-arts": {
    "10": "Kenali unsur pertunjukan dan latih teknik dasar serta ekspresi secara bertahap. Gunakan pemanasan, ruang latihan yang aman, disiplin waktu, dan umpan balik yang menghargai.",
    "11": "Kembangkan teknik sesuai konsentrasi melalui latihan terstruktur. Tafsirkan karya, bekerja sama dalam produksi, dan gunakan evaluasi untuk memperbaiki konsistensi serta komunikasi panggung.",
    "12": "Rencanakan produksi dari konsep dan latihan hingga pementasan. Bagi peran, atur kebutuhan teknis serta keselamatan, evaluasi pertunjukan, dan dokumentasikan karya untuk portofolio."
  }
};
