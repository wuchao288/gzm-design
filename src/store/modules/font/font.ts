import {getFonts} from "@/api/editor/font";
import FontFaceObserver from 'fontfaceobserver'

const defaultFonts = [
    {
        woff: '/resources/image/fonts/473404317567549440.otf',
        value: 'アプリ明朝',
        label:'アプリ明朝'
    }
]
export const useFontStore = defineStore('font', () => {
    const fontList = ref<any>([])

    // 跳过加载的字体
    const skipLoadFonts = ref<any>(defaultFonts.map(value => value.value))

    const nowVersion = '2' // 当前字体文件版本更新，将刷新前端缓存
    /**
     * 初始化部分字体
     */
    async function initFonts() {
        let list = []
        localStorage.getItem('FONTS_VERSION') !== nowVersion && localStorage.removeItem('FONTS')
        const localFonts: any = localStorage.getItem('FONTS') ? JSON.parse(localStorage.getItem('FONTS') || '') : []
        if (localFonts.length > 0) {
            list.push(...localFonts)
        }

        if (list.length === 0) {
            const res = await getFonts({page: 1, pageSize: 1000})
         
            list = res.list
            localStorage.setItem('FONTS', JSON.stringify(list))
            localStorage.setItem('FONTS_VERSION', nowVersion)
        }
        fontList.value = defaultFonts.concat(list)
        return list
    }

    return {
        fontList,
        skipLoadFonts,
        initFonts,
    }
})
