<template>
   
    <!-- <a-spin :loading="state.uploading"> -->

    <a-row class="el-row"   style="overflow: hidden;">
       <a-col class="el-col"  :span="18">

           <div v-show="state.rawImage" :loading="state.createing"  class="c-compare scan-effect" 
         :style="{ width: state.offsetWidth ? state.offsetWidth + 'px' : '100%','--value':state.percent+'%' }">
       

           <canvas ref="outSketch"  class="c-compare__left"  alt="result"></canvas>
           <img ref="sketch" @load.once="onImageLoad" class="c-compare__right" :src="state.rawImage" alt="B/W" />

           <input type="range" v-show="state.rawImage" class="c-rng c-compare__range" min="0" max="100"  v-model="state.percent"
             />
           <div class="scroller scroller-top" v-show="state.rawImage"  :style="{left: state.percent+'%'}">
               <svg class="scroller__thumb" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                   <polygon points="0 50 37 68 37 32 0 50" style="fill:#FFAB91"></polygon>
                   <polygon points="100 50 64 32 64 68 100 50" style="fill:#FFAB91"></polygon>
               </svg>
           </div> 
       </div> 

     </a-col>
       <a-col class="el-col el-col-form"  :span="6">
           
           <a-form :model="style"   layout="vertical">
          
               <a-form-item>
                   <a-radio-group v-model="style.convoluteName">
                       <a-radio v-for="(value,key,index) in Convolutes"  :value="key" >{{label[key]}}</a-radio>
                   </a-radio-group>
               </a-form-item>
               <a-form-item>
                   <a-space>
                       <a-switch
                          v-model="style.denoise" @change="_louvre(50)"
                       />
                       <span>降噪</span>
                    <a-switch
                        v-model="style.kuma"
                         @change="_louvre(50)"
                    /> 
                    <span>Kiss</span>
                </a-space>
         
                   <!-- <ui-switch v-model="state.denoise" @input="_louvre(50)">降噪</ui-switch>
                   <ui-switch v-model="state.kuma" @input="_louvre(50)">Kiss</ui-switch> -->
                   <!-- <ui-switch v-model="style.shade" :disabled="!style.kuma" @input="_louvre(50)">调子</ui-switch> -->
                   <!-- <ui-switch v-model="state.watermark" @input="_louvre(50)">水印</ui-switch>
                   <ui-switch v-model="state.hajimei" :disabled="!style.watermark" @input="_louvre(50)">初回</ui-switch> -->
               </a-form-item>
              
               <a-form-item :label="'线迹轻重'">
                   <a-slider v-model="style.darkCut" :min="20" :max="200" :step="1"/>
               </a-form-item>

               <a-form-item :label="'线调子数量'">
                   <a-slider v-model="style.shadeLimit" :min="20" :max="200" :step="1"/>
               </a-form-item>
          </a-form>
       </a-col>
    </a-row>
  

     <div ref="arcomodalfooter"  class="arco-modal-footer">
           <a-button @click="props.onClose">取消 </a-button>
           <a-button type="primary"  :loading="state.uploading" @click="createBgImageDone">确认</a-button>
     </div>

    <!-- </a-spin>  -->
 </template>



 <script setup  lang="ts">

   import {reactive,ref,nextTick,defineProps,computed,onMounted,onUnmounted ,watch,getCurrentInstance } from "vue"
   import { SketchProps } from "./interface"
   import { util } from "./method"
   import api from '@/api/editor'
   import { nanoid } from "nanoid"
   import { Message } from '@arco-design/web-vue'
   import {useBaseStore} from '@/store'
   import { storeToRefs } from 'pinia'

    const baseStore=useBaseStore()
    const baseStoreSet = storeToRefs(baseStore)

   const props = withDefaults(defineProps<SketchProps>(), {
       imageSrc: "",
       onClose:()=>{}
  })

   const emit = defineEmits(['updateImageSrc'])

   let sketch=ref<HTMLImageElement>()

   let outSketch=ref<HTMLCanvasElement>()

   export type TImageCreateBgState = {
       show: boolean;
       rawImage: string;
       sketchImage: string;
       offsetWidth: number;
       percent: number;
       progress: number;
       progressText: string;
       toolModel: boolean;
       loading: boolean;
       createing:boolean;
       T:number;
       uploading:boolean
  }

   let label={
    jixi:"极细",
    jingxi: "精细",
    yiban: "一般",
    shaochu: "稍粗",
    chaochu: "超粗",
    jichu: "极粗",
    fudiao: "浮雕",
    xiaogao: "线稿",
   }
   const creatConvoluteAverage = (w)=>new Array(w*w).fill(1/(w*w))
   const Convolutes = {
   jixi:   creatConvoluteAverage(3),
   jingxi:  creatConvoluteAverage(5),
   yiban:  creatConvoluteAverage(7),
   shaochu:  creatConvoluteAverage(9),
   chaochu:  creatConvoluteAverage(11),
   jichu:  creatConvoluteAverage(13),
   fudiao: [
       1, 1, 1,
       1, 1, -1,
       -1, -1, -1
   ],
   xiaogao:  null,
}

   const style = ref({
       zoom:1,
       light:0,
       shadeLimit: 108,
       shadeLight: 80,
       shade: false,
       kuma: false,
       hajimei: false,
       watermark: false,
       convoluteName: 'yiban',
       convolute1Diff: true,
       convoluteName2: null,
       Convolutes,
       lightCut: 128,
       darkCut: 118,
       denoise: true,
   })

   const run = () => {
       if(state.percent>=100){
          return false
       }
       state.percent += 1
       state.percent < 100 ? requestAnimationFrame(run) : ''
   }

   const louvre=async ()=>{
       state.createing = true;
       
       await nextTick(async ()=>{
           await util.louvre({
               img:sketch.value,
               outputCanvas:outSketch.value,
               config:{
                   ...style.value,
                   Convolutes
               }
           })
           state.createing = false;
           run()
       })
   }

   const maxPreviewWidth = Math.min(800,document.body.offsetWidth);
   let previewWidth = maxPreviewWidth;
   let previewHeight = Math.round(previewWidth * 0.593);

   const defaultImageURL = ref("")
   const convolutes = Object.keys(Convolutes);
   const data = ref({
       src: defaultImageURL,
       defaultImageURL,
       style:style.value,
       runing: true,
       convolutes,
       diff: false,
       output: '',
       downloadFilename: '[One-Last-Image].jpg',
       previewWidth,
       previewHeight,
       loading: true,
       bevelPosition:20,
 })


   const setImageAndDraw=async ()=>{
       
       const img  = sketch.value;
       const { naturalWidth, naturalHeight } = img;
       
       const previewWidth = Math.min(maxPreviewWidth, naturalWidth);
       const previewHeight = Math.floor(previewWidth / naturalWidth * naturalHeight);

       data.value.previewWidth = previewWidth;
       data.value.previewHeight = previewHeight;


       await louvre();
   }

   //https://lab.magiconch.com/one-last-image/
   const init= ()=>{
    
       state.createing = false;
       util.louvreInit( ()=>{
           if(!sketch.value){
              return
           }
           sketch.value.onload = setImageAndDraw;
           if(sketch.value.complete) sketch.value.onload();
       });
  }

   const _louvre=(ms=300)=>{
       state.createing = true
       clearTimeout(state.T)
       state.T = setTimeout(louvre,ms) as any
   }


   const sizeStyle=computed(()=>{
       return {
               width: `${data.value.previewWidth}px`,
               height: `${data.value.previewHeight}px`,
           }
   })

   const isDefaultImageURL=computed(()=>{
       return state.rawImage !== defaultImageURL.value
   })

   const creatConvoluteCenterHigh = (w,centerV)=>{
   const arr = [];
   const c = Math.floor((w*w)/2);

   for(let x = 0; x < w; x++){
       for(let y = 0; y < w; y++){
           let i = x * w + y;
           arr[i] = -1;

           if(i===c){
               arr[i] = centerV;
           }
       }
   }
   return arr;
}



  
  const state = reactive<TImageCreateBgState>({
       show: false,
       rawImage: "",//new URL("@/assets/koutu.png",import.meta.url).href,
       sketchImage:"",//new URL("@/assets/createbg.png",import.meta.url).href,
       offsetWidth: 0,
       percent: 100,
       progress: 0,
       progressText: '',
       toolModel: true,
       loading: false,
       createing:false,
       T:0,
       uploading:false
  })


   function  onImageLoad(){

       state.offsetWidth = (sketch.value as HTMLElement).offsetWidth
   }


   watch(()=>style.value,()=>{

       _louvre()

   },{deep:true})

   onMounted(()=>{
       state.sketchImage=''
       state.percent=0
       state.createing=false
       state.uploading=false
       state.rawImage=props.imageSrc
       init()
   })

   onUnmounted(()=>{
       state.rawImage=""
       state.sketchImage=''
       state.percent=0
       state.createing=false
       state.uploading=false
   })

   const createBgImageDone = () => {


       const  canvas  = outSketch.value

       if(!canvas){
            return
       }
       //state.sketchImage = canvas.toBlob('image/jpeg',1);
       state.uploading=true

       baseStoreSet.isloading.value = true
       baseStoreSet.isloading.tip = "请等待"

       canvas.toBlob(async function(blob:any) {

           const formData = new FormData()

           formData.append('file',blob,new Date().getTime()+"_"+nanoid(6)+".png")

           let srcObj= await api.upload.uploadFile(formData).catch(()=>{
               Message.error("upload Image Error")
               state.uploading=false
           })
           if(!srcObj){
               state.uploading=false
               return false
           }
           emit('updateImageSrc', {
               imageData:{
                url:srcObj.url
               }
           });
           state.rawImage=""
           state.sketchImage=''
           state.uploading=false

           props.onClose()

           baseStoreSet.isloading.value = false
           baseStoreSet.isloading.tip = "请等待"

       }, 'image/png', 1);
   }
 </script>

<style scoped  lang="less">
   .content {
       position: relative;
       display: flex;
       justify-content: center;
       flex-direction: column;
   }

   .el-col-form{
       padding: 16px;
       box-shadow: -1px -4px 0.4rem 0px #0000004d;
   }

   .preview-box {
       position: relative;
       cursor: pointer;
       --cover-width: 480px;
   }
   .preview-box img {
       position: absolute;
       left: 0;
       right: 0;
       opacity: 0;
       pointer-events: none;
       transition: opacity .1s ease;
  }

  .preview-box img, .preview-box canvas {
       display: block;
       max-width: 100%;
       margin: 0 auto;
   }

   .scan-effect {
       position: relative;
       overflow: hidden;
       background-image: linear-gradient(45deg, rgba(0, 0, 0, 0.2) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.2) 75%), linear-gradient(45deg, rgba(0, 0, 0, 0.2) 25%, transparent 25%, transparent 75%, rgba(0, 0, 0, 0.2) 75%);
       background-position: 0 0, 14px 14px;
       background-size: 28px 28px;
       img {
           height: 100%;
           object-fit: contain;
           position: absolute;
       }
  }

:deep(.el-space__item:last-of-type .el-form-item){
   margin-bottom: 0px;
}
.c-compare {
 --h: 11;
 --m: 1rem 0;
 --w: 16;
 --thumb-bgc: #FFAB91;
 --thumb-bgc-focus: hsla(0, 70%, 70%, 0.7);
 --thumb-w: 0.3rem;

 margin: var(--m);
 position: relative;
}
.c-compare::after {
 content: "";
 display: block;
 padding-bottom: calc((var(--h) / var(--w)) * 100%);
}
.c-compare__left,
.c-compare__right {
 height: 100%;
 object-fit: contain;
 position: absolute;
 width: 100%;
}
.c-compare__left {
 clip-path: polygon(0% 0%, var(--value) 0%, var(--value) 100%, 0% 100%);
}
.c-compare__right {
 clip-path: polygon(100% 0%, var(--value) 0%, var(--value) 100%, 100% 100%);
}
.c-compare__range {
 background-color: transparent;
 box-sizing: border-box;
 font-family: inherit;
 height: 100%;
 margin: 0;
 outline: none;
 position: absolute;
 top: 0;
 width: 100%;
}
.c-compare__range::-moz-range-thumb {
 background-color: var(--thumb-bgc);
 cursor: ew-resize;
 height: 100%;  
 width: var(--thumb-w);
}
.c-compare__range::-webkit-slider-thumb {
 background-color: var(--thumb-bgc);
 cursor: ew-resize;
 height: 100%;  
 width: var(--thumb-w);
}
.c-compare__range:focus::-webkit-slider-thumb {
 background-color: var(--thumb-bgc-focus);
 box-shadow: 0 0 0 3px var(--thumb-bgc);
}
.c-compare__range:focus::-moz-range-thumb {
 background-color: var(--thumb-bgc-focus);
 box-shadow: 0 0 0 3px var(--thumb-bgc);
}
.c-compare__range::-moz-range-track {
 background: transparent;
 background-size: 100%;
 box-sizing: border-box;
}
.c-compare__range::-webkit-slider-runnable-track {
 background: transparent;
 background-size: 100%;
 box-sizing: border-box;
 height: 100%;
}
.c-compare__range,
.c-compare__range::-webkit-slider-runnable-track,
.c-compare__range::-webkit-slider-thumb {
 -webkit-appearance: none;
 appearance: none;
}
.scroller {
   width: 50px;
   height: 50px;
   position: absolute;
   left: 100px;
   top: 50%;
   transform: translateY(-50%) translateX(-25px);
   border-radius: 50%;
   background-color: #fff;
   opacity: 0.9;
   transition: opacity 0.12s ease-in-out;
   pointer-events: auto;
   cursor: pointer;
   box-shadow: 3.5px 0px 7px rgba(100, 100, 100, 0.2);
   pointer-events: none;
}

.scroller-top>.scroller__thumb {
   border: 5px solid #FFAB91;
}

.scroller__thumb {
   width: 100%;
   height: 100%;
   border-radius: 50%;
   padding: 7px;
}
</style>