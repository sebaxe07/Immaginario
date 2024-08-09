import ScreenLayout from '@/layout/ScreenLayout'
import React, { useEffect, useRef, useState } from 'react'
import { Appbar, Text } from 'react-native-paper'
import LeftArrow from '#/assets/icons/leftArrow.svg'
import NewSequence from '#/assets/icons/newSequence.svg'
import { Colors } from '#/colors'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import SequenceButton from '@/components/sequence/RelatedSequences'
import SearchBar from '@/components/input/SearchBar'

import BottomSheet from '@gorhom/bottom-sheet'
import { useStore } from '@/providers/store-provider'
import { Connector } from '@/lib/connector'
import useNavigate from '@/hooks/useNavigate'
import CreateSequenceDrawer from './CreateSequenceDrawer'
import { useIsFocused } from '@react-navigation/native'
import { useStatusBarColor } from '@/hooks/useStatusBarColor'
import { useTranslation } from 'react-i18next'

const SequenceScreen = () => {
  const navigate = useNavigate()
  const handleReturn = () => navigate.goBack()

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  /*
   *
   * Sequence fetching and preserving of state
   *
   */
  const [savedSequences, setSavedSequences] = useState<Sequence[]>([])

  const getSequences = async () => {
    store.setLoading(true)

    await connector.db.sequence.getMySequences().then((sequences) => {
      setSavedSequences(sequences)
    })

    store.setLoading(false)
  }

  /*
   *
   * Search and filtering on the update of sequences or search query
   *
   */
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState<Sequence[]>([])

  useEffect(() => {
    const filtered = savedSequences.filter((s: Sequence) => s.name.toLowerCase().includes(query.toLowerCase()))
    setFiltered(filtered)
  }, [query, savedSequences])

  /*
   *
   * Get sequences when screen is focused
   *
   */
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) return

    getSequences()
  }, [isFocused])

  /*
   *
   * Bottom sheet
   *
   */
  const bottomSheetRef = useRef<BottomSheet>(null)

  const handleOpenNewSequence = () => bottomSheetRef.current.expand()

  useStatusBarColor('secondary')

  return (
    <ScreenLayout disableMargin backgroundSecondary={true}>
      <Appbar.Header statusBarHeight={0} theme={{ colors: { surface: Colors.secondary } }}>
        <Appbar.Action
          className="bg-Primary left-[4px] h-[45px] w-[45px] rounded-full "
          size={20}
          animated={false}
          icon={() => <LeftArrow width={20} height={20} />}
          onPress={handleReturn}
        />
        <Appbar.Content
          title={t('screens.sequence.SequencesScreen.sequences')}
          color={Colors.primary}
          className="m-1 h-[35px] w-full items-center  justify-center"
          style={{ position: 'absolute', alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}
          titleStyle={{ fontSize: 24 }}
        />
      </Appbar.Header>
      <View className="flex-1 rounded-t-[16px] bg-white">
        <SafeAreaProvider className="flex-1">
          <View className="flex-1">
            <View className="m-5 flex-row items-center justify-end space-x-4">
              <View className="flex-[8]">
                <SearchBar value={query} handler={setQuery} placeholder={t('standards.searchCard')} />
              </View>
              <View className="flex-[1] flex-row justify-center space-x-4">
                <TouchableOpacity onPress={handleOpenNewSequence}>
                  <NewSequence height={25} width={25} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                  <View className="mx-5 mt-4 justify-center">
                    <Text className="text-xl font-medium text-primary">{t('standards.savedSeq')}</Text>
                  </View>
                  <View className="flex-row flex-wrap items-center justify-between">
                    {filtered.map((sequence, index) => (
                      <SequenceButton key={index} sequence={sequence} date={'No date'} />
                    ))}
                  </View>
                </View>
                <View className="h-[200px]" />
              </ScrollView>
            </View>
          </View>
          <CreateSequenceDrawer sheet={bottomSheetRef} refresh={getSequences} />
        </SafeAreaProvider>
      </View>
    </ScreenLayout>
  )
}

export default SequenceScreen
