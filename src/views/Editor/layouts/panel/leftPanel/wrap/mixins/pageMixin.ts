// myMixin.js
import { reactive, computed } from 'vue';
import imageData from "@/assets/data/imageData.json";
interface PageConfig {
    url: string,
    pageSize: number,
    page: number,
    params:object
}
export default function usePageMixin() {
    // 定义需要共享的数据
    const page = reactive<{
        dataList?: any,
        pageSize: number,
        page: number,
        noMore?: boolean,
        query:object,
        cate:string|number,
        search:string,
        type:string
    }>({
        dataList: [],
        pageSize: 10,
        page: 1,
        noMore:false,
        query:{},
        cate:"",
        search:"",
        type:""
    });

    // 返回包含需要共享的数据、计算属性和方法的对象
    return {
        page
    };
}
