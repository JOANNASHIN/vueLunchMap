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
// import axios from "axios";

export default {
    name: "Map",

    components: {
        SearchComponent
    },
    
    setup() {
        const lunchMap = ref(null);

        const fetchRestaurantList = () => {
            // axios
        }

        const initMap = () => {
            const defaultData = {
                mapContainer: lunchMap.value,
                centerPosition: new kakao.maps.LatLng(37.481167099868166, 127.038415684882),
                markerSrc: "//t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png",
                markerSize: new kakao.maps.Size(24, 35),
                positions:  [
                    {
                        title: '모범 떡볶이', 
                        latlng: new kakao.maps.LatLng(37.48512597601747, 127.03206392495402)
                    },
                    {
                        title: '경성불백', 
                        latlng: new kakao.maps.LatLng(37.479162161747034, 127.04053519812724)
                    },
                    {
                        title: '춘천 우리 닭갈비', 
                        latlng: new kakao.maps.LatLng(37.48112248605404, 127.04116125789652)
                    },
                    {
                        title: '노브랜드 버거',
                        latlng: new kakao.maps.LatLng(37.48534890822267, 127.03440779812728)
                    }
                ]
            }

            const { mapContainer, centerPosition, markerSrc, markerSize, positions} = defaultData;
              
            const markerImage = new kakao.maps.MarkerImage(markerSrc, markerSize); 
            const map = new kakao.maps.Map(mapContainer, {
                center: centerPosition,
                level: 4
            })

            const makeOverListener = (map, marker) => {
                return () => {
                    console.log("클릭", map, marker)
                };
            }

            positions.forEach(location => {
                const content = `<span class="fb__restaurant__title">${location.title}</span>`
                const marker = new kakao.maps.Marker({
                    map,
                    position: location.latlng,
                    title : location.title,
                    image : markerImage,
                });

                new kakao.maps.CustomOverlay({
                    map,
                    content,
                    position: location.latlng,
                    xAnchor: 0.5,
                    yAnchor: 0
                });

                kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker));
                marker.setMap(map)
            })
        }

        onMounted(() => {
            if (window.kakao && window.kakao.maps) {
                initMap();
            }   
            else {
                const script = document.createElement('script')
                script.onload = () => kakao.maps.load(initMap);
                script.src = '//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=b5d70053a01fa96cdc3ff5bf1b2dca51'
                document.head.appendChild(script)
            }
        })

        fetchRestaurantList();

        return {
            lunchMap,
        }
    }
}
</script>