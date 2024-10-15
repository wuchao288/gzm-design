import axios from 'axios';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import {PageParams} from "@/types/page";

/**
 * 模板数据
 * @param params
 */
export function queryTemplateList(params:PageParams) {
  let {pageSize,page,cate,search,type}=params
  let resut= axios.get('/api/design/list',{params:{pageSize,page,cate,search,type}});
  return resut
}
/**
 * 模板（文字）分类
 * @param params type=类别（1模板2素材3文字4图片）
 * @returns 
 */
export function queryTemplateTextCateList(params:PageParams) {
  let resut= axios.get('/api/design/cate',{params});
  return resut
}
/**
 * 获取模板（文字）一个
 * @param params type=模板类型（0模板，1文字组件）id=数据id</param>
 * @returns 
 */
export function queryTemplateTextOne(params:any) {
  let resut= axios.get('/api/design/temp',{params});
  return resut
}

/**
 * 文字模板
 * @param params
 */
export function queryTextMaterialList(params:PageParams) {
  return axios.get('/api/text/materialList',{data:params});
}

/**
 * 图片素材
 * @param params
 */
export function queryImageMaterialList(params:PageParams) {
  return axios.get('/api/image/materialList',{data:params});
}

/**
 * 素材分类
 * @param params
 */
export function queryGraphCategory(params?:PageParams) {
  return axios.get('/api/graph/category',{data:params});
}
/**
 * 素材分类列表
 * @param params
 */
export function queryGraphList(params:PageParams) {
  return axios.get('/api/graph/list',{data:params});
}

/**
 * 背景图片
 * @param params
 */
export function queryBgImgMaterialList(params:PageParams) {
  return axios.get('/api/background/imageList',{data:params});
}


/**
 * 元素分类
 * @param params
 */
export function queryElementCategory(params?:PageParams) {
    return axios.get('/api/element/category',{data:params});
}
/**
 * 元素分类列表
 * @param params
 */
export function queryElementList(params:PageParams) {
    return axios.get('/api/element/list',{data:params});
}
