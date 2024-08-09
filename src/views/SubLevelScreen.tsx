import { SafeAreaView, ScrollView, View } from 'react-native'
import React, { useCallback } from 'react'
import ScreenLayout from '@/layout/ScreenLayout'
import { Appbar } from 'react-native-paper'
import LeftArrow from '#/assets/icons/leftArrow.svg'
import useNavigate from '@/hooks/useNavigate'
import CardComp from '@/components/card/CardComp'
import { useStore } from '@/providers/store-provider'
import ZoomableView from '@/components/ZoomableView'
import { Colors } from '#/colors'
import { useFocusEffect } from '@react-navigation/core'

const SubLevels = () => {
  const store = useStore()
  const navigate = useNavigate()

  const { cards, name } = store.sequence
  const seqCards = cards as CardSequenceObject[]

  const zoomableViewRef = React.useRef(null)

  useFocusEffect(
    useCallback(() => {
      zoomableViewRef.current!.reset()
    }, []),
  )

  return (
    <ScreenLayout disableMargin backgroundSecondary>
      <View style={{ zIndex: 2 }}>
        <Appbar.Header statusBarHeight={0} style={{ backgroundColor: Colors.secondary }}>
          <Appbar.Action
            className="bg-Primary left-[4px] h-[45px] w-[45px] rounded-full "
            size={20}
            animated={false}
            icon={() => <LeftArrow width={20} height={20} />}
            onPress={() => navigate.to('Agenda')}
          />
          <Appbar.Content
            title={name}
            color={Colors.primary}
            style={{ flex: 1, alignItems: 'center' }}
            titleStyle={{ fontSize: 24 }}
          />
        </Appbar.Header>
      </View>
      <SafeAreaView className="flex-1 bg-white">
        <ZoomableView maxScale={5} ref={zoomableViewRef}>
          <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 1 }} showsVerticalScrollIndicator={true}>
            {seqCards.map((card, index) => (
              <CardComp
                key={index}
                name={card.content.name}
                audio={card.content.voiceUrl ?? null}
                link={card.content.imgUrl ?? 'https://picsum.photos/110'}
                disableOptions
              />
            ))}
          </ScrollView>
        </ZoomableView>
      </SafeAreaView>
    </ScreenLayout>
  )
}

export default SubLevels
