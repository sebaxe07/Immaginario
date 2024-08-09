import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'expo-image'
import { Button, Checkbox } from 'react-native-paper'
import GlobeIcon from '#/assets/icons/globe.svg'
import { SvgProps } from 'react-native-svg'
import CameraIcon from '#/assets/icons/camera.svg'
import ImageIcon from '#/assets/icons/imageIcon.svg'
import MicrophoneIcon from '#/assets/icons/microphone.svg'
import PlayIcon from '#/assets/icons/play.svg'
import PauseIcon from '#/assets/icons/pause.svg'
import TrashIcon from '#/assets/icons/trash.svg'
import StopIcon from '#/assets/icons/stop.svg'
import MultipleImagesIcon from '#/assets/icons/multiple_images.svg'
import useUploadImages from '@/hooks/useUploadImage'
import useNavigate from '@/hooks/useNavigate'
import { useStore } from '@/providers/store-provider'
import { Connector } from '@/lib/connector'
import { useForm } from 'react-hook-form'
import { cardSchema } from '@/schema/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../input/FormInput'
import { Colors } from '#/colors'
import { toast } from '@/utils/toast'
import DropDownPicker from 'react-native-dropdown-picker'
import { useIsFocused } from '@react-navigation/native'
import { Audio } from 'expo-av'
import { Recording } from 'expo-av/build/Audio'
import { useTranslation } from 'react-i18next'

export const CreateNewCard = () => {
  const store = useStore()
  const connector = new Connector(store)
  const { imageUri, setImageUri, handleCameraPermission, handleImageFromGallery } = useUploadImages()
  const [checked, setChecked] = useState(false)
  const { t } = useTranslation()

  const [showDropDown, setShowDropDown] = useState(false)
  const [category, setCategory] = useState('')
  const [dropdownKey, setDropdownKey] = useState(Math.random())
  const [categoryList, setCategoryList] = useState([])
  const [creatingCard, setCreatingCard] = useState<boolean>(false)

  // category contains the value of the selected category
  // checked contains the value of the checkbox (true/false)
  const getCards = async () => {
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

  /*
   *
   * Get sequences when screen is focused
   *
   */
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) return

    getCards()
  }, [isFocused])

  useEffect(() => {
    store.setLoading(true)

    getCards()
  }, [])

  const navigate = useNavigate()

  const handleCancel = () => {
    setCategory(null)
    setDropdownKey(Math.random())

    reset()
    setImageUri(null)
    cleanupAudio()

    navigate.to('Home')
  }

  const handleImageUpload = async (cardId: string, uri: string) => {
    store.setLoading(true)
    try {
      return await connector.storage.uploadCardImage(cardId, uri)
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      store.setLoading(false)
    }
  }

  const handleCamera = async () => setImageUri(await handleCameraPermission())

  const handleGallery = async () => setImageUri(await handleImageFromGallery())

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      name: '',
    },
  })

  const [isRecording, setIsRecording] = useState(false)
  const [recordingInstance, setRecordingInstance] = useState<Recording>(null)
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
      console.log('Recording has begun')
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

  const handlePauseRecording = async () => {
    await sound.pauseAsync()
    setIsPlaying(false)
  }

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
  }

  const handleCreateCard = async (formData: z.infer<typeof cardSchema>) => {
    if (!imageUri) return toast({ title: 'Error', message: 'Please upload an image' })

    if (creatingCard) return
    setCreatingCard(true)

    const cardId = await connector.db.card.create(formData.name, '', category, null, checked)

    const uploadedImage = await handleImageUpload(cardId, imageUri)
    await connector.db.card.setImageUrl(cardId, uploadedImage)

    console.log('uploaded image', uploadedImage)

    setImageUri(null)

    const audio = recordingInstance ? await connector.storage.uploadCardAudio(cardId, recordingInstance.getURI()) : null
    await connector.db.card.setVoiceUrl(cardId, audio)

    navigate.to('Cards')
    reset()
    cleanupAudio()
    setCategory(null)
    setImageUri(null)
    setCreatingCard(false)
    navigate.to('Cards')
  }

  return (
    <View className="flex h-full items-center gap-4">
      <Text className="pt-4 text-xl font-bold">{t('components.createNew.createNewCard')}</Text>
      <View className="flex h-52 w-52 items-center justify-center rounded-2xl bg-stroke">
        {imageUri ? <Image className="h-full w-full rounded-2xl" source={{ uri: imageUri }} /> : <MultipleImagesIcon />}
      </View>
      <View>
        <View className="mb-[5px] flex-row justify-between">
          <Buttons name={t('standards.takePhoto')} SvgComponent={CameraIcon} onPress={handleCamera} />
          <Buttons SvgComponent={GlobeIcon} onPress={() => {}} />
        </View>
        <View className=" flex-row justify-between">
          <Buttons name={t('standards.chooseGallery')} SvgComponent={ImageIcon} onPress={handleGallery} />
        </View>
      </View>

      <View className="flex flex-row items-center space-x-2">
        <Input
          name="name"
          control={control}
          label={t('standards.cardName')}
          className="w-56"
          style={{
            fontSize: 18,
            backgroundColor: Colors.white,
          }}
        />
        <View className="w-5 flex-row justify-between">
          {isRecording ? (
            <Buttons SvgComponent={StopIcon} onPress={handleStopRecording} />
          ) : (
            <>
              {!recordingInstance ? (
                <Buttons SvgComponent={MicrophoneIcon} onPress={handleRecordAudio} />
              ) : (
                <Buttons SvgComponent={TrashIcon} onPress={handleDeleteAudio} />
              )}
            </>
          )}

          {!isRecording && recordingInstance && (
            <>
              {isPlaying ? (
                <Buttons SvgComponent={PauseIcon} onPress={handlePauseRecording} />
              ) : (
                <Buttons SvgComponent={PlayIcon} onPress={handlePlayRecording} />
              )}
            </>
          )}
        </View>
      </View>
      <View>
        <Text className="mb-[10px] text-[16px] font-bold text-primary">{t('standards.cardCat')}</Text>

        <DropDownPicker
          open={showDropDown}
          multiple={false}
          setOpen={setShowDropDown}
          key={dropdownKey}
          containerStyle={{ height: 40, width: 300 }}
          value={category}
          setValue={setCategory}
          items={categoryList}
          placeholder={t('components.createNew.selectCat')}
        />
        <Checkbox.Item
          label={t('components.createNew.makeGlobal')}
          status={checked ? 'checked' : 'unchecked'}
          position="leading"
          onPress={() => setChecked(!checked)}
        />
      </View>
      <View className="z-[-1] flex w-4/5 flex-row justify-center">
        <Button
          onPress={handleCancel}
          className="bg-white-1 mr-[8px] h-10 w-28 border border-black"
          textColor="black"
          mode="outlined"
        >
          {t('standards.cancel')}
        </Button>
        <Button onPress={handleSubmit(handleCreateCard)} className=" h-10 w-28 bg-primary" textColor="white">
          {t('standards.confirm')}
        </Button>
      </View>
    </View>
  )
}

type NewButtonsProps = {
  name?: string
  SvgComponent: React.FC<SvgProps>
  onPress: () => void
}

const Buttons = ({ name, SvgComponent, onPress }: NewButtonsProps) => {
  return (
    <TouchableOpacity
      className="m-[2px] flex h-10 grow flex-row items-center justify-center rounded-full bg-secondary px-4"
      onPress={onPress}
    >
      <SvgComponent />
      {name && <Text className="ml-1 text-sm">{name}</Text>}
    </TouchableOpacity>
  )
}
