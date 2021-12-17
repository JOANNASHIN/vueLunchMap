<template>
    <section class="fb__map">
        <h2 class="fb__title--hidden">지도 페이지</h2>
        <MapHeader @search:restaurant="searchRestaurant($event)"></MapHeader>
        <RestaurantList @direction-to="directionTo($event)"></RestaurantList>

        <figure class="fb__map__area" :class="isGoingBottom ? 'bottom' : ''">
            <div ref="lunchMap" class="fb__map__container">지도</div>
        </figure>

    </section>
</template>

<script>
import { ref, onMounted, watch, watchEffect } from "vue";
import { useStore } from "vuex";
import { connectDatabase } from "../composables/connectDatabase";
import MapHeader from "../components/MapHeader";
import RestaurantList from "../components/RestaurantList";

export default {
    name: "Map",

    components: {
        MapHeader,
        RestaurantList
    },
    
    setup() {
        //연습장
        const store = useStore();
        const { emitter } = store.state;

        // const showListLayer = () => {
        //     emitter.emit('show-list-layer');
        // }
        
        const isGoingBottom = ref(false);

        const directionTo = (direction) => {
            if (direction == "down") isGoingBottom.value = true;
            else isGoingBottom.value = false;
        }


        // #region [search]
        const searchWord = ref("");

        const searchRestaurant = (e) => {
            searchWord.value = e;
        }

        watch(searchWord, () => {
            if (positionList && positionList.length) drawMarkers();
        })
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


        //지도그리기
        const drawMap = () => {
            const mapContainer = lunchMap.value;
            const { markerSrc, markerSize, center} = defaultMapData;
            const centeredPosition = center.split(",");
            markerImage = new kakao.maps.MarkerImage(markerSrc, new kakao.maps.Size(markerSize)); 
            map = new kakao.maps.Map(mapContainer, {
                center: new kakao.maps.LatLng(centeredPosition[0], centeredPosition[1]),
                level: 5
            })

            drawMarkers();
        }

        
        const removeMarkers = () => {
            if (markers && markers.length) {
                markers.forEach(mk => {
                    mk.setMap(null);    
                })
            }
            
            if (customOverlays && customOverlays.length) {
                customOverlays.forEach(overlay => {
                    overlay.setMap(null);
                })
            }
        }
        
        const drawMarkers = () => {
            let positions = positionList;

            //검색단어 있을 경우
            if (searchWord.value != "") {
                //마커 리셋
                removeMarkers();
                 
                //조건에 부합하는 마커 분류
                positions = positionList.filter(v => {
                    if (v.name.indexOf(searchWord.value) != -1) return v; //음식점명에서 찾기
                    else return v.menu.some(menu => menu.name.indexOf(searchWord.value) != -1) //메뉴명에서 찾기
                });

                //맞는 레스토랑 업데이트
                emitter.emit('updateMatchedRests', positions);
            }

            // store.dispatch("saveMatchedRests", positions);

            if (positions && positions.length) {
                positions.forEach((restaurant, idx) => {
                    const content = `<span class="fb__map__marker">${restaurant.name}</span>`
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
                        xAnchor: 0.35,
                        yAnchor: -3.6
                    });
    
                    //센터 이동
                    if (idx == 0) map.setCenter(new kakao.maps.LatLng(location[0], location[1]));

                    //마커 그리기
                    marker.setMap(map)
                    kakao.maps.event.addListener(marker, 'click', markerClick(restaurant));

                    //마커 data 세팅
                    markers.push(marker);
                    customOverlays.push(customOverlay);
                })
            }
        }
        // #endregion
       
        const markerClick = (restaurant) => {
            return () => {
                console.log("클릭", restaurant)
            };
        }

        onMounted(async () => {
            requestPositions();
        })

        return {
            lunchMap,
            searchRestaurant,
            // showListLayer,
            directionTo,
            isGoingBottom
        }
    }
}
</script>