import { View } from 'react-native'
import { Chip } from 'react-native-paper'
import { Colors } from '#/colors'

type ChipSelectProps = {
  name: string
  selected: boolean // Add this line
  onSelect: () => void
}

const ChipSelect = ({ name, selected, onSelect }: ChipSelectProps) => {
  return (
    <View>
      <Chip
        selected={selected}
        showSelectedCheck={false}
        style={{
          backgroundColor: selected ? Colors.primary : Colors.secondary,
          borderRadius: 30,
          marginHorizontal: 2,
        }}
        textStyle={{
          color: selected ? Colors.white : Colors.primarytext,
          fontWeight: '500',
          fontSize: 16,
        }}
        onPress={onSelect}
      >
        {name}
      </Chip>
    </View>
  )
}

export default ChipSelect
