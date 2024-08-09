import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'
import { Appbar, Button, Modal, Portal } from 'react-native-paper'
import ScreenLayout from '@/layout/ScreenLayout'
import MiniCard from '@/components/card/MiniCard'
import SearchBar from '@/components/input/SearchBar'
import useNavigate from '@/hooks/useNavigate'
import { useStore } from '@/providers/store-provider'
import { useAtom } from 'jotai'
import { createSequenceState, updateSequenceState } from '@/state/sequence'
import { Connector } from '@/lib/connector'
import { useTranslation } from 'react-i18next'

const AddUpdateCardsSequenceScreen = ({ route }) => {
  const navigate = useNavigate()

  const update = route.params?.update

  const [cards, setCards] = useState({})
  const [visible, setVisible] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedCard, setSelectedCard] = useState<Card>(null)
  const [filteredCards, setFilteredCards] = useState([])

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const fetchCards = async () => {
    const myCards = await connector.db.card.getMyCards()
    const globalCards = await connector.db.card.getGlobal()

    const allCards = [...myCards, ...globalCards]

    const uniqueCards = Array.from(new Map(allCards.map((card) => [card.id, card])).values())

    return uniqueCards.reduce((acc, card) => ({ ...acc, [card.id]: card }), {})
  }

  useEffect(() => {
    store.setLoading(true)
    fetchCards()
      .then((cards) => {
        setCards(cards)
      })
      .finally(() => store.setLoading(false))
  }, [])

  useEffect(() => {
    const filtered = Object.values(cards).filter((card: Card) => card.name.toLowerCase().includes(query.toLowerCase()))
    setFilteredCards(filtered)
  }, [query, cards])

  const showModal = (card: Card) => {
    setSelectedCard(card)
    setVisible(true)
  }

  const hideModal = () => setVisible(false)

  const [sequence, setSequence] = useAtom(update ? updateSequenceState : createSequenceState)

  const addCardToSequence = () => {
    setSequence([...sequence, selectedCard])
    navigate.goBack()

    hideModal()
  }

  return (
    <ScreenLayout disableMargin backgroundSecondary tabBar={false}>
      <Appbar.Header statusBarHeight={0} className="bg-secondary">
        <Appbar.Action icon="close" onPress={() => navigate.goBack()} color="black" />
        <Appbar.Content
          title={t('screens.sequence.addCardsSequenceScreen.searchCard')}
          color="black"
          className="w-full text-center text-xl font-bold"
        />
      </Appbar.Header>
      <View className="flex-1 rounded-t-3xl bg-white p-4">
        <SafeAreaView className="flex-1">
          <SearchBar value={query} handler={setQuery} placeholder={t('standards.searchCard')} />
          <Text className="mb-2 ml-2 mt-4 text-lg font-bold">
            {t('screens.sequence.addCardsSequenceScreen.savedCards')}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between pb-16">
              {filteredCards.map((card) => (
                <MiniCard
                  key={card.id}
                  name={card.name}
                  image={card.imgUrl || 'https://picsum.photos/200'}
                  onPress={() => showModal(card)}
                  style={{ maxWidth: 175 }}
                />
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            padding: 20,
            margin: 20,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 6,
          }}
        >
          <Text className="mb-4 text-xl font-bold">Add Item</Text>
          <Text className="mb-4">{t('standards.wantAddCard')}</Text>
          {selectedCard && (
            <View className="align-center mb-12 mt-6 h-12 items-center justify-center">
              <MiniCard name={selectedCard.name} image={selectedCard.imgUrl} />
            </View>
          )}
          <View className="h-10 w-full flex-row justify-around">
            <Button mode="contained-tonal" className="mr-2 rounded-lg bg-white px-5 text-primary" onPress={hideModal}>
              {t('standards.cancel')}
            </Button>
            <Button mode="contained" className="mr-2 rounded-lg bg-primary px-2" onPress={addCardToSequence}>
              {t('standards.addCard')}
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScreenLayout>
  )
}

export default AddUpdateCardsSequenceScreen
