const addData = [
 {
        "name": "에머이 양재역점",
        "location": "37.48542338120925, 127.03401751211753",
        "address": "서울특별시 강남대로 242",
        "isWish": true,
        "score": 5,
        "howFar": "12",
        "tel": "",
        "photo": [
            {
                "id": 0,
                "src": "https://lh5.googleusercontent.com/p/AF1QipODgh-bDN62vgXizFYkF6_oO3lz7EtTFX56qXPp=w408-h408-k-no"
            }
        ],
        "openingHours": "",
        "description": "",
        "menu": [
            {
                "name": "쌀국수"
            },
            {
                "name": "분짜"
            },
            {
                "name": "베트남식 볶음밥"
            },
        ],
        "menuImage": []
    }

]

const addMenu = async(v) => {
     await store.state.restCollection.add(v)
        .then(result => {
            console.log(result);
        })
        .catch(err => {
            console.error(err,"err");
        });
};

const addToDB = () => {
    addData.forEach(v => {
        addMenu(v);
    })
};


addToDB();