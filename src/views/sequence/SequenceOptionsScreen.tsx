import { View, Text, Platform, ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { KeyboardAvoidingView } from 'react-native'

import React from 'react'

import HeaderCards from '@/components/header/HeaderCards'
import { useStore } from '@/providers/store-provider'
import { useStatusBarColor } from '@/hooks/useStatusBarColor'
import CardComp from '@/components/card/CardComp'

const SequenceOptions = () => {
  const store = useStore()

  const { name, cards, placeholder } = store.sequence

  // TODO: Update when adding ability to add sequences
  const seqCards = cards as CardSequenceObject[]
  const isOwner = store.sequence.ownerId === store.user.uid

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
              resizeMode: 'cover',
            }}
            source={{ uri: placeholder }}
          />
        </View>

        <View className="absolute w-full">
          <HeaderCards variant="sequence" isOwner={isOwner} />
        </View>

        <View className="flex-[1.5] items-center">
          <View className="mb-2 mt-5 flex-row items-center">
            <Text className="my-5 text-[25px] ">{name}</Text>
          </View>
          <View className=" h-5/6 w-5/6 rounded-md border border-primary">
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
          </View>
        </View>
        <View className="flex-1 items-center justify-center"></View>
      </View>
    </KeyboardAvoidingView>
  )
}

export default SequenceOptions
