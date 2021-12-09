<template>
    <section class="fb__map">
        <h2 class="fb__title--hidden">지도 페이지</h2>
        <SearchComponent :selected-menu="selectedMenu" @search:restaurant="searchRestaurant($event)"></SearchComponent>
        <RestaurantList :selected-menu="selectedMenu"></RestaurantList>
        <div ref="lunchMap" class="fb__map__container"></div>
    </section>
</template>

<script>
import { ref, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import SearchComponent from "../components/SearchComponent";
import RestaurantList from "../components/RestaurantList";
// import axios from "axios";

export default {
    name: "Map",

    components: {
        SearchComponent,
        RestaurantList
    },
    
    setup() {
        const store = useStore();
        const selectedMenu = store.state.selectedMenu;

        if (selectedMenu) {
            console.log(selectedMenu, "선택한 메뉴")
        }

        const lunchMap = ref(null);
        const positionList = [
                {
                    name: '모범 떡볶이', 
                    location: "37.48512597601747, 127.03206392495402"
                },
                {
                    name: '경성불백', 
                    location: "37.479162161747034, 127.04053519812724"
                },
                {
                    name: '춘천 우리 닭갈비', 
                    location: "37.48112248605404, 127.04116125789652"
                },
                {
                    name: '노브랜드 버거',
                    location: "37.48534890822267, 127.03440779812728"
                }
            ]

        const fetchRestaurantList = () => {
            // axios
        }

        const drawMap = (positions) => {
            const defaultData = {
                mapContainer: lunchMap.value,
                markerSrc: "//t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                markerSize: "24, 35"
            }

console.log(this)
            const { mapContainer, markerSrc, markerSize} = defaultData;
            const centeredPosition = positions ? positions[0].location.split(",") : [37.481167099868166, 127.038415684882]
              
            const markerImage = new kakao.maps.MarkerImage(markerSrc, new kakao.maps.Size(markerSize)); 
            const map = new kakao.maps.Map(mapContainer, {
                center: new kakao.maps.LatLng(centeredPosition[0], centeredPosition[1]),
                level: 4
            })

            const makeOverListener = (map, marker) => {
                return () => {
                    console.log("클릭", map, marker)
                };
            }

            positions.forEach(restaurant => {
                const content = `<span class="fb__restaurant__title">${restaurant.name}</span>`
                const location = restaurant.location.split(",");
                const marker = new kakao.maps.Marker({
                    map,
                    position: new kakao.maps.LatLng(location[0], location[1]),
                    title : restaurant.name,
                    image : markerImage,
                });

                new kakao.maps.CustomOverlay({
                    map,
                    content,
                    position: new kakao.maps.LatLng(location[0], location[1]),
                    xAnchor: 0.5,
                    yAnchor: 0
                });

                kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker));
                marker.setMap(map)
            })
        }

        const searchRestaurant = async(e) => {
            const targets = positionList.filter(v => v.name.indexOf(e) != -1);
            console.log(targets)
            if (targets) drawMap(targets)
        }

        onMounted(() => {
            if (window.kakao && window.kakao.maps) {
                drawMap(positionList);
            }   
            else {
                const script = document.createElement('script')
                script.onload = () => kakao.maps.load(drawMap);
                script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=b5d70053a01fa96cdc3ff5bf1b2dca51'
                document.head.appendChild(script)
            }
        })

        fetchRestaurantList();

        return {
            lunchMap,
            selectedMenu,
            searchRestaurant
        }
    }
}
</script>