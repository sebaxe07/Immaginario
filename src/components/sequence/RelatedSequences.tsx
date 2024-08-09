import useNavigate from '@/hooks/useNavigate'
import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import Sequence from '#/assets/icons/sequence.svg'
import RightArrow from '#/assets/icons/rightArrow.svg'
import { useStore } from '@/providers/store-provider'

// Props for RelatedSequenceButton
type RelatedSequenceButtonProps = {
  sequence: Sequence
  date: string
}

const RelatedSequenceButton = ({ sequence, date }: RelatedSequenceButtonProps) => {
  const { name } = sequence

  const navigate = useNavigate()

  const store = useStore()

  const goToSequenceScreen = () => {
    store.setSequence(sequence)
    navigate.to('SequenceOptions')
  }

  return (
    <TouchableOpacity
      className="h-[85px] w-full flex-row items-center justify-between border-b border-gray-400 bg-white"
      onPress={goToSequenceScreen}
    >
      <View className="ml-4 flex-1 flex-row items-center justify-between">
        <View className="ml-2 h-[40px] flex-row items-center">
          <Sequence height={20} width={20} />
          <View className="justify-left items-left ml-3 h-[40px] flex-col">
            <Text className="font-900 text-[18px] text-primary">{name}</Text>
            <Text className="text-[15px] font-normal text-[#00213fb3]">{date}</Text>
          </View>
        </View>
        <View className="mr-8">
          <RightArrow height={20} width={10} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default RelatedSequenceButton
