
import { Store, defineStore } from "pinia"

type TTemplateStoreState = {
  state: number,
  wmBollean: boolean,//水印
  ver: string | number
  id: string | number
  tempid:string | number
  type:string | number //文字效果 =0 模板=1
  spaceClass:string|number
  folderId:string|number
}

type TTemplateAction = {

  setTemplateData: (state: TTemplateStoreState) => void
}


const useTemplateStore = defineStore<'templateStore', TTemplateStoreState, {}, TTemplateAction>('templateStore', {
  state: () => ({
    state:1,
    wmBollean:false,
    ver: "",
    id: "",
    tempid:"",
    type:"",
    spaceClass:"",
    folderId:""
  }),
  actions: {
    setTemplateData(model: TTemplateStoreState) {
      this.ver = model.ver
      this.id = model.id
      this.tempid = model.tempid
      this.type = model.type
      this.folderId=model.folderId
      this.spaceClass=model.spaceClass
    }
  }
})

export type TTemplateStore = Store<'templateStore', TTemplateStoreState, {}, TTemplateAction>

export default useTemplateStore


