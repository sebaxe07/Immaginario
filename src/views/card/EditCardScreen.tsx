import { KeyboardAvoidingView, Platform, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import useNavigate from '@/hooks/useNavigate'

import Play from '#/assets/icons/play.svg'
import Stop from '#/assets/icons/stop.svg'
import Trash from '#/assets/icons/trash.svg'
import Pause from '#/assets/icons/pause.svg'
import Record from '#/assets/icons/record.svg'

import React, { useEffect, useState } from 'react'

import HeaderCardsEdit from '@/components/header/HeaderCardsEdit'
import ChangeImagePopUp from '@/components/popup/ChangeImagePopUp'
import { useStore } from '@/providers/store-provider'
import { Connector } from '@/lib/connector'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { cardSchema } from '@/schema/forms'
import { useIsFocused } from '@react-navigation/native'
import { z } from 'zod'
import { Checkbox } from 'react-native-paper'
import { type Recording } from 'expo-av/build/Audio'
import { Audio } from 'expo-av'
import { Colors } from '#/colors'
import Input from '@/components/input/FormInput'
import CircularButton from '@/components/button/CircularButton'
import DropDownPicker from 'react-native-dropdown-picker'
import { useTranslation } from 'react-i18next'

const EditCardScreen = () => {
  const { goBack } = useNavigate()

  const [visible, setVisible] = useState(false)

  const hideModal = () => setVisible(false)

  const showModal = () => setVisible(true)

  const store = useStore()
  const connector = new Connector(store)
  const { imgUrl } = store.card
  const { t } = useTranslation()

  const [checked, setChecked] = useState(store.card.global)

  const [showDropDown, setShowDropDown] = useState(false)
  const [category, setCategory] = useState(store.card.category)
  const [dropdownKey] = useState(Math.random())
  const [categoryList, setCategoryList] = useState([])

  const getCategories = async () => {
    store.setLoading(true)

    try {
      const myCards = await connector.db.card.getMyCards()
      const globalCards = await connector.db.card.getGlobal()
      const allCards = [...myCards, ...globalCards]
      const uniqueCards = Array.from(new Map(allCards.map((card) => [card.id, card])).values())

      const cardsCategories = new Set(uniqueCards.map((card) => card.category))
      const myCategories = await connector.db.category.getAll()
      const allCategories = Array.from(
        new Map([...myCategories.map((c) => c.name), ...cardsCategories].map((c) => [c, c])).values(),
      )
      const finalCategories = [...allCategories].filter(Boolean)

      // setCategoryList(finalCategories)

      const categoryList = finalCategories.map((category) => ({
        label: category,
        value: category,
      }))

      setCategoryList(categoryList)
    } catch (e) {
      console.error('Could not fetch cards/categories')
    }

    store.setLoading(false)
  }

  // Updating recorded audio
  const [isRecording, setIsRecording] = useState(false)
  const [audioDeleted, setAudioDeleted] = useState(false)
  const [recordingInstance, setRecordingInstance] = useState<Recording>(null)

  const handleUpdateCard = async (formData: z.infer<typeof cardSchema>) => {
    store.setLoading(true)

    if (recordingInstance) {
      const audio = await connector.storage.uploadCardAudio(store.card.id, recordingInstance.getURI())

      // Preemptively update the voiceUrl to reflect the changes in the card
      // without a database roundtrip
      await connector.db.card.setVoiceUrl(store.card.id, audio).then(() => {
        store.card.voiceUrl = audio
      })
      console.log('has changed audio')
    }

    if (audioDeleted) {
      // Preemptively remove the voiceUrl from the card to reflect the changes
      // without a database roundtrip
      await connector.db.card.deleteVoiceRecording(store.card.id).then(() => {
        store.card.voiceUrl = null
      })

      console.log('deleted audio')
    }

    await connector.db.card
      .update(store.card.id, formData.name, category, checked)
      .then(() => {
        store.card.name = formData.name
        store.card.category = category
        store.card.global = checked
        goBack()
      })
      .finally(() => {
        store.setLoading(false)
      })

    cleanupAudio()
    goBack()
  }

  const handleCancel = () => {
    goBack()
    cleanupAudio()
  }

  const { control, handleSubmit, setValue } = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: store.card.name,
    },
  })

  const isFocused = useIsFocused()

  // When the component mounts, set the editable sequence to the already saved sequence
  useEffect(() => {
    // TODO: Update when adding ability to add sequences
    if (!isFocused) return

    // Force react-hook-form to update the name field (not dynamically updated )
    setValue('name', store.card.name)
    setCategory(store.card.category)
    setChecked(store.card.global)

    getCategories()
  }, [isFocused])

  const handleDelete = () => setAudioDeleted(true)

  const handleNewRecording = () => {
    if (isRecording) return handleStopRecording()
    if (recordingInstance) return handlePlayRecording()

    handleRecordAudio()
  }

  const hasAudio = !!store.card.voiceUrl

  const [isPlaying, setIsPlaying] = useState(false)

  const handleRecordAudio = async () => {
    try {
      await Audio.requestPermissionsAsync()
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const recording = new Audio.Recording()
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await recording.startAsync()

      setIsRecording(true)
      setRecordingInstance(recording)
    } catch (error) {
      console.error('Error recording audio:', error)
    }
  }

  const handleStopRecording = async () => {
    setIsRecording(false)
    recordingInstance.stopAndUnloadAsync()
  }

  const [sound, setSound] = useState<Audio.Sound>(null)

  const handlePlayRecording = async () => {
    const uri = recordingInstance.getURI()
    setIsPlaying(true)
    const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true })

    setSound(sound)
  }

  // const handlePauseRecording = async () => {
  //   await sound.pauseAsync()
  //   setIsPlaying(false)
  // }

  useEffect(() => {
    if (!recordingInstance) return
    if (!sound) return

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return

      setIsPlaying(status.isPlaying)
    })
  }, [sound])

  const handleDeleteAudio = async () => {
    // TODO: Fix
    // await sound.unloadAsync()
    // await recordingInstance.stopAndUnloadAsync()

    cleanupAudio()
  }

  const cleanupAudio = () => {
    setSound(null)
    setRecordingInstance(null)
    setAudioDeleted(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -300}
    >
      <View className="flex-1">
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        <View className="grow ">
          <Image
            className="mt-[-160px] grow rounded-b-[16px]"
            style={{
              flex: 1,
              resizeMode: 'cover',
            }}
            source={{ uri: imgUrl }}
          />
        </View>
        <View className="absolute w-full">
          <HeaderCardsEdit onPressedButton={showModal} />
        </View>
        <View className=" flex-[1.7] flex-col">
          <View className="flex-1">
            <View className="flex-[1.5] items-center justify-center ">
              <Text className="font-900 text-[28px] text-primary">{store.card.name}</Text>
            </View>
            <View className="flex-[1.5] flex-row items-start justify-center">
              <View className="flex-row items-center justify-center">
                <View>
                  <Input
                    name="name"
                    control={control}
                    label={t('standards.cardName')}
                    outlineStyle={{
                      borderWidth: 2,
                      borderColor: Colors.primary,
                    }}
                    className="w-56"
                    style={{
                      fontSize: 18,
                      backgroundColor: Colors.white,
                    }}
                  />
                  <Text className="text-#49454F ml-3 mt-2 text-primary">{t('standards.writeName')}</Text>
                </View>
              </View>
            </View>

            <View className="flox-col flex-[3] items-center justify-center">
              <TouchableOpacity className="mb-[13px] mt-[35px]" onPress={handleDelete}>
                <View
                  className={`h-[45px] w-[150px] flex-row items-center justify-evenly rounded-full ${
                    hasAudio && !audioDeleted ? `bg-secondary` : `hidden`
                  } p-3`}
                >
                  <Record height={20} width={20} />
                  <Text className="font-1000 text-[12px] text-primary">
                    {t('screens.card.editCardScreen.delVoice')}
                  </Text>
                </View>
              </TouchableOpacity>
              <View className="flex-row">
                <TouchableOpacity onPress={handleNewRecording}>
                  <View className="h-[45px] w-[200px] flex-row items-center justify-evenly rounded-full bg-secondary p-3">
                    {isRecording ? (
                      <>
                        <Stop height={20} width={20} />
                        <Text className="font-1000 text-[12px] text-primary">
                          {t('screens.card.editCardScreen.stopRec')}
                        </Text>
                      </>
                    ) : (
                      <>
                        {recordingInstance ? (
                          <>
                            {isPlaying ? (
                              <>
                                <Pause height={20} width={20} />
                                <Text className="font-1000 text-[12px] text-primary">
                                  {t('screens.card.editCardScreen.playing')}...
                                </Text>
                              </>
                            ) : (
                              <>
                                <Play height={20} width={20} />
                                <Text className="font-1000 text-[12px] text-primary">{t('standards.cardName')}</Text>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <Play height={20} width={20} />
                            <Text className="font-1000 text-[12px] text-primary">
                              {t('screens.card.editCardScreen.RecVoice')}
                            </Text>
                          </>
                        )}
                      </>
                    )}
                  </View>
                </TouchableOpacity>

                {sound && <CircularButton Icon={Trash} handler={handleDeleteAudio} />}
              </View>
            </View>
          </View>
          <View className="mx-10 mb-[s2px] mt-6">
            <Text className="mb-[20px] ml-10 text-[18px] font-bold text-primary">
              {t('screens.card.editCardScreen.cardSettings')}
            </Text>
            <View className="ml-10 w-[220px] ">
              <DropDownPicker
                open={showDropDown}
                multiple={false}
                setOpen={setShowDropDown}
                key={dropdownKey}
                containerStyle={{ height: 40, width: 250 }}
                value={category}
                setValue={setCategory}
                items={categoryList}
              />
              <View className="items-center">
                <Checkbox.Item
                  label="Make global for all users"
                  status={checked ? 'checked' : 'unchecked'}
                  position="leading"
                  onPress={() => setChecked(!checked)}
                />
              </View>
            </View>
          </View>
        </View>
        <View className="mb-6 flex flex-row justify-center">
          <TouchableOpacity
            className="mr-3 h-[45px] w-[130px] items-center justify-center rounded-full bg-primary"
            onPress={handleSubmit(handleUpdateCard)}
          >
            <Text className="text-white">{t('standards.saveChanges')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-[45px] w-[90px] items-center justify-center rounded-full border-2 border-primary bg-white text-center text-base"
            onPress={handleCancel}
          >
            <Text className="text-black">{t('standards.cancel')}</Text>
          </TouchableOpacity>
        </View>
        <ChangeImagePopUp visible={visible} onDismiss={hideModal} />
      </View>
    </KeyboardAvoidingView>
  )
}

export default EditCardScreen
