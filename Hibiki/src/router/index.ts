import { createRouter, createWebHistory } from "vue-router";
import NovedadesView from "@/views/NovedadesView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
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
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/hibki",
      name: "hibki",
      component: Hibiki,
    }
  ],
});

export default router;
