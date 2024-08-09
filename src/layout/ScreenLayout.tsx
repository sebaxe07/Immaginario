import { Colors } from '#/colors'
import BackButton from '@/components/button/BackButton'
import ScreenTitle from '@/components/header/ScreenTitle'
import TabBar from '@/components/nav/TabBar'
import React, { useRef } from 'react'
import { Platform, SafeAreaView, StatusBar, View } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'

interface ScreenLayoutProps {
  title?: string
  disableMargin?: boolean
  backgroundSecondary?: boolean
  backButton?: boolean
  tabBar?: boolean
  children?: React.ReactNode
}

const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  title,
  disableMargin = false,
  backgroundSecondary = false,
  backButton = false,
  tabBar = true,
  children,
}) => {
  const APPBAR_HEIGHT = Platform.OS === 'ios' ? 60 : 56
  const APPBAR_COLOR = backgroundSecondary ? Colors.secondary : Colors.white

  const refNewCardRBSheet = useRef<RBSheet>()

  const openAddPopup = () => {
    refNewCardRBSheet.current?.open()
  }

  return (
    <>
      <View
        className="absolute left-0 top-0 w-full"
        style={{
          height: APPBAR_HEIGHT,
          backgroundColor: APPBAR_COLOR,
          zIndex: Platform.OS === 'ios' ? 1 : null,
        }}
      ></View>

      <SafeAreaView
        className={`${!disableMargin ? 'm-6' : ''} flex-1`}
        style={{ backgroundColor: backgroundSecondary ? Colors.secondary : Colors.white }}
      >
        {backButton && <BackButton />}
        {title && (
          <View className="flex-row items-center">
            <ScreenTitle>{title}</ScreenTitle>
          </View>
        )}

        {children}

        {tabBar && <TabBar disabledMargin={disableMargin} openPopup={openAddPopup} />}
      </SafeAreaView>
    </>
  )
}

export default ScreenLayout
