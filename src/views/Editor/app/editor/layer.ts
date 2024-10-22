import {IMLeaferCanvas, MLeaferCanvas} from '@/views/Editor/core/canvas/mLeaferCanvas'
import {IKeybindingService, KeybindingService} from '@/views/Editor/core/keybinding/keybindingService'
import {Disposable} from '@/views/Editor/utils/lifecycle'
import {EventbusService, IEventbusService} from "@/views/Editor/core/eventbus/eventbusService";
import {keybindMap} from "@/views/Editor/utils/constants";
import {flipHorizontally, flipVertically, getParentLayer} from "@/views/Editor/utils/utils";
import {IUI} from "@leafer-ui/interface";
import { IEditorUndoRedoService, EditorUndoRedoService } from '@/views/Editor/app/editor/undoRedo/undoRedoService'
import { IHierarchyService, HierarchyService } from '@/views/Editor/core/layer/hierarchyService'
import {Box, DragEvent, DropEvent, PropertyEvent, ChildEvent} from "leafer-ui";
import {v4 as uuidv4} from "uuid";
import {Message} from "@arco-design/web-vue";

export class Layer extends Disposable {
    constructor(
        @IMLeaferCanvas private readonly canvas: MLeaferCanvas,
        @IKeybindingService private readonly keybinding: KeybindingService,
        @IEventbusService readonly eventbus: EventbusService,
        @IEditorUndoRedoService private readonly undoRedo: EditorUndoRedoService,
        @IHierarchyService private readonly hierarchyService: HierarchyService,
    ) {
        super()
        canvas.contentLayer.on(ChildEvent.ADD, (e) => {
            hierarchyService.addItem({key:e.target.innerId,zIndex: e.target.zIndex})
        })
        canvas.contentLayer.on(PropertyEvent.CHANGE, (e:PropertyEvent) => {
            if (e.attrName === 'zIndex'){
                hierarchyService.updateOrAddItem({key:e.target.innerId,zIndex: <number>e.newValue})
            }
        })
        this.keybinding.bind(['del', 'backspace'], () => {
            const objects = canvas.getActiveObjects()
            if (objects.length === 0) return
            this.deleteLayer(objects)
            canvas.discardActiveObject()
            return false
        })

        // 重命名
        this.keybinding.bind('mod+r', () => {
            const activeObject = canvas.getActiveObject()
            if (!activeObject) return
            eventbus.emit('layerRename', {
                id: activeObject.innerId,
            })
            return false
        })

        // 水平翻转
        this.keybinding.bind('shift+h', () => {
            const activeObject = canvas.getActiveObject()
            if (!activeObject) return
            activeObject.flip("x")
            // this.undoRedo.saveState()
            return false
        })

        // 垂直翻转
        this.keybinding.bind('shift+v', () => {
            const activeObject = canvas.getActiveObject()
            if (!activeObject) return
            activeObject.flip("y")
            return false
        })

        // 移至底层
        this.keybinding.bind('[', () => {
            canvas.app.editor.toBottom()
            // this.hierarchyService.moveToBottom(keys)
            const activeObject = canvas.getActiveObject()
            if (!activeObject) return
            this.objForEach((obj) => {
                const group = obj.parent
                // 排除已经在最底层的元素
                if (
                    group.children?.indexOf(obj) === activeObject.children?.indexOf(obj)
                ) {
                    return
                }
                obj.zIndex =this.hierarchyService.getBottomLevel().zIndex - 1
            })
            canvas.childrenEffect()
            // this.undoRedo.saveState()
            return false
        })

        // 移至顶层
        this.keybinding.bind(']', () => {
            canvas.app.editor.toTop()
            const activeObject = canvas.getActiveObject()
            if (!activeObject) return
            this.objForEach((obj) => {
                const group = obj.parent
                // 排除已经在最底层的元素
                if (
                    group.children?.indexOf(obj) === activeObject.children?.indexOf(obj)
                ) {
                    return
                }
                obj.zIndex =this.hierarchyService.getTopLevel().zIndex + 1
            })
            canvas.childrenEffect()
            // this.undoRedo.saveState()
            return false
        })

        // 向下移动一层
        this.keybinding.bind('mod+[', () => {
            const activeObject = canvas.getActiveObject()
            if (!activeObject) return

            const keys = this.canvas.getActiveObjects().map(value => {
                return value.innerId
            })
            let nextLevel = this.hierarchyService.getNextLevel(keys);
            this.objForEach((obj) => {
                const group = obj.parent
                // 排除已经在最底层的元素
                if (
                    group.children?.indexOf(obj) === activeObject.children?.indexOf(obj)
                ) {
                    return
                }
                obj.zIndex = nextLevel.zIndex - 1
            })
            // canvas.childrenEffect()
            // this.undoRedo.saveState()
            return false
        })

        // 向上移动一层
        this.keybinding.bind('mod+]', () => {
            const activeObject = canvas.getActiveObject()
            if (!activeObject) return
            const keys = this.canvas.getActiveObjects().map(value => {
                return value.innerId
            })
            let previousLevel = this.hierarchyService.getPreviousLevel(keys);

            this.objForEach((obj) => {
                const group = obj.parent
                // 排除已经在最顶层的元素
                if (
                    group.children.indexOf(obj) + activeObject.children?.length === activeObject.children?.indexOf(obj) + group.children.length
                ) {
                    return
                }
                obj.zIndex = previousLevel.zIndex + 1
            }, true)
            // canvas.requestRenderAll()
            // this.undoRedo.saveState()
            return false
        })

        // 创建分组
        this.keybinding.bind(keybindMap.group, () => {

            // 创建组
            /**
             * 为什么打组使用Box而不是Group？因为Group本身是不支持任何样式的，比如想给某个组添加边框时使用Group就实现不了，所以这里采用功能更多的Box来实现打组
             */
            // const box = new Box()
            // canvas.app.editor.group(box)
            // box不支持蒙版/擦除效果，所以这里暂时先继续使用Group 有需要的可以自行实现一个Box的自定义组

            
            const group = canvas.app.editor.group()
            group.zIndex = this.hierarchyService.getTopLevel().zIndex + 1
            canvas.bindDragDrop(group)
            canvas.childrenEffect()
            return false
        })

        // 解除分组
        this.keybinding.bind(keybindMap.ungroup, () => {
            canvas.app.editor.ungroup()
            canvas.childrenEffect()
            // this.undoRedo.saveState()
            return false
        })

        // 选择全部
        this.keybinding.bind('mod+a', () => {
            const activeObject = canvas.getActiveObject()
            const parent = getParentLayer(activeObject)
            // const parent = activeObject?.parent || canvas.app.tree
            canvas.setActiveObjects(parent.children?.reverse())
            return false
        })

        // 显示/隐藏
        this.keybinding.bind('mod+shift+h', () => {
            this.objForEach((obj) => {
                obj.visible = !obj.visible
            })
            // this.undoRedo.saveState()
            return false
        })

        // 锁定/解锁
        this.keybinding.bind('mod+shift+l', () => {
            if (this.canvas.app.editor.editing) {
                // 统一多选状态，多选以第一个元素状态为准
                const firstLocked = this.canvas.app.editor.list[0].locked
                if (firstLocked) {
                    this.canvas.app.editor.unlock()
                } else {
                    this.canvas.app.editor.lock()
                }
            }
            // this.undoRedo.saveState()
            return false
        })

        // 另存为PNG
        this.keybinding.bind('mod+shift+k', () => {
            if (this.canvas.app.editor.element) {
                this.canvas.app.editor.element.export(`${uuidv4()}.png`).catch(reason => {
                    Message.error(`导出失败：${reason}`);
                })
            }
            return false
        })
    }

    private objForEach(fn: (obj: any) => void, reverse = false) {
        const objects = this.canvas.getActiveObjects()
        if (reverse) {
            objects.reverse()
        }
        const length = objects.length - 1
        for (let i = length; i >= 0; i--) {
            fn(objects[length - i])
        }
    }

    private deleteLayer(objects: (IUI | undefined)[]) {
        const removed = objects?.flatMap((obj) => obj?.remove())
        return removed
    }

}
