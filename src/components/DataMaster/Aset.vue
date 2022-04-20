<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">Kontrak Mitra akan Habis</h3>
    
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

        

      </v-card-title>
      <v-data-table :headers="headers" :items="mobils" :search="search">
        <template v-slot:[`item.status_mobil`]="{ item }">
            <span v-if="item.status_mobil == 'aktif' ">
              <v-chip color="green">Aktif</v-chip>
            </span>
            <span v-if="item.status_mobil == 'non-aktif' ">
              <v-chip color="red">Non Aktif</v-chip>
            </span>
          </template>

        <template v-slot:[`item.foto_mobil`]="{item}">
          <v-img :src="$baseUrl+'/storage/'+item.foto_mobil" height="100px" width="100px" style="object-fit:cover"/>  
        </template>

        <template v-slot:[`item.actions`]="{item}">
                <v-btn icon small class="mr-2" @click="editHandler(item)">
                  <v-icon color="red">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small @click="deleteHandler(item.id_mobil)">
                     <v-icon color="green">mdi-delete</v-icon>
                </v-btn>
            </template>

      </v-data-table>
    </v-card>
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{formTitle}} mobil</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field v-model="form.kode_mobil" label="Kode mobil" required></v-text-field>
            <v-text-field v-model="form.jenis_mobil" label="Jenis mobil" required></v-text-field>
            <v-text-field v-model="form.jumlah_potongan" label="Jumlah Potongan" required></v-text-field>
            <v-text-field v-model="form.keterangan" label="Keterangan" required></v-text-field>
            <v-select :items="statusmobil" v-model="form.status_mobil" label="status mobil" item-value="value" item-text="text" ></v-select>
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
      statusmobil: [
        {text: "Aktif", value:"aktif"},
        {text: "Non aktif", value:"non-aktif"},
      ],
      headers: [
        { text: "Foto Mobil", align: "start", sortable: true, value: "foto_mobil"},
        { text: "Nama Mobil", value: 'nama_mobil'},
        { text: "Tipe Mobil", value: 'tipe_mobil'},
        { text: "Nama Mitra", value: 'nama_mitra'},
        { text: "Nomor Telepon", value: 'nomor_telepon'},
        { text: "Plat Nomor", value: 'plat_nomor'},
      ],
      mobil: new FormData,
      mobils: [],
      form:{
        foto_mobil: null,
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
      var url = this.$api + '/mobilotwhabis';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.mobils = response.data.data;
      })
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