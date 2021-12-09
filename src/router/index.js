import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Map from "../views/Map.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
      path: "/map",
      name: "map",
      component: Map,
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

export default router;
