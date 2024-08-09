import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { Appbar, Button, Modal, Portal } from 'react-native-paper'
import ScreenLayout from '@/layout/ScreenLayout'
import SearchBar from '@/components/input/SearchBar'
import useNavigate from '@/hooks/useNavigate'
import { useStore } from '@/providers/store-provider'
import AgendaContext from '@/context/AgendaContext'
import SequenceCard from '@/components/SequenceCard'
import { getUUID } from '@/utils/uuid'
import { useIsFocused } from '@react-navigation/native'
import { Connector } from '@/lib/connector'
import { useTranslation } from 'react-i18next'

const AddSeqAgendaScreen = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const [visible, setVisible] = useState(false)
  const [selectedSequence, setSelectedSequence] = useState(null)
  const [sequences, setSequences] = useState([])
  const [filteredSequences, setFilteredSequences] = useState([])

  const [agenda, setAgenda] = useState({})

  const { selectedUser, selectedDay } = useContext(AgendaContext)

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const userId = selectedUser?.uid

  const hideModal = () => setVisible(false)

  const fetchSequences = async () => {
    const mySequences = await connector.db.sequence.getMySequences(userId)
    setSequences(mySequences)
  }

  const fetchAgenda = async () => {
    const fetchedAgenda = await connector.db.agenda.getAgenda(userId)

    if (!fetchedAgenda || !fetchedAgenda.agenda) return console.log('No agenda found')

    setAgenda(fetchedAgenda.agenda)
  }

  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) return

    store.setLoading(true)
    fetchAgenda()
    fetchSequences().finally(() => store.setLoading(false))
  }, [isFocused])

  useEffect(() => {
    const filtered = sequences.filter((sequence) => sequence.name.toLowerCase().includes(query.toLowerCase()))
    setFilteredSequences(filtered)
  }, [query, sequences])

  const showModal = (sequence: Sequence) => {
    setSelectedSequence(sequence)
    setVisible(true)
  }

  const addSequenceToAgenda = () => {
    if (!selectedSequence) return console.log('No sequence selected')

    const newAgendaSequence = [
      ...(agenda[selectedDay ?? 0] || []),
      { type: 'sequence', content: selectedSequence, uniqueId: getUUID() },
    ]

    connector.db.agenda.setDay(selectedDay ?? 0, newAgendaSequence, userId).then((success) => {
      if (success) {
        setAgenda({
          ...agenda,
          [selectedDay ?? 0]: newAgendaSequence,
        })
        navigate.to('Agenda')
      }
    })

    hideModal()
  }

  return (
    <ScreenLayout disableMargin backgroundSecondary>
      <Appbar.Header statusBarHeight={0} className="bg-secondary">
        <Appbar.Action icon="close" onPress={() => navigate.to('Agenda')} color="black" />
        <Appbar.Content
          title={t('screens.agenda.addSeqAgendaScreen.title')}
          color="black"
          className="w-full text-center text-xl font-bold"
        />
      </Appbar.Header>
      <View className="flex-1 rounded-t-3xl bg-white p-4">
        <SearchBar value={query} handler={setQuery} placeholder={t('screens.agenda.addSeqAgendaScreen.placeholder')} />
        <Text className="mb-2 ml-2 mt-4 text-lg font-bold">{t('standards.savedSeq')}</Text>
        <ScrollView className="p-1">
          {filteredSequences.map((sequence) => (
            <SequenceCard key={sequence.id} sequence={sequence} onAdd={showModal} />
          ))}
        </ScrollView>
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
          <Text className="mb-4 text-xl font-bold">{t('standards.addSeq')}</Text>
          {selectedSequence && (
            <Text className="mb-4 text-base">
              {t('screens.agenda.addSeqAgendaScreen.question1')} "{selectedSequence.name}"{' '}
              {t('screens.agenda.addSeqAgendaScreen.question2')}
            </Text>
          )}
          <View className="h-10 w-full flex-row justify-around">
            <Button mode="contained-tonal" className="mr-2 rounded-lg bg-white px-5 text-primary" onPress={hideModal}>
              {t('standards.cancel')}
            </Button>
            <Button mode="contained" className="mr-2 rounded-lg bg-primary px-2" onPress={addSequenceToAgenda}>
              {t('screens.agenda.addSeqAgendaScreen.addSeq')}
            </Button>
          </View>
        </Modal>
      </Portal>
    </ScreenLayout>
  )
}

export default AddSeqAgendaScreen
