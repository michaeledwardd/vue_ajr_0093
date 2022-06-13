import Vue from 'vue'
import App from './App.vue'
import vuetify from "@/plugins/vuetify";
import router from "./router";
import axios from 'axios';

Vue.config.productionTip = false

Vue.prototype.$http = axios;
Vue.prototype.$api = 'https://backendajr.ajr-edward.xyz/api';
Vue.prototype.$baseUrl = 'https://backendajr.ajr-edward.xyz/public';
new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app")
