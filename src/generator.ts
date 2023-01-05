import config from '@/config'
import * as elIcons from '@element-plus/icons-vue'
import errorHandler from "@/utils/errorHandler";
import {App} from "vue";

export default {
    install(app: App) {
        // 挂载全局对象
        app.config.globalProperties.$CONFIG = config
        app.config.errorHandler = errorHandler
        // 统一注册el-icon图标
        for (const [key, component] of Object.entries(elIcons)) {
            app.component(`ElIcon${key}`, component)
        }
    }
}