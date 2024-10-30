<!--图片的工具-->
<template >
     <Panel :hiddenAdd="true" :hiddenTitle="true" style="margin-top:4px">
        <a-row :gutter="8"> 
            <a-col :span="24" >
               <a-button  size="large" style="width: 100%;" >替换图片</a-button>
            </a-col> 
        </a-row>
      
     </Panel>
     <a-divider  style="margin: 4px;"/>
    <Panel :hiddenAdd="true" title="工具"  :hiddenTitle="false">
        
        <a-row :gutter="14"> 
            <a-col :span="6" @click="openCropperImg" >
               <a-button size="large"  ref="action_btn" style="width: 100%;" :style="{height:height}" class="action__icon">
                   <template #default>
                    <i class="iconfont  icon-crop-full" ></i>
                   </template>
                </a-button>
                <p class="action__text">裁剪</p>
            </a-col> 
            <a-col :span="6" >
               <a-button size="large" style="width: 100%;" :style="{height:height}"  class="action__icon">
                   <template #default>
                    <i class="iconfont icon-koutu" ></i>
                   </template>
                </a-button>
                <p class="action__text">AI抠图</p>
            </a-col> 


            <a-col :span="6" >
               <a-button size="large" style="width: 100%;" :style="{height:height}"  class="action__icon">
                   <template #default>
                    <i class="iconfont  icon-koutu1" ></i>
                   </template>
                </a-button>
                <p class="action__text">AI背景</p>
            </a-col> 

            <a-col :span="6" >
               <a-button size="large" style="width: 100%;" :style="{height:height}"  class="action__icon">
                   <template #default>
                    <i class="iconfont  icon-shengchenglunkuo" ></i>
                   </template>
                </a-button>
                <p class="action__text">线稿</p>
            </a-col> 

            <a-col :span="6" >
               <a-button size="large" style="width: 100%;" :style="{height:height}"  class="action__icon">
                   <template #default>
                    <i class="iconfont icon-tiaose" ></i>
                   </template>
                </a-button>
                <p class="action__text">调色</p>
            </a-col> 
           
            <a-col :span="6" >
               <a-button size="large" style="width: 100%;" :style="{height:height}"  class="action__icon">
                   <template #default>
                    <i class="iconfont  icon-lvjingmoshi" ></i>
                   </template>
                </a-button>
                <p class="action__text">滤镜</p>
            </a-col> 
        </a-row>
        
    </Panel>
</template>
<script lang="ts" setup>
   import { ref,onActivated,watch,computed,onMounted } from 'vue';

    import Panel from './panel.vue'

    import { appInstance } from '@/views/Editor/app'

    import {useEditor} from '@/views/Editor/app'

    import { IMLeaferCanvas } from '@/views/Editor/core/canvas/mLeaferCanvas'

    import CropperImg from '@/components/cropperImg'

    import { Fn, tryOnScopeDispose } from '@vueuse/core'

    const btn = useTemplateRef('action_btn')

    const height=ref("40px")

   const {editor} = useEditor()

   onMounted(()=>height.value=(btn.value.$el.offsetWidth)+"px")


   let closeFn: Fn | undefined


    const closeCropperImg = () => {
         closeFn && closeFn()
    }


   const openCropperImg = () => {
    const fillModel=editor.activeObject.value.fill
   
    appInstance.editor.service.invokeFunction((accessor) => {
      const canvas = accessor.get(IMLeaferCanvas)
      if (!isDefined(canvas.activeObject)) return
        closeFn = CropperImg.open({
            sizeData:{},
            cropData:{},
            imageSrc:fillModel.url,
            aspectRatio:NaN,
            viewMode:1,
            autoCropArea:0.8,
            onClose(){
                closeCropperImg()
            },
            onChange(obj:any){

                //Object.assign(fillModel,{url:obj.imageSrc})
                console.info(obj)
                console.info(fillModel)
                let fillObj= JSON.parse(JSON.stringify(fillModel))
                fillObj.url=obj.imgsrc.url
                editor.activeObject.value.fill=fillObj
            }
        })
    })
  }
</script>
<style scoped lang="less">
    .large-action{
        width: 100%;
        border-radius: 4px;
        margin-bottom: 12px;
        height:40px;
        line-height: 40px;
    }
    .action__icon{
        width: 100%;
        border-radius: 4px;
        .iconfont{
            font-size: 20px;
        }
    }

    .action__text{
        text-align: center;
        color: #4c535c;
        padding: 6px;
        font-size: 12px;
    }
    
    :deep(.arco-col-6){
        margin-bottom: 16px
    }
</style>