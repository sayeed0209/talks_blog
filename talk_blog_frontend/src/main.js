import App from './App.vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/js/all.js'
import Router from 'vue-router';
import router from './routes/routes.js'
import Vue from 'vue';
import Vuex from 'vuex';
import VueDragscroll from 'vue-dragscroll'
// import jwt_decode from "jwt-decode";

Vue.use(Vuex)
Vue.use(Router);
Vue.use(VueDragscroll);
// Vue.prototype.$jwt = jwt_decode();


// const router = new Router({
//   routes: routes,
//   mode: "history",
//   });

const store = new Vuex.Store({
  state: {
    dark: false
  },
  mutations: {
    switchTheme (state, bool) {
      state.dark = bool;
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
