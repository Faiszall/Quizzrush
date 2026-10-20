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
  ...[
    "Dasar-Dasar Program Keahlian",
    "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)",
    "Pengembangan Perangkat Lunak dan Gim (PPLG)",
    "Akuntansi dan Keuangan Lembaga (AKL)",
    "Manajemen Perkantoran dan Layanan Bisnis (MPLB)",
    "Desain Komunikasi Visual (DKV)",
    "Teknik Otomotif",
    "Pemasaran",
    "Kuliner",
    "Perhotelan",
    "Usaha Layanan Pariwisata",
    "Program Keahlian Lain"
  ].map((name, index) => catalogSubject("SMK", name, "kejuruan", {
    grades: index === 0 ? ["10", "11", "12"] : ["10", "11", "12"],
    icon: index === 0 ? "🧰" : "⚙️",
    optional: false,
    programId: ["foundation", "tjkt", "pplg", "akl", "mplb", "dkv", "automotive", "marketing", "culinary", "hospitality", "tourism", "other"][index],
    description: "Tampilkan hanya jika program dan konsentrasi ini tersedia di sekolah."
  }))
];

const VOCATIONAL_PROGRAMS = [
  { id: "tjkt", name: "Teknik Jaringan Komputer dan Telekomunikasi (TJKT)", concentrations: ["Teknik Komputer dan Jaringan", "Teknik Transmisi Telekomunikasi", "Lainnya"] },
  { id: "pplg", name: "Pengembangan Perangkat Lunak dan Gim (PPLG)", concentrations: ["Rekayasa Perangkat Lunak", "Pengembangan Gim", "Lainnya"] },
  { id: "akl", name: "Akuntansi dan Keuangan Lembaga (AKL)", concentrations: ["Akuntansi", "Perbankan", "Lainnya"] },
  { id: "mplb", name: "Manajemen Perkantoran dan Layanan Bisnis (MPLB)", concentrations: ["Manajemen Perkantoran", "Layanan Bisnis", "Lainnya"] },
  { id: "dkv", name: "Desain Komunikasi Visual (DKV)", concentrations: ["Desain Grafis", "Produksi Media", "Lainnya"] },
  { id: "automotive", name: "Teknik Otomotif", concentrations: ["Teknik Kendaraan Ringan", "Teknik Sepeda Motor", "Lainnya"] },
  { id: "marketing", name: "Pemasaran", concentrations: ["Bisnis Digital", "Retail", "Lainnya"] },
  { id: "culinary", name: "Kuliner", concentrations: ["Kuliner", "Patiseri", "Lainnya"] },
  { id: "hospitality", name: "Perhotelan", concentrations: ["Perhotelan", "Lainnya"] },
  { id: "tourism", name: "Usaha Layanan Pariwisata", concentrations: ["Usaha Perjalanan Wisata", "Pemanduan Wisata", "Lainnya"] },
  { id: "other", name: "Program keahlian lain", concentrations: ["Konsentrasi sesuai sekolah"] }
];
