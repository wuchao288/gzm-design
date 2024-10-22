import axios from 'axios';
import fetch from '@/utils/axios';
import {PageParams} from "@/types/page";

/**
 * 获取字体
 * @param params
 */
export function getFonts(params:PageParams) {
  
  return fetch('design/fonts',{data:params},"get");
  //return axios.get('/api/font/list',{data:params});
}
