<template>
    <article 
        ref="restaurantListLayer" 
        class="fb__restaurants"  
        v-touch:drag="dragTouch" 
        v-touch:release="endTouch"
    >
    <!-- v-touch:press="startTouch" -->
        <h2 class="fb__title--hidden">레스토랑 리스트 레이어</h2>
        <div class="fb__restaurants__space" :class="isTouched ? 'max' : ''">빈 배경 공간</div>

        <div class="fb__restaurants__cont">
            <button class="fb__restaurants__touch">레이어 확대버튼</button>

            <div class="fb__restaurants__scroll">
                <template v-if="restaurants && restaurants.length">
                    <ul class="fb__restaurants__wrapper">
                        <template v-for="(list, index) in restaurants" :key="index">
                            <li class="fb__restaurants__list" @click.prevent="openDetailLayer()">
                                <strong class="fb__restaurants__name">{{list.name}}</strong>
                                
                                <p class="fb__restaurants__desc">
                                    <span>{{list.description}}</span>
                                    <span>거리 {{list.howFar}}분</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                                    <span>별점 {{list.score}}점</span>
                                </p>

                                <template v-if="list.photo && list.photo.length">
                                    <figure class="fb__restaurants__img">
                                        <template v-for="(thumb, photoIndex) in list.photo" :key="`photo${photoIndex}`">
                                                <img :src="thumb.src" alt="">
                                        </template>
                                    </figure>
                                </template>
                            </li>
                        </template>
                    </ul>
                </template>
                <template v-else>
                    <p class="fb__restaurants__empty">리스트가 없습니다.</p>
                </template>
            </div>

            <!-- <button class="fb__restaurants__close" @click="closeLayer()">지도보기</button> -->
        </div>
    </article>
</template>

<script>
import { ref, reactive, onMounted, nextTick} from "vue";
import { useStore } from "vuex";
import { connectDatabase } from "../composables/connectDatabase";

export default {
    name: "RestaurantList",
    setup() {
        const store = useStore();
        const selectedMenu = store.state.selectedMenu;

        const { fetchRestaurantList } = connectDatabase();
        const restaurantListLayer = ref(null);
        const restaurants = ref([]);
   
        const requestPositions = async () => {
            const response = await fetchRestaurantList();
            restaurants.value= response;

            console.log(response);
        }

        // #region [scroll]
        let _prev = 0;
        let _moved = 0;
        const isTouched = ref(false);
        const dragTouch = (e) => {
            console.log(e)
            const _current = e.touches && e.touches.length ? e.touches[0].clientY : 0;
            _moved = _current - _prev;
            _prev = _current;
        }

        const endTouch = () => {
            if (_moved >= 0) isTouched.value = true;
            _prev = 0;
        }
        // #endregion [scroll]

        const openDetailLayer = () => {
            console.log("openDetailLayer")
        }

        const closeLayer = () => {
            // document.querySelector(".fb__restaurants__space")
        }

        requestPositions();

        return {
            selectedMenu,
            restaurantListLayer,
            restaurants,
            isTouched,
            dragTouch,
            endTouch,
            openDetailLayer
        }
    }
}
</script>

<style>

</style>