import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Modal, Portal, Text } from 'react-native-paper'

import ImgConfirm from '#/assets/icons/ImgConfirmation.svg'
import { useTranslation } from 'react-i18next'

const ChangeImagePopUpConfirmation = ({ visibleConfirm, onDismiss }) => {
  const { t } = useTranslation()
  const cancelSelection = () => {
    console.log('Cancel Process')
    onDismiss()
  }
  const changeImage = () => {
    console.log('Change Picture')
    onDismiss()
  }

  return (
    <Portal>
      <Modal visible={visibleConfirm} onDismiss={onDismiss}>
        <View className="flex-1 items-center justify-center">
          <View className="m-0 flex h-[350px] w-[300px] items-center justify-center rounded-3xl bg-white pb-4">
            <View className="m-4">
              <Text className="text-2xl font-bold text-primary">{t('standards.changeImg')}</Text>
              <Text className="text-#00213FCC text-base">{t('components.popup.replaceImg')}</Text>
            </View>
            <View className="flex-1 items-center justify-evenly">
              <View className="mb-4 h-[150px] w-[150px] flex-row items-center justify-evenly rounded-[45px] bg-secondary">
                <ImgConfirm height={150} width={150} />
              </View>
              <View className="flex flex-row justify-between">
                <TouchableOpacity className="mr-2" onPress={cancelSelection}>
                  <View className=" h-[45px] w-[80px] flex-row items-center justify-evenly rounded-full bg-white p-3">
                    <Text className="font-1000 text-[12px] text-primary">{t('standards.cancel')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={changeImage}>
                  <View className="h-[45px] w-[120px] flex-row items-center justify-evenly rounded-full bg-primary p-3">
                    <Text className="font-1000 text-[12px] text-white">{t('standards.changeImg')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

export default ChangeImagePopUpConfirmation
