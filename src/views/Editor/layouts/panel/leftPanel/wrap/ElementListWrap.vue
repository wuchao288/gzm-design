<template>
    <div class="wrap" >
        <!--        <search-header :cateList="cateList" v-model="keyword" @changeCate="changeCate" @search="onSearch"/>-->
        <comp-cate-list-wrap style="padding-top: 16px;"
         :data="page.dataList" 
         :cate-list="cateList" 
         :current-cate="currentCate" 
         :no-more="page.noMore"
         :option="{coverKey:'url'}"
                             @fetch-data="loadList"
                             @back-cate="backCate"
                             @item-click="handleClick"
                             @select-cate="selectCate"
        ></comp-cate-list-wrap>
    </div>
</template>

<script lang="ts" setup>

import {useEditor} from "@/views/Editor/app";
import {Group, Image, Line, UI} from "leafer-ui";
import {getDefaultName} from "@/views/Editor/utils/utils";
import CompCateListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompCateListWrap.vue";
import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import {queryElementList, queryElementCategory} from "@/api/editor/materials";
import SearchHeader from "@/components/editorModules/searchHeader.vue";
import {Ellipse, Star} from "@leafer-ui/core";
import isString from "lodash/isString";
import {Arrow} from "@leafer-in/arrow";

import elementData from '@/assets/data/elementData.json'

const {editor} = useEditor()

const keyword = ref();
const currentCate = ref(null);
const cateList = ref([])


const { page } = usePageMixin()
page.pageSize = 30
const fetchData = () => {
    queryElementCategory().then((res:any) =>{
        if (res.success) {
            const list = res.response
            cateList.value = list
        }
    })
}
const handleClick = (item:any) => {

    if(typeof item.json=="string"){
        item.json=JSON.parse(item.json)
    }

    item.json.name = getDefaultName(editor.contentFrame)
    if (isString(item.json.fill)){
        item.json.fill = [{
            type:'solid',
            color:item.json.fill
        }]
    }
    let group
    if (item.json.tag === 'Arrow'){
        group = new Arrow(item.json)
    }else {
        group = UI.one(item.json)
    }
    editor.add(group)
}
const backCate = () => {
    currentCate.value = null
    page.dataList = []
}
const selectCate = (cate) => {
    currentCate.value = cate
    page.page = 1
    page.noMore = false
    page.cate=cate.id
    page.dataList = []
    //loadList()
}
const loadList = () => {
   
    page.cate = currentCate.value.id
    queryElementList(page).then(res =>{
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
