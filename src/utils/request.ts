/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, {AxiosRequestConfig} from "axios";
import sysConfig from '@/config'
import {ElLoading, ElMessageBox, ElNotification} from "element-plus";
import router from "@/router";
import _ from 'lodash';

axios.defaults.baseURL = ''
axios.defaults.timeout = sysConfig.TIMEOUT

// HTTP request 拦截器
axios.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        if (config.headers?.['Loading'] !== false) {
            showLoading(config.headers?.['Loading'])
            delete config.headers?.['Loading']
        }
        const token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiIwIiwiaXNzIjoiYWRtaW4iLCJ1YSI6IjhhYjM1Iiwib2ciOiIxIiwiaWF0IjoxNjcyNjYwNjg2fQ.NIJm7bqkbVoNGl_WfHgVkxt-9P9bTwlHepVLgVLd9bqKQVq6fofhC5AScNiNmhZveRd3DLl9SFZWWYERSrUHug'
        if (token)
            config.headers![sysConfig.TOKEN_NAME] = token
        if (!sysConfig.REQUEST_CACHE && config.method === 'get') {
            config.params = config.params || {}
            config.params['_'] = new Date().getTime()
        }
        Object.assign(config.headers, sysConfig.HEADERS)
        return config
    },
    error => {
        hideLoading()
        return Promise.reject(error)
    }
)

// HTTP response 拦截器
axios.interceptors.response.use(
    response => {
        hideLoading()
        return response
    },
    error => {
        hideLoading()
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    ElNotification.error({title: '请求错误', message: "Status:404,正在请求的不存在的服务器记录！"});
                    break;
                case 500:
                    ElNotification.error({
                        title: '请求错误',
                        message: error.response.data.message || "Status:500，服务器发生错误！"
                    });
                    break;
                case 401:
                    ElMessageBox.confirm('当前用户已被登出或无权限访问当前资源，请尝试重新登录后再操作。', '无权限访问', {
                        type: 'error',
                        closeOnClickModal: false,
                        center: true,
                        confirmButtonText: '重新登录'
                    }).then(() => {
                        router.replace({path: '/login'}).then(r => r);
                    }).catch((e) => {
                        ElNotification.error(e)
                    });
                    break;
                default:
                    ElNotification.error({
                        title: '请求错误',
                        message: error.message || `Status:${error.response.status}，未知错误！`
                    });
            }
        } else {
            ElNotification.error({
                title: '请求错误',
                message: "请求服务器无响应！"
            });
        }
        return Promise.reject(error.response);
    }
)

const http = {
    /**
     * Get 请求
     * @param url 接口地址
     * @param params 请求参数
     * @param config 请求配置
     */
    get: function<T> (url: string, params?: object, config: object = {}) {
        return new Promise<IResponseData<T>>((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                params: params,
                ...config
            }).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                reject(error);
            })
        })
    },

    /**
     * Post 请求
     * @param url 接口地址
     * @param data 请求参数
     * @param config 请求配置
     */
    post: function <T>(url: string, data: object, config: object = {}) {
        return getPromise<T>('post', url, data, config)
    },

    /**
     * Put 请求
     * @param url 接口地址
     * @param data 请求参数
     * @param config 请求配置
     */
    put: function (url: string, data: object, config: object = {}) {
        return getPromise('put', url, data, config)
    },

    /**
     * Patch 请求
     * @param url 接口地址
     * @param data 请求参数
     * @param config 请求配置
     */
    patch: function (url: string, data: object, config: object = {}) {
        return getPromise('patch', url, data, config)
    },

    /** jsonp 请求
     * @param  url 接口地址
     * @param  name JSONP回调函数名称
     */
    jsonp: function (url: string, name = 'jsonp') {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.id = `jsonp${Math.ceil(Math.random() * 1000000)}`
            script.type = 'text/javascript'
            script.src = url
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            window[name] = (response: AxiosRequestConfig) => {
                resolve(response)
                document.getElementsByTagName('head')[0].removeChild(script)
                try {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete window[name];
                } catch (e) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    window[name] = undefined;
                }
            }
            document.getElementsByTagName('head')[0].appendChild(script)
        })
    }

}

/**
 *
 * @param method 请求方法
 * @param url 请求url
 * @param data 参数
 * @param config 请求配置
 */
function getPromise<T>(method: string, url: string, data: object, config: object) {
    return new Promise<IResponseData<T> & Blob>((resolve, reject) => {
        axios({
            method: method,
            url: url,
            data: data,
            ...config
        }).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error);
        })
    })
}

let loadingRequestCount = 0;
// loading对象
let loadingInstance: any;
const showLoading = (target: any) => {
    if (target === false) return
    if (loadingRequestCount === 0) {
        loadingInstance = ElLoading.service({
            lock: true,
            text: 'Loading...',
            target: target || 'body'
        });
    }
    loadingRequestCount++
}

// 隐藏loading的函数，并且记录请求次数
const hideLoading = () => {
    if (loadingRequestCount <= 0) return;
    loadingRequestCount--;
    if (loadingRequestCount === 0) {
        toHideLoading();
    }
}

// 防抖：将 300ms 间隔内的关闭 loading 便合并为一次. 防止连续请求时, loading闪烁的问题。
const toHideLoading = _.debounce(() => {
    loadingInstance.close();
    loadingInstance = null;
}, 300);

export declare type IResponseData<T = any> = {
    code: number;
    message: string;
    data: T;
}


export default http