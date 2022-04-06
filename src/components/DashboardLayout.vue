<template>
  <div class="dashboard">
    <v-navigation-drawer v-model="drawer" class="fullheight, blue" width="256" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"> Atma Jaya Rental </v-list-item-title>
          <v-list-item-subtitle class="subtitle"> Rentalan Terpercaya </v-list-item-subtitle>
        </v-list-item-content>
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
        { icon : "mdi-clock-outline", title: "Jadwal Pegawai", to:"/detailshift"},
        { icon : "mdi-seat-recline-extra", title: "Role", to:"/role"},
        { icon : "mdi-account-group", title: "Pegawai", to:"/pegawai"},
        { icon : "mdi-car", title: "Mobil", to:"/mobil"},
        { icon : "mdi-card-account-details", title: "Driver", to:"/driver"},
        { icon : "mdi-handshake-outline", title: "Mitra", to:"/mitra"},
        { icon : "mdi-account-group", title: "Customer", to:"/customer"},
        { icon : "mdi-currency-usd", title: "Transaksi", to:"/transaksi"},
      ],
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