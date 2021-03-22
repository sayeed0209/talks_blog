<template>
<div id="body" class="main__container light px-4 flex-grow-1" :class="{dark}">
    <div v-if="logged" class="dashboard__personal h-50 d-inline-block d-flex flex-column flex-lg-row justify-content-between">
        <div class="dashboard__personal__suggested pt-3 d-none d-xl-block">
            <span>Suggested People</span>
            <div>
                <ul>
                    <li class="suggested__profile__container mt-3 d-flex align-items-center">
                        <img src="../assets/img/random.jpg" alt="">
                        <div class="suggested__profile__description ml-4">
                            <div>
                                <span class="font-bold" :class="{dark}">Username</span>
                                <button class="suggested__follow__btn ml-1" :class="{dark}">Follow</button>
                            </div>
                            <span>Bacon ipsum dolor amet shankle corned beef tenderloin, drumstick[...]</span>
                        </div>
                    </li>
                    <li class="suggested__profile__container mt-3 d-flex align-items-center">
                        <img src="../assets/img/random.jpg" alt="">
                        <div class="suggested__profile__description ml-4">
                            <div>
                                <span class="font-bold" :class="{dark}">Username</span>
                                <button class="suggested__follow__btn ml-1" :class="{dark}">Follow</button>
                            </div>
                            <span>Bacon ipsum dolor amet shankle corned beef tenderloin, drumstick[...]</span>
                        </div>
                    </li>
                    <li class="suggested__profile__container mt-3 d-flex align-items-center">
                        <img src="../assets/img/random.jpg" alt="">
                        <div class="suggested__profile__description ml-4">
                            <div>
                                <span class="font-bold" :class="{dark}">Username</span>
                                <button class="suggested__follow__btn ml-1" :class="{dark}">Follow</button>
                            </div>
                            <span>Bacon ipsum dolor amet shankle corned beef tenderloin, drumstick[...]</span>
                        </div>
                    </li>
                </ul>
            </div>

        </div>
        <div class="dashboard__personal__article mx-5 flex-grow-1">
            <span class="mt-3 d-inline-block">Top of the day</span>
            <div>
                <div :ref="'popuTitleBox' + mostPopuPost.post_id" class="dashboard__personal__article--title">
                    <h4 class="font-bold">{{mostPopuPost.title}}</h4>
                </div>
                <div class="dashboard__personal__article--user">
                    <img :src="'http://localhost:8000/images/profile/' + mostPopuPost.profile_picture" alt="">
                    <span>{{mostPopuPost.name}} {{mostPopuPost.lastname}}</span>
                </div>
                <div :ref="'popularBody' + mostPopuPost.post_id" class="dashboard__personal__article--body mt-4">
                    <!-- <img src="../assets/img/random.jpg" alt=""> -->
                    <span>{{mostPopuPost.body}}</span>
                </div>
            </div>
        </div>
        <div class="dashboard__personal__community d-flex flex-column flex-sm-row flex-lg-column h-50">
            <div class="dashboard__personal__community--friend h-50 flex-grow-1">
                <span class="dashboard__personal__community--title d-inline-block mt-3">Latest from friends</span>
                <div v-dragscroll class="overflowX-scroll mt-3 d-flex align-items-center">
                    <div v-bind:key="'friend-'+friend.user_id" v-for="friend in friends" class="mr-4 d-flex flex-column align-items-center">
                        <router-link :disabled='notPressing' :event='notPressing ? "" : "click"' :to="'/user/'+ friend.user_id">
                            <img @mousedown="dragStart" @mouseup="dragEnd" src="../assets/img/random.jpg" alt="">
                        </router-link>
                        <span class="d-block">{{friend.fullname}}</span>
                    </div>
                </div>
            </div>
            <hr class="d-sm-none d-lg-block">
            <div class="h-50 d-flex align-items-center">
                <ul class="d-flex flex-wrap justify-content-center align-items-center">
                    <li class="dashboard__personal__community--category" v-bind:key="'category' + cat.category_id" v-for="cat in categories"><router-link :to="'/post/category/' + cat.category_id"><button :class="{dark}">{{cat.category}}</button></router-link></li>
                </ul>
            </div>
        </div>
    </div>
    <hr>
    <div class="w-100 d-flex relative">
        <div class="dashboard__feed pr-2 pt-4">
            <div v-bind:key="'artcle-' + article.post_id" v-for="article in recent" class="dashboard__feed__article d-flex mb-4 justify-content-between">
                <div class="d-inline">
                    <router-link :to="'/user/' + article.user_id">
                        <div class="dashboard__feed__article--user d-inline-block mb-1">
                            <img :src="'http://localhost:8000/images/profile/' + article.profile_picture" alt="">
                            <span class="font-bold" :class="{dark}">{{article.name}} {{article.lastname}}</span>
                        </div>
                    </router-link>
                    <router-link :to="'/post/' + article.post_id">
                        <div>
                            <div :ref="'titleBox' + article.post_id"><h5 class="dashboard__feed__article--title font-bold d-inline" :class="{dark}">{{article.title}}</h5></div>
                            <div :ref="'descriptionBox' + article.post_id"><span :ref="'descriptionContent' + article.post_id" class="dashboard__feed__article--body d-none d-md-inline">{{article.body}}</span></div>
                            <span class="dashboard__feed__article--data">16 Oct</span>
                        </div>
                    </router-link>
                </div>
                <img class="w-25 ml-4" :src="'http://localhost:8000/images/post/' + article.filename" alt="">
            </div>
        </div>
        <div class="dashboard__later d-none d-lg-block w-50 h-100 px-2 sticky-top pt-4">
            <div class="dashboard__later__container w-75 p-4 mx-auto" :class="{dark}">
                <span class="d-block mb-3">Saved for later</span>
                <div>
                    <div class="d-block mb-3">
                        <router-link to="/profile/1">
                            <div class="dashboard__later__article--user d-inline-block mb-1">
                                <img src="../assets/img/random.jpg" alt="">
                                <span class="font-bold" :class="{dark}">Username</span>
                            </div>
                        </router-link>
                        <router-link to="/post/1">
                            <div>
                                <h5 class="dashboard__later__article--title font-bold d-inline" :class="{dark}">This is some random title of the most awesome article you'll ever read</h5><br>
                                <span class="dashboard__later__article--data">16 Oct</span>
                            </div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'dashboard',
    props: ['dark', 'logged'],
    data () {
        return {
            post: null,
            recent: [],
            containerWidth: false,
            categories: [],
            mostPopuPost: {},
            dragTime: null,
            notPressing: false,
            friends: [{
                lastname: 'Strand',
                firstname: 'Lockne',
                user_id: 1
            },
            {
                lastname: 'Hirota',
                firstname: 'Momo',
                user_id: 2
            },
            {
                lastname: 'Hirota',
                firstname: 'Momo',
                user_id: 3
            },
            {
                lastname: 'Hirota',
                firstname: 'Momo',
                user_id: 4
            },
            {
                lastname: 'Hirota',
                firstname: 'Momo',
                user_id: 5
            },
            {
                lastname: 'Hirota',
                firstname: 'Momo',
                user_id: 6
            },
            {
                lastname: 'Hirota',
                firstname: 'Momo',
                user_id: 7
            },
            ]
        }
    },
    methods: {
        truncateSpan(str){
            this.recent.forEach((article, i) => {
                const ref = 'descriptionBox' + article.post_id;
                const ref2 = 'titleBox' + article.post_id;
                // const ref3 = 'laterBox' + article.post_id;

                if((this.$refs[ref][0].clientHeight/24) >2){
                    this.recent[i].body = article.body.substr(0, article.body.lastIndexOf(' ')) + '[...]';
                }
                if((this.$refs[ref2][0].clientHeight/30) >2){
                    this.recent[i].title = article.title.substr(0, article.title.lastIndexOf(' ')) + '[...]';
                }
            })
            // const popularTitle = 'popuTitleBox' + this.mostPopuPost.post_id;
            const popularBody = 'popularBody' + this.mostPopuPost.post_id;
            if((this.$refs[popularBody].clientHeight/24) >6){
                this.mostPopuPost.body = this.mostPopuPost.body.substr(0, this.mostPopuPost.body.lastIndexOf(' ')) + '[...]';
            }

            this.friends.forEach((friend, i)=>{
                // const ref = 
            })
        },
        restartContent(){
            this.recent.forEach((article, i) => {
                this.recent[i].body = article.bodyOriginal;
                this.recent[i].title = article.titleOriginal;
            });
            this.mostPopuPost.body = this.mostPopuPost.bodyOriginal;
        },
        dragStart(e){
            this.startDrag = Date.now();
        },
        dragEnd(e){
            const spanTime = (Date.now() - this.startDrag)/1000;
            if(spanTime > 0.1) this.notPressing = true;
            else this.notPressing = false;
        }
    },
    created(){
        axios.get('http://localhost:8000/post/list/recent/10')
        .then(e=>{
            this.recent = e.data.data;
            this.recent.forEach(e =>{
                e.body = e.body.substr(0, 170);
                e.bodyOriginal = e.body;
                e.titleOriginal = e.title;
            })
        });
        axios.get('http://localhost:8000/categories').then(e=>this.categories = e.data.data);
        axios.get('http://localhost:8000/post/list/popular/1').then(e=>{
            this.mostPopuPost = e.data.data[0];
            this.mostPopuPost.body = this.mostPopuPost.body.substr(0, 550);
            this.mostPopuPost.bodyOriginal = this.mostPopuPost.body;
            this.mostPopuPost.titleOriginal = this.mostPopuPost.title;
        });
        this.friends.forEach(friend => {
            const fullname = (friend.firstname + ' ' + friend.lastname);
            friend.fullname = fullname.length > 10 ? fullname.substr(0, 7) + '...' : fullname;
        })
    },
    mounted(){
        window.addEventListener('resize', ()=>{
            this.truncateSpan();
            if (this.$refs.descriptionBox1[0].clientWidth > this.containerWidth) this.restartContent();
            this.containerWidth = this.$refs.descriptionBox1[0].clientWidth
        });
    },
    updated(){
        this.truncateSpan();
    },
    watch: {
        recent(){
            console.log('recent updated')
            // this.truncateSpan();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';

.main__container{
    flex-grow: 1;

    &.dark{
        background: $color-dark;
        color: white;
    }
}

.light{
    background: white;
    color: $color-dark;
    transition: 0.3s ease;
}

.overflowX-scroll{
    overflow-x: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.overflowX-scroll::-webkit-scrollbar {
    display: none;
}

.dashboard__personal{
    &__article{
        height: 40vh;

        .font-bold{
            @include font-style(32px);
        }

        &--user{
            img{
                @include profile-pic(18px);
            }
            span{
                @include font-style(16px, $color-light);
            }
        }
        &--body{
            img{
                @include article-pic(150px, 150px);
            }
        }
    }
    &__community{
        width: 100%;
        &--category{
            button{
                @include CTA-btn(2px);
            }
        }
        &--friend{
            width: 50%;
            img{
                @include profile-pic(75px);
            }
            span{
                @include font-style(13px, $color-light);
            }
        }
        &--title span{
            @include font-style(134px, red);
        }
    }
}

.suggested__profile__container{
    width: 400px;

    img{
        @include profile-pic(60px);
    }

    .suggested__profile__description{
        width: 270px;
    }
    .suggested__profile__description > div > span:nth-child(1){
        @include font-style(16px, $color-dark);
        transition: 0.3s ease;
        &.dark{
            color: $color-light2;
        }
    }

    .suggested__profile__description > span:nth-child(2){
        @include font-style(14px, $color-light, false, 10px);
    }

    .suggested__follow__btn{
        @include CTA-btn(0, 10px, 1px, 10px);
    }

}

.dashboard__feed{
    &__article{
        height: 150px;

        img{
            @include article-pic(100%, 35%)
        }

        &--user{
            img{
                @include profile-pic(20px);
            }
            span{
                @include font-style(13px, $color-dark);
                transition: 0.3s ease;
                &.dark{
                    color: $color-light2;
                }
            }
        }

        &--title{
            @include font-style(22px, $color-dark);
            transition: 0.3s ease;
            &.dark{
                color: $color-light2;
            }
        }

        &--body{
            span:first-child{
                @include font-style(22px);
            }
            color: $color-light;
            @include font-style(16px);
        }

        &--data{
            @include font-style(13px, $color-light)
        }
    }
}


.dashboard__later{
    min-width: 370px;
    max-width: 510px;

    &__container{
        background: #f8f9fa;
        transition: 0.3s ease;
        &.dark{
            background: $color-dark-light;
        }
    }

    &__article{
        &--user{
            @extend .dashboard__feed__article--user;
        }
        &--title{
            @extend .dashboard__feed__article--title;
            @include font-style(16px);
        }
        &--data{
            @extend .dashboard__feed__article--data;
        }
    }
}

@media (min-width: 576px){
    }

@media (min-width: 992px){
    .dashboard__personal__community{
        width: 400px;
        &--friend{
            width: 100%;
        }
    }
    .dashboard__feed{
        width: 65%;
    }
}

</style>
