import { Appbar, Text } from 'react-native-paper'
import { ScrollView, View } from 'react-native'
import ScreenLayout from '@/layout/ScreenLayout'
import React, { useCallback, useContext } from 'react'
import useNavigate from '@/hooks/useNavigate'
import SavedDayCard from '@/components/agendasave/SavedDayCard'
import { useStore } from '@/providers/store-provider'
import { Connector } from '@/lib/connector'
import AgendaContext from '@/context/AgendaContext'
import { useFocusEffect } from '@react-navigation/core'

const SavedDaysScreen = () => {
  const navigate = useNavigate()
  const [savedDays, setSavedDays] = React.useState([])
  const { selectedUser, selectedDay } = useContext(AgendaContext)
  const store = useStore()
  const connector = new Connector(store)
  const userId = selectedUser?.uid
  const fetchSavedDays = async () => {
    store.setLoading(true)

    await connector.db.agenda
      .getSavedDays(userId)
      .then((days) => setSavedDays(days))
      .finally(() => store.setLoading(false))
  }

  useFocusEffect(
    useCallback(() => {
      fetchSavedDays()
    }, [selectedUser]),
  )

  const handleRestore = async (saveId: string) => {
    await connector.db.agenda.restoreSavedDay(saveId, selectedDay ?? 0, userId).then(() => {
      navigate.to('Agenda')
    })
  }
  const handleDelete = async (saveId: string) => {
    await connector.db.agenda.deleteSavedDay(saveId).then(() => fetchSavedDays())
  }

  return (
    <ScreenLayout disableMargin backgroundSecondary>
      <Appbar.Header statusBarHeight={0} className="bg-secondary">
        <Appbar.Action icon="close" onPress={() => navigate.to('Agenda')} color="black" />
        <Appbar.Content title="Restore a day" color="black" className="w-full text-center text-xl font-bold" />
      </Appbar.Header>
      <View className="flex-1 rounded-t-3xl bg-white p-4">
        <Text className="mb-2 ml-2 mt-4 text-lg font-bold">Saved days</Text>
        <ScrollView className="p-1">
          {!store.loading && savedDays.length === 0 && (
            <View className="h-[60vh] justify-center ">
              <Text className="text-center">No saved days yet</Text>
            </View>
          )}
          {savedDays.map((savedDay) => (
            <SavedDayCard key={savedDay.id} savedDay={savedDay} onRestore={handleRestore} onDelete={handleDelete} />
          ))}
        </ScrollView>
      </View>
    </ScreenLayout>
  )
}

export default SavedDaysScreen
