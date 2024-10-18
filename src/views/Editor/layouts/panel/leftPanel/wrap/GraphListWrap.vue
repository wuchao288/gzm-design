<template>
    <div class="wrap">
     
        <search2Header :search-placeholder="searchPlaceholder" v-model="keyword" v-on:search="onSearch"  />
        <a-divider style="margin-bottom: 6px;" />
        <!--有查询词的时候-->
       
        <comp-list2-wrap :data="page.dataList"  :no-more="page.noMore"
                        :option="{coverKey:'thumb'}"
                        @fetch-data="fetchData"
                        @item-click="handleClick"  v-show="keyword!=''"
        >
        </comp-list2-wrap>
        <comp-cate-list-wrap  v-show="keyword==''" :option="{coverKey:'thumb'}"
         :config="config" :data="page.dataList"
         :cate-list="cateList" 
         :current-cate="currentCate" 
         :no-more="page.noMore"
                             @fetch-data="fetchData"
                             @back-cate="backCate"
                             @item-click="handleClick"
                             @select-cate="selectCate"
                           
        >
        <template #default>
            <div class="search__top-cate" v-if="currentCate==null">
                <a-row :gutter="6">
                    <a-col  :span="6" class="top-cate-btn" v-for="(item, index) in cateTopList" :key="index">
                        <a-button @click="selectCate(item)" :title="item.id"  :style="'background-color:'+(item.bgcolor?item.bgcolor:'')"  >
                        <img style="width: 16px;height: auto;" :src="item.icon"/>
                        <span>{{item.name}}</span></a-button>
                    </a-col>
                </a-row>
            </div>
        </template>
        </comp-cate-list-wrap>
     
    </div>
</template>

<script lang="ts" setup>

import {useEditor} from "@/views/Editor/app";

import useCenter from "@/hooks/useCenter";

import {Image} from "leafer-ui";
import {getDefaultName} from "@/views/Editor/utils/utils";
import CompCateListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompCateListWrap.vue";
import CompList2Wrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompList2Wrap.vue";

import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import {queryGraphTopCategory,queryGraphCategory,queryGraphList} from "@/api/editor/materials";
import search2Header from "@/components/editorModules/search2Header.vue";
const {editor} = useEditor()



import {v4 as uuidv4} from 'uuid'
const keyword = ref('')

let searchPlaceholder=ref('搜索')

const currentCate = ref(null)

const cateIndexList = ref([])

const cateList = ref([])

const cateAllList = ref([])

const cateTopList = ref([])
const { page } = usePageMixin()
page.pageSize = 30
page.page=1

let config=ref({
    imgSelector:'thumb',
    span:6,
    imgHeight:60,
    itemCount:8,
    topHeight:140
})

//加载分类与首页数据
const fetchCateData = () => {

    queryGraphTopCategory().then((res:any) =>{
        if (res.success) {
            cateAllList.value=res.response
            cateTopList.value = cateAllList.value.filter(m=>m.isTop==1)
        }
    })

    queryGraphCategory({pcate:null,isIndex:1} as any).then((res:any) =>{
       
        if (res.success) {
            const list = res.response
            cateList.value = list
            cateIndexList.value=JSON.parse(JSON.stringify(list))
        }
    })
}

//查询
const onSearch = (value:any) => {
    keyword.value=value
    // currentCate.value=null
    page.page=1
    page.dataList=[]
    fetchData()
}

//点击
const handleClick = (item:any) => {

    console.info(useCenter)

    let {width,height,url}=item
    const image = new Image({
        name:getDefaultName(editor.contentFrame),
        editable: true,
        x:0,
        y:0,
        width,
        height,
        id:uuidv4(),
        url
    })
    editor.add(image)
}

//返回
const backCate = (action:any) => {

    page.dataList = []

    //返回顶级
    if(action==""){

        config.value.topHeight=140
        currentCate.value = null
        cateList.value = JSON.parse(JSON.stringify(cateIndexList.value))

    }else{

       config.value.topHeight=180
       currentCate.value = cateAllList.value.find(m=>m.id==action)
       queryGraphCategory({pcate:action,isIndex:null} as any).then((res:any) =>{
       
       if (res.success) {

               const list = res.response
               cateList.value = list
           }
       })
    }
    
}

watch(()=>currentCate.value,()=>{
    searchPlaceholder.value=currentCate.value?`在${currentCate.value.name}中搜索`:'搜索'
},{deep:true})

//选择类
const selectCate = (cate:any) => {



    currentCate.value = cate
    page.page = 1
    page.noMore = false
    page.cate=cate.id
    page.search=keyword.value
   
    if(cate.hasChild){
        config.value.topHeight=180
        queryGraphCategory({pcate:cate.id,isIndex:null} as any).then((res:any) =>{
       
        if (res.success) {
                const list = res.response
                cateList.value = list
            }
        })

    }else{
        config.value.topHeight=200
        fetchData()

    }
}
const fetchData = () => {


    page.cate=currentCate.value?currentCate.value.id:""
    page.search=keyword.value

    queryGraphList(page).then((res:any) =>{
        if (res.success) {
            const newDataList = res.response.list
            if (newDataList.length > 0) {
                page.dataList.push(...newDataList)
                page.page += 1
            }
            if (page.dataList.length >= res.response.total) {
                page.noMore = true
            } else {
                page.noMore = false
            }
        }
    })
}
fetchCateData()
</script>
<style lang="less" scoped>
.search__wrap {
    padding: 16px 16px 0rem 16px;
    display: flex;
    cursor: pointer;
    justify-content: center;
}
.search__top-cate{
    padding: 4px;
}
.top-cate-btn{
    margin-bottom: 6px;
    
}
.top-cate-btn button{
    font-size: 12px;
    padding: 6px 12px;
    height: 40px;
    border-radius: 6px;
    overflow: hidden;
    span{
        margin-left: 4px;
        font-weight: bold;
        color: #000000;
    }
}
</style>