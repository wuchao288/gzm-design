//const prefix = process.env
const prefix = import.meta.env
const isDev = prefix.NODE_ENV === 'development'
import { version } from '/package.json'
console.info(isDev,"isDev")
export default {
  isDev,
  BASE_URL: isDev ? '/' : './',
  VERSION: version,
  APP_NAME: '果米设计',
  COPYRIGHT: 'www.xxxx.com',
  API_URL: '/api', // 服务端地址
  IMG_URL: '/api/design/tmp/', 
  supportSubFont: false, // 是否开启服务端字体压缩
  serverPath:"editor",
  statusCode:"status",
  statusResult:'response',
  statusSuccess:"success",
  loginUrl: isDev ? 'http://localhost:9200' : 'http://localhost:9200', 

  IMAGEUPLOAD_URL:"/api/desgin/uploadimage"
}

export const LocalStorageKey = {
  tokenKey: "xp_token"
}
