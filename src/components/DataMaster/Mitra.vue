<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">Data Mitra</h3>

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
      <v-data-table :headers="headers" :items="mitras" :search="search">
        <template v-slot:[`item.is_aktif`]="{ item }">
          <span v-if="item.is_aktif == 1"
            ><v-chip color="green">Aktif</v-chip>
          </span>
          <span v-else><v-chip color="red">Tidak Aktif</v-chip> </span>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn icon small class="mr-2" @click="editHandler(item)">
            <v-icon color="red">mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }} Data Mitra</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_mitra"
              label="Nama Mitra"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.alamat"
              label="Alamat Mitra"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.nomor_ktp"
              label="Nomor KTP"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.nomor_telepon"
              label="Nomor Telepon"
              required
            ></v-text-field>
            <v-select
              :items="statusAktif"
              v-model="form.is_aktif"
              label="Status Mitra"
              item-value="value"
              item-text="text"
            ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus mitra ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
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
      search: null,
      dialog: false,
      dialogConfirm: false,
      statusAktif: [
        { text: "Aktif", value: 1 },
        { text: "Tidak Aktif", value: 0 },
      ],
      headers: [
        {
          text: "Nama Mitra",
          align: "start",
          sortable: true,
          value: "nama_mitra",
        },
        { text: "Alamat", value: "alamat" },
        { text: "Nomor KTP", value: "nomor_ktp" },
        { text: "Nomor Telepon", value: "nomor_telepon" },
        { text: "Status Aktif", value: "is_aktif" },
        { text: "Action", value: "actions" },
      ],
      mitra: new FormData(),
      mitras: [],
      form: {
        nama_mitra: "",
        alamat: "",
        nomor_ktp: "",
        nomor_telepon: "",
        is_aktif: "",
      },
      deleteId: "",
      editId: "",
    };
  },

  methods: {
    setForm() {
      if (this.inputType !== "Tambah") {
        this.update();
      } else {
        this.save();
      }
    },

    readData() {
      var url = this.$api + "/mitra";
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
      this.mitra.append("nama_mitra", this.form.nama_mitra);
      this.mitra.append("alamat", this.form.alamat);
      this.mitra.append("nomor_ktp", this.form.nomor_ktp);
      this.mitra.append("nomor_telepon", this.form.nomor_telepon);
      this.mitra.append("is_aktif", this.form.is_aktif);

      var url = this.$api + "/mitra/";
      this.load = true;
      this.$http
        .post(url, this.mitra, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "green";
          this.snackbar = true;
          this.load = true;
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

    update() {
      let newData = {
        nama_mitra: this.form.nama_mitra,
        alamat: this.form.alamat,
        nomor_ktp: this.form.nomor_ktp,
        nomor_telepon: this.form.nomor_telepon,
        is_aktif: this.form.is_aktif,
      };
      var url = this.$api + "/mitra/" + this.editId;
      this.load = true;
      this.$http
        .put(url, newData, {
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
      var url = this.$api + "/mitra/" + this.deleteId;
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
      this.editId = item.id_mitra;
      this.form.nama_mitra = item.nama_mitra;
      this.form.alamat = item.alamat;
      this.form.nomor_ktp = item.nomor_ktp;
      this.form.nomor_telepon = item.nomor_telepon;
      this.form.is_aktif = item.is_aktif;
      this.dialog = true;
    },

    deleteHandler(id_mitra) {
      this.deleteId = id_mitra;
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
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        nama_mitra: "",
        alamat: "",
        nomor_ktp: "",
        nomor_telepon: "",
        is_aktif: "",
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
  },
};
</script>
