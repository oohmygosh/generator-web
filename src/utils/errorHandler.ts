import {ComponentPublicInstance} from "@vue/runtime-core";
import {ElMessage} from "element-plus";

/**
 * 全局异常捕捉
 */

export default (error: any, instance: ComponentPublicInstance | null) => {
    console.error(`[Maker error]: ${error}`);
    instance?.$nextTick(() => {
        ElMessage.error(error.toString())
    })
}