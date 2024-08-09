import { KeyboardAvoidingView, Platform, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'

import React from 'react'

import CardNameBox from '@/components/card/CardNameBox'
// import SequenceButton from '@/components/sequence/RelatedSequences'
import HeaderCards from '@/components/header/HeaderCards'
import { useStatusBarColor } from '@/hooks/useStatusBarColor'
import { useStore } from '@/providers/store-provider'
import { useTranslation } from 'react-i18next'

const CardOptions = () => {
  const store = useStore()
  const { t } = useTranslation()

  const card = store.card
  const isOwner = store.card.ownerId === store.user.uid

  useStatusBarColor('transparent')

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -300}
    >
      <View className="flex-1">
        <View className="grow">
          <Image
            className="mt-[-160px] grow rounded-b-[16px]"
            style={{
              flex: 1,
              width: '100%',
              resizeMode: 'cover',
            }}
            source={{ uri: card.imgUrl }}
          />
        </View>
        <View className="absolute w-full">
          <HeaderCards variant="card" isOwner={isOwner} />
        </View>
        <View className="flex-1">
          <CardNameBox card={card} variant="card" />
          <View className="ml-5 mt-4">
            <Text className="[28px] text-[25px] font-semibold text-primary">{t('standards.cardCat')}</Text>
            {card.category !== null && (
              <TouchableOpacity
                activeOpacity={1.0}
                className="mt-[5px] h-[35px] w-[80px] items-center justify-center rounded-full bg-secondary"
              >
                <Text className="text-bold">{card.category}</Text>
              </TouchableOpacity>
            )}
            {!card.category && <Text>Category not set</Text>}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default CardOptions
