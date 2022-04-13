<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer"  
      :mini-variant.sync="mini"
      permanent app color="blue">
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img src="https://pbs.twimg.com/profile_images/378800000644330643/df168236cfdd359e0dc7ef7336538c8b_400x400.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-title>Atma Jaya Rental</v-list-item-title>

        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      
      <v-divider></v-divider>
      <v-list dense nav>
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
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <VSpacer />
      <v-toolbar-items>
         <v-btn text router @click = "btnLogout"><v-icon>mdi-account</v-icon></v-btn>
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
      ],
      mini: true,
    };
  },
  methods: {
    btnLogout() {
      localStorage.removeItem('id');
      localStorage.removeItem('token');
      location.reload();
    },
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