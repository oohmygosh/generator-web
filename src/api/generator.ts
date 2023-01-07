import config from '@/config'
import http from '@/utils/request'
import {Generator} from "@/models/generator";
import {AxiosHeaders, AxiosRequestConfig} from "axios";
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
    preview: (params: Api.GeneratorParam, config?: AxiosRequestConfig | AxiosHeaders) => http.post<Generator.RenderResult>(execApi.preview, params,config),
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
        get: async function (params: Generator.SysGeneratorDb | object = {}, config: AxiosRequestConfig = {}) {
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
    delete: (ids: number[], config?: AxiosRequestConfig) => http.post<boolean>(tableApi.del, ids, config),
    save: (param: Generator.SysGeneratorTable, config?: AxiosRequestConfig) => http.post<boolean>(tableBase + (param.id ? '/update' : '/create'), param, config)
}

/**
 * 表策略 API
 */
const tableStrategyBase = base + '/table-strategy'
const tableStrategyApi = {
    get: tableStrategyBase + "/get"
}
export const TableStrategy = {
    get: (id: number, config?: AxiosRequestConfig | AxiosHeaders) => http.get<Generator.SysGeneratorTableStrategy>(tableStrategyApi.get, {id}, config),
    save: (param: Generator.SysGeneratorTableStrategy, config?: AxiosRequestConfig | AxiosHeaders) => http.post<boolean>(tableStrategyBase + (param.id ? '/update' : '/create'), param, config)
}

/**
 * 模板 API
 */
const templateBase = base + '/template'
const templateApi = {
    getAll: templateBase + "/getAll"
}
export const Template = {
    get: (id: number, config?: AxiosRequestConfig | AxiosHeaders) => http.get<Array<Generator.SysGeneratorTemplate>>(templateApi.getAll, {id}, config),
    save: (param: Generator.SysGeneratorTemplate, config?: AxiosRequestConfig | AxiosHeaders) => http.post<boolean>(templateBase + (param.id ? '/update' : '/create'), param, config)
}

/**
 * 父类 API
 */
const superclassBase = base + '/superclass'
const superclassApi = {
    getAll: superclassBase + "/getAll"
}
export const Superclass = {
    get: (id: number, config?: AxiosRequestConfig | AxiosHeaders) => http.get<Array<Generator.SysGeneratorSuperclass>>(superclassApi.getAll, {id}, config),
    save: (param: Generator.SysGeneratorSuperclass, config?: AxiosRequestConfig | AxiosHeaders) => http.post<boolean>(superclassBase + (param.id ? '/update' : '/create'), param, config)
}

/**
 * 字段 Api
 */
const fieldBase = base + '/field'
const fieldApi = {
    get: fieldBase + '/get',
    deleted: fieldBase + '/delete',
    fetchTableField: fieldBase + '/fetchTableField'
}
export const Field = {
    get: (id: number, config?: AxiosRequestConfig) => http.get<Generator.SysGeneratorField>(fieldApi.get, {id}, config),
    fetchTableField: (id: number, config?: AxiosRequestConfig | AxiosHeaders) => http.get<Array<Generator.SysGeneratorField>>(fieldApi.fetchTableField, {id}, config),
    save: (param: Generator.SysGeneratorField, config?: AxiosRequestConfig | AxiosHeaders) => http.post<boolean>(fieldBase + (param.id ? '/update' : '/create'), param, config),
    delete: (ids: number[], config?: AxiosRequestConfig) => http.post<boolean>(fieldApi.deleted, ids, config),
}

