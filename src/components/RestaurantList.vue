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
        selectedMenu: {
            type: Object,
            required: false,
        }
    },
    setup() {
        const store = useStore();
        // store.state.
    }
}
</script>

<style>

</style>