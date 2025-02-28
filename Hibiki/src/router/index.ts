import { createRouter, createWebHistory } from "vue-router";
import NovedadesView from "@/views/NovedadesView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import PremiumView from "@/views/PremiumView.vue";
import Hibiki from "@/views/Hibiki.vue";
import PoliticaView from "@/views/PoliticaView.vue";
import TerminosView from "@/views/TerminosView.vue";
import CookiesView from "@/views/CookiesView.vue";
import InfoAnunciosView from "@/views/InfoAnunciosView.vue";
import InicioView from "@/views/InicioView.vue";
import PlaylistView from "@/views/PlaylistView.vue";
import ArtistaView from "@/views/ArtistaView.vue";
import CancionesView from "@/views/CancionesView.vue";
import PagoView from "@/views/PagoView.vue";
import PagoCompletadoView from "@/views/PagoCompletadoView.vue";


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
      path: "/premium",
      name: "premium",
      component: PremiumView,
    },

    {
      path: "/hibki",
      name: "hibki",
      component: Hibiki,
    },

    {
      path: "/politica",
      name: "politica",
      component: PoliticaView,
    },
    {
      path: "/terminos",
      name: "terminos",
      component: TerminosView,
    },

    {
      path: "/cookies",
      name: "cookies",
      component: CookiesView,
    },

    {
      path: "/infoanuncios",
      name: "infoanuncios",
      component: InfoAnunciosView,
    },

    {
      path: "/inicio",
      name: "inicio",
      component: InicioView,
    },


    {
      path: "/playlist",
      name: "playlist",
      component: PlaylistView,
    },

    {
      path: "/artista",
      name: "artista",
      component: ArtistaView,
    },

    {
      path: "/canciones",
      name: "canciones",
      component: CancionesView,
    },

    {
      path: "/pago",
      name: "pago",
      component: PagoView,
    },

    {
      path: "/pagocompletado",
      name: "pagocompletado",
      component: PagoCompletadoView,
    }
  ],
});

export default router;
