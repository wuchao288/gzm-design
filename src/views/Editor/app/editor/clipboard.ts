import {MLeaferCanvas, IMLeaferCanvas} from '@/views/Editor/core/canvas/mLeaferCanvas'
import {Disposable} from '@/views/Editor/utils/lifecycle'
import {IKeybindingService, KeybindingService} from '@/views/Editor/core/keybinding/keybindingService'
import {ClipboardService, IClipboardService} from '@/views/Editor/core/clipboard/clipboardService'
import { IEditorUndoRedoService, EditorUndoRedoService } from '@/views/Editor/app/editor/undoRedo/undoRedoService'
import {clamp, clone} from 'lodash'
import {appInstance} from '@/views/Editor/app'
import {PointerEvent, Point, Group, LeafListm,Text} from 'leafer-ui'
import {IGroup, IUI, } from '@leafer-ui/interface'
import { HTMLText} from '@leafer-in/html'
import {typeUtil} from "@/views/Editor/utils/utils";
import {EditorHelper} from "@leafer-in/editor/src/helper/EditorHelper";
import {MEditorHelper} from "@/views/Editor/utils/MEditorHelper";
import {Matrix} from "@leafer-ui/core";
import { nanoid } from 'nanoid'
import Image2 from '../../core/shapes/Image2'
import api from '@/api/editor'
import {getDefaultName} from "@/views/Editor/utils/utils";
import mousetrap, {ExtendedKeyboardEvent} from 'mousetrap'

export class Clipboard extends Disposable {

    private pointer = new Point()
    private activeObject: IUI
    private group: IGroup

    constructor(
        @IMLeaferCanvas private readonly canvas: MLeaferCanvas,
        @IKeybindingService readonly keybinding: KeybindingService,
        @IClipboardService private readonly clipboard: ClipboardService,
        @IEditorUndoRedoService private readonly undoRedo: EditorUndoRedoService,
        
    ) {
        super()

        document.addEventListener("paste",this.paste2)

        keybinding.bind({
            'mod+x': this.clip.bind(this),
            'mod+c': this.copy.bind(this),
            //'mod+v': this.paste.bind(this, false),
            'mod+shift+v': this.paste.bind(this, true),
        })

        

        canvas.app.tree.on(PointerEvent.MOVE, (arg: PointerEvent) => {
            this.pointer = new Point(arg.x, arg.y)
        })
    }

    private async copy() {
        const _activeObject = this.canvas.getActiveObject()
        if (!_activeObject || typeUtil.isBottomCanvas(_activeObject)) return
        this.activeObject = clone(_activeObject)

        // 不管怎样都进组，最后再拆
        if (typeUtil.isVirtualElement(this.activeObject)) {
            // 选中元素进组
            let list: IUI[] = []
            const objects = this.canvas.getActiveObjects()
            objects.forEach(value => {
                const clo = value.clone()
                clo.parent = value.parent
                list.push(clo)
            })
            this.group = MEditorHelper.group(list, objects[0])
        } else {
            const cloneObj = this.activeObject.clone()
            this.group = MEditorHelper.group([cloneObj], this.activeObject)
        }
        // 转json
        const json = JSON.stringify(this.group.toJSON())

        this.clipboard.writeText("")
        // 写剪贴板
        this.clipboard.writeText(json)
    }

   private paste2= async (event:any)=>{
   
      let serialized: any | undefined

      let items=( event.clipboardData.items)

      const  IMAGE_MIME_REGEX=/^image\/(p?jpeg|gif|png)$/i

      let isImgFile=false

      for (let i = 0; i< items.length; i++) {

        if (IMAGE_MIME_REGEX.test(items[i].type)) {
           
           var file=(items[i].getAsFile());

           const formData = new FormData()

           formData.append('file',file,new Date().getTime()+"_"+nanoid(6)+".png")

           let imgsrc= await api.upload.uploadFile(formData)

           let image = new Image2({
               name: getDefaultName(this.canvas.contentFrame)+"-截图",
               url: imgsrc.url,
               editable: true,
               id:nanoid()
           });

           serialized=new Group({
               id:nanoid(),
               editable:true,
               children:[image]
           })  

           this.addObjects(serialized.toJSON(),false)
           isImgFile=true
            break
        }
      }
    
      if(isImgFile==false){
        this.paste(false,event)
      }
     
   } 
    
    private   addObjects = (groupData: object,currentLocation:boolean) => {
           
            const group = new Group(groupData)
            // 粘贴到当前位置
            if (currentLocation) {
                const {x, y} = appInstance.editor.contextMenu?.pointer || this.pointer
                const point =this.activeObject&& this.activeObject.parent ? this.activeObject.parent.getInnerPoint({
                    x: x,
                    y: y
                }) : this.canvas.contentFrame.getInnerPoint({x: x, y: y})
                group.x = point.x
                group.y = point.y
            } else {
                // 略微在原基础上偏移粘贴
                group.x += 15
                group.y += 15
            }
            this.canvas.add(group)
            // 选中元素
            this.canvas.setActiveObjects(group.children)
            // 解组
            MEditorHelper.ungroup([group])

            this.undoRedo.saveState()

    }

    private paste=(currentLocation:boolean,event:any)=>{

        this.clipboard.readBlob().then((blobs) => {
            
            if (!blobs) return
         
            blobs.forEach(async (blob,index) => {
                if(index!=0){
                    return
                }
                // 读取json
                let serialized: any | undefined


                if(blob.type=="text/plain"){

                    const json = await blob.text()

                    if (json) {

                        try {
                            serialized = JSON.parse(json)
                            serialized.editable=true
                            serialized.id=nanoid()
                            this.addObjects(serialized,currentLocation)

                        } catch (error) {

                            //
                            serialized=new Group({
                                id:nanoid(),
                                editable:true,
                                children:[new Text({
                                    text:json,
                                    editable:true,
                                    id:nanoid(),
                                    name: getDefaultName(this.canvas.contentFrame)+"-复制文本",
                                    fontSize:18
                                })]
                            })  

                            this.addObjects(serialized.toJSON(),currentLocation)
                        }
                    }
                   
                }else if(blob.type=="text/html"){

                    const json = await blob.text()

                    const obj=new HTMLText({
                        text:json,
                        id:nanoid(),
                        editable:true,
                        name: getDefaultName(this.canvas.contentFrame)+"-复制文本"
                    })

                    serialized=new Group({
                        id:nanoid(),
                        editable:true,
                        children:[obj]
                    })  

                    this.addObjects(serialized.toJSON(),currentLocation)

                }else if(blob.type=="image/png"){

                    const item = new File([blob], 'blob', { type: 'image/png' })
                    
                    const formData = new FormData()

                    formData.append('file',item,new Date().getTime()+"_"+nanoid(6)+".png")
        
                    let imgsrc= await api.upload.uploadFile(formData)
        
                    let image = new Image2({
                        name: getDefaultName(this.canvas.contentFrame)+"-截图",
                        url: imgsrc.url,
                        editable: true,
                        id:nanoid()
                    });

                    serialized=new Group({
                        id:nanoid(),
                        editable:true,
                        children:[image]
                    })  

                    this.addObjects(serialized.toJSON(),currentLocation)
                }
                //  this.undoRedo.saveState()
                currentLocation && (appInstance.editor.contextMenu!.pointer = undefined)

                
            })
        })
    }

    private clip() {
        this.copy()
        this.keybinding.trigger('del')
    }

    public dispose(): void {
        super.dispose()
        this.keybinding.unbind(['mod+x', 'mod+c', 'mod+v', 'mod+shift+v'])
        document.removeEventListener("paste",this.paste2)
    }
}
