<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5"> Data Driver</h3>
    
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
      <v-data-table :headers="headers" :items="drivers" :search="search">

        <template v-slot:[`item.actions`]="{item}">
                <v-btn icon small class="mr-2" @click="editHandler(item)">
                  <v-icon color="red">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small @click="showHandler(item)">
                     <v-icon color="black">mdi-view-list</v-icon>
                </v-btn>
            </template>

      </v-data-table>
    </v-card>
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{formTitle}} Driver</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.nama_driver" label="Nama Driver" required></v-text-field>
            <v-text-field v-model="form.jenis_kelamin" label="Jenis Kelamin" required></v-text-field>
            <v-text-field v-model="form.alamat" label="Alamat" required></v-text-field>
            <v-text-field v-model="form.email_driver" label="Email Driver" required></v-text-field>
            <v-text-field v-model="form.password" label="Password" required></v-text-field>
            <v-text-field v-model="form.foto_driver" label="Foto Pegawai" required></v-text-field>
            <v-select :items="statusTersedia" v-model="form.status_tersedia" label="Status Ketersediaan" item-value="value" item-text="text" ></v-select>
            <v-select :items="statusBerkas" v-model="form.status_berkas" label="Status Berkas" item-value="value" item-text="text" ></v-select>
             <v-select :items="statusAktif" v-model="form.is_aktif" label="Status Aktif" item-value="value" item-text="text" ></v-select>
            <v-text-field v-model="form.biaya_sewa_driver" label="Biaya sewa Driver" required></v-text-field>
            <v-text-field v-model="form.no_telp" label="Nomor Telepon" required></v-text-field>
            <v-text-field type="date" v-model="form.tgl_lahir" label="Tanggal Lahir" required></v-text-field>
             <v-select :items="mahirInggris" v-model="form.mahir_inggris" label="Mahir Inggris" item-value="value" item-text="text" ></v-select>
            <v-text-field v-model="form.upload_sim" label="Surat Ijin Mengemudi" required></v-text-field>
            <v-text-field v-model="form.upload_bebas_napza" label="Surat Bebas Napza" required></v-text-field>
            <v-text-field v-model="form.upload_sehat_jiwa" label="Surat Sehat Jiwa" required></v-text-field>
            <v-text-field v-model="form.upload_sehat_jasmani" label="Surat Sehat Jasmani" required></v-text-field>
            <v-text-field v-model="form.upload_skck" label="Surat SKCK" required></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogData" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Berkas Driver</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field disabled v-model="form.mahir_inggris" label="Mahir Inggris" required></v-text-field>
            <v-text-field disabled v-model="form.upload_sim" label="Surat Ijin Mengemudi" required></v-text-field>
            <v-text-field disabled v-model="form.upload_bebas_napza" label="Surat Bebas Napza" required></v-text-field>
            <v-text-field disabled v-model="form.upload_sehat_jiwa" label="Surat Sehat Jiwa" required></v-text-field>
            <v-text-field disabled v-model="form.upload_sehat_jasmani" label="Surat Sehat Jasmani" required></v-text-field>
            <v-text-field disabled v-model="form.upload_skck" label="Surat SKCK" required></v-text-field>
            <v-text-field disabled v-model="form.status_berkas" label="Status Berkas" required></v-text-field>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" text @click="cancel"> Cancel </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus driver ini? </v-card-text>
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
      dialogData: false,
      dialogConfirm: false,
      statusTersedia:[
        {text:"Tersedia", value:"tersedia"},
        {text:"Tidak Tersedia", value:"tidak tersedia"},
      ],
      statusAktif:[
        {text:"Aktif", value: 1},
        {text:"Tidak Aktif", value:0},
      ],
      statusBerkas:[
        {text:"Verifikasi", value:"verifikasi"},
        {text:"Belum Verifikasi", value:"belum verifikasi"},
      ],
      mahirInggris:[
        {text:"Mahir Inggirs", value: 1},
        {text:"Tidak Mahir", value: 0},
      ],
      headers: [
        { text: "ID Driver", value:'id_driver'},
        { text: "Nama Driver", align: "start", sortable: true, value: "nama_driver"},
        { text: "Jenis Kelamin", value: "jenis_kelamin"},
        { text: "Biaya Sewa Driver", value: "biaya_sewa_driver"},
        { text: "Tanggal Lahir", value: "tgl_lahir"},
        { text: "Status", value: "status_tersedia"},
        { text: "Nomor Telepon", value: "no_telp"},
        { text: "Action", value:'actions'},
      ],
      driver: new FormData,
      drivers: [],
      form:{
        nama_driver: null,
        jenis_kelamin: null,
        alamat: null,
        email_driver: null,
        password: null,
        foto_driver: null,
        status_tersedia: null,
        status_berkas: null,
        is_aktif: null,
        biaya_sewa_driver: null,
        no_telp: null,
        tgl_lahir: null,
        mahir_inggris: null,
        upload_sim: null,
        upload_bebas_napza: null,
        upload_sehat_jiwa: null,
        upload_skck: null,
        upload_sehat_jasmani: null,
        
      },
      deleteId: '',
      showId: '',
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
      var url = this.$api + '/driver';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.drivers = response.data.data;
      })
    },

    save(){
      this.driver.append('nama_driver',this.form.nama_driver);
      this.driver.append('jenis_kelamin',this.form.jenis_kelamin);
      this.driver.append('alamat',this.form.alamat);
      this.driver.append('email_driver',this.form.email_driver);
      this.driver.append('password',this.form.password);
      this.driver.append('foto_driver',this.form.foto_driver);
      this.driver.append('status_tersedia',this.form.status_tersedia);
      this.driver.append('status_berkas',this.form.status_berkas);
      this.driver.append('is_aktif',this.form.is_aktif);
      this.driver.append('biaya_sewa_driver',this.form.biaya_sewa_driver);
      this.driver.append('no_telp',this.form.no_telp);
      this.driver.append('tgl_lahir',this.form.tgl_lahir);
      this.driver.append('mahir_inggris',this.form.mahir_inggris);
      this.driver.append('upload_sim',this.form.upload_sim);
      this.driver.append('upload_bebas_napza',this.form.upload_bebas_napza);
      this.driver.append('upload_sehat_jiwa',this.form.upload_sehat_jiwa);
      this.driver.append('upload_sehat_jasmani',this.form.upload_sehat_jasmani);
      this.driver.append('upload_skck',this.form.upload_skck);
    
      var url= this.$api + '/driver/'
      this.load = true;
      this.$http.post(url, this.driver, {
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
        nama_driver : this.form.nama_driver,
        jenis_kelamin : this.form.jenis_kelamin,
        alamat : this.form.alamat,
        email_driver : this.form.email_driver,
        password : this.form.password,
        foto_driver : this.form.foto_driver,
        status_tersedia : this.form.status_tersedia,
        status_berkas : this.form.status_berkas,
        is_aktif : this.form.is_aktif,
        biaya_sewa_driver : this.form.biaya_sewa_driver,
        no_telp : this.form.no_telp,
        tgl_lahir : this.form.tgl_lahir,
        mahir_inggris : this.form.mahir_inggris,
        upload_sim : this.form.upload_sim,
        upload_bebas_napza : this.form.upload_bebas_napza,
        upload_sehat_jiwa : this.form.upload_sehat_jiwa,
        upload_sehat_jasmani : this.form.upload_sehat_jasmani,
        upload_skck : this.form.upload_skck
      };
      var url = this.$api + '/driver/' + this.editId;
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
      var url = this.$api + '/role/' + this.deleteId;
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
      this.editId = item.id_driver;
      this.form.nama_driver = item.nama_driver;
      this.form.jenis_kelamin = item.jenis_kelamin;
      this.form.alamat = item.alamat;
      this.form.email_driver = item.email_driver;
      this.form.password = item.password;
      this.form.foto_driver = item.foto_driver;
      this.form.status_tersedia = item.status_tersedia;
      this.form.status_berkas = item.status_berkas;
      this.form.is_aktif = item.is_aktif;
      this.form.biaya_sewa_driver = item.biaya_sewa_driver;
      this.form.no_telp = item.no_telp;
      this.form.tgl_lahir = item.tgl_lahir;
      this.form.mahir_inggris = item.mahir_inggris;
      this.form.upload_sim = item.upload_sim;
      this.form.upload_bebas_napza = item.upload_bebas_napza;
      this.form.upload_sehat_jiwa = item.upload_sehat_jiwa;
      this.form.upload_sehat_jasmani = item.upload_sehat_jasmani;
      this.form.upload_skck = item.upload_skck;
      this.dialog = true;
    },
    showHandler(item){
        this.editId = item.id_driver;
        this.form.status_berkas = item.status_berkas;
        this.form.mahir_inggris = item.mahir_inggris;
        this.form.upload_sim = item.upload_sim;
        this.form.upload_bebas_napza = item.upload_bebas_napza;
        this.form.upload_sehat_jiwa = item.upload_sehat_jiwa;
        this.form.upload_sehat_jasmani = item.upload_sehat_jasmani;
        this.form.upload_skck = item.upload_skck;
        this.dialogData = true;
    },

    deleteHandler(id_driver) {
      this.deleteId = id_driver;
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
      this.dialogData = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        nama_driver: null,
        jenis_kelamin: null,
        alamat: null,
        email_driver: null,
        password: null,
        foto_driver: null,
        status_tersedia: null,
        status_berkas: null,
        is_aktif: null,
        biaya_sewa_driver: null,
        no_telp: null,
        tgl_lahir: null,
        mahir_inggris: null,
        upload_sim: null,
        upload_bebas_napza: null,
        upload_sehat_jiwa: null,
        upload_sehat_jasmani: null,
        upload_skck: null,
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