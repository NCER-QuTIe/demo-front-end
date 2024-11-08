import "./assets/main.css";

import { createApp } from "vue/dist/vue.esm-bundler";
import App from "./App.vue";
import Qti3Player from "qti3-item-player-vue3";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Qti3Test from "qti3-test-vue3";

let app = createApp(App);

import { createWebHistory, createRouter } from "vue-router";

import ListView from "./views/ListView.vue";
import TestView from "./views/TestView.vue";
import HomeView from "./views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/list/", component: ListView },
    { path: "/test/:id", component: TestView },
    { path: "/home/", component: HomeView },
  ],
});

app
  .use(Qti3Player)
  .use(Qti3Test)
  .use(router)
  .use(PrimeVue, {
    unstyled: true,
  })
  .mount("#app");

import { serviceWorkerFile } from "virtual:vite-plugin-service-worker";

// console.log(serviceWorkerFile);
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(serviceWorkerFile, { type: "module" });
}
