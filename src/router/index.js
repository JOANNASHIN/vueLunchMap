import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Map from "../views/Map.vue";
import NotFound from "../views/NotFound.vue";
import VueBodyClass from 'vue-body-class';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { bodyClass: 'Home'}
  },
  {
      path: "/map",
      name: "map",
      component: Map,
      meta: { bodyClass: 'Map'}
  },
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const vueBodyClass = new VueBodyClass(routes);
router.beforeEach((to, from, next) => { vueBodyClass.guard(to, next) });

export default router;
