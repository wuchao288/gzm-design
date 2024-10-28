import fetch from '@/utils/axios'
import config from '@/config/index'
/**
 * 上传文件
 * @param req
 */
// export function uploadFile(req:any) {
//     return axios.post(`/api/oss/upload`, req);
// }

export function uploadFile(req:any) {

    
    const  uploadUrl=config.IMAGEUPLOAD_URL;

    return fetch(uploadUrl, req,"post");
}
