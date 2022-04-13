<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">Data transaksi</h3>
    
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

        <v-btn color="blue" dark @click="dialog = true"> Tambah </v-btn>

      </v-card-title>
      <v-data-table :headers="headers" :items="transaksis" :search="search">

        <template v-slot:[`item.actions`]="{item}">
                <v-btn icon small class="mr-2" @click="editHandler(item)">
                  <v-icon color="red">mdi-pencil</v-icon>
                </v-btn>
                <!-- <v-btn icon small @click="deleteHandler(item.id_transaksi)">
                     <v-icon color="green">mdi-delete</v-icon>
                </v-btn> -->
            </template>

      </v-data-table>
    </v-card>
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{formTitle}} Data transaksi</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.nama_transaksi" label="Nama transaksi" required></v-text-field>
            <v-text-field v-model="form.alamat" label="Alamat transaksi" required></v-text-field>
            <v-text-field v-model="form.nomor_ktp" label="Nomor KTP" required></v-text-field>
            <v-text-field v-model="form.nomor_telepon" label="Nomor Telepon" required></v-text-field>
             <v-select :items="statusAktif" v-model="form.is_aktif" label="Status transaksi" item-value="value" item-text="text" ></v-select>
            
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
        <v-card-text> Anda yakin ingin menghapus transaksi ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

       <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }} </v-snackbar>

  </v-main>
</template>


<script>
export default {
  name: "List",
  data() {
    return {
      inputType: 'Tambah',
      load: false,
      snackbar: false,
      error_message: '',
      color: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      statusAktif:[
        { text: "Aktif", value: 1},
        { text: "Tidak Aktif", value: 0},
      ],
      headers: [
        { text: "ID Transaksi", align: "start", sortable: true, value: "id_transaksi"},
        { text: "Nama Customer", value: 'nama_customer'},
        { text: "Nama Driver", value: 'nama_driver'},
        { text: "Nama Pegawai", value: 'nama_pegawai'},
        { text: "Nama Mobil", value: 'nama_mobil'},
        { text: "Jenis Promo", value: 'jenis_promo'},
        { text: "Jumlah Potongan", value:'jumlah_potongan'},
        { text: "Action", value:'actions'},
      ],
      transaksi: new FormData,
      transaksis: [],
      mobils:[],
      customers: [],
      driver:[],
      promos:[],
      pegawais:[],
      form:{
        id_transaksi: null,
        id_promo: null,
        id_driver: null,
        id_pegawai: null,
        id_mobil: null,
        id_customer: null,
      },
      deleteId: '',
      editId: ''
    };
  },

  methods: {
    setForm(){
      if(this.inputType !== 'Tambah'){
        this.update();
      }
      else{
        this.save();
      }
    },

    readData(){
      var url = this.$api + '/transaksiall';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.transaksis = response.data.data;
      })
    },

    readDataPromo(){
      var url = this.$api + '/promo';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.promos = response.data.data;
      })
    },

    readDataDriver(){
      var url = this.$api + '/driver';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.drivers = response.data.data;
      })
    },

    readDataPegawai(){
      var url = this.$api + '/pegawai';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.pegawais = response.data.data;
      })
    },

    readDataMobil(){
      var url = this.$api + '/mobil';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.mobils = response.data.data;
      })
    },

    readDataCustomer(){
      var url = this.$api + '/customer';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.customers = response.data.data;
      })
    },

    save(){
      this.transaksi.append('nama_transaksi',this.form.nama_transaksi);
      this.transaksi.append('alamat',this.form.alamat);
      this.transaksi.append('nomor_ktp',this.form.nomor_ktp);
      this.transaksi.append('nomor_telepon', this.form.nomor_telepon);
      this.transaksi.append('is_aktif',this.form.is_aktif)

      var url= this.$api + '/transaksi/'
      this.load = true;
      this.$http.post(url, this.transaksi, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token'),
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = "green";
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

    update(){
      let newData = {
        nama_transaksi : this.form.nama_transaksi,
        alamat : this.form.alamat,
        nomor_ktp : this.form.nomor_ktp,
        nomor_telepon: this.form.nomor_telepon,
        is_aktif: this.form.is_aktif
      };
      var url = this.$api + '/transaksi/' + this.editId;
      this.load = true;
      this.$http.put(url, newData, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.error_message = response.data.message;
        this.color = 'green';
        this.snackbar = true;
        this.load = false;
        this.close();
        this.readData();
        this.resetForm();
        this.inputType = 'Tambah';
      }).catch(error => {
        this.error_message = error.response.data.message;
        this.color = 'red';
        this.snackbar = true;
        this.load = false;
      });
    },

    deleteData() {
      //mengahapus data
      var url = this.$api + '/transaksi/' + this.deleteId;
      //data dihapus berdasarkan id
      this.$http.delete(url, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
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

    editHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_transaksi;
      this.form.nama_transaksi = item.nama_transaksi;
      this.form.alamat = item.alamat;
      this.form.nomor_ktp = item.nomor_ktp;
      this.form.nomor_telepon = item.nomor_telepon;
      this.form.is_aktif = item.is_aktif;
      this.dialog = true;
    },

    deleteHandler(id_transaksi) {
      this.deleteId = id_transaksi;
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
        id_transaksi: null,
        id_promo: null,
        id_driver: null,
        id_pegawai: null,
        id_mobil: null,
        id_customer: null,
      };
    },
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.readDataPromo();
    this.readDataDriver();
    this.readDataPegawai();
    this.readDataMobil();
    this.readDataCustomer();
    this.readData();
  },
};
</script>