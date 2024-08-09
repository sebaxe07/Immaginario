import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SvgProps } from 'react-native-svg'

interface CircularButtonProps {
  handler: () => void
  Icon: React.FC<SvgProps>
}

const CircularButton = ({ Icon, handler }: CircularButtonProps) => {
  return (
    <TouchableOpacity className="ml-[16px] mr-[7px]" onPress={handler}>
      <View className="h-[45px] w-[45px] items-center justify-center rounded-full bg-secondary">
        <Icon height={20} width={20} />
      </View>
    </TouchableOpacity>
  )
}

export default CircularButton
