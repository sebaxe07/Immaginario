import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import { Image } from 'expo-image'

type MiniCardProps = {
  name: string
  image: string
  onPress?: () => void
  style?: StyleProp<ViewStyle>
}

const MiniCard = ({ name, image, onPress, style }: MiniCardProps) => {
  const CardContents = () => (
    <>
      <Image className="h-[65px] grow rounded-t-[14px]" source={{ uri: image }} />
      <Text className="relative top-[5px] grow text-center tracking-tight text-primary">{name}</Text>
    </>
  )

  return (
    <View
      className="m-[8px] h-[100px] w-[156px] grow rounded-[15px] border border-stroke bg-white"
      style={[
        {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        },
        style,
      ]}
    >
      {onPress ? (
        <TouchableOpacity onPress={onPress}>
          <CardContents />
        </TouchableOpacity>
      ) : (
        <View>
          <CardContents />
        </View>
      )}
    </View>
  )
}

export default MiniCard
