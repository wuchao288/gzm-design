
import {useEditor} from "@/views/Editor/app";


export default () => {
  const {canvas} = useEditor()
  const workspace = canvas.contentFrame;
  let left = 0, top = 0
  let width = workspace.width || 0, height = workspace.height || 0
  const centerPoint = {x: 0, y: 0}
  if (workspace) {
    width = workspace.width || 0, height = workspace.height || 0
    left = workspace.x || 0
    top = workspace.y || 0
    centerPoint.x = width / 2
    centerPoint.y = height / 2
  }
  
  return {
    width,
    height,
    left,
    top,
    centerPoint
  }
}