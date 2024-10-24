import { useAppStore } from './modules/app/app'
import { useFontStore } from './modules/font/font'
import  useUserStore  from './base/user'

import useTemplateStore from './base/template'

const pinia = createPinia()

export default pinia

export {
    useAppStore,
    useFontStore,
    useUserStore,
    useTemplateStore
}
