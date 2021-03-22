<template>
  <div id="app">
    <form @submit="checkform">
      <p v-if="errors.length"></p>

      <p></p>
      <div class="container">
        <div class="left-side">
          <div class="text-content">
            <h1 class="heading">EVERY GOOD CONTENT HAS AN OBJECTIVE</h1>
          </div>
          <div class="logo">
            <img src="../assets/flower.png" alt="" />
          </div>
        </div>
        <div class="right-side">
          <!-- <ul>
             <li v-for="error in errors" v-bind:key="error" class="text-danger text-center">{{error}}</li>
            </ul> -->
          <div class="login">
            <p class="logo_text">Talk!</p>
            <p
              v-for="error in errors"
              v-bind:key="error"
              class="text-danger text-center"
            >
              {{ error }}
            </p>
            <input
              type="email"
              class="form-control my-2"
              v-model="email"
              placeholder="Username"
            />
            <input
              type="password"
              class="form-control my-2"
              v-model="password"
              placeholder="password"
            />
            <input type="submit" class="btn btn-dark" value="Login" />
            <p class="forget_password">Forget password</p>
          </div>
          <div class="signin">
            <p class="siginText">New user?<a href="/signin">Signin</a></p>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: 'app',
  data() {
    return {
      errors: [],
      email: null,
      password: null,
    };
  },

  methods: {
    checkform(e) {
      e.preventDefault();
      this.errors = [];
      const passReg = '(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}';
      const emailReg = '/^\S+@\S+\.\S+$/'
      //  console.log(this.errors)
      if (this.email === '') {
        this.errors.push('You must enter a valid email');
      } else if (this.password === '') {
        this.errors.push(
          'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
        );
      } else {
        this.login();
      }
    },
    login() {
      const json = JSON.stringify({
        email: this.email,
        password: this.password,
      });
      // console.log(json);
      axios
        .post('http://localhost:8000/auth/login', json, {
          headers: { 'Content-type': 'application/json' },
        })
        .then((res) => {
          // console.log(res);
          const token = res.data.token;
        //   const admin = res.data.data.admin;
        //   const user = res.data.data.name
        //   const user_id = res.data.data.user_id
        //   console.log(admin);
        //   localStorage.setItem('jwt', token);
        //   localStorage.setItem('isAdmin', admin);
        //   localStorage.setItem('username',user)
        //   localStorage.setItem('user_id',user_id)
        //  if (token !== undefined) {
          // const admin = res.data.data.admin;
          // console.log(res.data.data);
          // localStorage.setItem('isAdmin', admin);
          if (token !== undefined) {
            localStorage.setItem('jwt', token);
            this.$router.push({ path: '/' });
          }
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #f0efeb88;
  display: flex;
  justify-content: center;
  overflow: hidden;
}
.left-side {
  display: flex;
  flex-direction: column;
  width: 60%;
  height: 100vh;
  // background-color: aqua;
}
.heading {
  margin-top: 200px;
  margin-bottom: 120px;
  text-align: center;
  font-size: 50px;
  font-weight: 900;
}
img {
  width: 700px;
}
.right-side {
  display: flex;
  width: 40%;
  flex-direction: column;
  // background-color: sandybrown;
  justify-content: center;
  align-items: center;
}
.login {
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 15px 5px rgb(175, 172, 172);
  margin-bottom: 15px;
  padding: 30px 20px;
  border-radius: 5px;
}
.signin {
  display: flex;
  flex-direction: column;
  box-shadow: 5px 5px 15px 5px rgb(175, 172, 172);
  padding: 10px 63px;
  justify-content: center;
  text-align: center;
  border-radius: 5px;
}
.forget_password {
  text-align: center;
}
.login .logo_text {
  text-align: center;
  font-weight: 900;
  font-size: 40px;
}
@media (max-width: 600px) {
  .container {
    display: flex;
    flex-direction: column;
  }
  .right-side {
    margin-top: 100px;
    width: 100%;
  }
  .text-content .heading {
    font-size: 30px;
    text-align: center;
  }
}
@media (max-width: 425px) {
  .container {
    display: flex;
    flex-direction: column;
  }
  .left-side {
    margin-top: 150px;
    width: 100%;
  }
  .right-side {
    margin-top: 150px;
    width: 100%;
  }
}
</style>
