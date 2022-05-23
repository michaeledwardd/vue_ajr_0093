<template>
  <v-main>
    <div class="dashboard">
      <v-subheader class="py-0 d-flex justify-space-between rounded-lg">
        <h3>Dashboard</h3>
      </v-subheader>
      <br />
      <v-row>
        <v-col>
          <v-alert dense text type="success">
            Login Successfully! Welcome
            <strong>Pegawai Atma Jaya Rental</strong>
          </v-alert>
          <v-row>
            <v-col v-for="(item, index) in activityLog" :key="index">
              <v-card elevation="2" class="rounded-lg">
                <v-card-text class="d-flex justify-space-between align-center">
                  <div>
                    <strong>{{ item.title }}</strong> <br />
                    <span>Berdasarkan sejak awal berdiri</span>
                  </div>
                  <v-avatar
                    size="60"
                    :color="item.color"
                    style="border: 3px solid #444"
                  >
                    <span style="color: white">{{ item.amount }} +</span>
                  </v-avatar>
                </v-card-text>
                <v-card-actions class="d-flex justify-space-between">
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="5">
          <v-card>
            <v-card-title>Ketentuan Pegawai Atma Jaya Rental</v-card-title>
            <v-card-text class="py-0">
              <v-timeline align-top dense>
                <v-timeline-item color="blue" small>
                  <strong>Tidak boleh slowrespon</strong>
                  <div class="text-caption">
                    Wajib fastrespon jika dihubungi
                  </div>
                </v-timeline-item>
                <v-timeline-item color="green" small>
                  <strong>Cepat dan Tanggap</strong>
                  <div class="text-caption mb-2">Jangan menunda pekerjaan</div>
                </v-timeline-item>
                <v-timeline-item color="blue" small>
                  <strong>Selesaikan kerjaan tepat waktu</strong>
                  <div class="text-caption">
                    Diusahakan selesai sebelum deadline
                  </div>
                </v-timeline-item>
                <v-timeline-item color="green" small>
                  <strong>Berdoalah sebelum bekerja</strong>
                  <div class="text-caption">
                    Ucapkan doa sebelum memulai kerja agar tidak menemui
                    kesalahan
                  </div>
                </v-timeline-item>
              </v-timeline>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-main>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {
      mobils: [],
      promos: [],
      customers: [],
      activityLog: [
        {
          title: "Mobil",
          amount: "",
          icon: "mdi-account",
          color: "green darken-2",
        },
        {
          title: "Customer",
          amount: "",
          icon: "mdi-account-group-outline",
          color: "green darken-2",
        },
        {
          title: "Mitra",
          amount: "",
          icon: "mdi-account-group-outline",
          color: "green darken-2",
        },
        {
          title: "Promo",
          amount: "",
          icon: "mdi-account-group-outline",
          color: "blue darken-1",
        },
        {
          title: "Driver",
          amount: "",
          icon: "mdi-account-group-outline",
          color: "blue darken-1",
        },
        {
          title: "Transaksi",
          amount: "",
          icon: "mdi-account-group-outline",
          color: "blue darken-1",
        },
      ],
    };
  },
  methods: {
    onButtonClick(item) {
      console.log("click on " + item.no);
    },
  },
  mounted() {
    this.$http
      .get(this.$api + "/mobil")
      .then((response) => {
        this.mobils = response.data.data;
        this.activityLog[0].amount = this.mobils.length;
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get(this.$api + "/customer")
      .then((response) => {
        this.customers = response.data.data;
        this.activityLog[1].amount = this.customers.length;
      })
      .catch((error) => {
        console.log(error);
      });

    this.$http
      .get(this.$api + "/promo")
      .then((response) => {
        this.promos = response.data.data;
        this.activityLog[3].amount = this.promos.length;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style scoped>
.overlap-icon {
  position: absolute;
  top: -33px;
  text-align: center;
  padding-top: 12px;
}

*,
:after,
:before {
  background-repeat: no-repeat;
}
</style>
