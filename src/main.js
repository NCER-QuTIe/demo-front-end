import './assets/main.css'

import { createApp } from 'vue/dist/vue.esm-bundler'
import App from './App.vue'
import Qti3Player from 'qti3-item-player-vue3'

let app = createApp(App);

app
  .use(Qti3Player)
  .mount('#app');
