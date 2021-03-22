<template>
<div class="main flex-grow-1 pt-4 px-5 d-flex justify-content-center justify-content-lg-start" :class="{dark}">
    <div class="flex-grow-1 pt-3 d-flex justify-content-center">
        <ul v-if="posts.length">
            <li class="main__articles--article mb-5" v-for="post in posts" v-bind:key="post.post_id" >
                <div class="">
                    <small class="text-muted time-status">{{post.created_at}}</small> 
                    <button class="main__articles--editBtn" :class="{dark}" v-if="post.user_id === user_id" @click="editPost(post.title,post.body,post.post_id)">edit</button>
                    <button class="main__articles--deleteBtn" :class="{dark}" v-if="post.user_id === user_id" @click="deletePost(post.post_id)">delete</button>
                    <div class="article__user mb-3 d-flex align-items-center">
                        <img v-bind:src="'http://localhost:8000/images/profile/' + post.profile_picture" width="100%">
                        <span class="text-center ml-1">{{post.name}} {{post.lastname}}</span>
                    </div>
                    <img v-bind:src="'http://localhost:8000/images/post/' + post.filename" class="mb-5" width="100%">
                </div>
                <div class="article__content">
                    <p class="text-sm-left font-bold">{{post.title}}</p>
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
            user_id:null,
            post_id:null,
            errors: null
        }
    },
    created(){
        const user = jwt_decode(localStorage.getItem('jwt')).user_id;
        const url = `http://localhost:8000/post/list/category/${this.$route.params.id}/10`;
        this.user_id = user
        this.user = jwt_decode(localStorage.getItem('jwt'));

        axios.get(url)
        .then(res=>{
            if(!res.data.status && res.data.data !== 'No posts found.') this.errors = res.data.data;
            else if(res.data.status){
                console.log(res.data);
                this.posts = res.data.data;
                res.data.data.forEach((post, i)=>{
                    this.posts[i].created_at = moment(this.posts[i].created_at).format('ll');
                });
            }
            console.log(this.errors)
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
            .article__user{
                img{
                    @include profile-pic(20px);
                }
                span{
                    @include font-style(16px, $color-light);
                }
            }
            .article__content{
                p:first-child{
                    @include font-style(40px);
                }
            }
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