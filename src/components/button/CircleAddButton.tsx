import React from 'react'
import PlusIcon from '#/assets/icons/plus.svg'
import { TouchableOpacity, View } from 'react-native'

interface CircleAddButtonProps {
  handler: () => void
}

const CircleAddButton: React.FC<CircleAddButtonProps> = ({ handler }) => {
  return (
    <TouchableOpacity onPress={handler} className="pb-10">
      <View className="h-16 w-16 items-center justify-center rounded-full bg-secondary">
        <PlusIcon />
      </View>
    </TouchableOpacity>
  )
}

export default CircleAddButton
