import {createDecorator} from '@/views/Editor/core/instantiation/instantiation'
import {
    ICanvasContext2D,
    IGroup,
    ILeafer, ILeaferCanvas,
    IPointData,
    IRenderOptions,
    IUI,
    IUIInputData,
    IZoomType
} from "@leafer-ui/interface";
import {
    App,
    ChildEvent,
    DropEvent,
    Frame,
    Leafer,
    PropertyEvent,
    ResizeEvent,
    surfaceType,
    DragEvent, Box,
    version,
} from "leafer-ui";
import leaferConfig from "@/config/leaferConfig";
import '@leafer-in/editor'
import '@leafer-in/text-editor'
import '@leafer-in/view'
import '@leafer-in/state'
import { ScrollBar } from '@leafer-in/scroll'
import {Ruler} from 'leafer-x-ruler'
import {IWorkspace, IWorkspacesService, WorkspacesService} from "@/views/Editor/core/workspaces/workspacesService";
import {EventbusService, IEventbusService} from "@/views/Editor/core/eventbus/eventbusService";
import {HierarchyService, IHierarchyService} from "@/views/Editor/core/layer/hierarchyService";
import {typeUtil} from "@/views/Editor/utils/utils";
import {addCustomFonts} from "@/utils/fonts/utils";
import {useAppStore, useFontStore} from "@/store";
import {EditTool} from "app";
import {toFixed} from "@/utils/math";

// 重写 proxyData，全局只需引入一次
import './proxyData'
import './initAttr'
import {EditorEvent,Editor} from "@leafer-in/editor";
import {BOTTOM_CANVAS_NAME} from "@/views/Editor/utils/constants";
import {v4 as uuidv4} from 'uuid'
import { nanoid } from 'nanoid'
import {PenDraw, SignaturePluginOptions} from "@/views/Editor/core/canvas/penDraw";
import { forEach } from 'lodash';


type ExtendedOption = {
    width: number
    height: number
    name: string
}

type ObjectType =
// 官方元素tag
    'UI'
    | 'App'
    | 'Leafer'
    | 'Frame'
    | 'Group'
    | 'Box'
    | 'Rect'
    | 'Image'
    | 'SVG'
    | 'Canvas'
    | 'Text'
    | 'Pen'
    | 'HTMLText'
    // 自定义元素tag
    | 'Image2'
    | 'QrCode'
    | 'BarCode'

interface Page {
    children: any
    name?: string
    id?: string
    cover?: string,
    height?: number
    hittable?: undefined
    pixelRatio?: number
    tag?: string
    width?: number
    scale?: number,
}


interface ZoomData {
    scale?: number | IPointData,
}

export const IMLeaferCanvas = createDecorator<MLeaferCanvas>('mLeaferCanvas')

export class MLeaferCanvas {
    declare readonly _serviceBrand: undefined

    public activeObject = shallowRef<IUI | null>()

    public extendedData = shallowRef<ExtendedOption>()

    /***
     * 当前页面ID
     */
    public pageId?: string

    /**
     * 多页面
     */
    private readonly pages: Map<string, Page> = new Map()

    // 画布
    public wrapperEl: any

    // 主应用
    private _app?: App
    // 内容层
    private _contentLayer?: ILeafer

    // 标尺
    public ruler: Ruler

    // 内容画板
    private _contentFrame: Frame
    // 操作选项
    private activeTool?: EditTool

    /**
     * 下面这些可变变量都可以修改成使用成store
     */
    /**
     * 响应式属性
     */
    public readonly ref = {
        zoom: ref(toFixed(this.getZoom(), 2)),
        _children: shallowRef<IUI[]>([]),
        // 是否启用辅助线
        enabledRuler: ref(true),
        // 画笔配置
        penDrawConfig: reactive<SignaturePluginOptions>({
            type:'pen',
            config:{
                stroke:'red',
                strokeWidth:2,
            }
        })
    }

    public backgroundColor?: string

    constructor(
        @IWorkspacesService private readonly workspacesService: WorkspacesService,
        @IEventbusService private readonly eventbus: EventbusService,
        @IHierarchyService private readonly hierarchyService: HierarchyService,
    ) {
        const app = new App({
            width: 800,
            height: 800,
            editor: {
                // point: { cornerRadius: 0 },
                // middlePoint: {},
                // rotatePoint: { width: 16, height: 16 },
                // rect: { dashPattern: [3, 2] },
                // buttonsDirection:'top',
                buttonsFixed:true,
                buttonsDirection:'top',
                lockRatio: 'corner',
                stroke: 'rgba(77, 124, 255, 1)',
                strokeWidth:2,
                skewable: false,
                hover: true,
                flipable:false,
                resizeable:true,
                mask:false,
                rotateGap:15,
                point:{ 
                    
                     stroke:'rgba(0, 0, 0, 0.5)',
                     strokeWidth:1,
                },
                middlePoint: { 
                     cornerRadius: 100,
                     width: 20,
                     height: 6,
                     stroke:'rgba(0, 0, 0, 0.5)',
                     strokeWidth:1,
                },
                rotatePoint: {
                    width: 20,
                    height: 20,
                    stroke:'rgba(0, 0, 0, 0.5)',
                    strokeWidth:1,
                    fill: {
                        type: 'image',
                        url: "data:image/svg+xml;charset=utf-8,%3Csvg width='22' height='22' viewBox='0 0 22 22' fill='rgba(0, 0, 0, 0)' xmlns='http://www.w3.org/2000/svg'%3E %3Ccircle cx='11' cy='11' r='10' fill='white'/%3E %3Ccircle cx='11' cy='11' r='10.5' stroke='black' stroke-opacity='0.2'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.66667 5.14868C6.99468 5.75499 5 8.14455 5 11C5 13.8555 6.99468 16.245 9.66667 16.8513V15.8203C7.55254 15.2368 6 13.2997 6 11C6 8.70032 7.55254 6.76325 9.66667 6.17975V5.14868ZM12.3333 15.8203C14.4475 15.2368 16 13.2997 16 11C16 8.70032 14.4475 6.76325 12.3333 6.17975V5.14868C15.0053 5.75499 17 8.14455 17 11C17 13.8555 15.0053 16.245 12.3333 16.8513V15.8203Z' fill='black'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M9.16667 5.5H6.33333V4.5H10.1667V8.33333H9.16667V5.5Z' fill='black'/%3E %3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M12.8333 16.5H15.6667V17.5H11.8333L11.8333 13.6667L12.8333 13.6667L12.8333 16.5Z' fill='black'/%3E %3C/svg%3E"//rotatePng,
                    }
                }
            },
        })




        // 启用滚动条
        // new ScrollBar(app)
        this.wrapperEl = app.canvas.view
        this.ruler = new Ruler(app,{
            enabled: this.ref.enabledRuler.value,
            theme:'light',
        })
        const contentLayer = app.tree
        contentLayer.fill = 'transparent'
        // TODO 2023-11-10 等待修复Leafer的fill的功能后放开下面注释启用背景填充
        // contentLayer.fill = {
        //     type:'image',
        //     url:'https://www.toptal.com/designers/subtlepatterns/uploads/white_carbon.png'
        // }
        this._contentLayer = contentLayer
        this._app = app
        this.pageId = this.workspacesService.getCurrentId()
        this.initWorkspace()
        this.initPageEditor()
        console.info("initPageEditor")
        this.initWatch()
        useFontStore().initFonts().then(value => {
            addCustomFonts(value)
        })
    }

    private initWatch() {
        const {activeTool} = storeToRefs(useAppStore())
        this.activeTool = activeTool.value
        // 监听activeTool
        watch(activeTool, (newTool, oldTool) => {
            this.activeTool = newTool
            if (newTool !== 'select') {
                this.discardActiveObject()
            }
        })

    }

    // 工作区 | 页面管理
    private initWorkspace() {
        
        this.workspacesService.all().forEach((workspace) => {
            this.setPageJSON(workspace.id, {
                children: [],
            })
        })
        this.eventbus.on('workspaceAddAfter', ({newId}) => {
            this.setPageJSON(newId, {
                children: [],
            })
        })
        this.eventbus.on('workspaceRemoveAfter', (id) => {
            this.pages.delete(id)
        })
        this.eventbus.on('workspaceChangeBefore', ({oldId}) => {
            
            if (!oldId || !this.pages.has(oldId)) return
            const page = this.pages.get(oldId)
            if (!page) return
            // 切换前保存当前工作区
            this.setPageJSON(oldId, this.contentFrame.toJSON())
            // page.scale = this.contentLayer.scale
            this.contentFrame.clear()
        })
        this.eventbus.on('workspaceChangeAfter', ({newId}) => {
            // 切换后恢复当前工作区
            console.info("切换后恢复当前工作区")
            console.info(newId)
            console.info(this.pageId)
            if (this.pageId !== newId) {
                useAppStore().activeTool = 'select'
                this.discardActiveObject()
                const page = this.pages.get(newId)
                this.pageId = newId
                if (page) {
                    this.importJsonToCurrentPage(page, true)
                }
            }
        })
        this.eventbus.on('workspaceChangeRefresh', ({newId}) => {
            const json = this.pages.get(newId)
            console.log('json=', json)
            if (json) {
                this.contentFrame.set(json)
            } else {
                this.setPageJSON(newId, this.contentFrame.toJSON())
            }
        })
    }

    // 页面元素编辑器
    initPageEditor() {
        // 创建基础画板
        const frame = new Frame({
            id: uuidv4(),
            name: BOTTOM_CANVAS_NAME,
            width: this.contentLayer.width,
            height: this.contentLayer.height,
            fill:[{
                type:'solid',
                color:'#ffffff'
            }]
        })
       
        this.contentLayer.add(frame)
        this.contentFrame = frame
        this.setActiveObjectValue(this.contentFrame)

        this.app.editor.on(EditorEvent.SELECT, (arg: EditorEvent) => {
            
            
            if(arg.editor.list.length>0){
                console.info(arg.editor.list[0])
                console.info(arg.editor.list[0].proxyData)
            }
            this.setActiveObjectValue(arg.editor.element)
            // this.ruler.forceRender()
        })
        // 子元素添加事件
        this.contentLayer.on(ChildEvent.ADD, (arg: ChildEvent) => {
            // this.selectObject(arg.target)
            this.childrenEffect()
        })

        // 子元素移除事件
        this.contentLayer.on(ChildEvent.REMOVE, (arg: ChildEvent) => {
            this.childrenEffect()
        })

        // 元素属性事件
        this.contentLayer.on(PropertyEvent.CHANGE, (e2: PropertyEvent) => {
            // 监听最底层画布xy变化 触发布局移动事件（用于辅助线跟随画布移动）
            // @ts-ignore
            if ((typeUtil.isBottomCanvas(e2.target) || typeUtil.isBottomLeafer(e2.target)) && e2.newValue && ['x', 'y'].includes(e2.attrName)) {
                this.eventbus.emit('layoutMoveEvent', e2)
            }
        })

        let initFrameWH = true
        // resize事件
        this.contentLayer.on(ResizeEvent.RESIZE, (e2: ResizeEvent) => {
            if (initFrameWH) {
                // 第一次初始化画布时设置画布宽高为可视区域大小
                this.contentFrame.width = e2.width
                this.contentFrame.height = e2.height
                this.app.tree.zoom('fit')
            }
            this.eventbus.emit('layoutResizeEvent', e2)
            initFrameWH = false
        })
    }


    private setPageJSON(id: string, json: Partial<Page | IUIInputData | any>) {
        if (id === '') return
        this.pages.set(id, {
            children: [],
            name: BOTTOM_CANVAS_NAME,
            id: id,
            ...json,
        })
    }

    /**
     * 根据id获取页面的json数据
     * 注意：getPageJSON必须在setCurrentId之后执行，否则要页面中的数据可能还未保存
     * @param id 页面ID
     */
    public getPageJSON(id: string): Page | undefined {
        if (id === this.pageId) {
            return {
                ...this.pages.get(id),
                children: this.ref._children.value,
            }
        }
        return this.pages.get(id)
    }


    public getCurrentPage(): Page {
        this.setPageJSON(this.workspacesService.getCurrentId(),this.contentFrame.toJSON())
        return this.pages.get(<string>this.pageId)
    }

    public getPages() {
        this.setPageJSON(this.pageId,this.contentFrame.toJSON())
        return this.pages
    }

    public setActiveObjectValue(object: IUI | null) {
        if (!object) {
            object = this.contentFrame
        }
        if (this.objectIsTypes(object, 'QrCode')) {
            this.app.editor.config.lockRatio = true
        } else {
            this.app.editor.config.lockRatio = false
        }
        // setTimeout(()=>{
            
        this.activeObject.value = object
        // },200)
    }

    public setActiveObjects(objects: IUI[] | undefined) {
        this.app.editor.target = objects
    }

    get contentFrame(): Frame {
        return this._contentFrame;
    }

    set contentFrame(value: Frame) {
        this._contentFrame = value;
    }

    get contentLayer(): Leafer {
        return <Leafer>this._contentLayer;
    }


    set contentLayer(value: Leafer) {
        this._contentLayer = value;
    }

    get app(): App {
        return <App>this._app;
    }

    set app(value: App) {
        this._app = value;
    }

    public activeObjectIsType(...types: ObjectType[]) {
        return types.includes(<ObjectType>this.activeObject.value?.tag)
    }

    public activeObjectIsBottomOrVirtualElement() {

    }

    public objectIsTypes(object: any, ...types: ObjectType[]) {
        return types.includes(<ObjectType>object?.tag)
    }

    /**
     * 选中元素
     * @param target
     */
    public selectObject(target: IUI | null) {
        if (this.activeTool === 'select') { // 选择器
            console.log('选中：', target)
            this.app.editor.target = target
            console.log('Editor element：', this.app.editor.element)
            this.setActiveObjectValue(this.app.editor.element)
        }
    }

    /**
     * 取消选中元素
     */
    public discardActiveObject() {
        this.app.editor.target = null
        this.setActiveObjectValue(this.contentFrame)
    }

    /**
     * 添加元素
     * @param _child 元素
     * @param _index 层级
     */
    public add(_child: IUI, _index?: number) {
        
        if (this.objectIsTypes(_child,'Group','Box')){
            this.bindDragDrop(_child)
        }
        if (!_child.zIndex){
            const topLevel = this.hierarchyService.getTopLevel().zIndex;
            _child.zIndex = topLevel + 1;
        }

        _child.id=nanoid()

        this.contentFrame.add(_child, _index)
        // 选中提添加的元素
        this.selectObject(_child)
        this.childrenEffect()
    }

    /**
     * 添加元素
     */
    public addMany(..._children: IUI[]) {

        _children.forEach((_child)=>{
            _child.id=nanoid()
        })
        this.contentFrame.addMany(..._children)
        this.childrenEffect()
    }

    /**
     * 重新加载json数据（一般用于切换页面）
     * @param json
     */
    public reLoadFromJSON(json: Partial<Page | IUIInputData | any>) {
      
        this.importJsonToCurrentPage(json, true)
        //this.setZoom(json.scale?json.scale:1)
    }

    /**
     * 导入JSON到当前页中
     * @param json json
     * @param clearHistory 是否清除历史画布数据
     */
    public  importJsonToCurrentPage(json: any, clearHistory?: boolean) {
        debugger
        if (clearHistory) {
            this.contentFrame.clear()
        }

        if (json) {

            this.contentFrame.set(json)

            this.discardActiveObject()

            useAppStore().activeTool = 'select'

            this.childrenEffect()

        }
        this.zoomToFit()
    }

    // /**
    //  * 导入JSON（多页）
    //  * @param pages 多页面json
    //  * @param clearHistory 是否清除历史画布数据
    //  */
    // public importPages(pages: any, clearHistory?: boolean) {
    //     if (clearHistory) {
    //         this.contentFrame.clear()
    //     }
    //     console.log('pages', pages)
    //     // TODO 多页面数据导入
    // }


    /**
     * 导入JSON（多页）
     * importPages
     * @param pages 多页面json
     * @param clearHistory 是否清除历史画布数据
     */
    public async importPages(json: any, clearHistory?: boolean) {
        
        console.info(json)

        if (!json) {
            return Promise.reject(new Error('`json` is undefined'))
        }
        if (clearHistory) {
            this.contentFrame.clear()
        }
        const serialized = typeof json === 'string' ? JSON.parse(json) : json

        const {
            workspaces,
            pages,
        }: {
            workspaces: IWorkspace[]
            pages: {
                id: string
                children: IUI[]
            }[]
        } = serialized

       

        if (!workspaces || !pages || workspaces.length === 0 || pages.length === 0) {
            return Promise.reject(new Error('`json` is not valid'))
        }

        this.workspacesService.clear()
        this.pages.clear()

        for (const { name, id } of workspaces) {
            this.workspacesService.add(name, id)
        }

        for (const page of pages.reverse()) {
            this.workspacesService.setCurrentId(page.id)
            await this.reLoadFromJSON(page.children)
        }
    }

    public getActiveObjects(): IUI[] {
        return this.app.editor.list
    }

    public getActiveObject() {
        return this.activeObject.value
    }

    public zoomToInnerPoint(zoom?: number) {
        this.ref.zoom.value = zoom
        this.app.tree.zoom(zoom)
    }
    public zoomToFit() {
        this.app.tree.zoom('fit')
        this.ref.zoom.value = <number>this.contentLayer.scale
    }

    public zoomTo100(zoom: IUI|number) {
        //this.app.tree.zoom(100)
        this.app.tree.zoom(zoom) 
        this.ref.zoom.value = <number>this.contentLayer.scale
    }

    public get children() {
        const id = this.workspacesService.getCurrentId()
        if (!this.pages.has(id)) {
            this.setPageJSON(id, {
                children: [],
            })
        }
        return this.pages.get(id)?.children || []
    }

    public set children(value) {
        const id = this.workspacesService.getCurrentId()
        this.setPageJSON(id, {
            children: value,
        })
    }

    /**
     * 执行调度器 更新_children值
     */
    public childrenEffect() {
        this.ref._children.value = []
        this.ref._children.value = this.contentFrame.children
    }


    public setZoom(scale: number | undefined) {
        this.zoomToInnerPoint(<number>scale)
    }

    public getZoom(): number {
        if (this.contentLayer) {
            return <number>this.contentLayer.scale
        } else {
            return 1
        }
    }

    /**
     * 根据ID查找对象
     * @param id 要查找的对象的ID
     * @returns 如果找到对象则返回一个FabricObject类型的对象，否则返回undefined
     */
    public findObjectById(id: string | number): any | undefined {
        const object = this.contentFrame.findOne(id)
        return object
    }

    /**
     * 根据ID数组查找对象
     * @param idsToFind 要查找的对象的ID数组
     * @returns 返回一个包含Object类型对象的数组，数组中每个元素的值为对应的ID在对象集合中的对象。如果没有找到对象，则相应的数组元素值为undefined。
     */
    public findObjectsByIds(idsToFind: (string | number)[]): IUI[] {
        const objects = this.app.tree.find(function (item) {
            return idsToFind.includes(item.innerId) ? 1 : 0
        })
        return objects
    }

    /**
     * 绑定组的元素拖动放置事件
     * @param group
     */
    public bindDragDrop(group: IUI){
        const that = this
        group.on(DragEvent.ENTER, function () {
            DragEvent.setData({ data: 'drop data' })
        })
        group.on(DropEvent.DROP, function (e: DropEvent) {
            e.list.forEach((leaf) => {
                if (leaf.innerId !== group.innerId) {
                    leaf.dropTo(group) // 放置元素到group中
                }
            })
        })
        group.on(DragEvent.OUT, function (e: DropEvent) {
            if (that.objectIsTypes(e.current, 'Group')) {
                e.target.dropTo(e.current.parent)
            }
        })
    }
}
