<template>
<div class="main" :class="{dark}">
    <h2 class="text-center">This is a footer</h2>
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