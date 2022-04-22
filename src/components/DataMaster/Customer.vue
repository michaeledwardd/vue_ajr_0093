<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">Data Customer</h3>
    
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
      <v-data-table :headers="headers" :items="customers" :search="search">
         <template v-slot:[`item.status_berkas`]="{ item }">
            <span v-if="item.status_berkas == 'verified' ">
              <v-chip color="green">Verifikasi</v-chip>
            </span>
            <span v-if="item.status_berkas == 'not-verified' ">
              <v-chip color="red">Belum Verifikasi</v-chip>
            </span>
          </template>
        <template v-slot:[`item.upload_berkas`]="{item}">
          <v-img :src="$baseUrl+'/storage/'+item.upload_berkas" height="100px" width="100px" style="object-fit:cover"/>  
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
                      Edit Customer
                    </v-btn>
                  </v-list-item-title>

                  <v-list-item-title>
                    <v-btn  @click="showHandler(item)">
                        Berkas Customer
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
          <span class="headline">{{formTitle}} Data customer</span>
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
            <v-text-field v-model="form.password" label="Password" required></v-text-field>
            <v-text-field v-model="form.usia_customer" label="Usia Customer" required></v-text-field>
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
        <v-card-text> Anda yakin ingin menghapus customer ini? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogConfirm = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="deleteData"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogFoto" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Berkas Customer</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-flex align-center>
                <v-img width="700px"
                    :src="previewImageUrl == '' ? $baseUrl+'/storage/'+form.upload_berkas : previewImageUrl"
                    id="previewImage" class="mb-5"></v-img>
            </v-flex>
            <v-select :items="statusBerkas" v-model="form.status_berkas" label="Status Berkas" item-value="value" item-text="text" ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="black darken-1" text @click="cancel"> Close </v-btn>
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
      search: [],
      dialog: false,
      dialogFoto: false,
      dialogConfirm: false,
      jenisKelamin: [
        { text: "Laki Laki", value: "laki-laki"},
        { text: "Perempuan", value: "perempuan"},
      ],
      statusBerkas:[
        { text: "Verified", value: "verified"},
        { text: "Not Verified", value: "not-verified"},
      ],
      headers: [
        { text: "ID Customer", value:'id_customer'},
        { text: "Nama Customer", align: "start", sortable: true, value: "nama_customer"},
        { text: "Tanggal lahir", value: 'tgl_lahir'},
        { text: "Jenis Kelamin", value: 'jenis_kelamin'},
        { text: "Email", value: 'email_customer'},
        { text: "Status Berkas", value: 'status_berkas'},
        { text: "Action", value:'actions'},
      ],
      customer: new FormData,
      customers: [],
      form:{
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
        usia_customer: []
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

        data.append('nama_customer',this.form.nama_customer);
        data.append('alamat_customer', this.form.alamat_customer);
        data.append('tgl_lahir', this.form.tgl_lahir);
        data.append('jenis_kelamin', this.form.jenis_kelamin);
        data.append('email_customer', this.form.email_customer);
        data.append('no_telp', this.form.no_telp);
        if(dataFile){
          data.append('upload_berkas', dataFile);
        }
        data.append('status_berkas', this.form.status_berkas);
        data.append('nomor_kartupengenal', this.form.nomor_kartupengenal);
        data.append('no_sim',this.form.no_sim);
        data.append('asal_customer', this.form.asal_customer);
        data.append('password', this.form.password);
        data.append('usia_customer', this.form.usia_customer);
        // data.append('_method', 'PUT');
      var url = this.$api + '/customer/' + this.editId;
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
      var url = this.$api + '/customer/' + this.deleteId;
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
      this.editId = item.id_customer;
      this.form.nama_customer = item.nama_customer;
      this.form.alamat_customer = item.alamat_customer;
      this.form.tgl_lahir = item.tgl_lahir;
      this.form.jenis_kelamin = item.jenis_kelamin;
      this.form.email_customer = item.email_customer;
      this.form.no_telp = item.no_telp;
      this.form.upload_berkas = item.upload_berkas;
      this.form.status_berkas = item.status_berkas;
      this.form.nomor_kartupengenal = item.nomor_kartupengenal;
      this.form.no_sim = item.no_sim;
      this.form.asal_customer = item.asal_customer;
      this.form.password = item.password;
      this.form.usia_customer = item.usia_customer;
      this.dialog = true;
    },

    showHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_customer,
      this.form.upload_berkas = item.upload_berkas,
      this.form.status_berkas = item.status_berkas,
      this.dialogFoto = true;
    },

    deleteHandler(id_customer) {
      this.deleteId = id_customer;
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
      this.dialogFoto = false;
      this.inputType = "Tambah";
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
        usia_customer: []
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