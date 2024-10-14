import Mock from 'mockjs';
import setupMock, { successResponseWrap } from '@/utils/setup-mock';
import fontData from '@/assets/data/fonts.json'
import {MockParams} from "@/types/mock";

setupMock({
    setup() {
        Mock.mock(new RegExp('/api/font/list'), (params:MockParams) => {
            const { page:pageNum, pageSize } = JSON.parse(params.body);
            var newDataList = fontData.list.slice((pageNum - 1) * pageSize, pageNum * pageSize)
            return successResponseWrap({records:newDataList,total:fontData.list.length});
        });
    },
});
