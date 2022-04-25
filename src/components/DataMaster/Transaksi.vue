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
        <template v-slot:[`item.status_transaksi`]="{ item }">
            <span v-if="item.status_transaksi == 'selesai' ">
              <v-chip color="green">Selesai</v-chip>
            </span>
            <span v-if="item.status_transaksi == 'belum verifikasi' ">
              <v-chip color="yellow">Belum Verifikasi</v-chip>
            </span>
            <span v-if="item.status_transaksi == 'gagal transaksi' ">
              <v-chip color="orange">Gagal Transaksi</v-chip>
            </span>
            <span v-if="item.status_transaksi == 'gagal pembayaran' ">
              <v-chip color="red">Gagal Pembayaran</v-chip>
            </span>
            <span v-if="item.status_transaksi == 'sedang berjalan' ">
              <v-chip color="blue">Sedang Berjalan</v-chip>
            </span>
        </template>

        <template v-slot:[`item.jenis_peminjaman`]="{ item }">
            <span v-if="item.jenis_peminjaman == 'mobil' ">
              <v-chip color="blue">Mobil</v-chip>
            </span>
            <span v-if="item.jenis_peminjaman == 'mobil + driver' ">
              <v-chip color="yellow">Mobil + Driver</v-chip>
            </span>
        </template>

        <template v-slot:[`item.metode_bayar`]="{ item }">
            <span v-if="item.metode_bayar == 'cash' ">
              <v-chip color="green">Cash</v-chip>
            </span>
            <span v-if="item.metode_bayar == 'transfer' ">
              <v-chip color="yellow">Transfer</v-chip>
            </span>
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
                  Edit Peminjaman
                </v-btn>
              </v-list-item-title>

              <v-list-item-title>
                <v-btn  @click="ratingHandler(item)">
                    Tambah Rating
                </v-btn>
              </v-list-item-title>

              <v-list-item-title>
                <v-btn  @click="bayarHandler(item)">
                    Tambah Pembayaran
                </v-btn>
              </v-list-item-title>

              <v-list-item-title>
                <v-btn  @click="detailHandler(item)">
                    Detail Transaksi
                </v-btn>
              </v-list-item-title>
            </v-list>
          </v-menu>    
        </template>

      </v-data-table>
    </v-card>
    

     <v-dialog v-model="dialogDetail" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Detail Data Transaksi</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-select :items="customers" readonly v-model="form.id_customer" label="Nama Customer" item-value="id_customer" item-text="nama_customer" ></v-select>
            <v-select :items="driveraktif" readonly v-model="form.id_driver" label="Nama Driver" item-value="id_driver" item-text="nama_driver" ></v-select>
            <v-select :items="promoaktif" readonly v-model="form.id_promo" label="Jenis Promo" item-value="id_promo" item-text="jenis_promo" ></v-select>
            <v-select :items="pegawaiaktif" readonly v-model="form.id_pegawai" label="Nama Pegawai" item-value="id_pegawai" item-text="nama_pegawai" ></v-select>
            <v-select :items="mobils" readonly v-model="form.id_mobil" label="Nama Mobil" item-value="id_mobil" item-text="nama_mobil" ></v-select>
            <v-select :items="jenisPeminjaman" readonly v-model="form.jenis_peminjaman" label="Jenis Peminjaman" item-value="value" item-text="text" ></v-select>
            <v-text-field type="date" readonly v-model="form.tgl_transaksi" label="Tanggal Transaksi" required></v-text-field>
            <v-text-field type="date" readonly v-model="form.tgl_pinjam" label="Tanggal Peminjaman" required></v-text-field>
            <v-text-field type="date" readonly v-model="form.tgl_kembali" label="Tanggal Pengembalian" required></v-text-field>
            <v-text-field type="time" readonly v-model="form.waktu_kembali" label="Waktu Pengembalian" required></v-text-field>
            <v-text-field type="date" readonly v-model="form.tgl_selesai_pinjam" label="Tanggal Mobil Kembali" required></v-text-field>
            <v-text-field type="time" readonly v-model="form.waktu_selesai_pinjam" label="Waktu Mobil Kembali" required></v-text-field>
            <v-select :items="ratingperform" readonly v-model="form.rating_perform_driver" label="Rating Driver" item-value="value" item-text="text" ></v-select>
            <v-select :items="ratingperform" readonly v-model="form.rating_perform_ajr" label="Rating AJR" item-value="value" item-text="text" ></v-select>
            <v-flex align-center>
                <v-img width="550px"
                    :src="previewImageUrl == '' ? $baseUrl+'/storage/'+form.bukti_bayar : previewImageUrl"
                    id="previewImage" class="mb-5"></v-img>
            </v-flex>
            <v-select :items="statusTransaksi" readonly v-model="form.status_transaksi" label="Status Transaksi" item-value="value" item-text="text" ></v-select>
            <v-select :items="metodeBayar" readonly v-model="form.metode_bayar" label="Metode Pembayaran" item-value="value" item-text="text" ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{formTitle}} Data Peminjaman</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-select :items="customers" v-model="form.id_customer" label="Nama Customer" item-value="id_customer" item-text="nama_customer" ></v-select>
            <v-select :items="driveraktif" clearable v-model="form.id_driver" label="Nama Driver" item-value="id_driver" item-text="nama_driver" ></v-select>
            <v-select :items="promoaktif" clearable v-model="form.id_promo" label="Jenis Promo" item-value="id_promo" item-text="jenis_promo" ></v-select>
            <v-select :items="pegawaiaktif" v-model="form.id_pegawai" label="Nama Pegawai" item-value="id_pegawai" item-text="nama_pegawai" ></v-select>
            <v-select :items="mobils" v-model="form.id_mobil" label="Nama Mobil" item-value="id_mobil" item-text="nama_mobil" ></v-select>
            <v-select :items="jenisPeminjaman" v-model="form.jenis_peminjaman" label="Jenis Peminjaman" item-value="value" item-text="text" ></v-select>
            <v-text-field type="date" v-model="form.tgl_transaksi" label="Tanggal Transaksi" required></v-text-field>
            <v-text-field type="date" v-model="form.tgl_pinjam" label="Tanggal Peminjaman" required></v-text-field>
            <v-text-field type="date" v-model="form.tgl_kembali" label="Tanggal Pengembalian" required></v-text-field>
            <v-text-field type="time" v-model="form.waktu_kembali" label="Waktu Pengembalian" required></v-text-field>
            <v-text-field type="date" v-model="form.tgl_selesai_pinjam" label="Tanggal Mobil Kembali" required></v-text-field>
            <v-text-field type="time" v-model="form.waktu_selesai_pinjam" label="Waktu Mobil Kembali" required></v-text-field>
            <v-file-input rounded filled prepend-icon="mdi-camera" label="Bukti Peminjaman" id="buktiBayar" ref="fileBuktiBayar"></v-file-input>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="setForm"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogRating" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Rating Driver dan AJR</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-select :items="ratingperform" clearable v-model="form.rating_perform_driver" label="Rating Driver" item-value="value" item-text="text" ></v-select>
            <v-select :items="ratingperform" v-model="form.rating_perform_ajr" label="Rating AJR" item-value="value" item-text="text" ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="tambahrating"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPembayaran" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Pembayaran Rental Mobil</span>
        </v-card-title>
        <v-card-text>
          <v-container>
             <v-file-input rounded filled prepend-icon="mdi-camera" label="Bukti Bayar" id="buktiBayar" ref="fileBuktiBayar"></v-file-input>
            <v-select :items="statusTransaksi" v-model="form.status_transaksi" label="Status Transaksi" item-value="value" item-text="text" ></v-select>
            <v-select :items="metodeBayar" v-model="form.metode_bayar" label="Metode Pembayaran" item-value="value" item-text="text" ></v-select>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="cancel"> Cancel </v-btn>
          <v-btn color="blue darken-1" text @click="tambahbayar"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialogConfirm" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">warning!</span>
        </v-card-title>
        <v-card-text> Anda yakin dengan pemberian rating ini? </v-card-text>
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
      dialogConfirm: false,
      dialogPembayaran: false,
      dialogRating: false,
      dialogDetail: false,
      metodeBayar:[
        {text: "Transfer", value: 'transfer'},
        {text: "Cash", value: 'cash'},
      ],
      jenisPeminjaman:[
        {text: "Mobil+driver", value: 'mobil + driver'},
        {text: "Mobil", value: 'mobil'},
      ],
      ratingperform: [
        {text: 1, value: 1},
        {text: 2, value: 2},
        {text: 3, value: 3},
        {text: 4, value: 4},
        {text: 5, value: 5}
      ],
      statusTransaksi:[
        { text: "Selesai", value: 'selesai'},
        { text: "Belum Verifikasi", value: 'belum verifikasi'},
        { text: "Gagal Transaksi", value: 'gagal transaksi'},
        { text: "Sedang Berjalan", value: 'sedang berjalan'},
        { text: "Gagal Pembayaran", value: 'gagal pembayaran'},
      ],
      headers: [
        { text: "ID Transaksi", align: "start", sortable: true, value: "id_transaksi"},
        { text: "Nama Customer", value: 'nama_customer'},
        { text: "Nama Driver", value: 'nama_driver'},
        { text: "Nama Pegawai", value: 'nama_pegawai'},
        { text: "Nama Mobil", value: 'nama_mobil'},
        { text: "Jenis Promo", value: 'jenis_promo'},
        { text: "Metode Bayar", value: 'metode_bayar'},
        { text: "Jenis Peminjaman", value: 'jenis_peminjaman'},
        { text: "Status Transaksi", value:'status_transaksi'},
        { text: "Jumlah bayar", value: 'subtotal_all'},
        { text: "Action", value:'actions'},
      ],
      transaksi: new FormData,
      transaksis: [],
      mobils:[],
      mobiltersedia:[],
      customers: [],
      driver:[],
      driveraktif:[],
      promos:[],
      promoaktif:[],
      pegawais:[],
      pegawaiaktif:[],
      reratarating: [],
      form:{
        id_transaksi: '',
        id_promo: [],
        id_driver: [],
        id_pegawai: '',
        id_mobil: '',
        id_customer: '',
        tgl_transaksi: '',
        tgl_pinjam: '',
        tgl_kembali: '',
        waktu_kembali: '',
        tgl_selesai_pinjam: [],
        waktu_selesai_pinjam: [],
        bukti_bayar: '',
        jenis_peminjaman: '',
        metode_bayar: [],
        status_transaksi: [],
        rating_perform_ajr: '',
        rating_perform_driver: [],
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
      else if(this.inputType === 'TambahRating')
      {
        this.tambahrating();
      }
      else if(this.inputType === 'TambahBayar')
      {
        this.tambahbayar();
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

    readDataPromoAktif(){
      var url = this.$api + '/promobystatus';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.promoaktif = response.data.data;
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

    readDataDriverAktif(){
      var url = this.$api + '/driverstatusaktif';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.driveraktif = response.data.data;
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

    readDataPegawaiAktif(){
      var url = this.$api + '/pegawaibystatus';
      this.$http.get(url, {
        headers: {
          'Authorization' : 'Bearer ' + localStorage.getItem('token')
        }
      }).then(response => {
        this.pegawaiaktif = response.data.data;
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
      if(this.form.id_promo > 0)
      {
        this.transaksi.append('id_promo',this.form.id_promo);
      }
      else{
        this.transaksi.append('id_promo',[]);
      }
  
      if(this.form.id_driver !== null)
      {
        this.transaksi.append('id_driver',this.form.id_driver);
      }
      else{
        this.transaksi.append('id_driver', []);
      }
      
      this.transaksi.append('id_pegawai',this.form.id_pegawai);
      this.transaksi.append('id_mobil', this.form.id_mobil);
      this.transaksi.append('id_customer',this.form.id_customer);
      this.transaksi.append('jenis_peminjaman',this.form.jenis_peminjaman);
      this.transaksi.append('tgl_transaksi',this.form.tgl_transaksi);
      this.transaksi.append('tgl_pinjam',this.form.tgl_pinjam);
      this.transaksi.append('tgl_kembali',this.form.tgl_kembali);
      this.transaksi.append('waktu_kembali',this.form.waktu_kembali);
      if(this.form.tgl_selesai_pinjam !== null)
      {
        this.transaksi.append('tgl_selesai_pinjam',this.form.tgl_selesai_pinjam);
      }
      else{
        this.transaksi.append('tgl_selesai_pinjam', []);
      }

      if(this.form.waktu_selesai_pinjam !== null)
      {
        this.transaksi.append('waktu_selesai_pinjam',this.form.waktu_selesai_pinjam);
      }
      else{
        this.transaksi.append('waktu_selesai_pinjam', []);
      }

      if(this.form.metode_bayar !== null)
      {
        this.transaksi.append('metode_bayar', this.form.metode_bayar);
      }
      else{
         this.transaksi.append('metode_bayar',[]);
      }

      var inputGambar = document.getElementById('buktiBayar'),
      dataFile = inputGambar.files[0];
      this.transaksi.append('bukti_bayar',dataFile);
     
      if(this.form.status_transaksi !== null)
      {
        this.transaksi.append('status_transaksi', this.form.status_transaksi);
      }
      else{
         this.transaksi.append('status_transaksi',[]);
      }
      
      this.transaksi.append('rating_perform_ajr',this.form.rating_perform_ajr);
      if(this.form.rating_perform_driver > 0)
      {
        this.transaksi.append('rating_perform_driver',this.form.rating_perform_driver);
      }
      else{
        this.transaksi.append('rating_perform_driver',[]);
      }
     

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

    onPreviewImage(e) {
      this.previewImageUrl = URL.createObjectURL(e)
    },

    tambahrating(){
      var data = new FormData();

          data.append('rating_perform_ajr', this.form.rating_perform_ajr);
          if(this.form.rating_perform_driver > 0)
          {
            data.append('rating_perform_driver',this.form.rating_perform_driver);
          }
          else{
            data.append('rating_perform_driver',[]);
          }

          var url = this.$api + '/updaterating/' + this.editId;
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

    tambahbayar(){
      var data = new FormData(),
      inputGambar = document.getElementById('buktiBayar'),
      dataFile = inputGambar.files[0];

          if(dataFile){
            data.append('bukti_bayar', dataFile);
          }
          data.append('metode_bayar', this.form.metode_bayar);
          data.append('status_transaksi', this.form.status_transaksi);

          var url = this.$api + '/tambahtransaksi/' + this.editId;
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

    update(){
      var data = new FormData();

        if(this.form.id_promo > 0)
        {
          data.append('id_promo',this.form.id_promo);
        }
        else{
          data.append('id_promo',[]);
        }

        if(this.form.id_driver !== null)
        {
          data.append('id_driver',this.form.id_driver);
        }
        else{
          data.append('id_driver',[]);
        }
        data.append('id_pegawai', this.form.id_pegawai);
        data.append('id_mobil', this.form.id_mobil);
        data.append('id_customer', this.form.id_customer);
        data.append('jenis_peminjaman',this.form.jenis_peminjaman)
        data.append('tgl_transaksi', this.form.tgl_transaksi);
        data.append('tgl_pinjam', this.form.tgl_pinjam);
        data.append('tgl_kembali', this.form.tgl_kembali);
        data.append('waktu_kembali',this.form.waktu_kembali);
        data.append('tgl_selesai_pinjam', this.form.tgl_selesai_pinjam);
        data.append('waktu_selesai_pinjam',this.form.waktu_selesai_pinjam);
          
      var url = this.$api + '/transaksi/' + this.editId;
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

    editHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_transaksi;
      this.form.id_promo = item.id_promo;
      this.form.id_driver = item.id_driver;
      this.form.id_pegawai = item.id_pegawai;
      this.form.id_mobil = item.id_mobil;
      this.form.id_customer = item.id_customer;
      this.form.tgl_transaksi = item.tgl_transaksi;
      this.form.jenis_peminjaman = item.jenis_peminjaman;
      this.form.tgl_pinjam = item.tgl_pinjam;
      this.form.tgl_kembali = item.tgl_kembali;
      this.form.waktu_kembali = item.waktu_kembali;
      this.form.tgl_selesai_pinjam = item.tgl_selesai_pinjam;
      this.form.waktu_selesai_pinjam = item.waktu_selesai_pinjam;
      
      this.dialog = true;
    },

    detailHandler(item){
      this.inputType = 'Ubah';
      this.editId = item.id_transaksi;
      this.form.id_promo = item.id_promo;
      this.form.id_driver = item.id_driver;
      this.form.id_pegawai = item.id_pegawai;
      this.form.id_mobil = item.id_mobil;
      this.form.id_customer = item.id_customer;
      this.form.tgl_transaksi = item.tgl_transaksi;
      this.form.jenis_peminjaman = item.jenis_peminjaman;
      this.form.tgl_pinjam = item.tgl_pinjam;
      this.form.tgl_kembali = item.tgl_kembali;
      this.form.waktu_kembali = item.waktu_kembali;
      this.form.tgl_selesai_pinjam = item.tgl_selesai_pinjam;
      this.form.waktu_selesai_pinjam = item.waktu_selesai_pinjam;
      this.form.rating_perform_ajr = item.rating_perform_ajr;
      this.form.rating_perform_driver = item.rating_perform_driver;
      this.form.bukti_bayar = item.bukti_bayar;
      this.form.metode_bayar = item.metode_bayar;
      this.form.status_transaksi = item.status_transaksi;
      this.dialogDetail = true;
    },

    deleteHandler(id_transaksi) {
      this.deleteId = id_transaksi;
      this.dialogConfirm = true;
    },

    ratingHandler(item){
      this.inputType = 'TambahRating';
      this.editId = item.id_transaksi;
      this.form.rating_perform_ajr = item.rating_perform_ajr;
      this.form.rating_perform_driver = item.rating_perform_driver;
      this.dialogRating = true;
    },

    bayarHandler(item){
      this.inputType = 'TambahBayar';
      this.editId = item.id_transaksi;
      this.form.bukti_bayar = item.bukti_bayar;
      this.form.metode_bayar = item.metode_bayar;
      this.form.status_transaksi = item.status_transaksi;
      this.dialogPembayaran = true;
    },

    close() {
      this.dialog = false;
      this.inputType = "Tambah";
      this.dialogConfirm = false;
      this.dialogRating = false,
      this.dialogPembayaran = false;
      this.dialogDetail = false;
      this.readData();
    },
    cancel() {
      this.resetForm();
      this.readData();
      this.dialog = false;
      this.dialogConfirm = false;
      this.dialogRating = false;
      this.dialogPembayaran = false;
      this.dialogDetail = false;
      this.inputType = "Tambah";
    },
    resetForm() {
      this.form = {
        id_transaksi: '',
        id_promo: [],
        id_driver: [],
        id_pegawai: '',
        id_mobil: '',
        id_customer: '',
        tgl_transaksi: '',
        tgl_pinjam: '',
        tgl_kembali: '',
        waktu_kembali: '',
        tgl_selesai_pinjam: [],
        waktu_selesai_pinjam: [],
        bukti_bayar: '',
        jenis_peminjaman: '',
        metode_bayar: [],
        status_transaksi: [],
        rating_perform_ajr: '',
        rating_perform_driver: [],
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
    this.readDataPromoAktif();
    this.readDataDriver();
    this.readDataDriverAktif();
    this.readDataPegawai();
    this.readDataPegawaiAktif();
    this.readDataMobil();
    this.readDataCustomer();
    this.readData();
  },
};
</script>