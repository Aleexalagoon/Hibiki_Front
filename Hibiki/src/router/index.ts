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
import perfilView from "@/views/perfil.vue";
import PagoView from "@/views/PagoView.vue";
import PagoCompletadoView from "@/views/PagoCompletadoView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: "/",  // Add this route to redirect to the home page
      redirect: "/inicio"
    },
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
      path: '/artista/:id',
      name: 'Artista',
      component: () => import('@/views/ArtistaView.vue'), // Asegúrate de que la ruta es correcta
      props: true
    },

    {
      path: "/canciones",
      name: "canciones",
      component: CancionesView,
    },
    {
      path: "/perfil",
      name: "perfil",
      component: perfilView,
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
