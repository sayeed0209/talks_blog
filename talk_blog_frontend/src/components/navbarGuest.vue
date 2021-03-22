<template>
<div id="topnav" class="navbar d-flex justify-content-between align-items-center" :class="{dark: checked}">
  <router-link to="/"><span class="font-bold title">talk!</span></router-link>
  <div class="d-flex h-100">
    <ul class="d-flex h-100 align-items-center">
      <li><router-link to="/login" class="navbar__route mr-3">Login</router-link></li>
      <li><router-link to="/signin" class="navbar__route mr-3">Signin</router-link></li>
      <li class="ml-3">
        <div class="custom-control custom-switch">
          <input v-model="checked" type="checkbox" class="custom-control-input " id="customSwitches">
          <label class="custom-control-label" for="customSwitches"></label>
          <span class="material-icons">wb_sunny</span>
          <span class="material-icons">brightness_3</span>
        </div>
      </li>
    </ul>
  </div>
</div>
</template>

<script>
export default {
  name: 'navbar',
  props: ['dark'],
  data () {
    return {
      checked: this.$store.state.dark,
      isActive: false,
    }
  },
  watch: {
    checked(){
      this.$store.commit('switchTheme', this.checked);
    }
  },
  methods: {
    toggleSearch(){
      this.isActive = !this.isActive ? true : false;
    },
    logout(){
        localStorage.removeItem('jwt')
        localStorage.removeItem('isAdmin')
        this.$router.push({path:'/login'})
     }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/css/variables';
  @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

  *{
    transition: 0.3s ease;
  }

  button:focus,
  input:focus{
    outline: none;
  }

  button:hover{
    transform: scale(1.2);
  }

.navbar__search{
  width: 0;
  border: none;
  border-bottom: 1px solid $color-light;
  &.show{
    width: 200px;
  }
}

  .navbar{
    height: 60px;
    padding: 0 20px;

    &__route{
      color: $color-dark;
    }

    .profile__img{
      height: 45px;
      width: 45px;
      border-radius: 50%;
    }

    .title{
      font-size: 28px;
      user-select: none;
      color: $color-dark;
    }
    .material-icons{
      color: $color-light;
      user-select: none;
    }

    button{
      border: none;
      margin: 5px 10px;
      background: none;
    }
    &.dark{
      background: $color-dark;
      *{
      color:rgb(236, 236, 236);
      }

      .dropdown-menu{
        background: $color-dark-light;
        border: none;

        .dropdown-item:hover{
          background: $color-dark-light2;
        }
      }
    }
  }

  .custom-control{
    transform: scale(1.4);
    position: relative;
    span{
      position: absolute;
      top: 8px;
      right: 11px;
      font-size: 9px;
    }
    span:nth-of-type(2){
      right: 23px;
      color: white;
    }
  }

  .custom-control-label::before,
  .custom-control-label::after{
    cursor: pointer;
  }
  .custom-control-label::after{
    z-index: 99;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    background: $color-light;
    border-color: $color-light;
  }

  .label:focus,
  .label:active,
  .input:active,
  .custom-control-label::before:active,
  .custom-control-label::before:focus,
  .custom-control-label::after:active,
  .custom-control-label::after:focus,
  .custom-control-label::before,
  .custom-control-label:focus,
  .custom-control-label:active,
  .custom-control-label,
  .custom-control:focus,
  .custom-control:active,
  .custom-control,
  .custom-control-input:focus,
  .custom-control-input:active,
  .custom-control-input,
  .custom-control-input:checked ~ .custom-control-label::before,
  .input:focus {
    outline: none;
    box-shadow: none;
    background: red;
  }

  [contenteditable="true"]:focus {
    outline-color: none;
}

</style>
