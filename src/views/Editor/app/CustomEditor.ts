import { App, Star, Box, DragEvent, PointerEvent } from 'leafer-ui'
import { InnerEditor, registerInnerEditor } from '@leafer-in/editor'


@registerInnerEditor()
export class CustomEditor extends InnerEditor {

    public get tag() { return 'CustomEditor' }

    public point: Box
    public closeBtn: Box

    public onCreate(): void {
        
        this.point = new Box()
        this.closeBtn = new Box({ fill: '#FF4B4B', cornerRadius: 20, around: 'top', cursor: 'pointer', children: [{ tag: 'Text', text: '完成', padding: [10, 20] }] })
        this.view.addMany(this.point, this.closeBtn)
        this.eventIds = [
            this.point.on_(DragEvent.DRAG, () => { console.log('drag point') }),
            this.closeBtn.on_(PointerEvent.TAP, () => { this.editor.closeInnerEditor() }) // 关闭内部编辑器
        ]
    }

    public onLoad(): void {
        this.point.set({ ...this.editBox.getPointStyle(), strokeWidth: 1 })
        this.editBox.add(this.view) // 添加在 editor 或 editBox 中都可以， 注意editBox本身具有定位
    }

    public onUpdate(): void {
        const { boxBounds, worldTransform } = this.editor.element // 单个选中时 element 代表选中的元素
        const { x, y, height } = boxBounds, { scaleX, scaleY } = worldTransform
        this.point.set({ x: (x + 50) * Math.abs(scaleX), y: y * Math.abs(scaleY) })
        this.closeBtn.set({ x: (x + 50) * Math.abs(scaleX), y: (y + height) * Math.abs(scaleY) })
    }

    public onUnload(): void {
        this.editBox.remove(this.view)
    }

    public onDestroy(): void {
        this.point = this.closeBtn = null
    }

}

Star.setEditInner('CustomEditor')
