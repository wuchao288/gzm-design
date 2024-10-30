import type { DialogConfig } from '@/components/dialog/interface'

export type Props = {
  sizeData?: any

  cropData?: any

  imageSrc: string

  aspectRatio:number

  viewMode: number

  autoCropArea:number
  onChange?: (obj:any) => void
  onClose?:() => void
}