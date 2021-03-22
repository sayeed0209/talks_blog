<template>
<div class="main flex-grow-1 d-flex align-items-center justify-content-center" :class="{dark}">
    <h1 class="text-center">404, not found :(</h1>
</div>
</template>

<script>
    export default {
        name: 'dashboard',
        props: ['dark', 'logged'],
    }
</script>

<style lang="scss" scoped>
@import '../assets/css/variables';

.main{
    transition: 0.3s ease;
}

.dark{
    background: $color-dark;
    color: $color-light2;
}
</style>