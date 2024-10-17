<template>
    <div class="wrap">
     
        <div class="search__wrap" >
                <a-input class="arco-radius" :allow-clear="true" size="large" placeholder="搜索素材" :button-text="''"
                @change="onSearch"
                >
                <template #prefix>
                    <icon-search />
                </template>
                </a-input>
        </div>
        <div class="search__top-cate">
            <a-row :gutter="6">
                <a-col  :span="6" class="top-cate-btn" v-for="(item, index) in cateTopList" :key="index">
                    <a-button  :style="'background-color:'+(item.bgcolor?item.bgcolor:'')"  >
                       <img style="width: 16px;height: auto;" :src="item.icon"/>
                       <span>{{item.name}}</span></a-button>
                </a-col>
            </a-row>
        </div>
        <comp-cate-list-wrap :data="page.dataList" :cate-list="cateList" :current-cate="currentCate" :no-more="page.noMore"
                             @fetch-data="loadList"
                             @back-cate="backCate"
                             @item-click="handleClick"
                             @select-cate="selectCate"
        ></comp-cate-list-wrap>
    </div>
</template>

<script lang="ts" setup>

import {useEditor} from "@/views/Editor/app";
import {Image} from "leafer-ui";
import {getDefaultName} from "@/views/Editor/utils/utils";
import CompCateListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompCateListWrap.vue";
import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import {queryGraphTopCategory,queryGraphCategory,queryGraphList} from "@/api/editor/materials";
import SearchHeader from "@/components/editorModules/searchHeader.vue";
const {editor} = useEditor()

const keyword = ref();
const currentCate = ref(null);
const cateList = ref([])
const cateTopList = ref([])

const onSearch = (value,ev) => {
    console.log('value=',value)
    console.log('keyword=',keyword.value)
    console.log('ev=',ev)
}
const { page } = usePageMixin()
page.pageSize = 30
const fetchData = () => {
    

    queryGraphTopCategory().then(res =>{
        console.info(res)
        if (res.success) {
            const list = res.response
            cateTopList.value = list
        }
    })

    queryGraphCategory().then(res =>{
        
        if (res.success) {
            const list = res.response.list
            cateList.value = list
        }
    })
}
const handleClick = (item) => {
    const image = new Image({
        name:getDefaultName(editor.contentFrame),
        editable: true,
        x:0,
        y:0,
        ...item,
    })
    editor.add(image)
}
const backCate = () => {
    currentCate.value = null
    page.dataList = []
}
const selectCate = (cate) => {
    currentCate.value = cate
    page.query.categoryId = cate.id
    page.page = 1
    page.noMore = false
    // loadList()
}
const loadList = () => {
    page.query.categoryId = currentCate.value.id
    queryGraphList(page).then(res =>{
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
fetchData()
</script>
<style lang="less" scoped>
.search__wrap {
    padding: 16px 16px 0rem 16px;
    display: flex;
    cursor: pointer;
    justify-content: center;
}
.search__top-cate{
    padding: 16px;
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