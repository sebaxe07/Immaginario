import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import ScreenLayout from '@/layout/ScreenLayout'
import MiniCard from '@/components/card/MiniCard'
import { Appbar } from 'react-native-paper'
import { Colors } from '#/colors'
import NewCategory from '#/assets/icons/newFolder.svg'
import NewImage from '#/assets/icons/newImage.svg'
import useNavigate from '@/hooks/useNavigate'
import React, { useEffect, useRef, useState } from 'react'
import ChipSelect from '@/components/chip/ChipSelect'
import LeftArrow from '#/assets/icons/leftArrow.svg'
import SearchBar from '@/components/input/SearchBar'
import { useStore } from '@/providers/store-provider'

import { useStatusBarColor } from '@/hooks/useStatusBarColor'
import { Connector } from '@/lib/connector'
import { capitalize } from '@/utils/capitalize'
import { useIsFocused } from '@react-navigation/native'
import CategorySheet from '@/components/folder/CategorySheet'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useTranslation } from 'react-i18next'

const CardsScreen = () => {
  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const [allCards, setCards] = useState([])
  const [filteredCards, setFilteredCards] = useState([])
  const [categories, setCategories] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const navigate = useNavigate()
  const sheetRef = useRef(null)

  const goToCardOptions = (card: Card) => {
    store.setCard(card)
    navigate.to('CardOptions')
  }

  const getCategories = async (cardCategories = []) => {
    store.setLoading(true)

    if (cardCategories.length === 0) cardCategories = categories

    try {
      const myCategories = await connector.db.category.getAll()
      const allCategories = [...myCategories.map((c) => c.name), ...cardCategories]

      setCategories([...new Set(allCategories)].filter(Boolean))
    } catch (e) {
      console.error('Could not fetch cards/categories')
    }

    store.setLoading(false)
  }

  /*
   *
   * Card fetching and preserving of state
   *
   */
  const getCards = async () => {
    store.setLoading(true)

    try {
      const myCards = await connector.db.card.getMyCards()
      const globalCards = await connector.db.card.getGlobal()
      const allCards = [...myCards, ...globalCards]
      const uniqueCards = Array.from(new Map(allCards.map((card) => [card.id, card])).values())

      const uniqueCategories = new Set(uniqueCards.map((card) => card.category))

      setCards(uniqueCards)
      // setCategories(['All', ...uniqueCategories].filter(Boolean))

      await getCategories(Array.from(uniqueCategories))
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

  useEffect(() => {
    const filtered = allCards.filter((card) => {
      const matchesCategory = selectedCategory === 'All' || card.category === selectedCategory
      const matchesSearch = card.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    setFilteredCards(filtered)
  }, [searchQuery, allCards, selectedCategory, categories])

  const onChangeSearch = (query: string) => {
    setSelectedCategory('All')
    setSearchQuery(query)
  }

  const handleCategorySelect = (category: string) => setSelectedCategory(category)

  // Function for displaying the Sheet component
  const handleNewCategory = () => sheetRef.current.open()

  //Function for NewImage
  const handleNewImage = () => {
    navigate.to('NewCard')
  }

  useStatusBarColor('secondary')

  return (
    <>
      <ScreenLayout disableMargin backgroundSecondary>
        <Appbar.Header statusBarHeight={0} theme={{ colors: { surface: Colors.secondary } }}>
          <Appbar.Action
            className="bg-Primary left-[4px] h-[45px] w-[45px] rounded-full "
            size={20}
            animated={false}
            icon={() => <LeftArrow width={20} height={20} />}
            onPress={() => navigate.to('Home')}
          />
          <Appbar.Content
            title={t('screens.card.cardsScreen.cards')}
            color={Colors.primary}
            className="m-1 h-[35px] w-full items-center  justify-center"
            style={{ position: 'absolute', alignItems: 'center', alignContent: 'center', alignSelf: 'center' }}
            titleStyle={{ fontSize: 24 }}
          />
        </Appbar.Header>

        <View className="flex-1 rounded-t-[16px] bg-white">
          <SafeAreaView className="m-5 flex-1">
            <View className="flex-1">
              <View className="flex-row items-center justify-end space-x-4">
                <View className="flex-[4]">
                  <SearchBar value={searchQuery} handler={onChangeSearch} placeholder={t('standards.searchCard')} />
                </View>
                <View className="flex-[1] flex-row justify-center space-x-4">
                  <TouchableOpacity onPress={handleNewCategory}>
                    <NewCategory height={25} width={25} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNewImage}>
                    <NewImage />
                  </TouchableOpacity>
                </View>
              </View>
              <View className="my-[24px] flex-row">
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="flex">
                  <ChipSelect
                    name={t('screens.card.cardsScreen.all')}
                    selected={'All' === selectedCategory}
                    onSelect={() => handleCategorySelect('All')}
                  />
                  {categories.map((category) => (
                    <ChipSelect
                      key={category}
                      name={capitalize(category)}
                      selected={category === selectedCategory}
                      onSelect={() => handleCategorySelect(category)}
                    />
                  ))}
                </ScrollView>
              </View>
              <View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="flex-row flex-wrap items-center justify-between">
                    {filteredCards.map((card, index) => (
                      <MiniCard
                        key={index}
                        name={card.name}
                        image={card.imgUrl}
                        onPress={() => goToCardOptions(card)}
                        style={{ maxWidth: 175 }}
                      />
                    ))}
                  </View>

                  <View className="h-[200px]" />
                </ScrollView>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ScreenLayout>
      <RBSheet
        ref={sheetRef}
        closeOnDragDown={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            borderTopEndRadius: 28,
            borderTopStartRadius: 28,
          },
        }}
      >
        {<CategorySheet sheet={sheetRef} refresh={getCategories} existingCategories={categories} />}
      </RBSheet>
    </>
  )
}

export default CardsScreen
