<script setup lang="ts">
import Panel from './panel.vue'
import {useActiveObjectModel} from '@/views/Editor/hooks/useActiveObjectModel'
import {useEditor} from '@/views/Editor/app'
import SwipeNumber from '@/components/swipeNumber'
import type {SelectProps} from '@arco-design/web-vue/es/select'
import {useColor} from '@/views/Editor/hooks/useActiveObjectColor'
import {watch} from "vue";
import {parseStrokeOrFill} from "@/views/Editor/utils/jsonParse";

const {canvas} = useEditor()

const stroke = useActiveObjectModel('stroke')
const strokeWidth = useActiveObjectModel('strokeWidth')
const strokeAlign = useActiveObjectModel<'strokeAlign', SelectProps['modelValue']>('strokeAlign')
const strokeJoin = useActiveObjectModel<'strokeJoin', SelectProps['modelValue']>('strokeJoin')
const strokeCap = useActiveObjectModel<'strokeCap', SelectProps['modelValue']>('strokeCap')

const {formatValue, colorBlock, changeColor, closeColorPicker, openColorPicker, readonly} =
    useColor(
        computed(() => stroke.value.modelValue),
        {
            attr: 'stroke',
            onChange() {
                stroke.value.onChange(strokeArray.value)
            },
        },
    )

watch(canvas.activeObject, () => closeColorPicker())

const options = reactive([
    {
        value: 'inside',
        label: '内部',
    },
    {
        value: 'center',
        label: '居中',
    },
    {
        value: 'outside',
        label: '外部',
    },
])

const strokeJoinOptions = reactive([
    {
        value: 'miter',
        label: '直角',
    },
    {
        value: 'bevel',
        label: '平角',
    },
    {
        value: 'round',
        label: '圆角',
    },
])
const strokeCapOptions = reactive([
    {
        value: 'none',
        label: '无',
    },
    {
        value: 'round',
        label: '圆形',
    },
    {
        value: 'square',
        label: '方形',
    },
])

const strokeArray = ref([])
watchEffect(() => {
    if (stroke.value.modelValue) {
        strokeArray.value = parseStrokeOrFill(stroke.value.modelValue)
        // strokeArray.value = <any>stroke.value.modelValue
    } else {
        strokeArray.value = []
    }
})

const refreshStroke = () => {
    stroke.value.onChange(strokeArray.value.length <= 0 ? [] : strokeArray.value)
}

const addStroke = () => {
    strokeArray.value.push({
        type: 'solid',
        color: 'rgba(151,151,151,1)',
    })
    refreshStroke()
}
const removeStroke = (index) => {
    strokeArray.value.splice(index, 1)
    refreshStroke()
}

</script>

<template>
    <Panel
            title="画笔设置"
            hidden-add
    >
        <a-row :gutter="[4, 4]" align="center">
            <a-col :span="13">
                <SwipeNumber size="small" v-model="canvas.ref.penDrawConfig.config.strokeWidth" :step="1" :min="1" style="padding: 0 6px" label-class="text-left" label-width="60px">
                    <template #label>
                        <div>画笔粗细</div>
                    </template>
                </SwipeNumber>
            </a-col>
            <a-col :span="11">
                <a-radio-group size="small" type="button" v-model="canvas.ref.penDrawConfig.config.strokeWidth">
                    <a-radio :value="2">2</a-radio>
                    <a-radio :value="5">5</a-radio>
                    <a-radio :value="10">10</a-radio>
                </a-radio-group>
            </a-col>
            <a-col :span="17">
                <a-color-picker v-model="canvas.ref.penDrawConfig.config.stroke" size="mini" >
                    <a-input
                            size="mini"
                            v-model="canvas.ref.penDrawConfig.config.stroke"
                    >
                        <template #prefix>
                            画笔颜色<div class="w18px h18px ml5px" :style="{backgroundColor: canvas.ref.penDrawConfig.config.stroke}"></div>
                        </template>
                    </a-input>
                </a-color-picker>
            </a-col>
        </a-row>
    </Panel>
</template>

<style scoped lang="less"></style>
