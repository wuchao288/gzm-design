<template>

<Panel :hiddenAdd="true"
            title="对齐" 
    >
    <a-row :gutter="8"> 
    <a-col :span="24" >
              <a-button  style="width: 100%;border-radius: 4px;margin-bottom: 12px;" size="large" :disabled="!isGroupBtnEnabled||(isUnGroupBtnEnabled)" @click="handleGroupBtnClick" class="gda-btn-action">创建分组</a-button>
                </a-col> 
                 <a-col :span="24" >
                   <a-button style="width: 100%;border-radius: 4px;"  size="large" :disabled="!isUnGroupBtnEnabled" @click="handleUnGroupBtnClick" class="gda-btn-action">解除分组</a-button>
                </a-col>
                </a-row> 
                <a-divider v-if="!isUnGroupBtnEnabled"  />


               <a-card  v-if="!isUnGroupBtnEnabled" style="width: 100%;" shadow="never" :body-class="'gda-btn-action'"  :body-style="{padding:'10px',borderRadius: '4px'}">
           
           <a-row>
               <a-col :span="4" >
               <a-tooltip
                   class="box-item"
                   effect="dark"
                   :content="'左边对齐'"
                   placement="top"
                   >
                   <a-link  :disabled="!isGroupBtnEnabled"  :underline="false" @click="setAlgin('left')" >
                       <i class="iconfont icon8 icon-duiqi-zuoduiqi" ></i>
                       </a-link>
                </a-tooltip>

             </a-col>
             <a-col :span="4">
               <a-tooltip
                   class="box-item"
                   effect="dark"
                   :content="'水平居中'"
                   placement="top"
                   >
                   <a-link   :disabled="!isGroupBtnEnabled"  :underline="false" @click="setAlgin('center')" >  
                       <i class="iconfont icon8 icon-duiqi-juzhongduiqi"></i>
                   </a-link>
               </a-tooltip>
           </a-col>
             <a-col :span="4">
               <a-tooltip
                   class="box-item"
                   effect="dark"
                   :content="'右对齐'"
                   placement="top"
                   >
               <a-link  :disabled="!isGroupBtnEnabled"  :underline="false" @click="setAlgin('right')" >  
                   <i class="iconfont icon8 icon-duiqi-youduiqi"></i>
               </a-link>
           </a-tooltip>

       </a-col>
             <a-col :span="4">
               <a-tooltip
                   class="box-item"
                   effect="dark"
                   :content="'上对齐'"
                   placement="top"
                   >
                   <a-link  :disabled="!isGroupBtnEnabled"   :underline="false" @click="setAlgin('top')"  >
                       <i class="iconfont icon8 icon-duiqi-shangduiqi" ></i>
                       </a-link>
                   </a-tooltip>
               </a-col>
                   <a-col :span="4">
               <a-tooltip
                   class="box-item"
                   effect="dark"
                   :content="'垂直居中'"
                   placement="top"
                   >
               <a-link  :disabled="!isGroupBtnEnabled"  :underline="false" @click="setAlgin('vcenter')"   >  
                   <i class="iconfont icon8 icon-duiqi-chuizhiduiqi"></i>
               </a-link>
           </a-tooltip>
       </a-col>
             <a-col :span="4">
               <a-tooltip
                   class="box-item"
                   effect="dark"
                   :content="'下对齐'"
                   placement="top"
                   >
                   <a-link  :disabled="!isGroupBtnEnabled"   :underline="false" @click="setAlgin('bottom')"   >  
                       <i class="iconfont icon8 icon-duiqi-xiaduiqi"></i>
                   </a-link>
               </a-tooltip> </a-col>
           </a-row>
           </a-card>

           <a-row v-if="!isUnGroupBtnEnabled"  :gutter="8" style="margin-top: 12px;"> 
                <a-col :span="12" >
                        <a-button style="width: 100%;border-radius: 4px;margin-bottom: 12px;" size="large"
                         @click="setAlgin('hd')" class="gda-btn-action">水平分布</a-button>
                            </a-col> 
                            <a-col :span="12" >
                            <a-button style="width: 100%;border-radius: 4px;margin-bottom: 12px;" 
                             size="large"   @click="setAlgin('vd')"  class="gda-btn-action">垂直分布</a-button>
                            </a-col>
         </a-row> 
</Panel>
    
</template>
<script lang="ts" setup>

import { ref,onActivated,watch,computed } from 'vue';

import { keybindMap } from '@/views/Editor/utils/constants';


import Panel from './panel.vue'

import {useEditor} from '@/views/Editor/app'

const { canvas, keybinding,undoRedo } = useEditor();

const isGroupBtnEnabled  = computed(() => {
    return !canvas.activeObjectIsType('Frame') && canvas.getActiveObjects().length > 1;
})

const isUnGroupBtnEnabled = computed(() => {
    return canvas.activeObjectIsType('Group')
})

const isAlign = computed(() => {
    
    return canvas.getActiveObjects().length >2;
})


const handleGroupBtnClick = () => {
    
    if (isGroupBtnEnabled) {
        
        keybinding.trigger(keybindMap.group);
    }
};
const handleUnGroupBtnClick = () => {
    
    if (isUnGroupBtnEnabled) {
        keybinding.trigger(keybindMap.ungroup);
    }
};


const setAlgin=(placement:any)=>{

    switch (placement) {
       case "left":
          
           //let l= canvasApp.editor.list.map(m=>m.x).reduce((a,b)=>Math.min(a,b))

           let l=canvas.app.editor.element.x
           canvas.app.editor.list.forEach((m)=>{
               m.x=l
           })
           break;
       case "right":
          //let r= canvasApp.editor.list.map(m=>m.x+m.width).reduce((a,b)=>Math.max(a,b))
           let r=canvas.app.editor.element.x+canvas.app.editor.element.width
           canvas.app.editor.list.forEach((m)=>{
               m.x=r-m.width
           })
           break;  
       case "center":

          //let l1= canvasApp.editor.list.map(m=>m.x).reduce((a,b)=>Math.min(a,b))
          //let r1= canvasApp.editor.list.map(m=>m.x+m.width).reduce((a,b)=>Math.max(a,b))

          let l1=canvas.app.editor.element.x
          let r1=canvas.app.editor.element.x+canvas.app.editor.element.width

          let center=(r1-l1)/2+l1
          canvas.app.editor.list.forEach((m)=>{
               m.x=center-(m.width/2)
           })
           break;  

     case "top":

           let t=canvas.app.editor.element.y

           canvas.app.editor.list.forEach((m)=>{
               m.y=t
           })
           break;
       case "bottom":

           let b=canvas.app.editor.element.y+canvas.app.editor.element.height

           canvas.app.editor.list.forEach((m)=>{
               m.y=b-m.height
           })
           break;  
       case "vcenter":

          let t1=canvas.app.editor.element.y
          let b1=canvas.app.editor.element.y+canvas.app.editor.element.height


          let vcenter=(b1-t1)/2+t1
          canvas.app.editor.list.forEach((m)=>{
               m.y=vcenter-(m.height/2)
           })
           break;  
      case "hd":
           if(canvas.app.editor.list.length>=3){

               let minX=canvas.app.editor.element.x;
               let maxX=canvas.app.editor.element.x+canvas.app.editor.element.width;

               let eleWidth=0

               canvas.app.editor.list.forEach((m,index,list)=>{
                   eleWidth+=m.width
               })

               let space=(maxX-minX-eleWidth)/(canvas.app.editor.list.length-1)

               let listRect=canvas.app.editor.list;

               listRect.sort((a, b) => a.x+a.width - (b.x+b.width));

               let last=listRect[listRect.length-1]

               listRect.sort((a, b) => a.x - b.x);

               let first=listRect[0]

               let currentLeft=first.x

               listRect.forEach((m,index,list)=>{
                   if(currentLeft>last.x+last.width){
                       currentLeft=first.x
                   }
                   m.x=currentLeft
                   currentLeft+=m.width+space
               })
           }
         break;  
         case "vd":
           if(canvas.app.editor.list.length>=3){
               
               let minY=canvas.app.editor.element.y;
               let maxY=canvas.app.editor.element.y+canvas.app.editor.element.height;

               let eleHeight=0

               canvas.app.editor.list.forEach((m,index,list)=>{
                   eleHeight+=m.height
               })

               let space=(maxY-minY-eleHeight)/(canvas.app.editor.list.length-1)

               let listRect=canvas.app.editor.list;

               listRect.sort((a, b) => a.y+a.height - (b.y+b.height));

               let last=listRect[listRect.length-1]

               listRect.sort((a, b) => a.y - b.y);

               let first=listRect[0]

               let currentTop=first.y

               listRect.forEach((m,index,list)=>{
                   if(currentTop>last.y+last.height){
                       currentTop=first.y
                   }
                   m.y=currentTop
                   currentTop+=m.height+space
               })
           }
         break;  
    }
    canvas.app.editor.updateEditBox()

    undoRedo.saveState()
}


</script>


<style scoped>
  .btn-action-group-wrap{
    width: 100%;
  }
  :deep(.arco-link){
      color: #333;
  }
</style>