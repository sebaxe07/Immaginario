import Play from '#/assets/icons/speaker.svg'
import Pause from '#/assets/icons/pause.svg'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import CircularButton from '../button/CircularButton'
import { Connector } from '@/lib/connector'
import { useStore } from '@/providers/store-provider'
import { useIsFocused } from '@react-navigation/native'

interface CardNameBoxProps {
  card?: Card
  variant: 'card' | 'sequence'
  center?: boolean
}

const CardNameBox = ({ card, variant, center = false }: CardNameBoxProps) => {
  const store = useStore()
  const connector = new Connector(store)

  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) return

    store.setAudio({ ...store.audio, uri: card?.voiceUrl })

    return () => store.resetAudio()
  }, [isFocused])

  const handlePlay = async () => await connector.audio.play()
  const handlePause = async () => await connector.audio.pause()

  const { name, voiceUrl } = card ?? {}

  return (
    <View className="flex-0.5">
      <View className="mb-2 mt-5 flex-row">
        {name && (
          <View className="flex-[1] flex-row items-center justify-center">
            <Text className="font-900 text-[28px] text-primary">{name}</Text>

            {voiceUrl &&
              (store.audio.isPlaying ? (
                <CircularButton Icon={Pause} handler={handlePause} />
              ) : (
                <CircularButton Icon={Play} handler={handlePlay} />
              ))}
          </View>
        )}
      </View>
    </View>
  )
}

export default CardNameBox
