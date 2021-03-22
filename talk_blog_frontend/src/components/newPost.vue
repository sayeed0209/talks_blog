<template>
    <div class="flex-grow-1 container mt-5">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card">
                    <div class="card-header">Create a new Post</div>
                    <div class="card-body">
                        <form  ref="clearForm">
                            <strong>Title:</strong>
                            <input type="text" class="form-control" v-model="title">
                            <strong>Description:</strong>
                            <textarea class="form-control" v-model="body"></textarea>
                            <div class="form-group">
                                <label for="imgUpload">Upload</label>
                                <input type="file" :ref="file" class="form-control-file" id="imgUpload">
                            </div>
                            <button @click="formSubmit" class="btn btn-success">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>


<script>
import axios from 'axios';
export default {
    name:'app',
    data() {
        return{
            title:'',
            body:'',
            selectedFiles: null,
        }
    },
    methods:{
        formSubmit(e){
            console.log(document.querySelector('#imgUpload').files);
            e.preventDefault();
            this.sendImage();
            this.$refs.clearForm.reset()
            const auth = {
                    headers: {Authorization:'Bearer ' + localStorage.getItem('jwt')}
                }
                console.log(auth)
                axios.post('http://localhost:8000/post/new',{ title:this.title,
                body: this.body},auth).then(res=>{
                console.log(res)
            }).catch(err=>{
                console.log(err)
            })
        },
        sendImage(){
            let data = new FormData();
            // this.selectedFiles = this.$refs.file.files;
            // console.log(this.selectedFiles);

            // for (var i = 0; i < files.length; i++) {
            //     let file = files.item(i);
            //     data.append('images[' + i + ']', file, file.name);
            // }

            // const config = {
            //     headers: { 'content-type': 'multipart/form-data' }
            // }

            // return axios.post('/api/images', data, config)
        }
    }
}
</script>