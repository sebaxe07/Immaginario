import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import DaySwitcher from '@/components/DaySwitcher'
import { Colors } from '#/colors'
import { useStore } from '@/providers/store-provider'
import Icon from 'react-native-vector-icons/FontAwesome'
import DraggableFlatList from 'react-native-draggable-flatlist'
import CardComp from '@/components/card/CardComp'
import ScreenLayout from '@/layout/ScreenLayout'
import { useFocusEffect } from '@react-navigation/core'
import useNavigate from '@/hooks/useNavigate'
import { useStatusBarColor } from '@/hooks/useStatusBarColor'
import { Connector } from '@/lib/connector'
import AgendaContext from '@/context/AgendaContext'
import { toast } from '@/utils/toast'
import ZoomableView from '@/components/ZoomableView'
import { useTranslation } from 'react-i18next'

const AgendaScreen = () => {
  const { t } = useTranslation()
  const [selectedDay, setSelectedDay] = useState(0)
  const daysOfWeek = [
    t('screens.agenda.agendaScreen.mon'),
    t('screens.agenda.agendaScreen.tue'),
    t('screens.agenda.agendaScreen.wed'),
    t('screens.agenda.agendaScreen.thu'),
    t('screens.agenda.agendaScreen.fri'),
    t('screens.agenda.agendaScreen.sat'),
    t('screens.agenda.agendaScreen.sun'),
  ]

  const store = useStore()
  const connector = new Connector(store)

  const [agenda, setAgenda] = useState({})
  const [filteredItems, setFilteredItems] = useState([])
  const [editPage, setEditPage] = useState<boolean>(false)
  const { selectedUser } = useContext(AgendaContext)
  const userID = selectedUser?.uid
  const zoomableViewRef = React.useRef(null)
  const updateFilteredItems = () => setFilteredItems(agenda[selectedDay] || [])

  const fetchAgenda = async () => {
    store.setLoading(true)
    await connector.db.agenda
      .getAgenda(userID)
      .then((res) => {
        if (!res || !res.agenda) {
          setAgenda({})
          return console.log('No agenda found')
        }

        setAgenda(res.agenda)
      })
      .catch((_) => {
        setAgenda({})
      })
      .finally(() => store.setLoading(false))
  }

  useFocusEffect(
    useCallback(() => {
      setEditPage(false)

      fetchAgenda()
      zoomableViewRef.current?.reset()
    }, [userID]),
  )

  useEffect(() => {
    fetchAgenda()
  }, [selectedUser])

  useEffect(() => {
    updateFilteredItems()
    zoomableViewRef.current?.reset()
  }, [selectedDay, agenda])

  const handleSelectDay = (dayIndex: number) => setSelectedDay(dayIndex)
  const handleEditPage = () => setEditPage((prevEditPage) => !prevEditPage)

  const handleDelete = async (uniqueId: string) => {
    const updatedItems = filteredItems.filter((item: SequenceObject) => item.uniqueId !== uniqueId)
    setFilteredItems(updatedItems)

    const updatedAgenda = { ...agenda }

    updatedAgenda[selectedDay] = updatedAgenda[selectedDay].filter((item) => item.uniqueId !== uniqueId)

    try {
      const weekday = selectedDay as unknown as WeekdayNumeral
      await connector.db.agenda.setDay(weekday, updatedAgenda[selectedDay], userID)
      // Refetch agenda to update the agenda state
      fetchAgenda()
    } catch (error) {
      console.error('Error updating agenda:', error)
    }
  }

  const navigate = useNavigate()

  const goToSubLevels = (sequence: Sequence) => {
    store.setSequence(sequence)
    navigate.to('SubLevels')
  }
  useStatusBarColor('secondary')

  const hasSublevel = (type: string) => type === 'sequence'

  async function handleDrag({ data }: { data: SequenceObject[] }) {
    console.log(data)
    const updatedItems = data
    setFilteredItems(updatedItems)
    const updatedAgenda = { ...agenda }
    updatedAgenda[selectedDay] = updatedItems

    try {
      const weekday = selectedDay as unknown as WeekdayNumeral
      await connector.db.agenda.setDay(weekday, updatedAgenda[selectedDay], userID)
      // Refetch agenda to update the agenda state
      fetchAgenda()
    } catch (error) {
      console.error('Error updating agenda:', error)
    }
  }

  return (
    <>
      <ScreenLayout disableMargin backgroundSecondary={true}>
        <SafeAreaView className="flex-1 bg-white">
          <DaySwitcher
            days={daysOfWeek}
            selectedDay={selectedDay}
            onSelectDay={handleSelectDay}
            onEditPage={handleEditPage}
            isEditMode={editPage}
            onResetZoom={() => {
              zoomableViewRef.current!.reset()
            }}
          />
          {!editPage && (
            <ZoomableView ref={zoomableViewRef} maxScale={5}>
              <ScrollView className="w-full flex-1">
                {filteredItems &&
                  filteredItems.map(({ content: item, uniqueId, type }, index) => (
                    <View key={uniqueId} style={index === filteredItems.length - 1 ? { marginBottom: 60 } : {}}>
                      <CardComp
                        name={item.name}
                        audio={item.voiceUrl ?? null}
                        link={item.imgUrl ?? item.placeholder ?? 'https://picsum.photos/110'}
                        isChecked={item.isChecked || false}
                        sublevel={hasSublevel(type)}
                        onPressTasks={() => goToSubLevels(item)}
                      />
                    </View>
                  ))}

                {!store.loading && !filteredItems.length && (
                  <View className="h-[60vh] justify-center ">
                    <Text className="text-center">{t('screens.agenda.agendaScreen.noActivities')}</Text>
                  </View>
                )}
              </ScrollView>
            </ZoomableView>
          )}
          {editPage && (
            <View className="flex-1">
              <DraggableFlatList
                data={filteredItems}
                renderItem={({ item, drag, isActive }) => (
                  <TouchableOpacity
                    onLongPress={drag}
                    activeOpacity={1}
                    style={[
                      filteredItems.findIndex((filteredItem) => filteredItem.uniqueId === item.uniqueId) ===
                      filteredItems.length - 1
                        ? { marginBottom: 60 }
                        : {},
                      isActive ? { backgroundColor: Colors.white, elevation: 5 } : {},
                    ]}
                  >
                    <View key={item.uniqueId} className="flex-row items-center">
                      <View className="mx-4 flex flex-col">
                        <TouchableOpacity
                          onPress={() => handleDelete(item.uniqueId)}
                          className="mb-4 w-24 rounded-full border-2 border-stroke bg-white p-2"
                        >
                          <View className="flex-column items-center">
                            <Icon className="text-center" name="trash" size={20} color={Colors.incomplete} />
                            <Text className="mt-0.5 text-center font-medium text-incomplete">
                              {t('standards.delete')}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <CardComp
                        name={item.content.name}
                        link={item.content.imgUrl ?? item.content.placeholder ?? 'https://picsum.photos/110'}
                        isChecked={item.content.isChecked || false}
                        sublevel={item.type === 'sequence'}
                      />

                      <View className="mx-1 flex flex-col">
                        <TouchableOpacity
                          onPress={() => toast({ message: t('screens.agenda.agendaScreen.longPress'), title: 'info' })}
                          onLongPress={drag}
                        >
                          <View className="flex-column items-center">
                            <Icon className="text-center" name="sort" size={30} color={Colors.secondary} />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.uniqueId}
                onDragEnd={handleDrag}
              />
            </View>
          )}
          <View></View>
        </SafeAreaView>
      </ScreenLayout>
    </>
  )
}

export default AgendaScreen
