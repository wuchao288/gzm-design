
import _CreateSketch from './createSketch.vue'
import {DialogReturn} from '@/components/dialog/interface'
import {appInstance} from '@/views/Editor/app'
import {ServicesAccessor} from '@/views/Editor/core/instantiation/instantiation'
import {SketchProps} from './interface'

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
  { imageSrc,onUpdateImageSrc }: Partial<SketchProps>
) => {

  return Modal.open({
    width: 1024,
    alignCenter:true,
    title: '生成线稿',
    closable:true,
    hideCancel:false,
    titleAlign:"start",
    footer:false,
    bodyStyle:"padding-bottom: 0px;",
    content: () =>
      h(_CreateSketch, {
        imageSrc,
        onUpdateImageSrc:onUpdateImageSrc,
        onClose(){
          dialogClose()
        }
      }),
    onClose() {
      dialog = undefined
    }
  })
}

const open = (option: Partial<SketchProps>) => {
  if (!dialog) {
    
    dialog = appInstance.editor.service.invokeFunction(openDialog, option)
  }
  return dialogClose
}

const CreateSketchImg = Object.assign(_CreateSketch, { open, close: dialogClose })

export default CreateSketchImg
