<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5"> Data Mobil</h3>
    
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
      <v-data-table :headers="headers" :items="mobils" :search="search">
        <template v-slot:[`item.status_ketersediaan`]="{ item }">
            <span v-if="item.status_ketersediaan == 'tersedia' ">
              <v-chip color="green">Tersedia</v-chip>
            </span>
            <span v-if="item.status_ketersediaan == 'tidak tersedia' ">
              <v-chip color="red">Tidak Tersedia</v-chip>
            </span>
          </template>
        <template v-slot:[`item.actions`]="{item}">
                <v-btn icon small class="mr-2" @click="editHandler(item)">
                  <v-icon color="red">mdi-pencil</v-icon>
                </v-btn>
                <!-- <v-btn icon small @click="deleteHandler(item.id_mobil)">
                     <v-icon color="green">mdi-delete</v-icon>
                </v-btn> -->
                <v-btn icon small @click="showHandler(item.id_mobil)">
                     <v-icon color="black">mdi-view-list</v-icon>
                </v-btn>
            </template>

      </v-data-table>
    </v-card>
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{formTitle}} Mobil</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.nama_mobil" label="Nama Mobil" required></v-text-field>
            <v-text-field v-model="form.jenis_transmisi" label="Jenis Transmisi" required></v-text-field>
            <v-text-field v-model="form.bahan_bakar" label="Bahan bakar" required></v-text-field>
            <v-text-field v-model="form.warna" label="Warna mobil" required></v-text-field>
            <v-text-field v-model="form.volume_bagasi" label="Volume Bagasi" required></v-text-field>
            <v-text-field v-model="form.fasilitas" label="Fasilitas" required></v-text-field>
            <v-text-field v-model="form.kategori_aset" label="Kepemilikan" required></v-text-field>
            <v-select :items="statusKetersediaan" v-model="form.status_ketersediaan" label="Status Mobil" item-value="value" item-text="text" ></v-select>
            <v-text-field v-model="form.plat_nomor" label="Plat Nomor" required></v-text-field>
            <v-text-field v-model="form.foto_mobil" label="Foto Mobil" required></v-text-field>
            <v-text-field v-model="form.tipe_mobil" label="Tipe Mobil" required></v-text-field>
            <v-text-field v-model="form.kapasitas" label="Kapasitas" required></v-text-field>
            <v-text-field v-model="form.biaya_sewa" label="Biaya sewa" required></v-text-field>
            <v-text-field type="date" v-model="form.last_service" label="Tanggal terakhir service" required></v-text-field>
            <v-text-field type="date" v-model="form.awal_kontrak" label="Tanggal awal kontrak" required></v-text-field>
            <v-text-field type="date" v-model="form.akhir_kontrak" label="Tanggal akhir kontrak" required></v-text-field>
            <v-text-field v-model="form.nomor_stnk" label="Nomor STNK" required></v-text-field>
            <v-select :items="mitras" v-model="form.id_mitra" label="Nama Mitra" item-value="id_mitra" item-text="nama_mitra" ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Close </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus mobil ini? </v-card-text>
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
      statusKetersediaan: [
        {text:"Tersedia", value:"tersedia"},
        {text:"Tidak Tersedia", value:"tidak tersedia"},
      ],
      headers: [
        { text: "Nama Mobil", align: "start", sortable: true, value: "nama_mobil"},
        { text: "Biaya Sewa", value: "biaya_sewa"},
        { text: "Kapasitas", value: "kapasitas"},
        { text: "Fasilitas", value: "fasilitas"},
        { text: "Kategori Aset", value: "kategori_aset"},
        { text: "Status", value: "status_ketersediaan"},
        { text: "Action", value:'actions'},
      ],
      mobil: new FormData,
      mobils: [],
      mitras: [],
      form:{
        id_mitra: null,
        nama_mobil: null,
        jenis_transmisi: null,
        bahan_bakar: null,
        warna: null,
        volume_bagasi: null,
        fasilitas: null,
        kategori_aset: null,
        status_ketersediaan: null,
        plat_nomor: null,
        foto_mobil: null,
        tipe_mobil: null,
        kapasitas: null,
        biaya_sewa: null,
        last_service: null,
        awal_kontrak: null,
        akhir_kontrak: null,
        nomor_stnk: null,
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
      var url = this.$api + '/mobil';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.mobils = response.data.data;
      })
    },

    readDataMitra(){
      var url = this.$api + '/mitra';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.mitras = response.data.data;
      })
    },

    save(){
      this.mobil.append('nama_mobil',this.form.nama_mobil);
      this.mobil.append('jenis_transmisi',this.form.jenis_transmisi);
      this.mobil.append('bahan_bakar',this.form.bahan_bakar);
      this.mobil.append('warna',this.form.warna);
      this.mobil.append('volume_bagasi',this.form.volume_bagasi);
      this.mobil.append('fasilitas',this.form.fasilitas);
      this.mobil.append('plat_nomor',this.form.plat_nomor);
      this.mobil.append('foto_mobil',this.form.foto_mobil);
      this.mobil.append('tipe_mobil',this.form.tipe_mobil);
      this.mobil.append('kapasitas',this.form.kapasitas);
      this.mobil.append('biaya_sewa',this.form.biaya_sewa);
      this.mobil.append('last_service',this.form.last_service);
      this.mobil.append('awal_kontrak',this.form.awal_kontrak);
      this.mobil.append('akhir_kontrak',this.form.akhir_kontrak);
      this.mobil.append('nomor_stnk',this.form.nomor_stnk);

      var url= this.$api + '/mobil/'
      this.load = true;
      this.$http.post(url, this.mobil, {
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
        nama_mobil : this.form.nama_mobil,
        jenis_transmisi : this.form.jenis_transmisi,
        bahan_bakar : this.form.bahan_bakar,
        warna : this.form.warna,
        volume_bagasi : this.form.volume_bagasi,
        fasilitas : this.form.fasilitas,
        kategori_aset : this.form.kategori_aset,
        status_ketersediaan : this.form.status_ketersediaan,
        plat_nomor : this.form.plat_nomor,
        foto_mobil : this.form.foto_mobil,
        tipe_mobil : this.form.tipe_mobil,
        kapasitas : this.form.kapasitas,
        biaya_sewa : this.form.biaya_sewa,
        last_service : this.form.last_service,
        awal_kontrak : this.form.awal_kontrak,
        akhir_kontrak : this.form.akhir_kontrak,
        nomor_stnk : this.form.nomor_stnk,
        id_mitra : this.form.id_mitra,
      };
      var url = this.$api + '/mobil/' + this.editId;
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
      var url = this.$api + '/mobil/' + this.deleteId;
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

    deleteHandler(id_pegawai) {
      this.deleteId = id_pegawai;
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
        id_mitra: null,
        nama_mobil: null,
        jenis_transmisi: null,
        bahan_bakar: null,
        warna: null,
        volume_bagasi: null,
        fasilitas: null,
        kategori_aset: null,
        status_ketersediaan: null,
        plat_nomor: null,
        foto_mobil: null,
        tipe_mobil: null,
        kapasitas: null,
        biaya_sewa: null,
        last_service: null,
        awal_kontrak: null,
        akhir_kontrak: null,
        nomor_stnk: null,
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