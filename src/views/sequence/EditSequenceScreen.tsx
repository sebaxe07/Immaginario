import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import useNavigate from '@/hooks/useNavigate'

import React, { useEffect, useState } from 'react'

import HeaderCardsEdit from '@/components/header/HeaderCardsEdit'
import { useStore } from '@/providers/store-provider'
import MiniCard from '@/components/card/MiniCard'
import Input from '@/components/input/FormInput'
import { Colors } from '#/colors'
import { useForm } from 'react-hook-form'
import { sequenceSchema } from '@/schema/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Connector } from '@/lib/connector'
import { toast } from '@/utils/toast'
import { z } from 'zod'
import ChangeImagePopUp from '@/components/popup/ChangeImagePopUp'
import CircleAddButton from '@/components/button/CircleAddButton'
import { useAtom } from 'jotai'
import { updateSequenceState } from '@/state/sequence'
import { sequenceState } from '@/state/signals'
import { useTranslation } from 'react-i18next'

const EditSequenceScreen = () => {
  const { goBack, ...navigate } = useNavigate()

  const [visible, setVisible] = useState(false)
  const hideModal = () => setVisible(false)
  const showModal = () => setVisible(true)

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  // TODO: Update when adding ability to add sequences
  const [sequence, setSequence] = useAtom(updateSequenceState)
  const [savedSequence] = useAtom(sequenceState)

  const { name, placeholder } = store.sequence

  // When the component mounts, set the editable sequence to the already saved sequence
  useEffect(() => {
    // TODO: Update when adding ability to add sequences
    setSequence(savedSequence.cards.map((card) => card.content) as Card[])

    // Force react-hook-form to update the name field (not dynamically updated )
    setValue('name', savedSequence.name)
  }, [savedSequence])

  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(sequenceSchema),
    defaultValues: {
      name,
    },
  })

  const handleAddCard = () => navigate.to('AddCardsSequence', { update: true })

  /**
   * Handle updating the sequence in the database and the store
   *
   * @param formData - The form data from react-hook-form
   */
  const handleUpdateSequence = async (formData: z.infer<typeof sequenceSchema>) => {
    store.setLoading(true)

    const cards = sequence.map((card) => ({ content: card, type: 'card' })) as SequenceObject[]

    const newSequence = {
      id: store.sequence.id,
      name: formData.name,
      placeholder: sequence[0].imgUrl,
      cards,
      ownerId: store.user.uid,
    }

    connector.db.sequence
      .update(newSequence.id, newSequence.name, newSequence.placeholder, newSequence.cards)
      .then(() => store.setSequence(newSequence))
      .catch(() => toast({ title: 'Error', message: 'Something went wrong and the sequence could not be updated' }))
      .finally(() => {
        store.setLoading(false)
        goBack()
      })
  }

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
          <HeaderCardsEdit onPressedButton={showModal} />
        </View>

        <View className="flex-[1.5] items-center">
          <Text className="my-5 text-[25px] ">{name}</Text>
          <View className=" h-2/3 w-5/6 rounded-md border border-primary">
            <ScrollView contentContainerStyle={{ alignItems: 'center', gap: 20 }} showsVerticalScrollIndicator={true}>
              {sequence.map((card, index) => (
                <MiniCard key={index} name={card.name} image={card.imgUrl} />
              ))}
              <CircleAddButton handler={handleAddCard} />
            </ScrollView>
          </View>
        </View>
        <View className="flex-1 items-center justify-start">
          <Input
            name="name"
            control={control}
            label={t('standards.seqName')}
            className="w-64"
            style={{
              fontSize: 18,
              backgroundColor: Colors.white,
            }}
          />

          <View className="mt-5 flex-row">
            <TouchableOpacity
              className="mr-3  h-[45px] w-[130px] items-center justify-center rounded-full bg-primary"
              onPress={handleSubmit(handleUpdateSequence)}
            >
              <Text className="text-white">{t('standards.saveChanges')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="h-[45px] w-[90px] items-center justify-center rounded-full border-2 border-primary bg-white text-center text-base"
              onPress={goBack}
            >
              <Text className="text-black">{t('standards.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ChangeImagePopUp visible={visible} onDismiss={hideModal} />
    </KeyboardAvoidingView>
  )
}

export default EditSequenceScreen
