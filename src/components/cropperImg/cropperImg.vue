<template>
   <a-spin ref="arcomodalwrap" class="arco-modal-wrap" :loading="state.isUploading" tip="This may take a while...">
      <div ref="arcomodalimg" class="arco-modal-img">
              <img ref="imageRef" :src="props.imageSrc" alt="image" style="object-fit: contain;">
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
    onChange:(obj:any)=>{},
    onClose:()=>{}
  })
  //绑定图片的dom对象
  const imageRef = ref(null)

  let state=ref({
    isUploading:true
  })

  let arcomodalwrap=   useTemplateRef('arcomodalwrap')
  let arcomodalimg=  useTemplateRef('arcomodalimg')
  let arcomodalfooter = useTemplateRef('arcomodalfooter')

  let cropper:any = null;

  //使用Cropper构造函数创建裁剪器实例，并将图片元素和一些裁剪选项传入
  onMounted(() => {



    let arcomodalwrapH=arcomodalwrap.value.$el.height

    let arcomodalimgH=arcomodalimg.value.clientHeight

    let arcomodalfooterH=arcomodalfooter.value.clientHeight


    console.info(arcomodalwrap)

    console.info(arcomodalimgH)

    console.info(arcomodalfooterH)


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
      if(cropper!=null){
        cropper?.destroy()
      }
      console.info("onUnmounted")
  })
  const cropImage =async () => {
     
      const canvas = cropper.getCroppedCanvas();
      let cropData=  cropper.getCropBoxData()
      const sizeData = cropper.getData();
      //const croppedImage = canvas.toDataURL();

      cropper.getCroppedCanvas().toBlob(async (blob:any) => {

        const formData = new FormData()
        formData.append('file',blob,new Date().getTime()+"_"+nanoid(6)+".png")

        let imgsrc= await api.upload.uploadFile(formData)
        props.onChange({imgsrc,cropData,sizeData})
        props.onClose()
        if(cropper!=null){
         cropper?.destroy()
        }
      })

  }
</script>

<style lang="less" scoped>
   .arco-modal-wrap{
      height: 600px;
      width: 100%;
      display: flex;
      flex-direction: column;
   }
   :deep(.arco-modal-footer){
       
   }
</style>
