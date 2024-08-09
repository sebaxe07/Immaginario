import useNavigate from '@/hooks/useNavigate'
import { View, Text, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'

type SavedCardProps = {
  name: string
  image: string
}

const SavedCard = ({ name, image }: SavedCardProps) => {
  const navigate = useNavigate()
  const goToCardOptionsScreen = () => navigate.to('CardOptions')

  return (
    <TouchableOpacity onPress={goToCardOptionsScreen}>
      <View className="items-center">
        <Image
          className="h-[75px] w-[75px] rounded-2xl"
          source={{
            uri: image,
          }}
        />
        <Text>{name}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default SavedCard
