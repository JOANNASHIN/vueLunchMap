<template>
    <section class="fb__map">
        <h2 class="fb__title--hidden">지도 페이지</h2>
        <SearchComponent></SearchComponent>
        <div ref="lunchMap" class="fb__map__container"></div>
    </section>
</template>

<script>
import { ref, onMounted } from "vue";
import SearchComponent from "../components/SearchComponent";

export default {
    components: {
        SearchComponent
    },
    setup() {
        const lunchMap = ref(null);

        const initMap = () => {
            const container = lunchMap.value;
            const markerPosition = new kakao.maps.LatLng(35.19656853772262, 129.0807270648317);
            
            const map = new kakao.maps.Map(container, {
                center: markerPosition,
                level: 3
            })

            const marker = new kakao.maps.Marker({
                position: markerPosition
            });

            marker.setMap(map)
        }

        onMounted(() => {
            if (window.kakao && window.kakao.maps) {
                initMap();
            }   
            else {
                const script = document.createElement('script')
                script.onload = () => kakao.maps.load(initMap);
                script.src = 'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=b5d70053a01fa96cdc3ff5bf1b2dca51'
                document.head.appendChild(script)
            }
        })

        return {
            lunchMap
        }
        
    }
}
</script>