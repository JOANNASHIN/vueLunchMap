<template>
    <article class="fb__list">
        <h2>레스토랑 리스트</h2>
        <div>
            <!-- {{selectedMenu.name}} -->
        </div>
    </article>
</template>

<script>
import { useStore } from "vuex";

export default {
    name: "RestaurantList",
    props: {
      
    },
    setup() {
        const store = useStore();
        const selectedMenu = store.state.selectedMenu;

        return {
            selectedMenu
        }
    }
}
</script>

<style>

</style>