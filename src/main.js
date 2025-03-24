import "qti3-item-player-vue3/dist/qti3Player.css";
import "primeicons/primeicons.css";

// import { createApp } from "vue/dist/vue.esm-bundler";
import { createApp } from "vue";
import App from "./App.vue";

import Qti3Player from "qti3-item-player-vue3";
import Qti3Test from "qti3-test-vue3";

import PrimeVue from "primevue/config";
import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
import ToastService from "primevue/toastservice";

import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);

import { createRouter, createWebHashHistory } from "vue-router";

import ListView from "./views/ListView.vue";
import FeedbackView from "./views/FeedbackView.vue";
import TestView from "./views/TestView.vue";
import HomeView from "./views/HomeView.vue";
import LoginView from "./views/LoginView.vue";

import VueMathjax from "vue-mathjax";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/test/:id", component: TestView },
    { path: "/list", component: ListView },
    { path: "/feedback", component: FeedbackView },
    { path: "/login", component: LoginView },
    { path: "/", component: HomeView },
  ],
});

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{lime.50}",
      100: "{lime.100}",
      200: "{lime.200}",
      300: "{lime.300}",
      400: "{lime.400}",
      500: "{lime.500}",
      600: "{lime.600}",
      700: "{lime.700}",
      800: "{lime.800}",
      900: "{lime.900}",
      950: "{lime.950}",
    },
  },
});

app
  .use(Qti3Player)
  .use(Qti3Test)
  .use(router)
  .use(VueMathjax)
  .use(PrimeVue, {
    theme: {
      preset: MyPreset,
      options: {
        prefix: "p",
        darkModeSelector: "system",
        cssLayer: false,
        darkModeSelector: false,
      },
    },
  })
  .use(ConfirmationService)
  .use(ToastService)
  .mount("#app");

import { serviceWorkerFile } from "virtual:vite-plugin-service-worker";

import { getAuth } from "./scripts/api.ts";
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(serviceWorkerFile, { type: "module" });

  const auth = getAuth();
  if (auth) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.active.postMessage(auth);
    });
  }
}
import "./assets/main.css";
