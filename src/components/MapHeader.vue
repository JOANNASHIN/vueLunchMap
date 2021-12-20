<template>
    <header class="fb__map__header">
        <router-link to="/" class="fb__map__back">뒤로가기</router-link>
        <form class="fb__map__search" action="" @submit.prevent="searchInit($event)">
            <fieldset class="search__wrapper">
                <legend>음식/ 음식점 검색하기</legend>

                <input 
                    ref="searchInput" 
                    type="search" 
                    class="search__input" 
                    placeholder="음식명 또는 음식점을 검색해보세요."
                    v-model="searchText">
                <button type="submit" class="search__button" @click="searchInit($event)">검색버튼</button>
            </fieldset>
        </form>
    </header>
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
            // TODO: 검색할때 STORE에 저장하든 업데이트하기
            if (searchInput.value) searchInput.value.blur();
            emit("search:restaurant", searchText.value);
            return false;
        }

        if (selectedMenu) {
            searchText.value = selectedMenu.name;
            searchInit();
        }

        return {
            searchInput,
            searchText,
            searchInit
        }
    }
}
</script>