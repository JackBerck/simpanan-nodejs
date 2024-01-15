const {
  inputData,
  daftarDataMahasiswa,
  cariDataMahasiswa,
  hapusDataMahasiswa,
} = require("./data-mahasiswa");
const yargs = require("yargs");

yargs
  .command({
    command: "add",
    describe: "Menambahkan data mahasiswa baru",
    builder: {
      nama: {
        describe: "Nama Lengkap",
        demandOption: true,
        type: "string",
      },
      nim: {
        describe: "Nomor Induk Mahasiswa",
        demandOption: true,
        type: "string",
      },
      ipk: {
        describe: "Indeks Prestasi Komulatif",
        demandOption: true,
        type: "string",
      },
    },
    handler(argv) {
      inputData(argv.nama, argv.nim, argv.ipk);
    },
  })
  .demandCommand();

yargs.command({
  command: "list",
  describe: "Menampilan daftar data mahasiswa",
  handler() {
    daftarDataMahasiswa();
  },
});

yargs.command({
  command: "detail",
  describe: "Menampilan data detail mahasiswa berdasarkan nama",
  builder: {
    nama: {
      describe: "Nama Lengkap",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    cariDataMahasiswa(argv.nama);
  },
});

yargs.command({
  command: "delete",
  describe: "Menghapus data mahasiswa berdasarkan nama",
  builder: {
    nama: {
      describe: "Nama Lengkap",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    hapusDataMahasiswa(argv.nama);
  },
});

// menampilkan daftar data mahasiswa

yargs.parse();
