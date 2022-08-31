<template>
    <section class="fb__detail">
        <header class="fb__detail__header">
            <h2 class="fb__detail__title">{{ restaurant.value.name }}</h2>
            <button 
                class="fb__detail__close"
                @click="closeDetailLayer"
            >
                닫기
            </button>
        </header>

        <div class="fb__detail__cont">
            <template v-if="restaurant.value.photo && restaurant.value.photo.length">
                <figure class="fb__detail__img">
                    <template v-for="(thumb, photoIndex) in restaurant.value.photo" :key="`photo${photoIndex}`">
                        <img :src="thumb.src" alt="">
                    </template>
                </figure>
            </template>
            
            <div class="fb__detail__info">
                <p class="fb__detail__basic">
                    <span>회사에서 걸어서 약 {{restaurant.value.howFar}}분정도 걸려요.</span>
                    <!-- &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                    <span>별점 {{restaurant.value.score}}점</span> -->
                </p>

                <p class="fb__detail__desc">{{restaurant.value.description}}</p>

                <section class="fb__detail__menus">
                    <h3 class="menus__title">대표메뉴</h3>

                    <ul class="menus__list">
                        <template v-for="(menu, menuIdx) in restaurant.value.menu" :key="`menu${menuIdx}`">
                            <li class="menus__box">
                                
                                <div class="menus__name">
                                    <span 
                                        v-if="menu.isRecommended"
                                        class="menus__recommend"
                                    >
                                        추천
                                    </span>
                                    <span class="menus__name__text">{{menu.name}}</span>
                                </div>
                                <span class="menus__price">{{priceString(menu.price)}}</span>
                            </li>
                        </template>
                    </ul>
                </section>
            </div>
        </div>
    </section>
</template>

<script>
import { computed } from "vue";

export default {
    props: {
        restaurant: {
            type: Object,
            required: true
        }
    },

    setup(props, { emit }) {
        const closeDetailLayer = () => {
            emit("closeDetailLayer")
        }

        const priceString = (price => {
            return price ? Number(price).toLocaleString("ko-kr") : "";
        })

        return {
            closeDetailLayer,
            priceString
        }
     
    }
}
</script>

<style>

</style>