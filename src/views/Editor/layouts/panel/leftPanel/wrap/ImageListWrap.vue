<template>
    <div class="wrap">
        <search-header :cateList="cateList" 
         :searchPlaceholder="searchPlaceholder" 
       @changeCate="changeCate"
         @search="onSearch"/>
        <a-divider style="margin-bottom: 6px;margin-top: 16px;" />
        <div class="other-text-wrap">
            <comp-list-wrap @fetchData="fetchData" :data="page.dataList" :noMore="page.noMore" max-height="calc(100vh - 185px)">
                <template #item="{ item, url, index }">
                    <a-card hoverable @click="handleClick(item)" class="cursor-pointer drop-shadow" :body-style="{ padding: '0px' }">
                        <div class="">
                            <LazyImg :url="url" class="img" />
                        </div>
                        <!--                      <div class="p5px">-->
                        <!--                          <span class="name truncated">{{ item.name }}</span>-->
                        <!--                      </div>-->
                    </a-card>
                </template>
            </comp-list-wrap>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {LazyImg} from '@/components/vue-waterfall-plugin-next'

import {useEditor} from "@/views/Editor/app";
import {Image} from "leafer-ui";
import {getDefaultName} from "@/views/Editor/utils/utils";
import CompListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompListWrap.vue";
import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import {queryImageMaterialList,queryImageCateList} from "@/api/editor/materials";
import SearchHeader from "@/components/editorModules/searchHeader.vue";
const {editor} = useEditor()
const keyword = ref();

const currentCate=ref({value:"order-desc",label:'最新上线'})

const cateList = reactive([]);

let searchPlaceholder=ref('搜索')

queryImageCateList().then((res:any)=>{
   res.response.map((m:any)=>cateList.push({value:m.id,label:m.name}))
});

const changeCate = (e:any) => {



currentCate.value=e
page.cate=currentCate.value.value
page.search=keyword.value
page.page=1
page.dataList=[]
fetchData()
}


watch(()=>currentCate.value,()=>{
    searchPlaceholder.value=currentCate.value?`在${currentCate.value.label}中搜索`:'搜索'
},{deep:true})

const onSearch = (value:any,ev:any) => {

keyword.value=value
page.cate=currentCate.value.value
page.search=keyword.value
page.page=1
page.dataList=[]
fetchData()
}




const { page } = usePageMixin()
page.pageSize = 20
page.cate=currentCate.value.value
const fetchData = () => {
    queryImageMaterialList(page).then(res =>{
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
const handleClick = (item) => {
    const image = new Image({
        name:getDefaultName(editor.contentFrame),
        // draggable: true,
        editable: true,
        x:0,
        y:0,
        ...item,
    })
    editor.add(image)
}
</script>

<style lang="less" scoped>
.search__wrap {
    padding: 16px 16px 0rem 16px;
}
</style>
