<template>
    <a-space>
        <!-- <a-button href="https://gitee.com/sourcenet/gzm-design"
                  target="_blank"
                  type="text"
                  class="!underline underline-offset-5 p-l-5px p-r-5px">
            <ali-icon type="icon-gitee" class="mr4px text-size-18px"/>Gitee
        </a-button>
        <a-button href="https://github.com/LvHuaiSheng/gzm-design"
                  target="_blank"
                  type="text"
                  class="!underline underline-offset-5 p-l-5px p-r-5px">
            <ali-icon type="icon-github" class="mr3px text-size-18px"/>GitHub
        </a-button> -->

        <a-divider direction="vertical" />

        <a-button @click="preview()">
            <template #icon>
                <icon-eye />
            </template>
            预览
        </a-button>
        <a-button type="primary" @click="save()">
            <template #icon>
                <icon-save />
            </template>
            保存
        </a-button>
        <a-dropdown-button type="primary" @select="handleSelect" @click="handleDownload()">
            <icon-download class="m-r-8px"/>下载作品
            <template #icon>
                <icon-down/>
            </template>
            <template #content>
                <a-doption value="json">另存为JSON</a-doption>
            </template>
        </a-dropdown-button>
    </a-space>
    <a-image-preview
            :src="previewUrl"
            v-model:visible="visiblePreview"
    />
    <a-modal v-model:visible="exportVisible" title="下载作品" @ok="handleExport()" width="600px" :top="50" :align-center="false">
        <a-form ref="formRef" :model="exportForm" :rules="rules">
            <a-form-item field="fileType" label="导出文件类型">
                <a-radio-group v-model="exportForm.fileType" type="button" :options="exportFileTypes"></a-radio-group>
            </a-form-item>
            <a-form-item field="quality" label="图片质量"  v-if="['jpg','webp'].includes(exportForm.fileType)">
                <a-space>
                    <a-radio-group v-model="exportForm.quality" type="button" :options="scQtaRate"></a-radio-group>
                    <a-input-number v-model="exportForm.quality" mode="button" style="width: 120px" :max="1" :step="0.1" :min="0.1" placeholder="1"></a-input-number>
                </a-space>
            </a-form-item>
            <a-form-item field="scale" label="缩放比例" extra="可用于生成小尺寸的缩略图">
                <a-space>
                    <a-radio-group v-model="exportForm.scale" type="button" :options="scQtaRate"></a-radio-group>
                    <a-input-number v-model="exportForm.scale" mode="button" style="width: 120px" :max="1" :step="0.1" :min="0.1" placeholder="1"></a-input-number>
                </a-space>
            </a-form-item>
            <a-form-item field="pixelRatio" label="像素比" extra="可导出适配高清屏的2倍图、3倍图">
                <a-input-number v-model="exportForm.pixelRatio" allow-clear hide-button style="width: 200px" placeholder="默认为1倍图">
                    <template #suffix>
                        倍
                    </template>
                </a-input-number>
            </a-form-item>
            <a-form-item field="trim" label="裁剪透明像素">
                <a-switch type="round" v-model="exportForm.trim">
                    <template #checked>
                        是
                    </template>
                    <template #unchecked>
                        否
                    </template>
                </a-switch>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import {useEditor} from "@/views/Editor/app";
import { useRoute, useRouter } from 'vue-router'

import {
    IUI
} from "@leafer-ui/interface";
import {IWorkspace, IWorkspacesService, WorkspacesService} from "@/views/Editor/core/workspaces/workspacesService";
import { IHierarchyService, HierarchyService } from '@/views/Editor/core/layer/hierarchyService'

const { editor, keybinding} = useEditor()
import {downFile} from "@/utils/designUtil.js";
import {v4 as uuidv4} from "uuid";
import {Notification} from "@arco-design/web-vue";
import {useUserStore,useTemplateStore} from '@/store'

import api from '@/api/editor'
import { Group, UI } from "leafer-ui";
import { nanoid } from "nanoid";

const userStore =  useUserStore()

const templateStore = useTemplateStore()

const route = useRoute()
const router = useRouter()

const visiblePreview = ref(false)
const previewUrl = ref()
const exportFileTypes = reactive([
    {value: 'jpg', label: 'JPG'},
    {value: 'png', label: 'PNG'},
    {value: 'webp', label: 'WEBP'},
])
const scQtaRate = reactive([
    {value: 1, label: '正常'},
    {value: 0.7, label: '0.7倍'},
    {value: 0.5, label: '0.5倍'},
    {value: 0.3, label: '0.3倍'},
    {value: 0.1, label: '0.1倍'},
])
const exportVisible = ref(false)
const exportForm = ref({
    fileType:'jpg',
    quality: 1,
    scale: 1,
    pixelRatio: 1,
    trim: false,
});
const rules = {

}
const resetForm = () => {
    exportForm.value = {
        fileType:'jpg',
        quality: 1,
        scale: 1,
        pixelRatio: 1,
        trim: false,
    }
}
const preview = async () => {
    const result = await editor.contentFrame.export('png', {blob: true})
    const url = URL.createObjectURL(result.data);
    previewUrl.value = url
    visiblePreview.value = true
}


 

const save = () => {
    Notification.info({
        closable:true,
        content:'请到控制台查看打印的JSON值'
    })
    // console.log('多页面JSON：',editor.getPages())
    // editor.getCurrentPage()
    // let json = editor.contentFrame.toJSON()
    // console.log('当前页JSON：',json)

    //先上传图片
    console.info(templateStore.)

    console.info(Array.from(editor.getPages().values()))

}

const handleDownload = () => {
    resetForm()
    exportVisible.value = true
}

const  createCover=async ()=>{
   
}

//保存模板（或文字效果）
async function saveTemp(isClose:boolean|null=true) {

}


onMounted(async()=>{
    
   await checklogin(async(res:any)=>{
     
        const edit= Boolean(route.query.edit)

        userStore.changeUser(res.userInfo.UserName,res.userInfo.CompCode,res.managerEdit&&edit);

        const { id, tempid: tempId } = route.query

        if(!id && !tempId){
            return
        }
        await loadTempData()
    })
})

//根据url参数查询页面


async function loadTempData() {

    const id= route.query.id as string

    const tempid= route.query.tempid as string

    const type= route.query.type as string

    const apiName = tempid && !id ? 'getTempDetail' : 'getWorks'
  
   if (!id && !tempid) {
       return
   }

   const { data: content, title, state, width, height,version:ver,spaceClass,folderId,cover }
   = await api.home[apiName]({ id : id || tempid , type : type  ,compCode:"" })

  if (!content) return

  templateStore.setTemplateData({
    wmBollean:false,
    ver,
    spaceClass,
    folderId,
    state,
    id,
    tempid,
    type
  })

  let jsonData = typeof content === 'string' ? JSON.parse(content) : content

  if(type==="1"){//文本
    jsonData.x=0
    jsonData.y=0
    jsonData=[{
        "tag": "Frame",
        "id": nanoid(),
        "name": "workspace",
        "width": width*1,
        "height": height*1,
        "fill": [
          {
            "type": "solid",
            "color": "#FFFFFF"
          }
        ],
        children:[jsonData]
    }]
  }

    if(Array.isArray(jsonData)){

    let json:{
        workspaces: IWorkspace[]
        pages: {
            id: string
            children: IUI[]
        }[]
    }={
        workspaces:[],
        pages: []
    }

    for (let index = 0; index < jsonData.length; index++) {

        const pageItem = jsonData[index];

        json.workspaces.push({id:pageItem.id,name:title,cover:cover})

        json.pages.push({ id:pageItem.id,children:pageItem})

    }
    
        await   editor.importPages(json,true)

    
    }else{
        editor.importJsonToCurrentPage(jsonData,true)
    }
}

async function checklogin(cb:(data:string)=>void) {
  let res=await api.home.checklogin();
  cb(res)
}

const handleExport = () => {
    let fileName = uuidv4()
    editor.contentFrame.export(`${fileName}.${exportForm.value.fileType}`,exportForm.value)
}

const handleSelect = (v) => {
    let fileName = uuidv4()
    switch (v) {
        case 'png':
            editor.contentFrame.export(fileName + '.png')
            break
        case 'jpg':
            editor.contentFrame.export(fileName + '.jpg')
            break
        case 'webp':
            editor.contentFrame.export(fileName + '.webp')
            break
        case 'json':
            saveJson()
            break
        default:
            editor.contentFrame.export(fileName + '.jpg')
            break
    }
};
function saveJson() {
    const dataUrl = editor.contentFrame.toJSON();
    const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(dataUrl, null, '\t')
    )}`;
    downFile(fileStr, `${uuidv4()}.json`);
}
</script>

<style scoped>

</style>
