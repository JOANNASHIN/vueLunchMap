<template>
    <article class="fb__restaurants">
        <h2 class="fb__title--hidden">음식점 리스트 레이어</h2>

        <!-- 레이어 -->
        <div 
            class="fb__restaurants__layer"
            :style="`transform: translateY(${transPos}rem); min-height:${layerMinHeight}rem;`"
            v-touch:drag="controlDrag"
            v-touch:release="controlTouchEnd"
        >
            <button
                class="fb__restaurants__touch"
                v-touch:drag="floatingTopSwipe"
                v-touch:swipe="floatingTopSwipe"
            >
                레이어 상단 버튼
            </button>

            <ul 
                class="fb__restaurants__wrapper"
                :style="customStyle"
            >
                <template v-if="restaurants && restaurants.length">
                    <template v-for="(list, index) in restaurants" :key="index">
                        <li class="fb__restaurants__list" @click.prevent="openDetailLayer()">
                            <strong class="fb__restaurants__name">{{list.name}}</strong>
                            
                            <p class="fb__restaurants__desc">
                                <span>{{list.description}}</span>
                                <span>거리 {{list.howFar}}분</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                                <span>별점 {{list.score}}점</span>
                            </p>

                            <ul class="fb__restaurants__menus">
                                <template v-for="(menu, menuIdx) in list.menu" :key="`menu${menuIdx}`">
                                    <li class="menus__name">{{menu.name}}</li>
                                </template>
                            </ul>

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
                    <p class="fb__restaurants__empty">
                        리스트가 없습니다.
                    </p>
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
            const touchEl = document.querySelector(".fb__restaurants__touch");

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
            const response = await fetchRestaurantList();
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

        const openDetailLayer = () => {
            console.log("openDetailLayer")
        }

        const closeDetailLayer = () => {
            // document.querySelector(".fb__restaurants__space")
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
            closeDetailLayer
        }
    }
}
</script>

<style>

</style>