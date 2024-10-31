<script setup lang="ts">
import {isDefined, useResizeObserver} from "@vueuse/core";

import BaseAttr from "./attrs/baseAttr.vue";
import LayerAttr from "./attrs/layerAttr.vue";
import TextAttr from "./attrs/textAttr.vue";
import HtmlTextAttr from "./attrs/htmlTextAttr.vue";
import CanvasAttr from './attrs/canvasAttr.vue'
import BoxAttr from './attrs/boxAttr.vue'
import FillAttr from "./attrs/fillAttr.vue";
import StrokeAttr from "./attrs/strokeAttr.vue";
import ShadowAttr from "./attrs/shadowAttr.vue";
import VirtualElementAttr from "./attrs/virtualElementAttr.vue";
import QrcodeAttr from "./attrs/qrcodeAttr.vue";
import BarcodeAttr from "./attrs/barcodeAttr.vue";
import GroupAttr from "./attrs/groupAttr.vue";
import PenAttr from "./attrs/penAttr.vue";
import CornerRadiusAttr from "./attrs/cornerRadiusAttr.vue";
import AlignmentAttr from "./attrs/alignmentAttr.vue";
import ImageAttr from "./attrs/imageAttr.vue";
import SvgAttr from "./attrs/svgAttr.vue";

import {appInstance, useEditor} from "@/views/Editor/app";
import {typeUtil} from "@/views/Editor/utils/utils";
import {useAppStore} from "@/store";

const {editor} = useEditor()
const {activeTool} = storeToRefs(useAppStore())
const splitRef = ref()
const treeHeight = ref(0)

onMounted(() => {
    // 更新tree组件的高度
    useResizeObserver(splitRef.value as HTMLDivElement, (entries) => {
        const [entry] = entries
        const {height} = entry.contentRect
        treeHeight.value = height - 43
    })
})

const componentList = computed(() => {
    const activeObject = editor.activeObject.value
   
    let isDef=isDefined(activeObject)

    let isVir=typeUtil.isVirtualOrBottom(activeObject)

    let isSingle= editor.app.editor.single


    const arr= [
        {
            name: 'CanvasAttr',
            component: CanvasAttr,
            visual: typeUtil.isBottomCanvas(activeObject),
        },
        {
            name: 'VirtualElementAttr',
            component: VirtualElementAttr,
            visual: isVir,
        },
        {
            name: 'BaseAttr',
            component: BaseAttr,
            visual: !isVir,
        },
        {
            name: 'LayerAttr',
            component: LayerAttr,
            visual: isDef && !isVir,
        },
        {
            name: 'ImageAttr',
            component: ImageAttr,
            visual: isDef &&!isVir && isSingle&&editor.activeObjectIsType('Image2','Image')
        },
        {
            name: 'SvgAttr',
            component: SvgAttr,
            visual: isDef &&!isVir && isSingle&&editor.activeObjectIsType('Image2','Image')
        },
        {
            name: 'AlignmentAttr',
            component: AlignmentAttr,
            visual:
            isDef
                &&!isVir
                && (!isSingle||editor.activeObjectIsType('Group'))
        },
        {
            name: 'BoxAttr',
            component: BoxAttr,
            visual: editor.activeObjectIsType('Box'),
        },
        {
            name: 'TextAttr',
            component: TextAttr,
            visual: isDef && editor.activeObjectIsType('Text'),
        },
        {
            name: 'HtmlTextAttr',
            component: HtmlTextAttr,
            visual: isDef && editor.activeObjectIsType('HTMLText'),
        },
        {
            name: 'QrcodeAttr',
            component: QrcodeAttr,
            visual:
            isDef
                &&!isVir
                && editor.activeObjectIsType('QrCode')
        },
        {
            name: 'BarcodeAttr',
            component: BarcodeAttr,
            visual:
            isDef
                &&!isVir
                && editor.activeObjectIsType('BarCode')
        },
        {
            name: 'FillAttr',
            component: FillAttr,
            visual:
            isDef
                &&!isVir
                && !editor.activeObjectIsType('Image2','Image','Pen','HTMLText','QrCode','BarCode','Group')&&isSingle
        },
        {
            name: 'StrokeAttr',
            component: StrokeAttr,
            visual:
            isDef
                &&!isVir
                && !editor.activeObjectIsType('Pen','Group')&&isSingle
        },
        {
            name: 'CornerRadiusAttr',
            component: CornerRadiusAttr,
            visual:
            isDef
                &&!isVir
                && editor.activeObjectIsType('Rect',"Image","Image2")&&isSingle
        },

        {
            name: 'ShadowAttr',
            component: ShadowAttr,
            visual:
            isDef
                &&!isVir
                && !editor.activeObjectIsType('Pen','Group')&&isSingle
        },
        {
            name: 'GroupAttr',
            component: GroupAttr,
            visual:
            isDef
                &&!isVir
                &&typeUtil.isCollection(activeObject)
                && !editor.activeObjectIsType('Pen')&&isSingle
        },
        {
            name: 'PenAttr',
            component: PenAttr,
            visual: activeTool.value === 'pen'&&isSingle,
        },
        // 阴影
        // 模糊
    ]

    return arr
})

const pluginSolts = appInstance.editor.getPluginSlots('rightPanel')
</script>

<template>
    <div
            ref="splitRef"
            class="ovf">
        <div>
            <template v-for="(com, index) in componentList" :key="com.name">
                <template v-if="com.visual">
                    <a-divider v-if="index !== 0" :margin="0" />
                    <component :is="com.component" />
                </template>
            </template>
            <template v-for="(com, index) in pluginSolts" :key="index">
                <a-divider v-if="index !== com.length - 1" :margin="0" />
                <component :is="com" />
            </template>
        </div>
    </div>
</template>

<style scoped lang="less">
.ovf{
    // height: calc(100vh - 95px);
    overflow-y: auto;
    overflow-x: hidden;
    // height: 100%;
}
</style>
