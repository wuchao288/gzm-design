<template>
    <div class="wrap">
        <div class="other-text-wrap">
            <div v-show="!currentCate" class="content__wrap">
                <a-scrollbar style="height:calc(100vh - 200px);overflow: auto;padding: 10px;">
                    <div v-for="(cate, index) in props.cateList" :key="index + 't'">
                        <div v-if="cate.list.length > 0" class="types__header" @click="selectCate(cate)">
                            <span style="flex: 1">{{ cate.name }}</span>
                            <span class="types__header-more">查看更多<icon-right /></span>
                        </div>
<!--                        <div v-else class="loading">暂无更多</div>-->
                        <div class="list-wrap" v-if="cate.list.length > 0">
                            <div v-for="(item, i) in cate.list" :title="item.id" :key="i + 'sl'" draggable="false" @click="handleClick(item)" >
                                <a-image v-if="i<3"
                                         class="list__img-thumb"
                                         height="95"
                                         width="95"
                                         :preview="false"
                                         fit="contain"
                                         :src="item.cover"
                                />
                            </div>
                        </div>
                    </div>
                </a-scrollbar>
            </div>
            <ul v-if="currentCate" class="list current-cate-list">
              <li >
                        <span class="header-back" @click="back"><icon-left />{{ currentCate.name }}</span>
              </li>
                <a-list :gridProps="{ gutter: [6, 10], span: 8 }"
                        :bordered="false"
                        :data="props.data"
                        @reach-bottom="fetchData"
                        max-height="calc(100vh - 80px)">
                    
                    <template #item="{ item,index }" >
                        <a-list-item style="padding: 0" @click="handleClick(item)" :key="index">
                            <div class="list__img-thumb">
                                <a-image
                                        class="list__img"
                                        :preview="false"
                                        :height="95"
                                        width="100%"
                                        fit="contain"
                                        :src="item.cover"
                                />
                            </div>
                        </a-list-item>
                    </template>
                    <template #scroll-loading >
                        <div v-if="props.noMore">没有更多了</div>
                        <a-spin v-else/>
                    </template>
                </a-list>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>

import {computed} from "vue";

const current = ref(1);
const bottom = ref(false);
const data = reactive([]);
const scrollbar = ref(true);

const props = withDefaults(
    defineProps<{
        cateList: any,
        data: any,
        currentCate: any,
        config?: Record<string, any>
        maxHeight?: string | number,
        noMore?: boolean,
    }>(),
    {
        cateList: [],
        data: [],
        currentCate:null,
        config: ()=>{ return {} },
        maxHeight: 'calc(100vh - 200px)',
        noMore: false
    }
)
const config = computed(() => {
    return Object.assign( props.config)
})
const emits = defineEmits(['fetchData','selectCate','backCate','itemClick'])
const selectCate = (cate:string) => {
    emits('selectCate',cate)
    // loadList()
}
const back = () => {
    emits('backCate')
}
const handleClick = (item:any) => {
    emits('itemClick',item)
}
const fetchData = () => {
    emits('fetchData')
    console.log('reach bottom!');
}
</script>

<style lang="less" scoped>
@import "../../../../styles/layouts";

.search__wrap {
 padding: 1.4rem 1rem 0.8rem 0rem;
}
.min-h{
  min-height: 300px;
}
</style>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
.types {
  display: flex;
  flex-wrap: wrap;
  padding: 10px 0 0 6px;
  &__item {
    position: relative;
    width: 64px;
    // height: 44px;
    height: 64px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-weight: 600;
    font-size: 13px;
    border-radius: 4px;
    cursor: pointer;
    margin: 8px 4px 0 4px;
    background-size: cover;
    background-repeat: no-repeat;
    text-shadow: 0 1px 0 rgb(0 0 0 / 25%);
    opacity: 0.5;
  }
  &--select {
    opacity: 1;
  }
  &__header {
    user-select: none;
    cursor: pointer;
    margin-bottom: 12px;
    font-size: 13px;
    color: #333333;
    display: flex;
    align-items: center;
    &-more {
      display: flex;
      align-items: center;
      color: #4c535c;
      font-size: 12px;
      font-weight: normal;
    }
    &-back {
      cursor: pointer;
      padding: 0 0 0 0.6rem;
      display: flex;
      align-items: center;
      color: #333;
      font-size: 16px;
      height: 2.9rem;
      position: absolute;
      z-index: 2;
      background: #ffffff;
      width: 320px;
      .icon-right {
        transform: rotate(180deg);
      }
    }
  }
}
.header-back{
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  padding-left: 12px;
}
.list {
  width: 100%;
  :deep(.arco-list-content){
    padding: 10px;
  }
  &__img {
    border-radius: 4px;
  }
  &__img-thumb{
    background: #f8fafc;
    cursor: pointer;
    border-radius: 4px;
  }
  &__img-thumb:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}
.list-wrap {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.8rem;
}

.content {
  &__wrap {
    padding: 1rem;
    height: 100%;
    overflow: auto;
  }
}

:deep(.current-cate-list .arco-list-header){
   padding: 12px;
}

:deep(.content__wrap){
   padding: 0px;
}

:deep(.other-text-wrap){
   padding: 0px;
}

</style>

