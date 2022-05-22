<template>
  <v-main>
    <v-app-bar color="deep-blue accent-4" dense dark>
      <v-toolbar-title>Atma Jaya Rental</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="btnLogin">Login </v-btn>
      <v-btn @click="dialog = true">Register</v-btn>
      <v-menu left bottom>
        <v-list>
          <v-list-item v-for="n in 5" :key="n" @click="() => {}">
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-carousel hide-delimiters>
      <v-carousel-item
        v-for="(item, i) in items"
        :key="i"
        :src="item.src"
      ></v-carousel-item>
    </v-carousel>

    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Registrasi Customer</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="form.nama_customer"
              label="Nama customer"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.alamat_customer"
              label="Alamat customer"
              required
            ></v-text-field>
            <v-text-field
              type="date"
              v-model="form.tgl_lahir"
              label="Tanggal lahir"
              required
            ></v-text-field>
            <v-select
              :items="jenisKelamin"
              v-model="form.jenis_kelamin"
              label="Jenis Kelamin"
              item-value="value"
              item-text="text"
            ></v-select>
            <v-text-field
              v-model="form.email_customer"
              label="Email Customer"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.no_telp"
              label="Nomor Telepon"
              required
            ></v-text-field>
            <v-file-input
              rounded
              filled
              prepend-icon="mdi-camera"
              label="Upload Berkas"
              id="file"
              ref="fileGambar"
            ></v-file-input>
            <v-text-field
              v-model="form.nomor_kartupengenal"
              label="Nomor KTP / KTM"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.no_sim"
              label="Nomor SIM"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.asal_customer"
              label="Asal Customer"
              required
            ></v-text-field>
            <v-text-field
              v-model="form.usia_customer"
              label="Usia Customer"
              required
            ></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom
      >{{ error_message }}
    </v-snackbar>

    <h2><center>Data Mobil</center></h2>
    <v-row>
      <v-col v-for="(item, index) in mobils" :key="index" md="4">
        <v-card class="mx-auto" max-width="344">
          <v-img
            :src="$baseUrl + '/storage/' + item.foto_mobil"
            height="200px"
          ></v-img>

          <v-card-title> {{ item.nama_mobil }} </v-card-title>

          <v-card-subtitle>
            {{ item.status_ketersediaan }} -
            {{ item.biaya_sewa }}</v-card-subtitle
          >

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn icon @click="show = !show">
              <v-icon>{{
                show ? "mdi-chevron-up" : "mdi-chevron-down"
              }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="show">
              <v-divider></v-divider>

              <v-card-text>
                {{ item.fasilitas }} - {{ item.bahan_bakar }}
              </v-card-text>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>
    </v-row>

    <v-parallax
      height="300"
      src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
    >
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="text-h4 font-weight-thin mb-4">
            Bagaimana Cara Pemesanan?
          </h1>
          <h4 class="subheading">1. Daftarkan akun Anda</h4>
          <h4 class="subheading">2. Pilih mobil dan driver</h4>
          <h4 class="subheading">3. Isi form pemesanan</h4>
          <h4 class="subheading">4. Lakukan Pembayaran secara online</h4>
        </v-col>
      </v-row>
    </v-parallax>

    <h2>Kunjungi Kami di</h2>
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.0981282211415!2d110.41394041477812!3d-7.779419494393565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59f1fb2f2b45%3A0x20986e2fe9c79cdd!2sUniversitas%20Atma%20Jaya%20Yogyakarta%20-%20Kampus%203%20Gedung%20Bonaventura%20Babarsari!5e0!3m2!1sid!2sid!4v1651153750380!5m2!1sid!2sid"
      width="600"
      height="450"
      style="border: 0"
      allowfullscreen=""
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    >
    </iframe>

    <h2><center>Promo Berlaku</center></h2>
    <v-row>
      <v-col v-for="(item, index) in promos" :key="index" md="4">
        <v-card class="mx-auto" max-width="344">
          <v-card-title>
            {{ item.jenis_promo }} - {{ item.kode_promo }}
          </v-card-title>

          <v-card-subtitle>
            {{ item.keterangan }} - {{ item.status_promo }}
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-footer padless>
      <v-col class="text-center" cols="12">
        {{ new Date().getFullYear() }} —
        <strong>Michael Edward Setiawan - UAJY</strong>
      </v-col>
    </v-footer>
  </v-main>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      snackbar: false,
      show: false,
      items: [
        {
          src: "https://rodakencana.com/wp-content/uploads/2020/07/rental-mobil-dengan-driver.jpg",
        },
        {
          src: "https://senayanrentcar.co.id/wp-content/uploads/2021/11/driverrr-1-1389x800.png",
        },
        {
          src: "https://apollo-singapore.akamaized.net/v1/files/vzwawslkrb1z2-ID/image",
        },
      ],
      dialog: false,
      jenisKelamin: [
        { text: "Laki Laki", value: "laki-laki" },
        { text: "Perempuan", value: "perempuan" },
      ],
      customer: new FormData(),
      customers: [],
      promos: [],
      mobils: [],
      form: {
        nama_customer: [],
        alamat_customer: [],
        tgl_lahir: [],
        jenis_kelamin: [],
        email_customer: [],
        no_telp: [],
        upload_berkas: [],
        status_berkas: [],
        nomor_kartupengenal: [],
        no_sim: [],
        asal_customer: [],
        usia_customer: [],
      },
    };
  },
  methods: {
    btnLogin() {
      this.$router.push("/login");
    },
    save() {
      this.customer.append("nama_customer", this.form.nama_customer);
      this.customer.append("alamat_customer", this.form.alamat_customer);
      this.customer.append("tgl_lahir", this.form.tgl_lahir);
      this.customer.append("jenis_kelamin", this.form.jenis_kelamin);
      this.customer.append("email_customer", this.form.email_customer);
      this.customer.append("no_telp", this.form.no_telp);
      var inputGambar = document.getElementById("file"),
        dataFile = inputGambar.files[0];
      this.customer.append("upload_berkas", dataFile);
      this.customer.append("status_berkas", this.form.status_berkas);
      this.customer.append(
        "nomor_kartupengenal",
        this.form.nomor_kartupengenal
      );
      this.customer.append("no_sim", this.form.no_sim);
      this.customer.append("asal_customer", this.form.asal_customer);
      this.customer.append("usia_customer", this.form.usia_customer);
      this.customer.append("status_berkas", []);

      var url = this.$api + "/customer/";
      this.load = true;
      this.$http
        .post(url, this.customer, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.error_message = response.data.message;
          this.color = "blue";
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
    readData() {
      var url = this.$api + "/promo";
      this.$http
        .get(url, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((response) => {
          this.promos = response.data.data;
        });
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogConfirm = false;
      this.dialogFoto = false;
      this.inputType = "Tambah";
    },
    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.dialogConfirm = false;
      this.readData();
    },
    resetForm() {
      this.form = {
        nama_customer: [],
        alamat_customer: [],
        tgl_lahir: [],
        jenis_kelamin: [],
        email_customer: [],
        no_telp: [],
        upload_berkas: [],
        status_berkas: [],
        nomor_kartupengenal: [],
        no_sim: [],
        asal_customer: [],
        password: [],
        usia_customer: [],
      };
    },
  },
  mounted() {
    this.readData();

    this.$http
      .get(this.$api + "/mobil")
      .then((response) => {
        this.mobils = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get(this.$api + "/promo")
      .then((response) => {
        this.promos = response.data.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}

#app {
  margin-top: 0;
}
</style>
