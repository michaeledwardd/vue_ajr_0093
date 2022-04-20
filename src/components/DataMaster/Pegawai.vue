<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">Data Pegawai</h3>
    
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
      <v-data-table :headers="headers" :items="pegawais" :search="search">
        <template v-slot:[`item.is_aktif`]="{item}">
          <span v-if="item.is_aktif == 1"><v-chip color="green">Aktif</v-chip> </span>
          <span v-else><v-chip color="red">Tidak Aktif</v-chip> </span>
        </template>
        <template v-slot:[`item.foto_pegawai`]="{item}">
          <v-img :src="$baseUrl+'/storage/'+item.foto_pegawai" height="100px" width="100px" style="object-fit:cover"/>  
        </template>


        <template v-slot:[`item.actions`]="{item}">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item-title>
                <v-btn  @click="editHandler(item)">
                  Edit Pegawai
                </v-btn>
              </v-list-item-title>

              <v-list-item-title>
                <v-btn  @click="showHandler(item)">
                     Foto Pegawai
                </v-btn>
              </v-list-item-title>
            </v-list>
          </v-menu>    
        </template>
        
      </v-data-table>
    </v-card>
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{formTitle}} Pegawai</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.nama_pegawai" label="Nama Pegawai" required></v-text-field>
            <v-file-input rounded filled prepend-icon="mdi-camera" label="Foto Pegawai" id="file" ref="fileGambar"></v-file-input>
            <v-text-field type="date" v-model="form.tgl_lahir" label="Tanggal Lahir" required></v-text-field>
            <v-text-field v-model="form.alamat" label="Alamat" required></v-text-field>
            <v-text-field v-model="form.email" label="Email Pegawai" required></v-text-field>
            <v-text-field v-model="form.password" label="Password" required></v-text-field>
             <v-select :items="jenisKelamin" v-model="form.jenis_kelamin" label="Jenis Kelamin" item-value="value" item-text="text" ></v-select>
            <v-select :items="statusAktif" v-model="form.is_aktif" label="Status Pegawai" item-value="value" item-text="text" ></v-select>
             <v-select :items="roles" v-model="form.id_role" label="Jabatan" item-value="id_role" item-text="nama_role" ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogFoto" persistent max-width="650px">
      <v-card>
        <v-card-title>
          <span class="headline">Foto Pegawai</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-flex align-center>
                <v-img width="550px"
                    :src="previewImageUrl == '' ? $baseUrl+'/storage/'+form.foto_pegawai : previewImageUrl"
                    id="previewImage" class="mb-5"></v-img>
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
        <v-card-text> Anda yakin ingin menghapus pegawai ini? </v-card-text>
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
      previewImageUrl: '',
      search: null,
      dialog: false,
      dialogFoto: false,
      dialogConfirm: false,
      jenisKelamin: [
        {text:"Laki laki", value:"laki-laki"},
        {text:"Perempuan", value:"perempuan"},
      ],
      statusAktif: [
        {text:"Aktif", value: 1},
        {text:"Tidak Aktif", value: 0},
      ],
      headers: [
        { text: "Nama Pegawai", align: "start", sortable: true, value: "nama_pegawai"},
        { text: "Jabatan", value: 'nama_role'},
        { text: "Tanggal lahir", value: 'tgl_lahir'},
        { text: "Jenis Kelamin", value: 'jenis_kelamin'},
        { text: "Email", value: 'email'},
        { text: "Status Aktif", value: 'is_aktif'},
        { text: "Action", value:'actions'},
      ],
      pegawai: new FormData,
      pegawais: [],
      roles: [],
      form:{
        nama_pegawai: null,
        id_role: null,
        foto_pegawai: null,
        tgl_lahir: null,
        jenis_kelamin: null,
        alamat: null,
        email: null,
        password: null,
        is_aktif:null,
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
      else if(this.inputType === 'Show'){
        this.showData();
      }
      else{
        this.save();
      }
    },

    readData(){
      var url = this.$api + '/pegawai';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.pegawais = response.data.data;
      })
    },

    readDataRole(){
      var url = this.$api + '/role';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.roles = response.data.data;
      })
    },

    save(){
      this.pegawai.append('nama_pegawai',this.form.nama_pegawai);
      this.pegawai.append('id_role',this.form.id_role);
      var inputGambar = document.getElementById('file'),
      dataFile = inputGambar.files[0];
      this.pegawai.append('foto_pegawai',dataFile);
      this.pegawai.append('tgl_lahir',this.form.tgl_lahir);
      this.pegawai.append('jenis_kelamin', this.form.jenis_kelamin);
      this.pegawai.append('alamat',this.form.alamat);
      this.pegawai.append('email',this.form.email);
      this.pegawai.append('password',this.form.password);
      this.pegawai.append('is_aktif',this.form.is_aktif);

      var url= this.$api + '/pegawai/'
      this.load = true;
      this.$http.post(url, this.pegawai, {
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

    onPreviewImage(e) {
      this.previewImageUrl = URL.createObjectURL(e)
    },


    update(){
      var data = new FormData(),
      inputGambar = document.getElementById('file'),
      dataFile = inputGambar.files[0];

        data.append('nama_pegawai', this.form.nama_pegawai);
        data.append('id_role', this.form.id_role);
        if(dataFile){
          data.append('foto_pegawai', dataFile);
        }
        data.append('tgl_lahir', this.form.tgl_lahir);
        data.append('jenis_kelamin', this.form.jenis_kelamin);
        data.append('alamat', this.form.alamat);
        data.append('email', this.form.email);
        data.append('password' ,this.form.password);
        data.append('is_aktif', this.form.is_aktif);
      
      var url = this.$api + '/pegawai/' + this.editId;
      this.load = true;
      this.$http.post(url, data, {
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
      var url = this.$api + '/pegawai/' + this.deleteId;
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
      this.editId = item.id_pegawai;
      this.form.id_role = item.id_role;
      this.form.nama_pegawai = item.nama_pegawai;
      this.form.foto_pegawai = item.foto_pegawai;
      this.form.tgl_lahir = item.tgl_lahir;
      this.form.jenis_kelamin = item.jenis_kelamin;
      this.form.alamat = item.alamat;
      this.form.email = item.email;
      this.form.password = item.password;
      this.form.is_aktif = item.is_aktif
      this.dialog = true;
    },

    showHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_pegawai;
      this.form.foto_pegawai = item.foto_pegawai
      this.dialogFoto = true;
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
      this.readDatabyId();
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogFoto = false;
      this.dialogConfirm = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        nama_pegawai: null,
        id_role: null,
        foto_pegawai: null,
        tgl_lahir: null,
        jenis_kelamin: null,
        alamat: null,
        email: null,
        password: null,
        is_aktif:null,
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
    this.readDataRole();
  },
};
</script>