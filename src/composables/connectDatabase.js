import { useStore } from "vuex";

export const connectDatabase = () => {
    const store = useStore();

    const fetchRestaurantList = () => {
        return new Promise((resolve, reject) => {
            try {
                const customData = [];
                
                store.state.restCollection.get().then(result => {
                    result.forEach(list => {
                        customData.push(Object.assign(list.data(), {
                            id: list.id
                        }));
                    });

                    resolve(customData)
                })
            }
    
            catch (error) {
                reject(error)
            }
        })
    };

    return {
        fetchRestaurantList
    }
};