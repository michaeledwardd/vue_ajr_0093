<template>
  <v-main>
    <v-card v-if="customer != ''" class="mx-auto" max-width="344">
      <v-card-text>
        <div>KARTU CUSTOMER</div>
        <p class="text-h4 text--primary">
          {{ customer.nama_customer }}
        </p>
        <p>CUSTOMER</p>
        <p>{{ customer.id_customer }}</p>
        <p>Mobile: {{ customer.no_telp }}</p>
        <div class="text--primary">Address: {{ customer.alamat_customer }}</div>
        <p>Email: {{ customer.email_customer }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="teal accent-4" @click="reveal = true">
          Berkas Anda
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <v-card
          v-if="reveal"
          class="transition-fast-in-fast-out v-card--reveal"
          style="height: 100%"
        >
          <v-card-text class="pb-0">
            <p class="text-h4 text--primary">Berkas Customer</p>
            <img
              :src="$baseUrl + '/storage/' + customer.upload_berkas"
              width="220px"
            />
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn text color="teal accent-4" @click="reveal = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-expand-transition>
    </v-card>
  </v-main>
</template>

<script>
export default {
  data: () => ({
    reveal: false,
    customer: "",
  }),
  mounted() {
    if (localStorage.getItem("id_customer") != null) {
      this.$http
        .get(this.$api + "/customer/" + localStorage.getItem("id_customer"))
        .then((response) => {
          this.customer = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
};
</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
