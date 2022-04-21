<template>
<v-main>
    <v-app-bar
      color="deep-blue accent-4"
      dense
      dark
    >
      <v-toolbar-title>Atma Jaya Rental</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click=btnLogin>Login </v-btn>
      <v-btn @click="dialog = true">Register</v-btn>
      <v-menu
        left
        bottom
      >
        <v-list>
          <v-list-item
            v-for="n in 5"
            :key="n"
            @click="() => {}"
          >
            <v-list-item-title>Option {{ n }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  
        <v-carousel hide-delimiters>
    <v-carousel-item
      v-for="(item,i) in items"
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
            <v-text-field v-model="form.nama_customer" label="Nama customer" required></v-text-field>
            <v-text-field v-model="form.alamat_customer" label="Alamat customer" required></v-text-field>
            <v-text-field type="date" v-model="form.tgl_lahir" label="Tanggal lahir" required></v-text-field>
            <v-select :items="jenisKelamin" v-model="form.jenis_kelamin" label="Jenis Kelamin" item-value="value" item-text="text" ></v-select>
            <v-text-field v-model="form.email_customer" label="Email Customer" required></v-text-field>
            <v-text-field v-model="form.no_telp" label="Nomor Telepon" required></v-text-field>
            <v-file-input rounded filled prepend-icon="mdi-camera" label="Upload Berkas" id="file" ref="fileGambar"></v-file-input>
            <v-text-field v-model="form.nomor_kartupengenal" label="Nomor KTP / KTM" required></v-text-field>
            <v-text-field v-model="form.no_sim" label="Nomor SIM" required></v-text-field>
            <v-text-field v-model="form.asal_customer" label="Asal Customer" required></v-text-field>
            <v-text-field v-model="form.usia_customer" label="Usia Customer" required></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="close"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }} </v-snackbar>

</v-main>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
        snackbar: false,
        items: [
            {
                src: 'https://rodakencana.com/wp-content/uploads/2020/07/rental-mobil-dengan-driver.jpg',
            },
            {
                src: 'https://senayanrentcar.co.id/wp-content/uploads/2021/11/driverrr-1-1389x800.png',
            },
            {
                src: 'https://apollo-singapore.akamaized.net/v1/files/vzwawslkrb1z2-ID/image',
            },
            ],
        dialog: false,
        jenisKelamin: [
            { text: "Laki Laki", value: "laki-laki"},
            { text: "Perempuan", value: "perempuan"},
        ],
        customer: new FormData,
        customers: [],
        form:{
            nama_customer: null,
            alamat_customer: null,
            tgl_lahir: null,
            jenis_kelamin: null,
            email_customer: null,
            no_telp: null,
            upload_berkas: null,
            status_berkas: null,
            nomor_kartupengenal: null,
            no_sim: null,
            asal_customer: null,
            usia_customer: null
      },
    };
  },
  methods: {
    btnLogin(){
      this.$router.push("/login");
    },
    save(){
      this.customer.append('nama_customer',this.form.nama_customer);
      this.customer.append('alamat_customer',this.form.alamat_customer);
      this.customer.append('tgl_lahir',this.form.tgl_lahir);
      this.customer.append('jenis_kelamin', this.form.jenis_kelamin);
      this.customer.append('email_customer',this.form.email_customer);
      this.customer.append('no_telp',this.form.no_telp);
      var inputGambar = document.getElementById('file'),
      dataFile = inputGambar.files[0];
      this.customer.append('upload_berkas',dataFile);
      this.customer.append('status_berkas',this.form.status_berkas);
      this.customer.append('nomor_kartupengenal',this.form.nomor_kartupengenal);
      this.customer.append('no_sim',this.form.no_sim);
      this.customer.append('asal_customer',this.form.asal_customer);
      this.customer.append('password',this.form.password);
      this.customer.append('usia_customer',this.form.usia_customer);

      var url= this.$api + '/customer/'
      this.load = true;
      this.$http.post(url, this.customer, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "blue";
        this.snackbar = true;
        this.load = true;
        this.close();
        this.readData();
        this.resetForm();
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = "red";
        this.snackbar = true;
        this.load = false;
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
        nama_customer: null,
        alamat_customer: null,
        tgl_lahir: null,
        jenis_kelamin: null,
        email_customer: null,
        no_telp: null,
        upload_berkas: null,
        status_berkas: null,
        nomor_kartupengenal: null,
        no_sim: null,
        asal_customer: null,
        password: null,
        usia_customer: null
      };
    },
  },
};
</script> 


