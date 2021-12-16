<template>
    <div class="wrapper">
        <header>헤더</header>
        <div class="bg">
            배경
        </div>

        <article
            class="floating" 
            :style="`transform: translateY(${transY}rem)`"
            v-touch:drag="controlDrag"
            v-touch:release="controlTouchEnd"
        >

            <button 
                class="floatingTop"
                v-touch:tap="floatingTopSwipe"
                v-touch:swipe="floatingTopSwipe"
            >
                상단 버튼
            </button>

            <div class="contscroll">
                <p>플로팅1</p>
                <p>플로팅</p>
                <p>플로팅</p>
                <p>플로팅</p>
                <p>플로팅</p>
                <p>플로팅</p>
                <p>플로팅</p>
                <p>플로팅</p>
                <p>플로팅akwlakr</p>
            </div>
        </article>
    </div>

</template>

<script>
import { ref, reactive, computed, onMounted, nextTick, watch} from "vue";

export default {
    setup() {
        const transPos = ref(500);
        const transY = computed(() => {
            return transPos.value / 16;
        });

        let isGoingUp = true;
        let scrollPrev = 0;
        let scrollMoved = 0;
        let innerScrollAble = ref(false);


        //만약 다시 터치하면 
        const floatingTopSwipe = (direction) => {
            const contscrollEl = document.querySelector(".contscroll");
            contscrollEl.style.background="blue";

            if (isGoingUp && innerScrollAble.value) {
                scrollPrev = 0;

                contscrollEl.style.background="white";
                contscrollEl.style.height = "100%";
                contscrollEl.style.overflow="hidden";
                contscrollEl.style.transition="all 3s linear";

                //디폴트 위치로 변경
                transPos.value = 500;

                innerScrollAble.value = false;

                //스크롤 값 여기
                isGoingUp = false;
            }
        }

        //드래그 하면서 플로팅 값 바꿔줌
        const controlDrag = (e) => {
            if (innerScrollAble.value == true) return ;

            const _current = e.touches[0].clientY;
            scrollMoved = _current - scrollPrev;

            if (scrollPrev != 0) transPos.value = transPos.value + scrollMoved;

            //영역 기준
            const fromHere = window.innerHeight / 2;

            if (_current >= fromHere) isGoingUp = false;
            else isGoingUp = true;

            //스와이프 기준
            // if (_current >= scrollPrev) isGoingUp = false;
            // else isGoingUp = true;
            
            scrollPrev = _current;
        }

        //끝나면 위로했는지 아래로 했는지 체크해서 고정시키기
        const controlTouchEnd = (e) => {
            const contscrollEl = document.querySelector(".contscroll");
            const headerEl = document.querySelector("header");

            if (isGoingUp) {
                transPos.value = 60;

                // setTimeout(() => {
                    innerScrollAble.value = true; //안에 터치 가능으로 변경
                    contscrollEl.style.overflow="auto";
                    contscrollEl.style.height = `${window.innerHeight - headerEl.offsetHeight- headerEl.offsetHeight /2}px`;
                // },1)
            }
            else {
                transPos.value = 500;
                contscrollEl.style.overflow="hidden";
            }

            scrollPrev = 0;
        }


        return {
            transPos,
            transY,
            innerScrollAble,
            controlDrag,
            controlTouchEnd,
            floatingTopSwipe
        }
    }
}
</script>

<style scoped lang="scss">
    html, body {
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    header {
        height: rem(60px);
    }

    .bg {
        overflow: hidden;
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: red;
    }

    .floating {
        position: fixed;
        top: 0;
        width: 100%;
        transform: translateY(rem(500px));
        transition: all 0.25s linear;
        background: gray;

        &.transition {
            transition: all 0.5s linear;
        }

        &Top {
            width: 100%;
            height: rem(50px);
            background: yellow;
        }

        .contscroll {
            overflow: hidden;
            height: 100%;

            &.scroll {
                // overflow: auto;
                // height:
            }

            &.default {
                overflow: hidden;
                height: 100%;
            }

        }
        p {
            display: block;
            height: rem(100px);
            border: 1px solid red;
        }
    }
</style>