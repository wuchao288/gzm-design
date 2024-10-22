import axios from 'axios';
import type {AxiosRequestConfig, AxiosResponse} from 'axios';
import {Message} from '@arco-design/web-vue';
import {useRoute, useRouter, RouteRecordRaw} from 'vue-router';

import app_config, { LocalStorageKey } from '@/config/index'

const router = useRouter();
// default config

axios.defaults.baseURL = app_config.API_URL;
axios.defaults.timeout = 60000; // 1 分钟


// request interceptors
axios.interceptors.request.use(
    // @ts-ignore
    (config: AxiosRequestConfig) => {
        // 使用Token

        // const token = getToken();
        // if (token) {
        //     if (!config.headers) {
        //         config.headers = {};
        //     }
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        
        return config;
    },
    (error) => {
        console.log(error);
        return Promise.reject(error);
    }
);

export interface HttpResponse<T = unknown> {
    success: boolean; // 是否成功
    status: number; // 状态码
    msg: string; // 状态信息
    response: T; // 返回数据
    timestamp: string; // 时间戳
}

// response interceptors
axios.interceptors.response.use(
    // @ts-ignore
    (response: AxiosResponse<HttpResponse>) => {
        // 二进制数据则直接返回
        if (
            response.request.responseType === 'blob' ||
            response.request.responseType === 'arraybuffer'
        ) {
            return response;
        }


        // 操作成功则直接返回
        const res = response.data;
        if (res.success) {
            return res;
        }
        // 操作失败，弹出错误提示
        Message.error({
            content: res.msg,
            duration: 3000,
        });
        //
        if (res.status === 401) {
            // 重定向路由到登录页面
            router.replace('/login')
        }
        return Promise.reject(new Error(res.msg));
    },
    (error) => {

        console.error(`err: ${error}`);
        const res = error.response.data;
        Message.error({
            content: res.msg || '网络错误',
            duration: 3000,
        });
        return Promise.reject(error);
    }
);
