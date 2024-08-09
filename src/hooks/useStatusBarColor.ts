import { Colors } from '#/colors'
import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'
import { Platform, StatusBar } from 'react-native'

export const useStatusBarColor = (color: keyof typeof Colors | 'transparent') => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return

      StatusBar.setBackgroundColor(color === 'transparent' ? color : Colors[color])
      StatusBar.setBarStyle('dark-content')
      StatusBar.setTranslucent(true)
    }, []),
  )
}
