import "./assets/main.css";

// import { createApp } from "vue/dist/vue.esm-bundler";
import { createApp } from "vue";
import App from "./App.vue";
import Qti3Player from "qti3-item-player-vue3";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Qti3Test from "qti3-test-vue3";

let app = createApp(App);

import { createWebHashHistory, createRouter } from "vue-router";

import ListView from "./views/ListView.vue";
import TestView from "./views/TestView.vue";
import HomeView from "./views/HomeView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/test/:id", component: TestView },
    { path: "/", component: ListView },
  ],
});

app
  .use(Qti3Player)
  .use(Qti3Test)
  .use(router)
  .use(PrimeVue, {
    // unstyled: true,
    preset: Aura,
  })
  .mount("#app");

import { serviceWorkerFile } from "virtual:vite-plugin-service-worker";

// console.log(serviceWorkerFile);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(serviceWorkerFile, { type: "module" });
}
