<template>
    <template v-if="isMounted">
        <article ref="restaurantListLayer" class="fb__restaurants" v-touch:press="startTouch" v-touch:drag="dragTouch" v-touch:release="endTouch">
            <h2 class="fb__title--hidden">레스토랑 리스트</h2>
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
        </article>
    </template>
</template>

<script>
import { ref, reactive, onMounted, nextTick} from "vue";
import { useStore } from "vuex";
import { connectDatabase } from "../composables/connectDatabase";

export default {
    name: "RestaurantList",
    props: {
      
    },
    setup() {
        const store = useStore();
        const selectedMenu = store.state.selectedMenu;

        const { fetchRestaurantList } = connectDatabase();
        const restaurantListLayer = ref(null);
        const restaurants = ref([]);
   
        const requestPositions = async () => {
            const response = await fetchRestaurantList();
            console.log(response);
            restaurants.value= response;
        }

       

        const startTouch = (e) => {
            // _start = e.touches[0].clientY;
        }

        let _transformYNumber = 0;
        let _prev = 0;
        let _moved = 0;

        const dragTouch = (e) => {
            document.querySelector(".fb__restaurants").classList.remove("full");
            document.querySelector(".fb__restaurants").classList.remove("down");

            const _current = e.touches && e.touches.length ? e.touches[0].clientY : 0;
            const _transformY = window.getComputedStyle(document.querySelector(".fb__restaurants")).transform;

            _transformYNumber = Number(_transformY.split(",") ? _transformY.split(",")[5].replace(/(px)?\)?/ig, ""): 0);
            _moved = (_current - _prev) ;

            if ( _prev != 0 ) {
                document.querySelector(".fb__restaurants").style.transform = `translate(0, ${_transformYNumber + _moved}px)`;
            }

            _prev = _current;
        }

        const endTouch = (e) => {
            if (_moved < 0) {
                document.querySelector(".fb__restaurants").classList.remove("down");
                document.querySelector(".fb__restaurants").classList.add("full");
            }
            else {
                document.querySelector(".fb__restaurants").classList.remove("full")
                document.querySelector(".fb__restaurants").classList.add("down");
            }
            _prev = 0;
            // console.log("endTouch", e.changedTouches[0].clientY)
        }

        const openDetailLayer = () => {
            console.log("openDetailLayer")
        }

        const isMounted = ref(false);

        onMounted(async () => {
            isMounted.value = true;
            await nextTick()
            console.log(document.querySelector(".fb__restaurants").style.height )

        })

        requestPositions();

        return {
            isMounted,
            selectedMenu,
            restaurantListLayer,
            restaurants,
            startTouch,
            dragTouch,
            endTouch,
            openDetailLayer
        }
    }
}
</script>

<style>

</style>