import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { useTranslation } from 'react-i18next'

const BackButton = () => {
  const navigate = useNavigation()
  const { t } = useTranslation()

  return (
    <View className="absolute left-[-10] top-[-3] z-10">
      <Button mode="text" icon="arrow-left" onPress={() => navigate.goBack()}>
        {t('components.button.back')}
      </Button>
    </View>
  )
}

export default BackButton
