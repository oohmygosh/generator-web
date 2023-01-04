import config from '@/config'
import * as elIcons from '@element-plus/icons-vue'
import {App} from "vue";

export default {
    install(app: App) {
        // 挂载全局对象
        app.config.globalProperties.$CONFIG = config
        // 统一注册el-icon图标
        for (const [key, component] of Object.entries(elIcons)) {
            app.component(`ElIcon${key}`, component)
        }
    }
}