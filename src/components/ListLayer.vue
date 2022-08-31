<template>
    <article 
        class="fb__layer"
        :style="`transform: translateY(${transPos}rem); min-height:${layerMinHeight}rem;`"
        v-touch:drag="controlDrag"
        v-touch:release="controlTouchEnd"
    >
        <h2 class="fb__title--hidden">음식점 리스트 레이어</h2>

        <button
            class="fb__layer__touch"
            v-touch:drag="floatingTopSwipe"
            v-touch:swipe="floatingTopSwipe"
        >
            레이어 상단 버튼
        </button>

        <!-- 리스트 -->
        <ul 
            class="fb__layer__wrapper"
            :style="customStyle"
        >
            <template v-if="restaurants && restaurants.length">
                <template v-for="(list, index) in restaurants" :key="index">
                    <li class="fb__layer__list" @click.prevent="openDetailLayer(list)">
                        <strong class="fb__layer__name">{{list.name}}</strong>
                        
                        <p class="fb__layer__info">
                            <span>걸어서 약 {{list.howFar}}분</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                            <span>별점 {{list.score}}점</span>
                        </p>

                        <p class="fb__layer__desc">{{list.description}}</p>

                        <ul class="fb__layer__menus">
                            <template v-for="(menu, menuIdx) in list.menu" :key="`menu${menuIdx}`">
                                <template v-if="menuIdx < 5">
                                    <li class="menus__name">{{menu.name}}</li>
                                </template>
                            </template>
                        </ul>

                        <template v-if="list.photo && list.photo.length">
                            <figure class="fb__layer__img">
                                <template v-for="(thumb, photoIndex) in list.photo" :key="`photo${photoIndex}`">
                                        <img :src="thumb.src" alt="">
                                </template>
                            </figure>
                        </template>
                    </li>
                </template>
            </template>

            <template v-else>
                <p class="fb__layer__empty">
                    리스트가 없습니다.
                </p>
            </template>
        </ul>
    </article>

    <DetailLayer 
        v-if="isDetailLayerShow"
        v-model:restaurant="detailRestaurant"
        @close-detail-layer="closeDetailLayer"
    ></DetailLayer>
</template>

<script>
import { ref, reactive, computed, onMounted, nextTick, watch} from "vue";
import { useStore } from "vuex";
import { connectDatabase } from "@/composables/connectDatabase";
import DetailLayer from "@/components/DetailLayer.vue";
import restaurantData from '@/data/restaurant.json';

export default {
    name: "ListLayer",
    components: {
        DetailLayer
    },
    setup(props, { emit }) {
        const store = useStore();
        const { emitter, selectedMenu, matchedRests } = store.state;
        const { fetchRestaurantList } = connectDatabase();

        //#region 스크롤 관련
        let isGoingUp = true;
        let scrollPrev = 0;
        let scrollMoved = 0;
        let innerScrollAble = ref(false);

        //레이어 위치
        const transY = ref(500);
        const transPos = computed(() => {
            return transY.value / 16;
        });
       
        const _screen = window.innerHeight;

        //레이어 minHeight설정
        const minHeight = ref(_screen - 500);
        const layerMinHeight = computed(() => {
            return minHeight.value / 16;
        });

        const customStyle = computed(() => {
            const headerEl = document.querySelector(".fb__map__header");
            const touchEl = document.querySelector(".fb__layer__touch");

            //내부 스크롤
            if (innerScrollAble.value) {
                return `overflow: auto; height: ${_screen - headerEl.offsetHeight - touchEl.offsetHeight}px;`;
            }
            //내부 스크롤 금지
            else {
                return `overflow: hidden; height: 100%;`;
            }
        })
        
        //레이어 상단 터치 시
        const floatingTopSwipe = () => {
            if (isGoingUp && innerScrollAble.value) {
                
                //스크롤 리셋
                scrollPrev = 0;
                innerScrollAble.value = false;
                isGoingUp = false;
            }
        }


        //드래그 하면서 플로팅 값 바꿔줌
        const controlDrag = (e) => {
            //내부 스크롤일때는 return
            if (innerScrollAble.value == true) return ;

            const _current = e.touches[0].clientY;

            //이동한 만큼 transformY 이동
            scrollMoved = _current - scrollPrev;
            if (scrollPrev != 0) {
                transY.value = transY.value + scrollMoved;
            }

            //영역 기준
            // const fromHere = _screen / 2;
            // if (_current >= fromHere) isGoingUp = false;
            // else isGoingUp = true;

            //스와이프 기준
            if (_current >= scrollPrev) isGoingUp = false;
            else isGoingUp = true;
            
            scrollPrev = _current;
        }

        //끝나면 위로했는지 아래로 했는지 체크해서 고정시키기
        const controlTouchEnd = (e) => {
            if (isGoingUp) {
                transY.value = 60;
                innerScrollAble.value = true;
                minHeight.value = _screen - 60;
            }
            else {
                transY.value = 500;
                innerScrollAble.value = false;
                minHeight.value = _screen - 500;
            }

            scrollPrev = 0;
        }

        //#endregion 스크롤 관련

        //레스토랑 리스트
        const restaurants = ref([]);
   
        const requestPositions = async () => {
            const response = restaurantData.data;
            // const response = await fetchRestaurantList();
            restaurants.value= response;
        }

        //검색단어 있을 시
        emitter.on('updateMatchedRests', rests => {
            restaurants.value = rests;
        });

        if (matchedRests && matchedRests.length) {
            restaurants.value = matchedRests;
        }
        else {
            requestPositions();
        }

        const openDetailLayer = (restaurant) => {
            emit("open-detail-layer", restaurant)
        }

        return {
            transPos,
            customStyle,
            layerMinHeight,
            controlDrag,
            controlTouchEnd,
            floatingTopSwipe,

            selectedMenu,
            restaurants,
            
            openDetailLayer,
        }
    }
}
</script>

<style>

</style>