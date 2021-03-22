<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create a new Post</div>
    
                    <div class="card-body" :post_id="post_id">
                        <form @submit="update">
                        <strong>Title:</strong>
                        <input type="text"  v-model="title" class="form-control" >
                        <strong>Description:</strong>
                        <textarea class="form-control" v-model="body"></textarea>
                         <div class="form-group">
                        <label for="exampleFormControlFile1">Upload</label>
                         <input type="file"  class="form-control-file" id="exampleFormControlFile1">
                    </div>
                    <button class="btn btn-success" :post_id="post_id">Submit</button>
                     </form>
                    </div>              
                </div>
                
            </div>
            
        </div>
        
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'app',
    data(){
        return{
            posts:[],
            title:'',
            body:'',
            post_id:null
        }
    },
    mounted(){
      this.title= this.$route.params.title
      this.body= this.$route.params.body
      
    },
    methods:{
        update(e){
            e.preventDefault()
            console.log('holaaaa')
            this.post_id= this.$route.params.post_id
            console.log(this.post_id)
            const json = {post_id:this.post_id,title:this.title,body:this.body}
            const url= `http://localhost:8000/post/edit` 
            const auth = {
                headers: {Authorization:'Bearer ' + localStorage.getItem('jwt')} 
            }
            axios.post(url,json,auth).then(res=>{
                console.log(res)
      })
        }
    }
}
</script>