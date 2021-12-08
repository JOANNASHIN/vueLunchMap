<template>
  <router-view></router-view>
  <FooterComponent></FooterComponent>
</template>

<script>
import FooterComponent from "./components/FooterComponent.vue";

export default {
    components: {
        FooterComponent
    },
    setup() {
        
    },
}
</script>

<style lang="scss">
#app {
    height: 100%;
}

</style>
