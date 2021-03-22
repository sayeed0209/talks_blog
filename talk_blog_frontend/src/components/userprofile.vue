<template>
<div class="main flex-grow-1 pt-4 px-5 d-flex justify-content-center justify-content-lg-start" :class="{dark}">
    <div class="mr-5 d-none d-lg-block">
        <div class="main__user sticky-top pt-3" id="side">
            <img v-bind:src="'http://localhost:8000/images/profile/'+ posts[0].profile_picture"  class="main__user--img"/>
            <h5 class="mt-3">{{posts[0].name}} {{posts[0].lastname}}</h5>
            <div class="d-flex justify-content-between align-items-center" >
                <a href="">{{followers}} Followers</a>
                <button type="button" class="followBtn" :class="{dark}">Follow</button>
            </div>
            <div class="mt-3">
                <span class="text-secondary">About</span>
                <p class="text-wrap">{{posts[0].description}}</p>
            </div>
        </div>
    </div>
    <div class="flex-grow-1 pt-3 d-flex justify-content-center">
        <ul v-if="posts.length">
            <li class="main__articles--article mb-5" v-for="post in posts" v-bind:key="post.post_id" >
                <div class="">
                    <small class="text-muted time-status">{{post.created_at}}</small> 
                    <button class="main__articles--editBtn" :class="{dark}" v-if="post.user_id === user_id" @click="editPost(post.title,post.body,post.post_id)">edit</button>
                    <button class="main__articles--deleteBtn" :class="{dark}" v-if="post.user_id === user_id" @click="deletePost(post.post_id)">delete</button>
                    <img v-bind:src="'http://localhost:8000/images/post/' + post.filename" class="mb-5" width="100%">
                </div>
                <div>
                    <p class="text-sm-left font-weight-bold">{{post.title}}</p>
                    <p class="">{{post.body}}</p>
                </div>
                <div class="row">
                    <div class="col-sm-5 d-flex justify-content-between ">
                        <i class="fas fa-heart"></i>
                        <i class="far fa-comment"></i>
                        <i class="fas fa-share-alt"></i>
                        <i class="far fa-bookmark"></i>
                    </div>
                </div>
            </li>
        </ul>
        <div v-else>
            <span>No posts yet :(</span>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import jwt_decode from "jwt-decode";
import moment from 'moment';

export default {
    name:'profile',
    props: ['dark', 'logged'],
    data(){
        return {
            posts:[],
            postImg: [],
            user: null,
            followers: null,
            user_id:null,
            post_id:null,
            errors: null
        }
    },
    created(){
        const user = jwt_decode(localStorage.getItem('jwt')).user_id;
        const url = `http://localhost:8000/post/list/user/${this.$route.params.id}/1`;
        this.user_id = user
        this.user = jwt_decode(localStorage.getItem('jwt'));

        axios.get(url)
        .then(res=>{
            if(!res.data.status && res.data.data !== 'No posts found.') this.errors = res.data.data;
            else if(res.data.status){
                this.posts = res.data.data;
                res.data.data.forEach((post, i)=>{
                    this.posts[i].created_at = moment(this.posts[i].created_at).format('ll');
                });
            }
        }).then(()=>{
            axios.get(`http://localhost:8000/get/followers/${this.posts[0].user_id}`)
            .then(res => {
                if(res.data.status) this.followers = res.data.data.followers;
            })
        })

    },
    methods:{
        editPost(title,body,post_id){
            this.$router.push({name:'Edit',params:{
                title:title,
                body:body,
                post_id:post_id
            }})
        },
        deletePost(id){
            axios.post('http://localhost:8000/post/remove',
            {
                post_id: id
                },
            {
                headers: {Authorization:'Bearer ' + localStorage.getItem('jwt')} 
            })
            .then(e=> console.log(e));
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../assets/css/variables';

.main{
    transition: 0.3s ease;

    &__user{
        width: 175px;
        &--img{
            @include profile-pic(175px, $r)
        }
    }
    .followBtn{
        @include CTA-btn(false, 10px);
    }

    &__articles{
        &--article{
            max-width: 680px;
        }
        &--editBtn{
            @include CTA-btn(5px, 10px, 1px, 5px)
        }
        &--deleteBtn{
            @include CTA-btn(5px, 10px, 1px, 5px)
        }
    }
}

.dark{
    background: $color-dark;
    color: $color-light2;
}

</style>