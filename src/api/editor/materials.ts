import axios from 'axios';
import type { DescData } from '@arco-design/web-vue/es/descriptions/interface';
import {PageParams} from "@/types/page";

/**
 * 模板数据
 * @param params
 */
export function queryTemplateList(params:PageParams) {
  let {pageSize,page,cate,search,type}=params//0=图片，1=文字
  let resut= axios.get('/api/design/list',{params:{pageSize,page,cate,search,type}})
  
  return resut
}
/**
 * 模板类别
 * @param params type=类别（1模板4图片）
 * @returns 
 */
export function queryTemplateTextCateList(params:PageParams) {
  let resut= axios.get('/api/design/cate',{params:params});
  return resut
}
/**
 * 文字类别
 * @returns 
 */
export function queryTextCateList() {
  let resut= axios.get('/api/design/textcate');
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
  let {pageSize,page,cate,search,type}=params
  return axios.get('/api/design/list',{params:{pageSize,page,cate,search,type}});
}

/**
 * 图片分类
 * @param params
 */
export function queryImageCateList() {
  let resut= axios.get('/api/design/imagecate');
  return resut
}
/**
 * 图片列表
 * @param params
 */
export function queryImageMaterialList(params:PageParams) {
  let {pageSize,page,cate,search}=params
  return axios.get('/api/design/imgs',{params:{pageSize,page,cate,search}});
}
/**
 * 素材顶部分类
 * @param params
 */
export function queryGraphTopCategory() {
  return axios.get('/api/design/matetopcate');
}
/**
 * 素材首页分类
 * @param params
 */
export function queryGraphCategory(params?:PageParams) {
  let {pcate,isIndex}=params
  return axios.get('/api/design/matecategroup',{params:{pcate,isIndex}});
}
/**
 * 素材列表
 * @param params
 */
export function queryGraphList(params:PageParams) {
  let {pageSize,page,cate,search}=params
  return axios.get('/api/design/material',{params:{pageSize,page,cate,search}});
}

/**
 * 背景图片
 * @param params
 */
export function queryBgImgMaterialList(params:PageParams) {
  let {pageSize,page,cate}=params
  return axios.get('/api/design/imgs',{params:{pageSize,page,cate}});
}


/**
 * 元素分类
 * @param params
 */
export function queryElementCategory() {
    return axios.get('/api/design/elementcate');
}
/**
 * 元素分类列表
 * @param params
 */
export function queryElementList(params:PageParams) {
    let {pageSize,page,cate}=params
    return axios.get('/api/design/elements',{params:{pageSize,page,cate}});
}
