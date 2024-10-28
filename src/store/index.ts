import { useAppStore } from './modules/app/app'
import { useFontStore } from './modules/font/font'
import  useUserStore  from './base/user'
import  useBaseStore  from './base/base'


import useTemplateStore from './base/template'

const pinia = createPinia()

export default pinia

export {
    useAppStore,
    useFontStore,
    useUserStore,
    useBaseStore,
    useTemplateStore
}
