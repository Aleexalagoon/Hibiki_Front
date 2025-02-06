import { createRouter, createWebHistory } from "vue-router";
import NovedadesView from "@/views/NovedadesView.vue";
import Hibiki from "@/views/Hibiki.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/novedades",
      name: "novedades",
      component: NovedadesView,
    },
    {
      path: "/hibki",
      name: "hibki",
      component: Hibiki,
    }
  ],
});

export default router;
