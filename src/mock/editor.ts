import Mock from 'mockjs';
import  qs from 'qs'
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import templateData from '@/assets/data/templateData.json'
import templateCateData from '@/assets/data/templateCateData.json'
import graphData from '@/assets/data/graphData.json'
import imageData from '@/assets/data/imageData.json'
import textData from '@/assets/data/textData.json'
import bgImgData from '@/assets/data/bgImgData.json'
import elementData from '@/assets/data/elementData.json'
import {MockParams} from "@/types/mock";
import textCateData from '@/assets/data/textCateData.json'

/**
 * TODO 优化图库，抓取unsplash图片
 */
setupMock({
    mock:true,
    setup() {

       
        
        Mock.mock(new RegExp('/api/design/textcate'), (params:MockParams) => {

            var lreturn=  successResponseWrap(textCateData.cate);
        
            return lreturn
        });

        Mock.mock(new RegExp('/api/design/cate'), (params:MockParams) => {

            var lreturn=  successResponseWrap(templateCateData);
        
            return lreturn
        });

        Mock.mock(new RegExp('/api/design/list'), (params:MockParams) => {
            //0=图片，1=文字
            console.info(params)
            const { page:pageNum, pageSize,type } = qs.parse(params.url.split("?")[1])//JSON.parse(params.body);
            var newDataList = templateData.list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
            var lreturn=  successResponseWrap({list:newDataList,total:templateData.list.length});
        
            return lreturn
        });

        Mock.mock(new RegExp('/api/text/materialList'), (params:MockParams) => {
            const { page:pageNum, pageSize } = JSON.parse(params.body);
            var newDataList = textData.list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
            return successResponseWrap({list:newDataList,total:textData.list.length});
        });

        Mock.mock(new RegExp('/api/image/materialList'), (params:MockParams) => {
            const { page:pageNum, pageSize } = JSON.parse(params.body);
            var newDataList = imageData.list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
            return successResponseWrap({list:newDataList,total:imageData.list.length});
        });


        Mock.mock(new RegExp('/api/graph/category'), (params:MockParams) => {
            return successResponseWrap({list:graphData.cate,total:graphData.cate.length});
        });
        Mock.mock(new RegExp('/api/graph/list'), (params:MockParams) => {
            const { page:pageNum, pageSize, query } = JSON.parse(params.body);
            const list = graphData.list.filter(v=>{
                return v.category == query.categoryId
            })
            var newDataList = list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
            return successResponseWrap({list:newDataList,total:list.length});
        });

        Mock.mock(new RegExp('/api/background/imageList'), (params:MockParams) => {
            const { page:pageNum, pageSize } = JSON.parse(params.body);
            var newDataList = bgImgData.list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
            return successResponseWrap({list:newDataList,total:bgImgData.list.length});
        });

        Mock.mock(new RegExp('/api/element/category'), (params:MockParams) => {
            return successResponseWrap({list:elementData.cate,total:elementData.cate.length});
        });
        Mock.mock(new RegExp('/api/element/list'), (params:MockParams) => {
            const { page:pageNum, pageSize, query } = JSON.parse(params.body);
            const list = elementData.list.filter(v=>{
                return v.category == query.categoryId
            })
            var newDataList = list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
            return successResponseWrap({list:newDataList,total:list.length});
        });
    },
});
