import { Colors } from '#/colors'
import AgendaContext from '@/context/AgendaContext'
import useNavigate from '@/hooks/useNavigate'
import React, { useContext } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { IconButton, Menu } from 'react-native-paper'
import SaveDayPrompt from '@/components/agendasave/SaveDayPrompt'
import { useTranslation } from 'react-i18next'

const DaySwitcher = ({ days, selectedDay, onSelectDay, onEditPage, isEditMode, onResetZoom }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const goToHomeScreen = () => navigate.to('Home')
  const goToAddCardsAgendaScreen = () => navigate.to('AddCardsAgenda')
  const goToAddSeqAgendaScreen = () => navigate.to('AddSeqAgenda')
  const goToRestoreDayScreen = () => navigate.to('SavedDays')

  const [visiblePlus, setVisiblePlus] = React.useState(false)
  const [visibleDots, setVisibleDots] = React.useState(false)
  const [visiblePrompt, setVisiblePrompt] = React.useState(false)

  const openMenuPlus = () => setVisiblePlus(true)
  const closeMenuPlus = () => setVisiblePlus(false)
  const openMenuDots = () => setVisibleDots(true)
  const closeMenuDots = () => setVisibleDots(false)

  const { setSelectedDay: updateSelectedDay } = useContext(AgendaContext)

  const handleSelectDay = (index: WeekdayNumeral) => {
    onSelectDay(index)
    updateSelectedDay(index)
  }

  const handleMenuPress = (handler: () => void) => {
    handler()
    closeMenuDots()
    closeMenuPlus()
  }

  return (
    <View className="h-24 items-center justify-center bg-secondary">
      <View className="w-full flex-row items-center justify-between">
        <SaveDayPrompt setVisiblePrompt={setVisiblePrompt} visiblePrompt={visiblePrompt} />

        <IconButton
          icon="arrow-left"
          onPress={() => {
            goToHomeScreen()
          }}
        />
        <IconButton icon="" style={{ opacity: 0 }} />
        <Text className="flex-1 text-center text-2xl">Agenda</Text>
        <View className="flex-row space-x-1">
          <Menu
            style={{ marginTop: 20 }}
            contentStyle={{ backgroundColor: Colors.white }}
            visible={visiblePlus}
            onDismiss={closeMenuPlus}
            anchor={<IconButton icon="plus" onPress={openMenuPlus} />}
          >
            <Menu.Item
              onPress={() => handleMenuPress(goToAddCardsAgendaScreen)}
              title={t('components.daySwitcher.addCard')}
            />
            <Menu.Item onPress={() => handleMenuPress(goToAddSeqAgendaScreen)} title={t('standards.addSeq')} />
          </Menu>
          <Menu
            style={{ padding: 20, marginRight: 20, width: 220 }}
            contentStyle={{ backgroundColor: Colors.white }}
            visible={visibleDots}
            onDismiss={closeMenuDots}
            anchor={<IconButton icon="dots-horizontal" onPress={openMenuDots} />}
          >
            <Menu.Item
              onPress={() => handleMenuPress(onEditPage)}
              title={isEditMode ? t('components.daySwitcher.exitEdit') : t('components.daySwitcher.editPage')}
            />
            <Menu.Item
              onPress={() => {
                handleMenuPress(() => {
                  setVisiblePrompt(true)
                })
              }}
              title={t('components.daySwitcher.saveDay')}
            />
            <Menu.Item
              onPress={() => {
                handleMenuPress(goToRestoreDayScreen)
              }}
              title={t('components.daySwitcher.loadDay')}
            />
            {!isEditMode && (
              <Menu.Item
                onPress={() => {
                  handleMenuPress(onResetZoom)
                }}
                title="Reset zoom"
              />
            )}
          </Menu>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={day}
            onPress={() => handleSelectDay(index)}
            className={`m-1 h-8 w-12 items-center justify-center rounded-xl ${
              selectedDay === index ? 'bg-white' : 'bg-secondary'
            }`}
          >
            <Text className={`text-center ${selectedDay === index ? 'text-primary' : 'text-primary'}`}>{day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default DaySwitcher
