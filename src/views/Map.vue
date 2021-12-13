<template>
    <section class="fb__map">
        <h2 class="fb__title--hidden">지도 페이지</h2>
        <button style="position: fixed; top: 0;
        left: 0; z-index:999;" @click="removeMarkers()"> 버튼</button>
        <SearchComponent @search:restaurant="searchRestaurant($event)"></SearchComponent>
        <RestaurantList></RestaurantList>
        <div ref="lunchMap" class="fb__map__container"></div>
    </section>
</template>

<script>
import { ref, onMounted, watch, watchEffect } from "vue";
import { connectDatabase } from "../composables/connectDatabase";
import SearchComponent from "../components/SearchComponent";
import RestaurantList from "../components/RestaurantList";

export default {
    name: "Map",

    components: {
        SearchComponent,
        RestaurantList
    },
    
    setup() {
        // #region [search]
        const searchWord = ref("");

        const searchRestaurant = (e) => {
            searchWord.value = e;
        }
        // #endregion


        // #region [get restaurantList from db]
        const { fetchRestaurantList } = connectDatabase();
        let positionList = [];
   
        const requestPositions = async () => {
            const response = await fetchRestaurantList();
            positionList = response;

            setKakaoMap();
        }
        // #endregion


        // #region [setKakaoMap]
        const setKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                drawMap();
            }   
            else {
                const script = document.createElement('script')
                script.onload = () => kakao.maps.load(drawMap);
                script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=b5d70053a01fa96cdc3ff5bf1b2dca51'
                document.head.appendChild(script)
            }
        }
        // #endregion


        // #region [draw Map]
        const lunchMap = ref(null);
        const defaultMapData = {
            markerSrc: "//t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
            markerSize: "24, 35",
            center: "37.481167099868166, 127.038415684882"
        }

        const markers = [];
        const customOverlays = [];
        let markerImage = null;
        let map = null;

        const drawMap = () => {
            const mapContainer = lunchMap.value;
            const { markerSrc, markerSize, center} = defaultMapData;
            const centeredPosition = center.split(",");
            markerImage = new kakao.maps.MarkerImage(markerSrc, new kakao.maps.Size(markerSize)); 
            map = new kakao.maps.Map(mapContainer, {
                center: new kakao.maps.LatLng(centeredPosition[0], centeredPosition[1]),
                level: 4
            })

            drawMarkers();
        }

        

        //@TODO: visible로 처리해보기
        const removeMarkers = () => {
            if (markers && markers.length) {
                markers.forEach(mk => {
                    mk.setMap(null);    
                })
            }
            
            if (customOverlays && customOverlays.length) {
                customOverlays.forEach(overlay => {
                    overlay.setVisible(false);
                })
            }
        }
        
        const drawMarkers = () => {
            let positions = positionList;

            //검색단어 있을 경우
            if (searchWord.value != "") {
                removeMarkers();
                positions = positionList.filter(v => v.name.indexOf(searchWord.value) != -1);
            }

            if (positions && positions.length) {
                positions.forEach(restaurant => {
                    const content = `<span class="fb__restaurant__title">${restaurant.name}</span>`
                    const location = restaurant.location.split(",");
                    const marker = new kakao.maps.Marker({
                        map,
                        position: new kakao.maps.LatLng(location[0], location[1]),
                        title : restaurant.name,
                        image : markerImage,
                    });
    
                    const customOverlay = new kakao.maps.CustomOverlay({
                        map,
                        content,
                        position: new kakao.maps.LatLng(location[0], location[1]),
                        xAnchor: 0.5,
                        yAnchor: -1.4
                    });
    
                    //
                    marker.setMap(map)

                    //
                    markers.push(marker);
                    customOverlays.push(customOverlay);
                })
            }
        }
        // #endregion

        watch(searchWord, () => {
            if (positionList && positionList.length) drawMarkers();
        })
      
        onMounted(async () => {
            requestPositions();
        })

        return {
            lunchMap,
            searchRestaurant,
            removeMarkers
        }
    }
}
</script>