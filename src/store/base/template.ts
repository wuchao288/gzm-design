
import { Store, defineStore } from "pinia"

type TStoreBaseState = {
  templateState:TTemplateStoreState
}

type TTemplateStoreState = {
  state: number,
  wmBollean: boolean,//水印
  version: string | number
  id: string | number
  tempid:string | number
  type:string | number //文字效果 =0 模板=1
  spaceClass:string|number
  folderId:string|number
  cover:string
  width:string|number
  height:string|number
  title:string
  content:string
}

type TTemplateAction = {

  setTemplateData: (state: TTemplateStoreState) => void
}


const useTemplateStore = defineStore<'templateStore', TStoreBaseState, {}, TTemplateAction>('templateStore', {
  state: () => ({
    templateState:{
      state: 1,
      wmBollean: false,//水印
      version: 1,
      id: '',
      tempid:'',
      type:'',//文字效果 =0 模板=1
      spaceClass:'',
      folderId:'',
      cover:''
    } as TTemplateStoreState
  }),
  actions: {
    setTemplateData(model: TTemplateStoreState) {
        this.templateState=model
    }
  }
})

export type TTemplateStore = Store<'templateStore', TTemplateStoreState, {}, TTemplateAction>

export default useTemplateStore


