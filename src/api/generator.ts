import config from '@/config'
import http from '@/utils/request'
import {Generator} from "@/models/generator";
import {AxiosRequestConfig} from "axios";
import {Api} from "@/api/api";
import {Page} from "@/models/page";

const base = `${config.API_URL}/generator`

/**
 * 代码生成Api
 */
const execBase = base + '/exec'
const execApi: Api.ApiModel = {
    getZip: execBase + "/getZip",
    preview: execBase + "/preview",
}
export const Exec = {
    preview: (params: Api.GeneratorParam) => http.post<Generator.RenderResult>(execApi.preview, params),
    generatorZip: (params: Api.GeneratorParam, config?: AxiosRequestConfig) => http.post(execApi.getZip, params, Object.assign(config, {
        responseType: "blob" // 下载zip文件需要使用的响应格式,这是区别于普通post请求的地方,重点!!!
    })).then(res => {
        if (res.type === "application/json")
            throw res.message
        const blob = new Blob([res], {type: "application/zip"});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = 'maker-generator'
        document.body.appendChild(a)
        a.click() //执行下载
        window.URL.revokeObjectURL(a.href)
        document.body.removeChild(a)
    }),
}

/**
 * 数据源Api
 */
const dbBase = base + '/db'
export const Db = {
    page: {
        url: dbBase + '/page',
        name: "数据库列表",
        get: async function (params: Generator.SysGeneratorDb | object = {}, config: object = {}) {
            return await http.post<Page<Generator.SysGeneratorDb>>(this.url, params, config);
        }
    },
    save: (params: Generator.SysGeneratorDb, config?: AxiosRequestConfig) => http.post(dbBase + (params.id ? '/update' : '/create'), params, config),
    delete: (ids: number[]) => http.post(dbBase + '/delete', ids),
}

/**
 * 全局策略 Api
 */
const globalStrategyBase = base + '/strategy'
const globalStrategyApi = {
    get: globalStrategyBase + '/get'
}
export const GlobalStrategy = {
    get: (id: number, config: AxiosRequestConfig) => http.get<Generator.SysGeneratorStrategy>(`${globalStrategyApi.get}?id=${id}`, {}, config),
    save: (params: Generator.SysGeneratorStrategy, config?: AxiosRequestConfig) => http.post<boolean>(globalStrategyBase + (params.id ? '/update' : '/create'), params, config)
}

/**
 * 表格 Api
 */
const tableBase = base + '/table'
const tableApi = {
    get: tableBase + '/get',
    del: tableBase + '/delete'
}
export const Table = {
    get: (id: number, config?: AxiosRequestConfig) => http.get<Generator.SysGeneratorTable[]>(tableApi.get, {id}, config),
    delete: (ids: number[], config?: AxiosRequestConfig) => http.post<boolean>(tableApi.del, ids,config),
    save: (param: Generator.SysGeneratorTable, config?: AxiosRequestConfig) => http.post<boolean>(tableBase + (param.id ? '/update' : '/create'), param,config)
}