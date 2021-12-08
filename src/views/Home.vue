<template>
    <section class="fb__content fb__main">
        <h2 class="fb__title--hidden">점심추천 메인페이지</h2>

        <template v-if="false === fetches.getMenuData">
            loading...
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

                    <span class="recommend__text">먹을까요?</span>
                </div>

                <nav class="fb__main__nav">
                    <template v-if="false === fetches.menuSelected">
                        <button class="nav__button" @click="menuRolling($event)">고르기</button>
                    </template>
                    <template v-else>
                        <button class="nav__button" @click="menuRolling($event)">다시 고르기</button>
                        <a class="nav__button" href="/lunchMap">지도에서 보기</a>
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
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import Swiper from "swiper";

export default {
    name: "Home",
    setup() {
        const store = useStore();

        const fetches = reactive({
            getMenuData: false,
            menuSelected: false,
            menuRolling: false,
        })

        const menuList = ref([]);

        const menuCollection = store.state.menuCollection;

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

        const getMenuData = async () => {
            try {
                const response = await requestMenuList();
                if (response) menuList.value = response;

                fetches.getMenuData = true;
            }
            catch (err) {
                console.error(err);

                fetches.getMenuData = "error";
            }
        };

        let rollingSlide = null;

        const menuRolling = () => {
            fetches.menuRolling = true;
            const menuTotal = menuList.value.length;
            const randomCount = Math.floor(Math.random() * menuTotal);
            console.log(menuTotal, randomCount)

            if (rollingSlide) {
                rollingSlide.slideToLoop(randomCount, 800);
            }
            else {
                 rollingSlide = new Swiper(".recommend__rolling", {
                    loop: true,
                    slidesPerView: 1,
                    direction: "vertical",
                    allowTouchMove: false,
                })
            }

            fetches.menuSelected = true;

        }

        onMounted(() => {

        })

        getMenuData();

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