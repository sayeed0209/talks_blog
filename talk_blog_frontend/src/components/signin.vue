<template>
    <div class="container">
        <form @submit="checkform">
            <div class="form form-group">
                <h1>Register</h1>
                <p v-for="error in errors" v-bind:key="error" class="text-danger lead text-center">{{error}}</p>  
            <input type="text" name="" class="form-control" v-model="username" placeholder="username">
            <input type="text" name="" class="form-control" v-model="name" placeholder="name">
            <input type="text" name="" class="form-control" v-model="lastname" placeholder="lastname">
            <input type="email" name="" class="form-control"  v-model="email" placeholder="email">
            <input type="password" name="" class="form-control"  v-model="password" placeholder="password">
            <input type="submit" class="btn btn-dark" value="Register">
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'app',
    data(){
        return {
        errors: [],
        username:'',
        name:'',
        lastname:'',
        email: '',
        password:''
        }
    },
   
    methods:{
        checkform(e){
            e.preventDefault()
                this.errors = [];
                //  console.log(this.errors)
                if (this.username === '') {
                    this.errors.push('You must enter username');
                }else if(this.name === ''){
                    this.errors.push('You must enter firstname');
                }
                else if(this.lastname === ''){
                    this.errors.push('You must enter lastname');
                }
                else if(this.email === ''){
                    this.errors.push('You must enter a valid email');
                }else if(this.password === ''){
                    this.errors.push('You must enter a valid password');
                }
                else{
                    this.register()
                }
            },
        register(){
            const json = JSON.stringify({
                    username:this.username,
                    name:this.name,
                    lastname:this.lastname,
                    email:this.email,
                    password:this.password
            })
            axios.post('http://localhost:8000/auth/register',json
                    ,{headers:{ 'Content-type':'application/json'}}
                    ).then(res=>{
                console.log(res.status)
                if(res.data.status == true){
                this.$router.push({path:'/login'})
            }
            })
        }
    },
}
</script>

<style lang="scss" scoped>
.container {
    display:flex;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    padding: 50px;
    background-color:#f0efeb88;
    overflow: hidden;
}
.form{
    display: flex;
    flex-direction: column;
    padding: 30px 100px;
    margin:20px;
    justify-content: center;
    box-shadow: 5px 5px 15px 5px rgb(175, 172, 172);
}
input{
    padding: 20px 20px;
    margin-top: 10px;
}

</style>
