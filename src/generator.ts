import config from '@/config'
import * as elIcons from '@element-plus/icons-vue'
import errorHandler from "@/utils/errorHandler";
import {App} from "vue";
import resize from "@/directives/resize"

export default {
    install(app: App) {
        // 挂载全局对象
        app.config.globalProperties.$CONFIG = config
        app.config.errorHandler = errorHandler
        // 注册指令
        app.directive('resize',resize)
        // 统一注册el-icon图标
        for (const [key, component] of Object.entries(elIcons)) {
            app.component(`ElIcon${key}`, component)
        }
    }
}