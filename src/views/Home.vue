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
                        <template v-if="false == fetches.menuRolling">
                            <span class="recommend__menu recommend__menu--before">
                                어떤거
                            </span>
                        </template>
                        <template v-else>
                            <ul ref="rollingWrapper" class="recommend__wrapper swiper-wrapper">
                                <template v-if="menuList && menuList.length">
                                    <template v-for="(menu, index) in menuList" :key="index">
                                        <li class="recommend__list swiper-slide">
                                            <em class="recommend__menu">{{menu.name}}</em>
                                        </li>
                                    </template>
                                </template>
                            </ul>
                        </template>
                    </div>

                    <span class="recommend__text">먹을까요?</span>
                </div>

                <nav class="fb__main__nav">
                    <button class="nav__delivery" @click="menuRolling($event)">고르기</button>
                </nav>
            </main>
        </template>

        <template v-else-if="'error' === fetches.getMenuData">
            오류가 발생하였습니다. 잠시 후 다시 시도해주세요.
        </template>
    
    </section>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";

export default {
    name: "Home",
    setup() {
        const store = useStore();

        const fetches = reactive({
            getMenuData: false,
            menuSelected: false,
            menuRolling: false,
        })

        let menuList = reactive({});

        const menuCollection = store.state.menuCollection;

        fetches.getMenuData = true;


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

                if (response && response.length) {
                    menuList = response;
                }

// await nextTick()
//       console.log('Now DOM is updated')
//     }

                fetches.getMenuData = true;
            }
            catch (err) {
                console.error(err);

                fetches.getMenuData = "error";
            }
        };

        const menuRolling = () => {
            fetches.menuRolling = true;
        }


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