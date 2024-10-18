<template>
    <div class="wrap">
        <div class="search__wrap" v-show="!currentCate">
                <a-input class="arco-radius" :allow-clear="true" size="large" placeholder="搜索文字" :button-text="''"
                @change="onSearch"
                >
                <template #prefix>
                    <icon-search />
                </template>

                </a-input>
        </div>
        <a-divider style="margin-bottom: 0px;" v-show="!currentCate"/>
        <!--有查询词的时候-->
        <div v-if="keyword!=''">
            <comp-list2-wrap :data="page.dataList"  :no-more="page.noMore"
                            :option="{coverKey:'cover'}"
                            @fetch-data="fetchData"
                            @item-click="handleClick"
            >
            </comp-list2-wrap>
        </div>
        <div   v-else >
           
        
            <comp-cate-list-wrap   :data="page.dataList" :cate-list="cateList"
                    :current-cate="currentCate" max-height="calc(100vh - 115px)"  :no-more="page.noMore"
                                @fetch-data="fetchData"
                                @back-cate="backCate"
                                @item-click="handleClick"
                                @select-cate="selectCate"
            >
            <template #default >
                <div class="basic-text-wrap"  v-show="!currentCate">
                    <div class="types__header">
                        <span style="flex: 1">添加文字</span>
                    </div>
                 </div>
                    <div class="basic-text-wrap short-add" 
                      v-show="!currentCate">
                        <a-row  justify="start">
                            <a-col  :span="6"
                                v-for="(item, index) in basicTextList"
                                :key="index"
                                class="basic-text-item"
                                :style="{
                            fontSize: 14 + 'px',
                            fontWeight: item.json.fontWeight,
                            }"
                                draggable="true"
                                @click="handleClick(item)"
                        >
                                <span style="font-size: 24px;" :class="'iconfont '+ item.icon"></span>
                                <p style="font-size: 14px;font-weight: normal;">{{ item.title }}</p>
                            </a-col>
                       
                        </a-row>
            </div>
            </template>
        </comp-cate-list-wrap> 

            <!--        <div class="other-text-wrap">-->
            <!--            -->
            <!--            <comp-list-wrap @fetchData="fetchData"-->
            <!--                            :config="config"-->
            <!--                            :data="page.dataList" :noMore="page.noMore" max-height="calc(100vh - 115px)">-->
            <!--                <template #item="{ item, url, index }">-->
            <!--                    <a-card hoverable @click="handleClick(item)" class="cursor-pointer drop-shadow" :body-style="{ padding: '0px' }">-->
            <!--                        <div class="">-->
            <!--                            <LazyImg :url="url" class="img" />-->
            <!--                        </div>-->
            <!--                        &lt;!&ndash;                      <div class="p5px">&ndash;&gt;-->
            <!--                        &lt;!&ndash;                          <span class="name truncated">{{ item.name }}</span>&ndash;&gt;-->
            <!--                        &lt;!&ndash;                      </div>&ndash;&gt;-->
            <!--                    </a-card>-->
            <!--                </template>-->
            <!--            </comp-list-wrap>-->
            <!--        </div>-->
        </div>
    </div>
</template>

<script setup lang="ts">
import {Group, Text} from "leafer-ui";
import {useEditor} from "@/views/Editor/app";
import {getDefaultName} from "@/views/Editor/utils/utils";
import CompList2Wrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompList2Wrap.vue";
import {LazyImg} from "@/components/vue-waterfall-plugin-next";
import {queryTextMaterialList,queryTextCateList} from "@/api/editor/materials";
import usePageMixin from "@/views/Editor/layouts/panel/leftPanel/wrap/mixins/pageMixin";
import {HTMLText} from "@leafer-in/html";
import CompCateListWrap from "@/views/Editor/layouts/panel/leftPanel/wrap/CompCateListWrap.vue";
import {TextListType} from "@/views/Editor/layouts/panel/leftPanel/wrap/wrapType";

const {editor} = useEditor()

const keyword = ref('');
const currentCate = ref(null);
const cateList = ref([])

const NAME = 'text-list-wrap'
const config = {
    imgSelector: 'cover',
    gutter: 2,
    breakpoints: {
        1200: {
            // 当屏幕宽度小于等于1200
            rowPerView: 4
        },
        800: {
            // 当屏幕宽度小于等于800
            rowPerView: 3
        },
        500: {
            // 当屏幕宽度小于等于500
            rowPerView: 3
        }
    },
}
const basicTextList = ref<TextListType[]>([
    {
        icon:'icon-heading-h1',
        title: '标题',
        json: {
            tag: 'Text',
            text: '标题',
            fontSize: 40,
            fontWeight: '900',
            fontFamily:'アプリ明朝'
        }
    },
    {   icon:'icon-heading-h2',
        title: '副标题',
        json: {
            tag: 'Text',
            text: '副标题',
            fontSize: 32,
            fontWeight: '600',
            fontFamily:'アプリ明朝'
        }
    },
    {
        icon:'icon-zhengwen',
        title: '正文',
        json: {
            tag: 'Text',
            text: '正文',
            fontSize: 28,
            fontWeight: 'normal',
            fontFamily:'アプリ明朝'
        }
    },
    {
        icon:'icon-fuwenben',
        title: '富文本',
        json: {
            tag: 'HTMLText',
            fontFamily:'アプリ明朝',
            text: `<i style="font-size: 40px;font-family:'アプリ明朝'">富文本</i>`,
            fontWeight: 'normal'
        }
    },
])
const handleClick = (item: any) => {
    // editor.add(item.json)

     item.json = typeof item.json === 'string' ? JSON.parse(item.json) : item.json

    if(!Object.hasOwn(item.json,'fontFamily')){
        item.json.fontFamily='アプリ明朝'
    }
    let text
    if (editor.objectIsTypes(item.json, 'Text')) {
        text = new Text({
            name: getDefaultName(editor.contentFrame),
            // draggable: true,
            editable: true,
            x: 0,
            y: 0,
            fill: [
                {
                    type: 'solid',
                    color: 'rgba(0,0,0,1)',
                },
            ],
            ...item.json,
        })
    } else if (editor.objectIsTypes(item.json, 'HTMLText')) {
        text = new HTMLText({
            name: getDefaultName(editor.contentFrame),
            editable: true,
            x: 0,
            y: 0,
            ...item.json,
        })
    } else {
        
        
        text = new Group(item.json)
    }

    console.log('text=', text)
    editor.add(text)
}
const {page} = usePageMixin()
page.pageSize = 30
page.type="1"


const fetchData = () => {

    page.type="1"
    page.cate=currentCate.value?currentCate.value.id:""
    page.search=keyword.value

    queryTextMaterialList(page).then((res:any) => {
       
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

    // if (current.value <= 5) {
    //     data.push(...imageData.list)
    //     current.value += 1
    // } else {
    //     bottom.value = true
    // }
}

const onSearch = (value:any,ev:any) => {
    keyword.value=value
    currentCate.value=null
    page.page=1
    page.dataList=[]
    fetchData()
}



const backCate = () => {
    currentCate.value = null
    page.dataList = []
}
const selectCate = (cate:any) => {
    currentCate.value = cate
    page.page = 1
    page.noMore = false
    page.cate=cate.id
    page.search=keyword.value
}

const fetchCateData = () => {

    queryTextCateList().then((res:any)=>{
        cateList.value=res.response
     });
}

fetchCateData()
</script>

<style lang="less" scoped>
// Color variables (appears count calculates by raw css)
@color0: #3b74f1; // Appears 2 times
@color1: #f1f2f4;

  .basic-text-wrap {
    padding: 8px;

    .basic-text-item {
      color: #33383e;
      background-color: #f1f2f4;
      cursor: pointer;
      user-select: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0);
      border-top: 1px solid rgba(255, 255, 255, 0);
      // color: @color-black;
      padding: 10px 0;
      text-align: center;
      margin-bottom: 5px;
      
      &:hover {
         background-color: rgba(0, 0, 0, 0.07);
         border-radius: 6px;
      }
    }
  }



.search__wrap {
    padding: 16px 16px 0rem 16px;
    display: flex;
    cursor: pointer;
    justify-content: center;
}

.short-add{
    border-radius: 6px;
    background-color:@color1;
    overflow: hidden;
    margin-bottom: 16px;
    
}
</style>
