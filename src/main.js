import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


createApp(App).use(store).use(router).mount("#app");


/* rem */
const htmlDoc = document.documentElement;
const bodyDoc = document.querySelector("body");
let enSizing = false;

function setFontSize() {
    if (window.innerWidth > window.innerHeight || window.innerWidth > 1100) {
        htmlDoc.style.fontSize = "";
        bodyDoc.setAttribute("type", "pc");

       return ;
    }
    htmlDoc.style.fontSize = parseInt(htmlDoc.offsetWidth / 360 * 100) + '%';

    bodyDoc.setAttribute("type", "mobile");
}
 
window.onresize = function() {
    if (!enSizing) {
        window.requestAnimationFrame(function() {
            setFontSize();
            enSizing = false;
        });
    }
    enSizing = true;
}
 
window.dispatchEvent(new Event('resize'));