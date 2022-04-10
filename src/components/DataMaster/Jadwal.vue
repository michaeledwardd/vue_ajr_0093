<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">Data Waktu Kerja</h3>
    
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
      <v-data-table :headers="headers" :items="jadwals" :search="search">

        <template v-slot:[`item.actions`]="{item}">
                <v-btn icon small class="mr-2" @click="editHandler(item)">
                  <v-icon color="red">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small @click="deleteHandler(item.id_jadwal)">
                     <v-icon color="green">mdi-delete</v-icon>
                </v-btn>
            </template>

      </v-data-table>
    </v-card>
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{formTitle}} Data Waktu Kerja</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.hari_kerja" label="Hari Kerja" required></v-text-field>
            <v-text-field v-model="form.jenis_shift" label="Jenis Shift" required></v-text-field>
            <v-text-field type="time" v-model="form.jam_mulai" label="Jam Mulai" required></v-text-field>
            <v-text-field type="time" v-model="form.jam_selesai" label="Jam Selesai" required></v-text-field>
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
        <v-card-text> Anda yakin ingin menghapus waktu kerja ini? </v-card-text>
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
      headers: [
        { text: "Hari Kerja", align: "start", sortable: true, value: "hari_kerja"},
        { text: "Jenis Shift", value: 'jenis_shift'},
        { text: "Jam Mulai", value: 'jam_mulai'},
        { text: "Jam Selesai", value: 'jam_selesai'},
        { text: "Action", value:'actions'},
      ],
      jadwal: new FormData,
      jadwals: [],
      form:{
        hari_kerja: null,
        jenis_shift: null,
        jam_mulai: null,
        jam_selesai: null,
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
      var url = this.$api + '/jadwal';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.jadwals = response.data.data;
      })
    },

    save(){
      this.jadwal.append('hari_kerja',this.form.hari_kerja);
      this.jadwal.append('jenis_shift',this.form.jenis_shift);
      this.jadwal.append('jam_mulai',this.form.jam_mulai);
      this.jadwal.append('jam_selesai', this.form.jam_selesai);

      var url= this.$api + '/jadwal/'
      this.load = true;
      this.$http.post(url, this.jadwal, {
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
        hari_kerja : this.form.hari_kerja,
        jenis_shift : this.form.jenis_shift,
        jam_mulai : this.form.jam_mulai,
        jam_selesai: this.form.jam_selesai,
        
      };
      var url = this.$api + '/jadwal/' + this.editId;
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
      var url = this.$api + '/jadwal/' + this.deleteId;
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
      this.editId = item.id_jadwal;
      this.form.hari_kerja = item.hari_kerja;
      this.form.jenis_shift = item.jenis_shift;
      this.form.jam_mulai = item.jam_mulai;
      this.form.jam_selesai = item.jam_selesai;
      this.dialog = true;
    },

    deleteHandler(id_jadwal) {
      this.deleteId = id_jadwal;
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
       hari_kerja: null,
        jenis_shift: null,
        jam_mulai: null,
        jam_selesai: null,
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