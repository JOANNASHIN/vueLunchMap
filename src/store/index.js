import { createStore } from "vuex";
import firebase from "firebase";
import mitt from 'mitt';
import createPersistedState from "vuex-persistedstate";

const firebaseConfig = {
    apiKey: "AIzaSyDHz7AynNlBgyXbBv_4I9KoRqSgzh1xkVY",
    authDomain: "lunchmap-489a0.firebaseapp.com",
    projectId: "lunchmap-489a0",
    storageBucket: "lunchmap-489a0.appspot.com",
    messagingSenderId: "481065159336",
    appId: "1:481065159336:web:26542afd06f6e65e19509d"
};
  
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
else {
    firebase.app();
}

const database = firebase.firestore();

export default createStore({
    state: {
        menuCollection: database.collection("menuList"),
        restCollection: database.collection("restaurantList"),
        menuData: [],
        selectedMenu: null,
        matchedRests: [],
        emitter: mitt(),
    },

    mutations: {
        setSelectedMenu(state, data) {
            state.selectedMenu = data;
        },

        setMatchedRests(state, data) {
            state.matchedRests = data;
        },
    },

    actions: {
        saveSelectedMenu({ commit }, menu) {
            commit("setSelectedMenu", menu)
        },

        saveMatchedRests({ commit }, posotions) {
            commit("setMatchedRests", posotions)
        },
    },
    modules: {

    },
    plugins: [ 
        createPersistedState({
            paths: ["menuData","selectedMenu", "matchedRests"]
        }) 
    ]
});
