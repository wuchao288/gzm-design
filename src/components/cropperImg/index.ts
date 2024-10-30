import Dialog from '@/components/dialog'
import _CropperImg from './cropperImg.vue'
import {DialogReturn} from '@/components/dialog/interface'
import {appInstance} from '@/views/Editor/app'
import {isDefined} from '@vueuse/core'
import {IMLeaferCanvas} from '@/views/Editor/core/canvas/mLeaferCanvas'
import {ServicesAccessor} from '@/views/Editor/core/instantiation/instantiation'
import { isString } from 'lodash'
import {Props} from './interface'

import { h } from 'vue';
import { Modal, Button } from '@arco-design/web-vue';


let dialog: DialogReturn | undefined

/**
 * 关闭dialog
 */
const dialogClose = () => {
  dialog && dialog.close()
  dialog = undefined
}

const openDialog = (
  accessor: ServicesAccessor,
  { sizeData, cropData,imageSrc,
    aspectRatio,
    viewMode,
    onChange,
    autoCropArea }: Partial<Props>
) => {

  return Modal.open({
    width: 1024,
    alignCenter:true,
    title: '图片裁剪',
    closable:true,
    hideCancel:false,
    titleAlign:"start",
    footer:false,
    bodyStyle:"padding-bottom: 0px;",
    content: () =>
      h(_CropperImg, {
        sizeData,
        cropData,
        imageSrc,
        aspectRatio,
        viewMode,
        autoCropArea,
        onUpdateSrc:onChange,
        onClose(){
          dialogClose()
        }
      }),
    onClose() {
      dialog = undefined
    }
  })
}

const open = (option: Partial<Props>) => {
  if (!dialog) {
    
    dialog = appInstance.editor.service.invokeFunction(openDialog, option)
  }
  return dialogClose
}



const CropperImg = Object.assign(_CropperImg, { open, close: dialogClose })

export default CropperImg
