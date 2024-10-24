<!--
 * @Author: ShawnPhang
 * @Date: 2022-01-27 11:05:48
 * @Description:
 * @LastEditors: ShawnPhang <site: book.palxp.com>
 * @LastEditTime: 2023-06-29 16:50:02
-->
<template>
    <div class="search__wrap">
      <a-space  direction="vertical">
           <a-input class="arco-radius" size="large" :button-text="''"
           :placeholder="props.searchPlaceholder" 
           @change="onSearch"
           >
          
           <template #prefix>
            <icon-search />
          </template>

          </a-input>
           
      <a-space direction="horizontal">
           <a-button class="arco-radius" 
           @click="toggleNew" 
           :type="state.isNewList?'primary':'secondary'"
            style="margin-right: 10px;">
              最新上线
           </a-button>
      
           <a-dropdown :disabled="state.popupVisible"  :popup-max-height="false">
              
              <a-button class="arco-radius" @click.stop="clickCate" :type="state.isNewList==false?'primary':'secondary'">
                <span class="current-cate">{{state.currentCate}}</span>
                <icon-down/>
              </a-button>
              
              <template #content>
                  <a-doption style="min-width: 80px;;" v-for="(item,index) in state.cateList" :key="index"
                              @click.stop="state.isNewList=false;action('changeCate', item, index)">
                              <span :class="['cate__text', { 'cate--select': + state.currentIndex === index }]">{{
                              item.label
                          }}</span>
                  </a-doption>
              </template>
          </a-dropdown>
        </a-space>
      </a-space>
    </div>
</template>
<script lang="ts" setup >
import {reactive, toRefs, watch} from 'vue'



  const  props=defineProps(['cateList', 'modelValue','searchPlaceholder','currentCate'])
  const  emit=defineEmits(['update:modelValue', 'search', 'changeCate'])

  const state: any = reactive({
      searchValue: '',
      currentIndex: -1,
      currentCate:props.currentCate,
      isNewList:true,
      popupVisible:false
  })

  if (props.cateList) {
      state.cateList = props.cateList
      state.currentCate=state.cateList.length>0?state.cateList[0].label:"分类"
  }

  watch(
      () => state.searchValue,
      () => {
        emit('update:modelValue', state.searchValue)
      },
  )


  // watch(
  //     () =>[state.currentCate,state.isNewList],
  //     () => {
  //       state.searchPlaceholder=state.currentCate&&state.isNewList==false?`在${state.currentCate}中搜索模板`:'搜索模板'
  //     },
  // )

  const  clickCate=(event:MouseEvent)=>{
  
      if(state.currentIndex>-1&&state.isNewList==true){

        state.popupVisible=true

         
         emit("changeCate",state.cateList[state.currentIndex],state.currentIndex)
         
         requestAnimationFrame(function(){
             state.popupVisible=false
         })

      }else{

        state.popupVisible=false

      }

      state.isNewList=false
  }

  const toggleNew=()=>{
      state.isNewList=true
      state.popupVisible=true
      emit("changeCate",{label:'最新上架',value:'order-desc'},-1)
  }

  function action(fn: 'update:modelValue'|'search'|'changeCate', item: any, currentIndex: number | string) {
      state.currentIndex = currentIndex
      state.currentCate=state.cateList.length>0?state.cateList[currentIndex].label:"分类"
      emit(fn, item, currentIndex)
  }

  function onSearch(value: string, ev: Event) {
      emit('search', value, ev)
  }

  defineExpose({
      ...toRefs(state),
      action,
      onSearch,
  })

</script>

<style lang="less" scoped>
:deep(.el-input__suffix) {
  padding-top: 9px;
}

.search__wrap {
  padding: 16px 16px 0rem 16px;
  display: flex;
  cursor: pointer;
  justify-content: center;
  div{
     flex: 1;
  }
}

.search {
  &__type {
    border: 1px solid #e8eaec;
    color: #666666;
    width: 44px;
    margin: 0 0.6rem 0 1rem;
    border-radius: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    .iconfont {
      font-size: 20px;
    }
  }

  &__type:hover {
    color: rgb(var(--primary-6));
  }
}

.cate {
  &__text {
    font-weight: bold;
  }

  &--select {
    color: rgb(var(--primary-6));
  }
}

.current-cate{
  margin-right: 10px;
  display: inline-block;
}
</style>
