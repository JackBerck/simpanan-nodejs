// standar core modules
const fs = require("node:fs");
const chalk = require("chalk");
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const { resolve } = require("node:path");
const { rejects } = require("node:assert");
const rl = readline.createInterface({ input, output });
const validator = require("validator");
const Table = require("cli-table");

// membuat folder data jika belum ada
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdir("./data");
}

// membuat folder data jika belum ada
const filePath = "./data/dataMahasiswa.json";
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, "[]", "utf-8");
}

// inputan atau pertanyaan data mahasiswa menggunakan promise
// membuat pertanyaan nama
// const question = (text) => {
//   return new Promise((resolve, reject) => {
//     rl.question(text, (answer) => {
//       resolve(answer);
//     });
//   });
// };

const loadData = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Terjadi kesalahan saat membaca file:", err);
        reject(err);
        return;
      }

      let dataMahasiswa;

      dataMahasiswa = JSON.parse(data);
      resolve(dataMahasiswa);
    });
  });
};

const inputData = async (nama, nim, ipk) => {
  const Mahasiswa = { nama, nim, ipk };
  const dataMahasiswa = await loadData();

  // cek nama hanya ada huruf saja tidak boleh angka
  if (!validator.isAlpha(nama)) {
    console.log(chalk.bold.red("Nama harus berupa huruf, tidak boleh angka!"));
    return false;
  }

  // cek ipk hanya ada angka saja tidak boleh huruf
  if (!validator.isNumeric(ipk)) {
    console.log(chalk.bold.red("IPK harus berupa angka, tidak boleh huruf!"));
    return false;
  }

  // cek duplikasi data mahasiswa
  const dupMahasiswa = dataMahasiswa.find(
    (mahasiswa) => mahasiswa.nama === nama
  );

  if (dupMahasiswa) {
    console.log(chalk.bold.red("Data yang Anda masukkan sudah ditambahkan!"));
    return false;
  }

  dataMahasiswa.push(Mahasiswa);

  fs.writeFile(filePath, JSON.stringify(dataMahasiswa), (writeErr) => {
    if (writeErr) {
      console.error("Terjadi kesalahan saat menulis ke file:", writeErr);
    } else {
      console.log("Data berhasil ditambahkan.");
    }
  });

  rl.close();
};

const daftarDataMahasiswa = async () => {
  try {
    const dataMahasiswa = await loadData();
    const table = new Table({
      head: ["No", "Nama", "NIM", "IPK"],
      colWidths: [5, 25, 15, 10],
      style: { head: ["cyan"] },
    });

    if (dataMahasiswa.length === 0) {
      console.log(chalk.yellow("Tidak ada data mahasiswa."));
      rl.close();
      return;
    }

    console.log(chalk.bgCyanBright.grey("Daftar Data Mahasiswa"));
    dataMahasiswa.forEach((mahasiswa, i) => {
      table.push([i + 1, mahasiswa.nama, mahasiswa.nim, mahasiswa.ipk]);
    });
    console.log(table.toString());

    rl.close();
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    rl.close();
  }
};

const cariDataMahasiswa = async (nama) => {
  const dataMahasiswa = await loadData();
  const mahasiswa = dataMahasiswa.find(
    (m) => m.nama.toLowerCase() === nama.toLowerCase()
  );

  if (!mahasiswa) {
    console.log(chalk.bold.red("Mahasiswa tidak ditemukan!"));
    return false;
  }

  const table = new Table({
    head: ["No", "Nama", "NIM", "IPK"],
    colWidths: [5, 25, 15, 10],
    style: { head: ["cyan"] },
  });

  table.push([1, mahasiswa.nama, mahasiswa.nim, mahasiswa.ipk]);
  console.log(table.toString());

  return true;
};

// const hapusDataMahasiswa = async (nama) => {
//   const dataMahasiswa = await loadData();
//   const mahasiswa = dataMahasiswa.find(
//     (m) => m.nama.toLowerCase() === nama.toLowerCase()
//   );

//   if (!mahasiswa) {
//     console.log(chalk.bold.red("Mahasiswa tidak ditemukan!"));
//     return false;
//   }
// };

const hapusDataMahasiswa = async (nama) => {
  try {
    let dataMahasiswa = await loadData();
    const index = dataMahasiswa.findIndex(
      (m) => m.nama.toLowerCase() === nama.toLowerCase()
    );

    if (index === -1) {
      console.log(chalk.bold.red("Mahasiswa tidak ditemukan!"));
      return false;
    }

    dataMahasiswa.splice(index, 1);

    fs.writeFile(filePath, JSON.stringify(dataMahasiswa), (writeErr) => {
      if (writeErr) {
        console.error("Terjadi kesalahan saat menulis ke file:", writeErr);
      } else {
        console.log("Data berhasil dihapus.");
      }
      rl.close(); // Tambahkan ini jika diinginkan
    });

    return true;
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    rl.close(); // Tambahkan ini jika diinginkan
    return false;
  }
};

rl.close();

module.exports = {
  inputData,
  daftarDataMahasiswa,
  cariDataMahasiswa,
  hapusDataMahasiswa,
};
