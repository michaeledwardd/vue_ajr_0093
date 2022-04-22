<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">Promo</h3>
    
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
      <v-data-table :headers="headers" :items="promos" :search="search">
        <template v-slot:[`item.status_promo`]="{ item }">
            <span v-if="item.status_promo == 'aktif' ">
              <v-chip color="green">Aktif</v-chip>
            </span>
            <span v-if="item.status_promo == 'non-aktif' ">
              <v-chip color="red">Non Aktif</v-chip>
            </span>
          </template>
        <template v-slot:[`item.actions`]="{item}">
                <v-btn icon small class="mr-2" @click="editHandler(item)">
                  <v-icon color="red">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small @click="deleteHandler(item.id_promo)">
                     <v-icon color="green">mdi-delete</v-icon>
                </v-btn>
            </template>

      </v-data-table>
    </v-card>
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{formTitle}} Promo</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.kode_promo" label="Kode Promo" required></v-text-field>
            <v-text-field v-model="form.jenis_promo" label="Jenis Promo" required></v-text-field>
            <v-text-field v-model="form.jumlah_potongan" label="Jumlah Potongan" required></v-text-field>
            <v-text-field v-model="form.keterangan" label="Keterangan" required></v-text-field>
            <v-select :items="statusPromo" v-model="form.status_promo" label="status promo" item-value="value" item-text="text" ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin ingin menghapus promo ini? </v-card-text>
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
      kodeRules: [(v) => !!v || "Kode Promo tidak boleh kosong"],
      color: '',
      search: null,
      dialog: false,
      dialogConfirm: false,
      statusPromo: [
        {text: "Aktif", value:"aktif"},
        {text: "Non aktif", value:"non-aktif"},
      ],
      headers: [
        { text: "Kode Promo", align: "start", sortable: true, value: "kode_promo"},
        { text: "Jenis Promo", value: 'jenis_promo'},
        { text: "Jumlah Potongan", value: 'jumlah_potongan'},
        { text: "Keterangan", value: 'keterangan'},
        { text: "Status Promo", value: 'status_promo'},
        { text: "Action", value:'actions'},
      ],
      promo: new FormData,
      promos: [],
      form:{
        kode_promo: '',
        jenis_promo: '',
        jumlah_potongan: '',
        keterangan: '',
        status_promo: '',
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
      var url = this.$api + '/promo';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.promos = response.data.data;
      })
    },


    save(){
      this.promo.append('kode_promo',this.form.kode_promo);
      this.promo.append('jenis_promo',this.form.jenis_promo);
      this.promo.append('jumlah_potongan',this.form.jumlah_potongan);
      this.promo.append('keterangan', this.form.keterangan);
      this.promo.append('status_promo',this.form.status_promo)

      var url= this.$api + '/promo/'
      this.load = true;
      this.$http.post(url, this.promo, {
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
        kode_promo : this.form.kode_promo,
        jenis_promo : this.form.jenis_promo,
        jumlah_potongan : this.form.jumlah_potongan,
        keterangan: this.form.keterangan,
        status_promo: this.form.status_promo
      };
      var url = this.$api + '/promo/' + this.editId;
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
      var url = this.$api + '/promo/' + this.deleteId;
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
      this.editId = item.id_promo;
      this.form.kode_promo = item.kode_promo;
      this.form.jenis_promo = item.jenis_promo;
      this.form.jumlah_potongan = item.jumlah_potongan;
      this.form.keterangan = item.keterangan;
      this.form.status_promo = item.status_promo
      this.dialog = true;
    },

    deleteHandler(id_promo) {
      this.deleteId = id_promo;
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
        kode_promo: null,
        jenis_promo: null,
        jumlah_potongan: null,
        keterangan: null,
        status_promo: null,
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