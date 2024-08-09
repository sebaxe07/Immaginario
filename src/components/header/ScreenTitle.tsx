import { View } from 'react-native'
import { Text } from 'react-native-paper'

const ScreenTitle = ({ children }) => {
  return (
    <View className="mb-2 flex-1">
      <Text className="text-center text-[24px] font-bold text-primary">{children}</Text>
    </View>
  )
}

export default ScreenTitle
