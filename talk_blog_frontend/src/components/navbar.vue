<template>
<div id="topnav" class="navbar d-flex justify-content-between align-items-center" :class="{dark: checked}">
  <router-link to="/"><span class="font-bold title">talk!</span></router-link>
  <div class="d-flex h-100">
    <ul class="navbar__links d-flex h-100 align-items-center">
      <li><button @click="toggleSearch" class="material-icons md-36">search</button></li>
      <li><input class="navbar__search" :class="{show: isActive}"></li>
      <li><button class="material-icons md-36">turned_in_not</button></li>
      <li><button class="material-icons md-36">send</button></li>
      <li class="ml-3">
        <div class="custom-control custom-switch">
          <input v-model="checked" type="checkbox" class="custom-control-input " id="customSwitches">
          <label class="custom-control-label" for="customSwitches"></label>
          <span class="material-icons">wb_sunny</span>
          <span class="material-icons">brightness_3</span>
        </div>
      </li>
    </ul>
    <div class="dropdown ml-3">
      <button class="border border-primary profile__img" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></button>
      <div class="dropdown-menu dropdown-menu-right" :class="{dark: checked}" aria-labelledby="dropdownMenuButton">
        <router-link to="/new-post" class="dropdown-item">New Article</router-link>
        <router-link to="/profile" class="dropdown-item">Profile</router-link>
        <button class="dropdown-item" @click="logout">Logout</button>
      </div>
    </div>
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
        localStorage.removeItem('user_id')
        localStorage.removeItem('username')
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

  .navbar{
    height: 60px;
    padding: 0 20px;

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

    &__search{
      width: 0;
      border: none;
      border-bottom: 1px solid $color-light;
      &.show{
        width: 200px;
      }
    }

    &__links{
      button{
        border: none;
        margin: 5px 10px;
        background: none;
      }
    button:hover{
      transform: scale(1.2);
    }
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

  .custom-control-input ~ .custom-control-label::before{
    border-color: $color-light;
    outline: none;
    box-shadow: none;
  }
  .custom-control-input:checked ~ .custom-control-label::before {
    background: $color-light;
    border-color: $color-light;
      outline: none;
    box-shadow: none;
  }

  [contenteditable="true"]:focus {
    outline-color: none;
}

</style>
