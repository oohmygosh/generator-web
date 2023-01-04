import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import elementPlus from 'element-plus'
import generator from "@/generator"
import 'element-plus/dist/index.css'

createApp(App)
    .use(store)
    .use(router)
    .use(elementPlus)
    .use(generator)
    .mount('#app')
