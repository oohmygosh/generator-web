const DEFAULT_CONFIG = {
    // title
    APP_NAME: process.env.VUE_APP_TITLE,
    //TokenName
    TOKEN_NAME: "accessToken",
    //请求是否开启缓存
    REQUEST_CACHE: false,
    //追加其他头
    HEADERS: {},
    // 请求超时
    TIMEOUT: 10000,
    // 接口地址
    API_URL: process.env.VUE_APP_API_BASEURL,
}

export default DEFAULT_CONFIG