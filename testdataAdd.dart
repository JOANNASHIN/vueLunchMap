

    const addData = [
    {
        "name": "떡볶이",
        "isDiet": "N",
        "isSpicy": "Y",
        "type": "schoolFood",
        "carbohydrate": "ricecake",
        "typeOfCooking": "stirFry"
    },
    {
        "name": "샌드위치",
        "isDiet": "Y",
        "isSpicy": "N",
        "type": "bread",
        "carbohydrate": "bread",
        "typeOfCooking": "fresh"
    },
    {
        "name": "닭갈비",
        "isDiet": "N",
        "isSpicy": "Y",
        "type": "koreanFood",
        "carbohydrate": "rice",
        "typeOfCooking": "stirFry"
    },
    {
        "name": "갈치구이",
        "isDiet": "Y",
        "isSpicy": "N",
        "type": "koreanFood",
        "carbohydrate": "rice",
        "typeOfCooking": "roast"
    },
    {
        "name": "라멘",
        "isDiet": "N",
        "isSpicy": "N",
        "type": "japaneseFood",
        "carbohydrate": "noodle",
        "typeOfCooking": "soup"
    },
    {
        "name": "콩비지찌개",
        "isDiet": "Y",
        "isSpicy": "N",
        "type": "koreanFood",
        "carbohydrate": "rice",
        "typeOfCooking": "soup"
    },
    {
        "name": "불고기",
        "isDiet": "Y",
        "isSpicy": "N",
        "type": "koreanFood",
        "carbohydrate": "rice",
        "typeOfCooking": "stirFry"
    },
    {
        "name": "연어덮밥",
        "isDiet": "Y",
        "isSpicy": "Y",
        "type": "japaneseFood",
        "carbohydrate": "rice",
        "typeOfCooking": "fresh"
    },
    {
        "name": "쌀국수",
        "isDiet": "Y",
        "isSpicy": "N",
        "type": "asianFood",
        "carbohydrate": "noodle",
        "typeOfCooking": "soup"
    }
]



        const addMenu = async(v) => {
            await menuCollection.add(v)
                .then(result => {
                    console.log(result);
                })
                .catch(err => {
                    console.error(err);
                });
        };
        
        const addToDB = (type) => {
            addData.forEach(v => {
                if (type == "M") {
                    addMenu(v);
                }
                else {
                    addRestaurant(v);
                }
            })
        };

    // addToDB("M")