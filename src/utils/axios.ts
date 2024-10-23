
import axios from 'axios';
import type {AxiosRequestConfig, AxiosResponse,AxiosStatic} from 'axios';
import app_config, { LocalStorageKey } from '@/config'
import {Message} from '@arco-design/web-vue';
import { Notification } from '@arco-design/web-vue';
import { useUserStore } from '@/store/index';

axios.defaults.headers.common['Accept'] = 'application/json, text/javascript';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

axios.defaults.timeout = 30000
// axios.defaults.headers.authorization = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDEsImV4cCI6MTc4ODU3NDc1MDU4NX0.L_t6DFD48Dm6rUPfgIgOWJkz18En1m_-hhMHcpbxliY';
const defaultToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MTAwMDEsImV4cCI6MTc4ODU3NDc1MDU4NX0.L_t6DFD48Dm6rUPfgIgOWJkz18En1m_-hhMHcpbxliY';
// const version = app_config.VERSION;
const baseUrl = app_config.API_URL

const statusCode=app_config.statusCode;

const statusResult=app_config.statusResult;

const statusSuccess=app_config.statusSuccess;

// 请求拦截器
axios.interceptors.request.use(
  // @ts-ignore
  (config: AxiosRequestConfig) => {
    const url = config.url ?? ""
    const values = {}
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      config.url = url.startsWith('/') ? baseUrl + url : config.url = baseUrl + '/' + url
    }

    if (config.method === 'get') {
     
      config.params = Object.assign(config.params||{}, values)

    } else {

      config.data = Object.assign(config.data, values)

    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
axios.interceptors.response.use((res: AxiosResponse<any>) => {
    // store.dispatch('hideLoading');
    
    // 接口规则：只有正确code为200时返回result结果对象，错误返回整个结果对象
    if (!res.data) {
      return Promise.reject(res)
    }
   
    if(res.data[statusSuccess]==true){

        return Promise.resolve(res.data[statusResult])

    }else{
       console.info("res.data[statusSuccess]==false")
        Message.error({
            content: res.data.msg || '请求失败',
            duration: 3000,
        });
      
      return Promise.reject(res.data)

    }

    if (res.data[statusCode] === 401) {
      console.log('登录失效')
      useUserStore().changeOnline(false)

      // store.commit('changeOnline', false)
    }
    if (res.data[statusResult] && res.data[statusCode] === 200) {
      return Promise.resolve(res.data[statusResult])
    } else if (res.data[statusResult] && res.data.stat == 1) {
      return Promise.resolve(res.data[statusResult])
    } else {
      return Promise.resolve(res.data)
    }
  },
  (error) => {
   
    console.info("res.data[statusSuccess]==error")

    if(error.response.status === 401){

      useUserStore().changeOnline(false)
      useUserStore().changeloginVisible(true);

      Notification.error({
            id:'MESSAGE_ID',
            title:"请求失败",
            content:error.response.data.msg 
        });

    }else{

      Notification.error({
        id:'MESSAGE_ID',
        title:"请求失败",
        content:error.response.data.msg 
    });
    }
    return Promise.reject(error)
  },
)

type TFetchRequestConfigParams = AxiosRequestConfig & Record<string, any>
type TFetchMethod = keyof Pick<
  AxiosStatic, 
  "get" | "post" | "put" | "getUri" | "request" | "delete" | "head" | "options" | "patch"
>

// export default axios;
const fetch = <T = any> (
  url: string,
  params: TFetchRequestConfigParams={}, 
  type: TFetchMethod = 'get',
  exheaders: Record<string, any> = {},
  extra: Record<string, any> = {}
): Promise<T> => {
  if (params?._noLoading) {
    delete params._noLoading
  } else {
    // store.commit('loading', '加载中..');
  }

  

  const token = defaultToken//localStorage.getItem(LocalStorageKey.tokenKey)
  const headerObject: Record<string, any> = {}
  token && (headerObject.Authorization = token)
  
  // {
  //   //headers: Object.assign(headerObject, exheaders),
  //   params,
  //   ...extra,
  // }

  if (type === 'get') {

    // if(extra&&JSON.stringify(params)!="{}"){
    //   //Object.assign(params, extra)
    // }
    params=Object.assign(params, extra)

    return axios.get(url,params)
  } else {
    return axios[type](url, params, {
      //headers: Object.assign(headerObject, exheaders),
      ...extra,
    }) as Promise<T>
  }
}

export default fetch
