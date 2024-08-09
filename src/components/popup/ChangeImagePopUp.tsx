import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Modal, Portal, Text } from 'react-native-paper'

import Camera from '#/assets/icons/camera.svg'
import Gallery from '#/assets/icons/gallery.svg'
import Explore from '#/assets/icons/explore.svg'
import ChangeImagePopUpConfirmation from './ChangeImagePopUpConfirmation'
import { useTranslation } from 'react-i18next'

const ChangeImagePopUp = ({ visible, onDismiss }) => {
  const [visibleConfirm, setVisible] = React.useState(false)
  const { t } = useTranslation()

  const hideModal = () => setVisible(false)

  const takePicture = () => {
    console.log('Take Picture')
  }
  const choosePicture = () => {
    console.log('Choose Picture from Gallery')
  }
  const exploreOnline = () => {
    console.log('Explore for Picture')
    setVisible(true)
  }

  return (
    <>
      <Portal>
        <Modal visible={visible} onDismiss={onDismiss}>
          <View className="flex-1 items-center justify-center">
            <View className="m-0 flex h-[250px] w-[300px] items-center justify-center rounded-3xl bg-white p-3">
              <View className="m-4">
                <Text className="text-2xl font-bold text-primary">{t('standards.changeImg')}</Text>
                <Text className="text-#00213FCC text-base">{t('components.popup.howReplace')}</Text>
              </View>
              <View className="flex-1 items-center justify-evenly">
                <View className="flex flex-row justify-between">
                  <TouchableOpacity className="mr-2 " onPress={takePicture}>
                    <View className="h-[45px] w-[140px] flex-row items-center justify-evenly rounded-full bg-secondary p-3">
                      <Camera height={20} width={20} />
                      <Text className="font-1000 text-[12px] text-primary">{t('standards.takePhoto')}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={exploreOnline}>
                    <View className="h-[45px] w-[45px] flex-row items-center justify-evenly rounded-full bg-secondary p-3">
                      <Explore height={20} width={20} />
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={choosePicture}>
                  <View className="h-[45px] w-[200px] flex-row items-center justify-evenly rounded-full bg-secondary p-3">
                    <Gallery height={20} width={20} />
                    <Text className="font-1000 text-[12px] text-primary">{t('standards.chooseGallery')}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
      <ChangeImagePopUpConfirmation visibleConfirm={visibleConfirm} onDismiss={hideModal} />
    </>
  )
}

export default ChangeImagePopUp
