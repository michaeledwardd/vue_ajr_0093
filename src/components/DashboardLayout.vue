<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer"  
      :mini-variant.sync="mini"
      permanent app color="blue">
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://abertarental.com/wp-content/uploads/2017/12/Rental-mobil-murah-Innova-Bandung.png"></v-img>
        </v-list-item-avatar>
        <v-list-item-title >Atma Jaya Rental</v-list-item-title>

        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      
      <v-divider></v-divider>
      <v-list dense nav v-if="loggedIn && loggedinManager">
        <v-list-item
          v-for="item in manager"
          :key="item.title"
          link
          tag="router-link"
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title><v-icon>{{ item.icon }}</v-icon> {{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

       <!-- <v-divider></v-divider> -->
      <v-list dense nav v-else-if="loggedIn && loggedinCustomerService">
        <v-list-item
          v-for="item in customerservice"
          :key="item.title"
          link
          tag="router-link"
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title><v-icon>{{ item.icon }}</v-icon> {{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- <v-divider></v-divider> -->
      <v-list dense nav v-else-if="loggedIn && loggedinAdmin">
        <v-list-item
          v-for="item in admin"
          :key="item.title"
          link
          tag="router-link"
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title><v-icon>{{ item.icon }}</v-icon> {{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <!-- <v-divider></v-divider> -->
      <v-list dense nav v-else-if="loggedIn && loggedInCustomer">
        <v-list-item
          v-for="item in pelanggan"
          :key="item.title"
          link
          tag="router-link"
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title><v-icon>{{ item.icon }}</v-icon> {{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-list dense nav v-else-if="loggedIn">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          tag="router-link"
          :to="item.to"
        >
          <v-list-item-content>
            <v-list-item-title><v-icon>{{ item.icon }}</v-icon> {{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar app fixed height="75px">
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <VSpacer />
      <v-toolbar-items>
        
         <v-btn text router @click = "btnProfile"><v-icon>mdi-account</v-icon></v-btn>
        <v-btn text router @click = "btnLogout"><v-icon>mdi-power</v-icon></v-btn>
       
      </v-toolbar-items>
    </v-app-bar>
    <div class="fullheigh pa-2">
      <router-view></router-view>
    </div>
  </div>
</template>


<script>
export default {
  name: "Dashboard",
  data() {
    return {
      drawer: true,
      items: [
        { icon : 'mdi-view-dashboard-outline', title: "Dashboard", to: "/dashboard" },
        { icon : "mdi-brightness-percent", title: "Promo", to:"/promo" },
        { icon : "mdi-calendar-clock", title: "Jadwal Pegawai", to:"/detailshift"},
        { icon : "mdi-clock-time-nine", title: "Waktu Kerja", to:"/jadwal"},
        { icon : "mdi-seat-recline-extra", title: "Role", to:"/role"},
        { icon : "mdi-account-group", title: "Pegawai", to:"/pegawai"},
        { icon : "mdi-car", title: "Mobil", to:"/mobil"},
        { icon : "mdi-card-account-details", title: "Driver", to:"/driver"},
        { icon : "mdi-handshake-outline", title: "Mitra", to:"/mitra"},
        { icon : "mdi-account-group", title: "Customer", to:"/customer"},
        { icon : "mdi-currency-usd", title: "Transaksi", to:"/transaksi"},
        { icon : "mdi-briefcase-check", title: "Aset Mitra", to:"/aset"}
      ],
      manager: [
        { icon : 'mdi-view-dashboard-outline', title: "Dashboard", to: "/dashboard" },
        { icon : "mdi-brightness-percent", title: "Promo", to:"/promo" },
        { icon : "mdi-calendar-clock", title: "Jadwal Pegawai", to:"/detailshift"},
        { icon : "mdi-clock-time-nine", title: "Waktu Kerja", to:"/jadwal"},
      ],
      admin:[
        { icon : 'mdi-view-dashboard-outline', title: "Dashboard", to: "/dashboard" },
        { icon : "mdi-seat-recline-extra", title: "Role", to:"/role"},
        { icon : "mdi-account-group", title: "Pegawai", to:"/pegawai"},
        { icon : "mdi-car", title: "Mobil", to:"/mobil"},
        { icon : "mdi-card-account-details", title: "Driver", to:"/driver"},
        { icon : "mdi-handshake-outline", title: "Mitra", to:"/mitra"},
        { icon : "mdi-briefcase-check", title: "Aset Mitra", to:"/aset"}
      ],
      customerservice: [
        { icon : 'mdi-view-dashboard-outline', title: "Dashboard", to: "/dashboard" },
        { icon : "mdi-account-group", title: "Customer", to:"/customer"},
        { icon : "mdi-currency-usd", title: "Transaksi", to:"/transaksi"},
      ],
      pelanggan: [
         { icon : 'mdi-view-dashboard-outline', title: "Dashboard", to: "/dashboard" },
         { icon : "mdi-car", title: "Mobil", to:"/mobilcustomer"},
         { icon : "mdi-card-account-details", title: "Driver", to:"/drivercustomer"},
         { icon : "mdi-cash-100", title: "Histori Pembayaran", to:"/riwayattransaksi"},
      ],
      mini: true,
    };
  },
  methods: {
    btnLogout() {
      localStorage.removeItem('email_customer');
      localStorage.removeItem('email_driver');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('id_customer');
      localStorage.removeItem('nama_pegawai');
      localStorage.removeItem('nama_customer');
      localStorage.removeItem('id_driver');
      localStorage.removeItem('id_pegawai');
      localStorage.removeItem('nama_role');
      localStorage.removeItem('id_role');
      this.$router.push('/home');
    },
    btnProfile(){
      this.$router.push('/profile');
    }
  },
  computed:{
    loggedIn(){
      return localStorage.getItem("token") != null;
    },
    loggedinManager(){
      return localStorage.getItem("id_role") == "1";
    },
    loggedinAdmin(){
      return localStorage.getItem("id_role") == "2";
    },
    loggedinCustomerService(){
      return localStorage.getItem("id_role") == "3";
    },
    loggedInCustomer(){
      return localStorage.getItem("id_customer") != '';
    }
  },
  mounted(){
    if (localStorage.getItem('id_pegawai') != null) {
      this.$http.get(this.$api + '/pegawai/' + localStorage.getItem('id_pegawai'))
          .then(response => {
              this.pegawai = response.data.data;
              this.nama_pegawai = response.data.data.nama_pegawai;
      }).catch(error => {
              console.log(error)
      })
    }
    if (localStorage.getItem('id_role') != null) {
      this.$http.get(this.$api + '/role/' + localStorage.getItem('id_role'))
          .then(response => {
              this.role = response.data.data;
      }).catch(error => {
              console.log(error)
      })
    }
    if (localStorage.getItem('id_customer') != null) {
      this.$http.get(this.$api + '/customer/' + localStorage.getItem('id_customer'))
          .then(response => {
              this.customer = response.data.data;
              this.nama_customer = response.data.data.nama_customer;
      }).catch(error => {
              console.log(error)
      })
    }
  }
};
</script>
<style scoped>
.fullheight {
  min-height: 100vh !important;
}
.router{
  text-decoration: none;
  color: black;
}
.dashboard{
  color:black;
  text-align: left;
}
.title{
  color: white;
  text-align: left;
}
.subtitle{
  color: white;
  text-align: left;
}
</style>