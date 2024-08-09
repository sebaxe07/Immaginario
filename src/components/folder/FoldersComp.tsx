import { View, Text, TouchableOpacity } from 'react-native'
import Folder from '#/assets/icons/folder.svg'

type FolderCompProps = {
  name: string
}

const FolderComp = ({ name }: FolderCompProps) => {
  return (
    <TouchableOpacity
      onPress={() => console.log('Folder pressed!')}
      className="m-2 h-[100px] max-w-[155px] grow justify-center rounded-2xl bg-secondary"
    >
      <View className=" items-center">
        <Folder />
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          className=" mt-[2px] max-w-[85px] text-center text-[16px] font-semibold tracking-tight text-primary"
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default FolderComp
