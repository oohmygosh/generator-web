import elementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import generator from "@/generator"

createApp(App)
    .use(store)
    .use(router)
    .use(elementPlus)
    .use(generator)
    .mount('#app')
