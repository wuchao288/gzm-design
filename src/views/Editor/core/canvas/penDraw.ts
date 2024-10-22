import {Pen, PointerEvent} from 'leafer-ui'
import {MLeaferCanvas} from "@/views/Editor/core/canvas/mLeaferCanvas";
import {getDefaultName} from "@/views/Editor/utils/utils";

/**
 * 配置选项接口，用于描述签名插件的各种配置参数
 */
export interface SignaturePluginOptions {
    // 目前暂时只限定画笔，提供后续扩展 如画矩形等
    type: 'pen',
    config: {
        // 画笔颜色
        stroke?: string;
        // 画笔粗细
        strokeWidth?: number;
    }
    //todo 配置选项
}

export class PenDraw{
    private canvas: MLeaferCanvas;
    private pen?: Pen | null;
    // 是否可以画
    private canDrawing: boolean = false;
    private isDrawing: boolean;

    constructor(
        canvas: MLeaferCanvas,
    ) {
        this.canvas = canvas
        this.isDrawing = false;
    }

    /**
     * 开始画
     */
    public start() {
        this.canDrawing = true
        this.startDrawing();
        this.continueDrawing();
        this.stopDrawing();
    }
    /**
     * 开始画
     */
    public stop() {
        this.canDrawing = false
        this.pen = null
    }

    private startDrawing() {
        this.canvas.app.on(PointerEvent.DOWN, (event: PointerEvent) => {
            if (event.left && !event.spaceKey && this.canDrawing){
                if (!this.pen){
                    this.pen = new Pen({
                        name:getDefaultName(this.canvas.contentFrame),
                        // 子元素是否响应交互事件
                        hitChildren: false,
                        editable: true,
                    });
                    this.canvas.contentFrame.add(this.pen);
                    this.canvas.childrenEffect()
                }
                this.isDrawing = true;
                this.pen.setStyle({
                    stroke: this.canvas.ref.penDrawConfig.config.stroke ? this.canvas.ref.penDrawConfig.config.stroke : 'red',
                    strokeWidth: this.canvas.ref.penDrawConfig.config.strokeWidth ? this.canvas.ref.penDrawConfig.config.strokeWidth : 2,
                });
                const center = {x:event.x,y:event.y}
                const innerPoint = this.canvas.contentFrame.getInnerPoint(center)
                this.pen.moveTo(innerPoint.x, innerPoint.y);
            }
        });
    }

    private continueDrawing() {
        this.canvas.app.on(PointerEvent.MOVE, (event: PointerEvent) => {
            if (event.left && !event.spaceKey && this.pen ) {
                if (this.isDrawing) {
                    const center = {x:event.x,y:event.y}
                    const innerPoint = this.canvas.contentFrame.getInnerPoint(center)
                    this.pen.lineTo(innerPoint.x, innerPoint.y);
                    this.pen.paint();
                }
            }
        });
    }

    private stopDrawing() {
        this.canvas.app.on(PointerEvent.UP, () => {
            if (this.pen) {
                this.isDrawing = false;
                // 每画完一次一个新图层
                this.pen = null
            }
        });
    }

    public clearSignature() {
        this.pen?.clear();
    }
}
