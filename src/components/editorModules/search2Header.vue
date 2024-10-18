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
           <a-input type="text" class="arco-radius" size="large" :button-text="''"
            :placeholder="props.searchPlaceholder" 
           @change="onSearch"
           >
          
           <template #prefix>
            <icon-search />
          </template>

          </a-input>
      </a-space>
    </div>
</template>
<script lang="ts" setup >
import {reactive, toRefs, watch} from 'vue'

  const searchValue = defineModel({ type: String, default: "" })

  const  props=defineProps(['searchPlaceholder'])

  const  emit=defineEmits(['search'])

  function onSearch(value: string, ev: Event) {
       console.info("onSearch");
      emit('search', value)
  }


</script>

<style lang="less" scoped>
:deep(.el-input__suffix) {
  padding-top: 9px;
}

.search__wrap {
  padding: 16px 16px 16px 16px;
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
