<template>
    <form class="fb__search" action="" @submit.prevent="searchInit($event)">
        <fieldset class="fb__search__wrapper">
            <legend>음식/ 음식점 검색하기</legend>

            <input type="search" class="fb__search__input" placeholder="음식명 또는 음식점을 검색해보세요." v-model="searchText">
            <button type="submit" class="fb__search__button">검색버튼</button>
        </fieldset>
    </form>
</template>

<script>
import { ref } from "vue";
export default {
    setup() {
        const searchText = ref("");
        const searchInit = () => {
            console.log(searchText.value,"검색단어");
        }

        return {
            searchText,
            searchInit
        }
    }
}
</script>