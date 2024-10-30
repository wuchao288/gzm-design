<template>
   <a-spin ref="arcomodalwrap" :style="{height:arcomodalwrapH+'px'}"  class="arco-modal-wrap" :loading="state.isUploading" tip="This may take a while...">
      <div ref="arcomodalimg"
       :style="{height:arcomodalimgH+'px',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'}"

        class="arco-modal-img">
              <img ref="imageRef"
               :src="props.imageSrc"
               alt="image" style="object-fit: contain;opacity: 1;width:100%;height:100%;">
      </div>
      <div ref="arcomodalfooter" class="arco-modal-footer">
            <a-button @click="props.onClose">取消 </a-button>
            <a-button type="primary" @click="cropImage">确认</a-button>
      </div>
    </a-spin>
</template>


<script setup  lang="ts">

  import Cropper from 'cropperjs';
  import "cropperjs/dist/cropper.css";
  import api from '@/api/editor'
  import { Props } from '@/components/cropperImg/interface'
import { nanoid } from 'nanoid';

  const props = withDefaults(defineProps<Props>(), {
    sizeData:null,
    cropData:null,
    //图片地址
    imageSrc: "",
    //aspectRatio:置裁剪框为固定的宽高比
    aspectRatio:null,
    //viewMode: 视图控制
    viewMode: 1,
    //autoCropArea: 设置裁剪区域占图片的大小 值为 0-1 默认 0.8 表示 80%的区域
    autoCropArea:0.8,

    onClose:()=>{}
  })
  //绑定图片的dom对象
  const imageRef = ref(null)

  const arcomodalwrapH = ref(600)

  arcomodalwrapH.value=window.innerHeight*0.8

  if(arcomodalwrapH.value>800){
    arcomodalwrapH.value=800
  }



  const arcomodalfooterH = ref(64)

  const arcomodalimgH = ref(arcomodalwrapH.value-arcomodalfooterH.value)

  let state=ref({
    isUploading:true,
  })

  let arcomodalwrap=   useTemplateRef('arcomodalwrap')
  let arcomodalimg=  useTemplateRef<HTMLDivElement>('arcomodalimg')
  let arcomodalfooter = useTemplateRef<HTMLDivElement>('arcomodalfooter')

  let cropper:any = null;

  //使用Cropper构造函数创建裁剪器实例，并将图片元素和一些裁剪选项传入
  onMounted(() => {

    state.value.isUploading=true


     
      cropper = new Cropper(imageRef.value, {
      aspectRatio: props.aspectRatio,
      autoCropArea:props.autoCropArea,
      scalable:false,
      rotatable:false,
      movable:false,
      zoomOnTouch:false,
      zoomOnWheel:false,
      ready:function(){
        state.value.isUploading=false
      }
    })
  });


  onUnmounted(()=>{
    state.value.isUploading=false
      if(cropper!=null){
        cropper?.destroy()
      }
  })

  const emits=defineEmits(["updateSrc"])

  const cropImage =async () => {
    state.value.isUploading=true
      const canvas = cropper.getCroppedCanvas();
      let cropData=  cropper.getCropBoxData()
      const sizeData = cropper.getData();
      //const croppedImage = canvas.toDataURL();

      cropper.getCroppedCanvas().toBlob(async (blob:any) => {

        const formData = new FormData()
        formData.append('file',blob,new Date().getTime()+"_"+nanoid(6)+".png")

        let imgsrc= await api.upload.uploadFile(formData)

        emits("updateSrc",{imgsrc,cropData,sizeData})

        props.onClose()
        if(cropper!=null){
         cropper?.destroy()
        }

        state.value.isUploading=false
      })

  }
</script>

<style lang="less" scoped>
   .arco-modal-wrap{
      width: 100%;
      display: flex;
      flex-direction: column;
   }
   :deep(.arco-modal-img){
    overflow: hidden;
   }
</style>
