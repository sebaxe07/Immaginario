import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import NewImage from '#/assets/icons/newImage.svg'
import NewFolder from '#/assets/icons/newFolder.svg'
import { SvgProps } from 'react-native-svg'
import useNavigate from '@/hooks/useNavigate'
import ScreenLayout from '@/layout/ScreenLayout'
import { useTranslation } from 'react-i18next'

export const CreateNewDialog = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <>
      <ScreenLayout title="Create New Item">
        <View className="flex h-full w-full flex-col items-center pt-4 text-center">
          <View className="flex w-5/6 flex-row justify-around">
            <NewButtons
              name={t('components.createNewDialog.newCard')}
              SvgComponent={NewImage}
              onPress={() => navigate.to('NewCard')}
            />
            <NewButtons name={t('components.createNewDialog.newSeq')} SvgComponent={NewImage} onPress={() => {}} />
            <NewButtons name={t('components.createNewDialog.newFolder')} SvgComponent={NewFolder} onPress={() => {}} />
          </View>
        </View>
      </ScreenLayout>
    </>
  )
}

type NewButtonsProps = {
  name?: string
  SvgComponent: React.FC<SvgProps>
  onPress: () => void
}

const NewButtons: React.FC<NewButtonsProps> = ({ name, SvgComponent, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex items-center pt-7">
        <View className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#ECECEC]">
          <SvgComponent height={30} width={37} />
        </View>
        <Text className="text-md mt-2 text-primary">{name}</Text>
      </View>
    </TouchableOpacity>
  )
}
