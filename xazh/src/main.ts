/**
 * Today, I got a cat. 20230804-22:40.
 * I'm going to call her, Xiao Liu.
 * Haha, She is drinking milk.
 */


import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

const app = createApp(App)
app.use(router)
  .use(store)
  .mount('#app')
