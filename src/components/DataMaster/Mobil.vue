<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">Data Mobil</h3>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>

        <v-spacer></v-spacer>

        <v-btn class="mx-2" fab dark color="blue" @click="dialog = true">
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table :headers="headers" :items="mobils" :search="search">
        <template v-slot:[`item.status_ketersediaan`]="{ item }">
          <span v-if="item.status_ketersediaan == 'tersedia'">
            <v-chip color="green">Tersedia</v-chip>
          </span>
          <span v-if="item.status_ketersediaan == 'tidak tersedia'">
            <v-chip color="red">Tidak Tersedia</v-chip>
          </span>
        </template>
        <template v-slot:[`item.kategori_aset`]="{ item }">
          <span v-if="item.kategori_aset == 'mitra'">
            <v-chip color="yellow">Mitra</v-chip>
          </span>
          <span v-if="item.kategori_aset == 'perusahaan'">
            <v-chip color="blue">Perusahaan</v-chip>
          </span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item-title>
                <v-btn @click="editHandler(item)"> Edit Mobil </v-btn>
              </v-list-item-title>
              <v-list-item-title>
                <v-btn @click="detailHandler(item)"> Detail Mobil </v-btn>
              </v-list-item-title>
              <v-list-item-title>
                <v-btn @click="showHandler(item)"> Foto Mobil </v-btn>
              </v-list-item-title>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Mobil</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_mobil"
              label="Nama Mobil"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.jenis_transmisi"
              label="Jenis Transmisi"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.bahan_bakar"
              label="Bahan bakar"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.warna"
              label="Warna mobil"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.volume_bagasi"
              label="Volume Bagasi"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.fasilitas"
              label="Fasilitas"
              required
            ></v-text-field>
            <v-select
              :items="kepemilikan"
              v-model="form.kategori_aset"
              label="Kepemilikan"
              item-value="value"
              item-text="text"
            ></v-select>
            <v-select
              :items="statusKetersediaan"
              v-model="form.status_ketersediaan"
              label="Status Mobil"
              item-value="value"
              item-text="text"
            ></v-select>
            <v-text-field
              v-model="form.plat_nomor"
              label="Plat Nomor"
              required
            ></v-text-field>
            <v-file-input
              rounded
              filled
              prepend-icon="mdi-camera"
              label="Foto Mobil"
              id="file"
              ref="fileGambar"
            ></v-file-input>
            <v-select
              :items="tipeMobil"
              v-model="form.tipe_mobil"
              label="Tipe Mobil"
              item-value="value"
              item-text="text"
            ></v-select>
            <v-text-field
              v-model="form.kapasitas"
              label="Kapasitas"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.biaya_sewa"
              label="Biaya sewa"
              required
            ></v-text-field>
            <v-text-field
              type="date"
              v-model="form.last_service"
              label="Tanggal terakhir service"
              required
            ></v-text-field>
            <v-text-field
              type="date"
              v-model="form.awal_kontrak"
              label="Tanggal awal kontrak"
              required
            ></v-text-field>
            <v-text-field
              type="date"
              v-model="form.akhir_kontrak"
              label="Tanggal akhir kontrak"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.nomor_stnk"
              label="Nomor STNK"
              required
            ></v-text-field>
            <v-select
              :items="mitras"
              clearable
              v-model="form.id_mitra"
              label="Nama Mitra"
              item-value="id_mitra"
              item-text="nama_mitra"
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Close </v-btn>
          <v-btn color="blue darken-1" text @click="dialogConfirm = true">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogDetail" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Mobil</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              readonly
              v-model="form.nama_mobil"
              label="Nama Mobil"
              required
            ></v-text-field>
            <v-text-field
              readonly
              v-model="form.jenis_transmisi"
              label="Jenis Transmisi"
              required
            ></v-text-field>
            <v-text-field
              readonly
              v-model="form.bahan_bakar"
              label="Bahan bakar"
              required
            ></v-text-field>
            <v-text-field
              readonly
              v-model="form.warna"
              label="Warna mobil"
              required
            ></v-text-field>
            <v-text-field
              readonly
              v-model="form.volume_bagasi"
              label="Volume Bagasi"
              required
            ></v-text-field>
            <v-text-field
              readonly
              v-model="form.fasilitas"
              label="Fasilitas"
              required
            ></v-text-field>
            <v-select
              :items="kepemilikan"
              readonly
              v-model="form.kategori_aset"
              label="Kepemilikan"
              item-value="value"
              item-text="text"
            ></v-select>
            <v-select
              :items="statusKetersediaan"
              readonly
              v-model="form.status_ketersediaan"
              label="Status Mobil"
              item-value="value"
              item-text="text"
            ></v-select>
            <v-text-field
              readonly
              v-model="form.plat_nomor"
              label="Plat Nomor"
              required
            ></v-text-field>
            <v-file-input
              readonly
              rounded
              filled
              prepend-icon="mdi-camera"
              label="Foto Mobil"
              id="file"
              ref="fileGambar"
            ></v-file-input>
            <v-select
              :items="tipeMobil"
              readonly
              v-model="form.tipe_mobil"
              label="Tipe Mobil"
              item-value="value"
              item-text="text"
            ></v-select>
            <v-text-field
              readonly
              v-model="form.kapasitas"
              label="Kapasitas"
              required
            ></v-text-field>
            <v-text-field
              readonly
              v-model="form.biaya_sewa"
              label="Biaya sewa"
              required
            ></v-text-field>
            <v-text-field
              readonly
              type="date"
              v-model="form.last_service"
              label="Tanggal terakhir service"
              required
            ></v-text-field>
            <v-text-field
              readonly
              type="date"
              v-model="form.awal_kontrak"
              label="Tanggal awal kontrak"
              required
            ></v-text-field>
            <v-text-field
              readonly
              type="date"
              v-model="form.akhir_kontrak"
              label="Tanggal akhir kontrak"
              required
            ></v-text-field>
            <v-text-field
              readonly
              v-model="form.nomor_stnk"
              label="Nomor STNK"
              required
            ></v-text-field>
            <v-select
              :items="mitras"
              clearable
              readonly
              v-model="form.id_mitra"
              label="Nama Mitra"
              item-value="id_mitra"
              item-text="nama_mitra"
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" text @click="cancel"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogFoto" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Foto Mobil</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              readonly
              v-model="form.updated_at"
              label="Terakhir Update"
              required
            ></v-text-field>
            <v-flex align-center>
              <v-img
                width="550px"
                :src="
                  previewImageUrl == ''
                    ? $baseUrl + '/storage/' + form.foto_mobil
                    : previewImageUrl
                "
                id="previewImage"
                class="mb-5"
              ></v-img>
            </v-flex>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" text @click="cancel"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Are you sure? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Yakin </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom
      >{{ error_message }}
    </v-snackbar>
  </v-main>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      inputType: "Tambah",
      load: false,
      snackbar: false,
      error_message: "",
      color: "",
      previewImageUrl: "",
      search: null,
      dialog: false,
      dialogFoto: false,
      dialogDetail: false,
      dialogConfirm: false,
      tipeMobil: [
        { text: "City car", value: "city car" },
        { text: "Sedan", value: "sedan" },
        { text: "MPV", value: "MPV" },
        { text: "SUV", value: "SUV" },
      ],
      kepemilikan: [
        { text: "Mitra", value: "mitra" },
        { text: "Perusahaan", value: "perusahaan" },
      ],
      statusKetersediaan: [
        { text: "Tersedia", value: "tersedia" },
        { text: "Tidak Tersedia", value: "tidak tersedia" },
      ],
      headers: [
        {
          text: "Nama Mobil",
          align: "start",
          sortable: true,
          value: "nama_mobil",
        },
        { text: "Biaya Sewa", value: "biaya_sewa" },
        { text: "Kategori Mobil", value: "tipe_mobil" },
        { text: "Plat Nomor", value: "plat_nomor" },
        { text: "Kategori Aset", value: "kategori_aset" },
        { text: "Status", value: "status_ketersediaan" },
        { text: "Action", value: "actions" },
      ],
      mobil: new FormData(),
      mobils: [],
      mitras: [],
      form: {
        id_mitra: [],
        nama_mobil: "",
        jenis_transmisi: "",
        bahan_bakar: "",
        warna: "",
        volume_bagasi: "",
        fasilitas: "",
        kategori_aset: "",
        status_ketersediaan: "",
        plat_nomor: "",
        foto_mobil: "",
        tipe_mobil: "",
        kapasitas: "",
        biaya_sewa: "",
        last_service: "",
        awal_kontrak: "",
        akhir_kontrak: "",
        updated_at: "",
        nomor_stnk: "",
      },
      deleteId: "",
      showId: "",
      editId: "",
    };
  },

  methods: {
    setForm() {
      if (this.inputType !== "Tambah") {
        this.update();
      } else if (this.inputType === "Show") {
        this.showData();
      } else {
        this.save();
      }
    },

    readData() {
      var url = this.$api + "/mobil";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mobils = response.data.data;
        });
    },

    readDataMitra() {
      var url = this.$api + "/mitrabystatus";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.mitras = response.data.data;
        });
    },

    save() {
      if (this.form.id_mitra > 0) {
        this.mobil.append("id_mitra", this.form.id_mitra);
      } else {
        this.mobil.append("id_mitra", []);
      }
      this.mobil.append("nama_mobil", this.form.nama_mobil);
      this.mobil.append("jenis_transmisi", this.form.jenis_transmisi);
      this.mobil.append("bahan_bakar", this.form.bahan_bakar);
      this.mobil.append("warna", this.form.warna);
      this.mobil.append("volume_bagasi", this.form.volume_bagasi);
      this.mobil.append("fasilitas", this.form.fasilitas);
      this.mobil.append("plat_nomor", this.form.plat_nomor);
      var inputGambar = document.getElementById("file"),
        dataFile = inputGambar.files[0];
      this.mobil.append("foto_mobil", dataFile);
      this.mobil.append("tipe_mobil", this.form.tipe_mobil);
      this.mobil.append("kapasitas", this.form.kapasitas);
      this.mobil.append("biaya_sewa", this.form.biaya_sewa);
      this.mobil.append("last_service", this.form.last_service);
      this.mobil.append("awal_kontrak", this.form.awal_kontrak);
      this.mobil.append("akhir_kontrak", this.form.akhir_kontrak);
      this.mobil.append("nomor_stnk", this.form.nomor_stnk);
      this.mobil.append("status_ketersediaan", this.form.status_ketersediaan);
      var url = this.$api + "/mobil/";
      this.load = true;
      this.$http
        .post(url, this.mobil, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = true;
          location.reload();
          this.close();
          this.readData();
          this.resetForm();
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    onPreviewImage(e) {
      this.previewImageUrl = URL.createObjectURL(e);
    },

    update() {
      var data = new FormData(),
        inputGambar = document.getElementById("file"),
        dataFile = inputGambar.files[0];
      if (this.form.id_mitra > 0) {
        data.append("id_mitra", this.form.id_mitra);
      } else {
        data.append("id_mitra", []);
      }
      data.append("nama_mobil", this.form.nama_mobil);
      data.append("jenis_transmisi", this.form.jenis_transmisi);
      data.append("bahan_bakar", this.form.bahan_bakar);
      data.append("warna", this.form.warna);
      data.append("volume_bagasi", this.form.volume_bagasi);
      data.append("fasilitas", this.form.fasilitas);
      data.append("kategori_aset", this.form.kategori_aset);
      data.append("status_ketersediaan", this.form.status_ketersediaan);
      data.append("plat_nomor", this.form.plat_nomor);
      if (dataFile) {
        data.append("foto_mobil", dataFile);
      }
      data.append("tipe_mobil", this.form.tipe_mobil);
      data.append("kapasitas", this.form.kapasitas);
      data.append("biaya_sewa", this.form.biaya_sewa);
      data.append("last_service", this.form.last_service);
      data.append("awal_kontrak", this.form.awal_kontrak);
      data.append("akhir_kontrak", this.form.akhir_kontrak);
      data.append("nomor_stnk", this.form.nomor_stnk);

      var url = this.$api + "/mobil/" + this.editId;
      this.load = true;
      this.$http
        .post(url, data, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          location.reload();
          this.close();
          this.readData();
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    deleteData() {
      //mengahapus data
      var url = this.$api + "/mobil/" + this.deleteId;
      //data dihapus berdasarkan id
      this.$http
        .delete(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = false;
          this.close();
          this.readData(); //mengambil data
          this.resetForm();
          this.inputType = "Tambah";
        })
        .catch((error) => {
          this.error_message = error.response.data.message;
          this.color = "red";
          this.snackbar = true;
          this.load = false;
        });
    },

    editHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_mobil;
      this.form.id_mitra = item.id_mitra;
      this.form.nama_mobil = item.nama_mobil;
      this.form.jenis_transmisi = item.jenis_transmisi;
      this.form.bahan_bakar = item.bahan_bakar;
      this.form.warna = item.warna;
      this.form.volume_bagasi = item.volume_bagasi;
      this.form.fasilitas = item.fasilitas;
      this.form.kategori_aset = item.kategori_aset;
      this.form.status_ketersediaan = item.status_ketersediaan;
      this.form.plat_nomor = item.plat_nomor;
      this.form.foto_mobil = item.foto_mobil;
      this.form.tipe_mobil = item.tipe_mobil;
      this.form.kapasitas = item.kapasitas;
      this.form.biaya_sewa = item.biaya_sewa;
      this.form.last_service = item.last_service;
      this.form.awal_kontrak = item.awal_kontrak;
      this.form.akhir_kontrak = item.akhir_kontrak;
      this.form.nomor_stnk = item.nomor_stnk;
      this.dialog = true;
    },

    detailHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_mobil;
      this.form.id_mitra = item.id_mitra;
      this.form.nama_mobil = item.nama_mobil;
      this.form.jenis_transmisi = item.jenis_transmisi;
      this.form.bahan_bakar = item.bahan_bakar;
      this.form.warna = item.warna;
      this.form.volume_bagasi = item.volume_bagasi;
      this.form.fasilitas = item.fasilitas;
      this.form.kategori_aset = item.kategori_aset;
      this.form.status_ketersediaan = item.status_ketersediaan;
      this.form.plat_nomor = item.plat_nomor;
      this.form.foto_mobil = item.foto_mobil;
      this.form.tipe_mobil = item.tipe_mobil;
      this.form.kapasitas = item.kapasitas;
      this.form.biaya_sewa = item.biaya_sewa;
      this.form.last_service = item.last_service;
      this.form.awal_kontrak = item.awal_kontrak;
      this.form.akhir_kontrak = item.akhir_kontrak;
      this.form.nomor_stnk = item.nomor_stnk;
      this.dialogDetail = true;
    },

    showHandler(item) {
      this.inputType = "Ubah";
      this.editId = item.id_mobil;
      this.form.updated_at = item.updated_at;
      this.form.foto_mobil = item.foto_mobil;
      this.dialogFoto = true;
    },

    deleteHandler(id_mobil) {
      this.deleteId = id_mobil;
      this.dialogConfirm = true;
    },
    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.dialogConfirm = false;
      this.readData();
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogConfirm = false;
      this.dialogFoto = false;
      this.dialogDetail = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        id_mitra: "",
        nama_mobil: "",
        jenis_transmisi: "",
        bahan_bakar: "",
        warna: "",
        volume_bagasi: "",
        fasilitas: "",
        kategori_aset: "",
        status_ketersediaan: "",
        plat_nomor: "",
        foto_mobil: "",
        tipe_mobil: "",
        kapasitas: "",
        biaya_sewa: "",
        last_service: "",
        awal_kontrak: "",
        akhir_kontrak: "",
        nomor_stnk: "",
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readData();
    this.readDataMitra();
  },
};
</script>
