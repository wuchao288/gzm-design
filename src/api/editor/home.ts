
import fetch from '@/utils/axios'
import _config from '@/config'

function serialize(obj: any) {
  return Object.keys(obj).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`).join('&');
}


type IGetTempListParam = {
  search: string
  page: number
  pageSize: number
  cate: number | string
}
export type IGetTempListData = {
  cover: string
  height: number
  id:  string | number
  state: number
  title: string
  width: number
  isDelect: boolean
  fail: boolean
  top: number
  left: number
  data?: string
  listWidth?: number
  gap?: number
  thumb?: string
  url: string
  model?: string
  color?: string
}
type IGetTempListResult = TPageRequestResult<IGetTempListData[]>

// 获取模板列表
export const getTempList = (params: IGetTempListParam) => fetch<IGetTempListResult>('design/list', params, 'get')

export type TGetTempDetail = {
  id:  string | number
  type?: number
  compcode:string|""
}

export type TTempDetail = {
  /** 分类 */
  category: number
  /** 封面 */
  cover: string
  /** 创建时间 */
  created_time: string
  /** Template内容 */
  data: string
  /** 高度 */
  height: number
  id: bigint
  /** 来源 */
  original: string
  resource: string
  state: string
  tag: string | null
  title: string
  updated_time: string
  width: number,
  version:number,
  spaceClass:string | number,
  folderId:string | number
}

export const getTempDetail = (params: TGetTempDetail) => fetch<TTempDetail>('design/temp', params, 'get')

type TGetCategoriesParams = {
  type?: number
}
export type TGetCategoriesData = {
  id: number
  name: string
  pid: number
  type: number
}
type TgetCategoriesResult = TCommResResult<TGetCategoriesData>

export const getCategories = (params: TGetCategoriesParams) => fetch<TgetCategoriesResult[]>('design/cate', params, 'get')


// 保存模板
export const saveTemp = (params: Type.Object = {}) => fetch('design/edit', params, 'post')
// export const delTemp = (params: Type.Object = {}) => fetch('/api/template/temp_del', params)

type TGetCompListParam = {
  search?: string
  page?: number
  type?: number
  pageSize: number
  cate?: number | string
}

/** 获取组件返回类型 */
export type TGetCompListResult = {
  cover: string
  height: number
  id: string | number
  state: number
  title: string
  width: number
  name?: string
}

type getCompListReturn = TPageRequestResult<TGetCompListResult[]>

// 组件相关接口
export const getCompList = (params: TGetCompListParam) => fetch<getCompListReturn>('design/list', params, 'get')

type TRemoveComp = {
  id: string | number
}

export const removeComp = (params: TRemoveComp) => fetch<void>('design/del', params, 'post')

type TSaveWorksParams = {
  title: string
  temp_id?: string
  width: number
  height: number
  data: string
  cover?: string
  version?:number | string
  id?: string | number,
  spaceClass:string | number,
  folderId:string | number
}

export type TSaveWorksResult = {
  id: number | string,
  stat?: number,
  msg: string,
  version: number | string
}

// 保存作品
export const saveWorks = (params: TSaveWorksParams) => fetch<any>('design/save', params, 'post')

// 保存个人模板
export const saveMyTemp = (params: Type.Object = {}) => fetch('design/user/temp', params, 'post')

// 获取作品
export const getWorks = (params: TGetTempDetail) => fetch<TTempDetail>('design/poster', params, 'get')

type TGetMyDesignParams = {
  page: number
  pageSize: number
}

type TGetMyDesignResult = TPageRequestResult<IGetTempListData[]>

// 我的作品列表
export const getMyDesign = (params: TGetMyDesignParams) => fetch<TGetMyDesignResult>('design/my', Object.assign(params, {type:2}), 'get')

//团队作品列表
export const getTeamDesign = (params: TGetMyDesignParams) => fetch<TGetMyDesignResult>('design/my', Object.assign(params, {type:1}), 'get')

export type TLoginParm = {
  username: string
  password: string
}
//登录
export const login = (params: TLoginParm) => fetch<void>('layout/userlogin', params,"post")
//检查是否登录
export const checklogin = () => fetch<any>('auth/checkauthenticate',{},"post")

export type TFolderParm = {
  folderClass: number  //空间文件夹类型：1团队空间，2我的空间
}
//空间文件夹

export type Tree = {
  [key: string]: any
}

//查询保存后的文件夹
export const  getFolder = () => fetch<Tree[]>('design/getfoldertree',{},'get')