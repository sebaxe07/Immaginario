import { SvgProps } from 'react-native-svg'

export type TabBarConfig = {
  [key: string]: {
    title?: string
    icon: {
      src: React.FC<SvgProps>
      h?: number
      w?: number
    }
    link?: string
    popup?: boolean
  }
}
