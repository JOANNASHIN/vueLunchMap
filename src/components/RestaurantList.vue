<template>
    <article class="fb__restaurants js__listLayer" :class="goingTop ? 'top' : 'down'">
        <h2 class="fb__title--hidden">레스토랑 리스트 레이어</h2>

        <div class="fb__restaurants__layer" v-touch:swipe="touchHandler">
            <button class="fb__restaurants__touch" v-touch:swipe="touchHandler">레이어 확대버튼</button>

            <ul class="fb__restaurants__wrapper">

                <template v-if="restaurants && restaurants.length">
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
                </template>

                <template v-else>
                    <p class="fb__restaurants__empty">리스트가 없습니다.</p>
                </template>
            </ul>
        </div>
    </article>
</template>

<script>
import { ref, reactive, onMounted, nextTick, watch} from "vue";
import { useStore } from "vuex";
import { connectDatabase } from "../composables/connectDatabase";

export default {
    name: "RestaurantList",
    props: {
        
    },
    setup(props, { emit }) {
        const store = useStore();
        const { emitter, selectedMenu } = store.state;
        const { fetchRestaurantList } = connectDatabase();

        //목록 보기 (레이어 열기)
        emitter.on('show-list-layer', () => {
            const listLayerEl = document.querySelector(".js__listLayer");
            const _screenHeight = window.innerHeight;
            const _top = listLayerEl.scrollTop;

            let _pos = 0;

            const layerUp = setInterval(() => {
                if (_top + _pos > _screenHeight / 2) clearInterval(layerUp);

                _pos += 5;
                listLayerEl.scrollTo(0, _pos);
            }, 1)

        })

        //레스토랑 리스트
        const restaurants = ref([]);
   
        const requestPositions = async () => {
            const response = await fetchRestaurantList();
            restaurants.value= response;

        }

        // #region [scroll]
        let _prev = 0;
        let _moved = 0;
        const isTouched = ref(false);
        const dragTouch = (e) => {
            const _current = e.touches && e.touches.length ? e.touches[0].clientY : 0;
            _moved = _current - _prev;
            _prev = _current;
        }

        const endTouch = () => {
            if (_moved >= 0) isTouched.value = true;
            _prev = 0;
        }

        const visibleLayer = ref(false);

        const goingTop = ref(true);
        const touchHandler = (direction) => {
            visibleLayer.value = false;

            if (direction == "top") {
                goingTop.value = true;
                document.querySelector(".fb__restaurants__cont").classList.remove("hide");
            }
            else {
                goingTop.value = false;
                document.querySelector(".fb__restaurants__cont").classList.add("hide");
            }
        }

        const showLayer = () => {
            document.querySelector(".fb__restaurants").scrollTo(0, 500);
            // visibleLayer.value = true;
        }

        watch(goingTop, () => {
            emit("test",goingTop.value)
        })
        
        // #endregion [scroll]




        const openDetailLayer = () => {
            console.log("openDetailLayer")
        }

        const closeDetailLayer = () => {
            // document.querySelector(".fb__restaurants__space")
        }

        

        const transformHeight = ref(0);
        onMounted(() => {
            const _screen = window.innerHeight;
            const _minHeight = "21rem";
            // transformHeight.value = _screen - _minHeight;
        })

        requestPositions();

        return {
            transformHeight,
            selectedMenu,
            
            restaurants,
            
            isTouched,
            dragTouch,
            endTouch,
            
            goingTop,
            touchHandler,

            visibleLayer,
            showLayer,

            openDetailLayer,
            closeDetailLayer
        }
    }
}
</script>

<style>

</style>