<template>
    <section class="fb__content fb__main">
        <h2 class="fb__title--hidden">점심추천 메인페이지</h2>

        <template v-if="false === fetches.getMenuData">
            <span class="fb__loading">
                loading...
            </span>
        </template>

        <template v-else-if="true === fetches.getMenuData">
            <main class="fb__main__wrapper">
                <div class="fb__main__recommend">
                    <span class="recommend__text">오늘 점심으로</span>

                    <div ref="rollingSlider" class="recommend__rolling swiper-container">
                            <span v-show="false == fetches.menuRolling" class="recommend__menu recommend__menu--before">
                                어떤거
                            </span>
                            <ul ref="rollingWrapper" class="recommend__wrapper swiper-wrapper">
                                <template v-for="(menu, index) in menuList" :key="index">
                                    <li class="recommend__list swiper-slide">
                                        <em class="recommend__menu">{{menu.name}}</em>
                                    </li>
                                </template>
                            </ul>
                    </div>

                    <span class="recommend__text" v-text="!fetches.menuRolling ? '먹을까요?' : '어떠세요?'"></span>
                </div>

                <nav class="fb__main__nav">
                    <template v-if="false === fetches.menuSelected">
                        <button class="nav__button" @click="menuRolling($event)">고르기</button>
                    </template>
                    
                    <template v-else>
                        <button class="nav__button" @click="menuRolling($event)">다시 고르기</button>
                        <router-link to="/map" class="nav__button">지도에서 보기</router-link>
                        <!-- <button class="nav__walk">걸어서</button>
                        <button class="nav__delivery">배달</button> -->
                    </template>
                </nav>
            </main>
        </template>

        <template v-else-if="'error' === fetches.getMenuData">
            오류가 발생하였습니다. 잠시 후 다시 시도해주세요.
        </template>
    
    </section>
</template>

<script>
import { ref, reactive, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import Swiper from "swiper";

export default {
    name: "Home",
    
    setup() {
        const store = useStore();
        const menuCollection = store.state.menuCollection;
        const menuList = ref([]);
        const fetches = reactive({
            getMenuData: false,
            menuSelected: false,
            menuRolling: false,
        })
        const selectedMenu = reactive({});

        let rollingSlide = null;

        const getMenuData = async () => {
            try {
                const response = await requestMenuList();
                if (response) menuList.value = response;

                fetches.getMenuData = true;

                await nextTick()
                makeRollingSlider();
            }
            catch (err) {
                console.error(err);

                fetches.getMenuData = "error";
            }
        };

        const requestMenuList = () => {
            return new Promise((resolve, reject) => {
                try {
                    menuCollection.get().then((result) => {
                        const customData = [];

                        result.forEach(list => {
                            customData.push(Object.assign(list.data(), {
                                id: list.id
                            }));
                        })

                        resolve(customData);
                    })
                }

                catch (error) {
                    reject(error);
                }
            })
        };

        const makeRollingSlider = () => {
            // @TODO: STORE에 있는 값 저장해서 다시 뿌리기
            // const randomCount = store.state.selectedMenu ? store.state.selectedMenu.randomCount : 0;
            rollingSlide = new Swiper(".recommend__rolling", {
                loop: true,
                slidesPerView: 1,
                // initialSlide: randomCount,
                direction: "vertical",
                allowTouchMove: false,
            })
        }

        const menuRolling = () => {
            
            fetches.menuRolling = true;

            const menuTotal = menuList.value.length;
            const randomCount = Math.floor(Math.random() * menuTotal);

            if (rollingSlide) rollingSlide.slideToLoop(randomCount, 800);
            else makeRollingSlider();

            fetches.menuSelected = true;

            setSelectedMenu(randomCount);
        }

        const setSelectedMenu = (randomCount) => {
            selectedMenu.value = menuList.value[randomCount];

            Object.assign(selectedMenu.value, {
                randomCount
            })

            store.dispatch("saveSelectedMenu", selectedMenu.value)
        }

        onMounted(() => {

        })

        
        return {
            fetches,
            menuList,
            menuRolling
        }
    }
}
</script>

<style>

</style>