<template>
    <article class="fb__restaurants js__list__scroll">
        <h2 class="fb__title--hidden">레스토랑 리스트 레이어</h2>

        <!-- 레이어 -->
        <div 
            class="fb__restaurants__layer" 
            :style="`transform: translateY(${transY}rem)`"
            v-touch:drag="controlDrag"
            v-touch:release="controlTouchEnd"
        >
            <button
                class="fb__restaurants__touch"
                v-touch:swipe="controlSwipe"
                >레이어 상단 버튼</button>

<!-- @scroll.prevent="insideScrolling($event)" -->
            <ul class="fb__restaurants__wrapper"
                @scroll.prevent="insideScrolling"  
                v-touch:release="insideScrollingEnd">
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
import { ref, reactive, computed, onMounted, nextTick, watch} from "vue";
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



        // 여기서부터 테스트
        const _screen = window.innerHeight;
        const _default = _screen - 150;
        const _min = _screen - 40; //최소;
        const _max = 60; //header 뺀 최대

        console.log(_screen, _default, _min, _max)

        //위치 정하기
        const layerPositionType = ref(_default);

        const transY = computed(() => {
            console.log("test")
            return layerPositionType.value / 16;
        });
        

        let flag = false;
        const insideScrolling = () => {
            console.log("안에 스크롤중")

            flag = true;
        }

         const insideScrollingEnd = () => {
            console.log("안에 끝")
            setTimeout(() => {
                flag = false;
            }, 1)
        }

        ///////

        //드래그일때
        let isGoingUp = true;
        let scrollPrev = 0;
        const controlDrag = (e) => {
            const _current = e.touches[0].clientY;
            if (_current >= scrollPrev) {
                console.log("내려가는중")
                //내려가는중
                isGoingUp = false;
            }
            else {
                console.log("올라가는중")
                isGoingUp = true;
            }

            scrollPrev = _current;

        }

        const controlTouchEnd = (e) => {
            if (flag) return ;
            //밖에 스크롤 없애기
            const scrollEl = document.querySelector(".js__list__scroll");
            const innerScrollEl = document.querySelector(".fb__restaurants__wrapper");

            if (isGoingUp) {
                scrollEl.scrollTop = 0;
                scrollEl.style.overflow = "hidden";
                layerPositionType.value = _max;
                innerScrollEl.style.overflow = "auto";
                innerScrollEl.style.height = `${(_screen - 100) / 16}rem`;

            }
            else {
                scrollEl.scrollTop = 0;
                scrollEl.style.overflow = "auto";
                layerPositionType.value = _min;
                innerScrollEl.style.overflow = "hidden";
                innerScrollEl.style.height = `${(_screen - 100) / 16}rem`;
            }

        }





        // 여기까지 테스트 끝

        
        
        
        
        
        //목록 보기 (레이어 열기)
        emitter.on('show-list-layer', () => {
            const listLayerEl = document.querySelector(".js__list__scroll");
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

        const openDetailLayer = () => {
            console.log("openDetailLayer")
        }

        const closeDetailLayer = () => {
            // document.querySelector(".fb__restaurants__space")
        }

        requestPositions();

        return {
            transY,
            layerPositionType,


insideScrolling,
insideScrollingEnd,
controlDrag,
controlTouchEnd,





            selectedMenu,
            restaurants,
            
            openDetailLayer,
            closeDetailLayer
        }
    }
}
</script>

<style>

</style>