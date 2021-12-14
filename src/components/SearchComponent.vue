<template>
    <form class="fb__search" action="" @submit.prevent="searchInit($event)">
        <fieldset class="fb__search__wrapper">
            <legend>음식/ 음식점 검색하기</legend>

            <input ref="searchInput" type="search" class="fb__search__input" placeholder="음식명 또는 음식점을 검색해보세요." v-model="searchText">
            <button type="submit" class="fb__search__button">검색버튼</button>
        </fieldset>
    </form>
</template>

<script>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";

export default {
    setup(props, { emit }) {
        const store = useStore();

        const searchInput = ref(null);
        const searchText = ref("");
        
        const selectedMenu = store.state.selectedMenu;


        const searchInit = () => {
            if (searchInput.value) searchInput.value.blur();
            emit("search:restaurant", searchText.value);
        }

        if (selectedMenu) {
            searchText.value = selectedMenu.name;
            searchInit();
        }

        return {
            searchText,
            searchInit
        }
    }
}
</script>