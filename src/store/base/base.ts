
import { Store, defineStore } from "pinia"

type TStoreBaseState = {
  isloading:boolean,
  isloadingTip:string
}



type TBaseAction = {
  setBaseData: (state: TStoreBaseState) => void
}


const useBaseStore = defineStore<'baseStore', TStoreBaseState, {}, TBaseAction>('baseStore', {
  state: () => ({
    isloading:false,
    isloadingTip:"This may take a while..."
  }),
  actions: {
    setBaseData(model: TStoreBaseState) {
        this.isloading=model.isloading
        this.isloadingTip=model.isloadingTip
    }
  }
})

export type TStoreBaseSetState = Store<'storeBaseSetStore', TStoreBaseState, {}, TBaseAction>

export default useBaseStore


