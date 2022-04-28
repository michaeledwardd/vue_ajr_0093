<template>
  <v-main class="list">
    <h3 class="text font-weight-medium mb-5">List Mobil</h3>
    
<v-row>
  <v-col v-for="(item,index) in mobils" :key="index" md="4">
  <v-card
    class="mx-auto"
    max-width="344"
  >
    <v-img
      :src="$baseUrl+'/storage/'+item.foto_mobil"
      height="200px"
    ></v-img>

    <v-card-title>
      {{ item.nama_mobil }}
    </v-card-title>

    <v-card-subtitle>
      {{ item.status_ketersediaan}} - {{ item.biaya_sewa }}
    </v-card-subtitle>
  </v-card>
</v-col>
</v-row>
    
    
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
      
      promo: new FormData,
      promos: [],
      mobils: [],
     
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
 
  },
  computed: {
    formTitle() {
      return this.inputType;
    },
  },
  mounted() {
    this.$http.get(this.$api + '/mobil')
        .then(response => {
             this.mobils = response.data.data;
        }).catch(error => {
            console.log(error)
        })
  },
};
</script>