<template>
  <div id="main" class="d-flex flex-column justify-content-between min-vh-100">
    <!-- <navbar v-if="$route.path ==='/login' || $route.path ==='/signin' && !logged ? false : true" v-bind:dark='this.$store.state.dark' /> -->
    <navbar v-if="logged ? true : false" v-bind:dark='this.$store.state.dark' />
    <navbarGuest v-else-if="$route.path ==='/login' || $route.path ==='/signin' ? false : true" v-bind:dark='this.$store.state.dark' />
    <router-view v-bind:dark='this.$store.state.dark' v-bind:logged='logged'/>
    <!-- <foot v-if="$route.path ==='/login' || $route.path ==='/signin' ? false : true" v-bind:dark='this.$store.state.dark' /> -->
  </div>
</template>

<script>
import navbar from './components/navbar.vue'
import navbarGuest from './components/navbarGuest.vue'
import footer from './components/footer.vue'
import jwt_decode from "jwt-decode"

export default {
  name: 'app',
  components: {
    navbar: navbar,
    navbarGuest: navbarGuest,
    foot: footer
  },
  data () {
    return {
      dark: false,
      logged: false,
    }
  },
  methods: {
    checkLog(){
      try {
        jwt_decode(localStorage.getItem('jwt'));
        this.logged = true;
      } catch (error) {
        this.logged = false;
      }
    }
  },
  created(){
    this.checkLog()
  },
  updated(){
    this.checkLog()
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: "Mark-Book";
  src: local("Mark-Book"),
  url(./assets/fonts/MarkPro-Book.ttf) format("truetype");
}
@font-face {
  font-family: "Mark-Bold";
  src: local("Mark-Bold"),
  url(./assets/fonts/MarkPro-Black.ttf) format("truetype");
}

@import './assets/css/variables';

*{
  margin: 0;
  padding: 0;
}

#main {
  font-family: 'Mark-Book', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  min-height: 100vh;
}

.font-bold{
  font-family: 'Mark-Bold', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

// li {
//   display: inline-block;
//   margin: 0 10px;
// }

a, a:hover {
  text-decoration: none;
  // color: #42b983;
}
</style>
