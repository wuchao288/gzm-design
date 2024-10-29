<script setup lang="ts">
import Panel from './panel.vue'
import {useActiveObjectModel} from '@/views/Editor/hooks/useActiveObjectModel'
import {useEditor} from '@/views/Editor/app'
import SwipeNumber from '@/components/swipeNumber'
import type {SelectProps} from '@arco-design/web-vue/es/select'
import {useColor} from '@/views/Editor/hooks/useActiveObjectColor'
import {watch} from "vue";
import {parseCornerRadius} from "@/views/Editor/utils/jsonParse";


const {canvas} = useEditor()

const cornerRadius = useActiveObjectModel('cornerRadius',[0,0,0,0],parseCornerRadius)

const cornerRadiusArray = ref([])


watchEffect(() => {
    if (cornerRadius.value.modelValue) {

        cornerRadiusArray.value = parseCornerRadius(cornerRadius.value.modelValue)

    } else {
        cornerRadiusArray.value = []
    }
})

</script>

<template>
    <Panel :hiddenAdd="true"
            title="圆角" 
    >
        <a-space direction="vertical" style="padding: 8px;" >
            <a-row  >
                <a-col :span="12">
                    <a-slider :max="200" :min="1" :style="{ width: '100px' }" v-bind="cornerRadius"  />
                </a-col>
                <a-col :span="12">
                    <SwipeNumber size="small" :max="200" :min="1"  v-bind="cornerRadius"  :hide-button="false"/>
                </a-col>
            </a-row>
        </a-space>
    </Panel>
</template>

<style scoped lang="less"></style>
