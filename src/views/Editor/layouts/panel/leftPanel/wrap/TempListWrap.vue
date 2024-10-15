<template>
    <div class="wrap">
        <search-header :cateList="cateList" v-model="keyword" @changeCate="changeCate" @search="onSearch"/>
        
        <div class="temp-wrap">
           
            <comp-list-wrap @fetchData="fetchData" :data="page.dataList" :config="config" :noMore="page.noMore" max-height="calc(100vh - 115px)">
                <template #item="{ item, url, index }">
                    <a-card hoverable @click="handleClick(item)" class="cursor-pointer drop-shadow" :body-style="{ padding: '0px' }">
                        <div class="">
                            <div class="tags">
                                <div class="tag">VIP</div>
<!--                                <div>ag</div>-->
                            </div>
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
import { LazyImg, Waterfall } from '@/components/vue-waterfall-plugin-next'
import loading from '@/assets/images/loading.png'
import error from '@/assets/images/error.png'
import searchHeader from "@/components/editorModules/searchHeader.vue";
const config= {
    imgSelector:'cover',
}
import {
    IUI
} from "@leafer-ui/interface";
import {IWorkspace, IWorkspacesService, WorkspacesService} from "@/views/Editor/core/workspaces/workspacesService";
import {useEditor} from "@/views/Editor/app";
import {Group,Image} from "leafer-ui";
const {editor} = useEditor()
import {getDefaultName} from "@/views/Editor/utils/utils";
import CompListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompListWrap.vue";
import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import {queryTemplateList,queryTemplateTextCateList,queryTemplateTextOne} from "@/api/editor/materials";
import { title } from 'process';
const keyword = ref("");

const currentCate=ref({value:"10001",lable:'手机海报'})

const cateList = reactive([]);

const { page } = usePageMixin()

page.pageSize = 20
page.cate=currentCate.value.value
page.search=keyword.value
page.type="0"

queryTemplateTextCateList({type:1}).then((res)=>{
    res.response.map(m=>cateList.push({value:m.id,label:m.name}))
});


const changeCate = (e:any) => {

    currentCate.value=e
    page.cate=currentCate.value.value
    page.search=keyword.value
    page.page=1
    page.dataList=[]
    fetchData()
}
const onSearch = (value:any,ev:any) => {
    keyword.value=value
    page.cate=currentCate.value.value
    page.search=keyword.value
    page.page=1
    page.dataList=[]
    fetchData()
}


onMounted(()=>{
    console.info("onMounted")
})

const fetchData = () => {
   
    queryTemplateList(page).then((res:any) =>{

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
const handleClick =async (item:any) => {

    const resjson= await queryTemplateTextOne({type:0,id:item.id})

    const jsonData = typeof resjson.response.data === 'string' ? JSON.parse(resjson.response.data) : resjson.response.data

    if(Array.isArray(jsonData)){

        let json:{
            workspaces: IWorkspace[]
            pages: {
                id: string
                children: IUI[]
            }[]
        }={
            workspaces:[],
            pages: []
        }
        
        for (let index = 0; index < jsonData.length; index++) {
            const pageItem = jsonData[index];
            json.workspaces.push({id:pageItem.id,name:item.title,cover:item.cover})
            json.pages.push({ id:pageItem.id,children:pageItem})
        }
         await   editor.importPages(json,true)

    }else{

        editor.importJsonToCurrentPage(jsonData,true)

    }
    
}
</script>

<style lang="less" scoped>
.search__wrap {
    padding: 1.4rem 1rem 0.8rem 0rem;
}
.temp-wrap .tags{
  .tag{
    background-color: rgba(0,0,0,.6);
    //background-color:  rgb(var(--primary-6));
    border-radius: 8px;
    top: 6px;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,.16);
    color: #fff;
    font-size: 12px;
    height: 16px;
    line-height: 16px;
    padding: 0 6px;
    position: absolute;
    left: 6px;
    z-index: 11;
  }
}
</style>
