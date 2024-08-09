import { useStore } from '@/providers/store-provider'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import AgendaW from '#/assets/icons/agenda_w.svg'
import Seque from '#/assets/icons/sequence.svg'
import Setting from '#/assets/icons/settings.svg'
import RightArrW from '#/assets/icons/rightArrowW.svg'
import Cards from '#/assets/icons/cards.svg'
import User from '#/assets/icons/person.svg'
import DownSArr from '#/assets/icons/DownSArr.svg'
import React, { useContext, useEffect, useState } from 'react'
import { SvgProps } from 'react-native-svg'
import useNavigate from '@/hooks/useNavigate'
import useDisableLoading from '@/hooks/useDisableLoading'
import ScreenLayout from '@/layout/ScreenLayout'
import AgendaContext from '@/context/AgendaContext'
import { useIsFocused } from '@react-navigation/native'
import { Connector } from '@/lib/connector'
import { Menu } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { toast } from '@/utils/toast'

const HomeScreen = () => {
  const navigate = useNavigate()
  const [showDropDown, setShowDropDown] = useState(false)
  const { selectedUser, setSelectedUser } = useContext(AgendaContext)
  const [caregivers, setCaregivers] = useState([])

  const goToAgendaScreen = () => navigate.to('Agenda')
  const goToSettingsScreen = () => navigate.to('Settings')

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  // Wait to set loading false until screen has actually rendered
  useDisableLoading()

  const profile = store?.profile
  const firstName = profile?.fullName?.split(' ')[0]

  const getCaregivers = async () => {
    const caregivers = await connector.db.user.getOwnCaregivers()
    const caregiversList = caregivers?.map((caregiver) => (
      <Menu.Item
        key={Math.random()}
        title={caregiver.fullName}
        onPress={() => {
          setSelectedUser(caregiver)
          setShowDropDown(false)
        }}
      />
    ))
    if (selectedUser?.uid != profile?.uid) {
      caregiversList.push(
        <Menu.Item
          key={Math.random()}
          title={'My profile'}
          onPress={() => {
            setSelectedUser(profile)
            setShowDropDown(false)
          }}
        />,
      )
    }
    setCaregivers(caregiversList)
  }
  const isFocused = useIsFocused()
  useEffect(() => {
    if (!isFocused) return
    if (!selectedUser) setSelectedUser(profile)
    getCaregivers()
    store.setLoading(false)
  }, [isFocused])

  useEffect(() => {
    if (!isFocused) return
    getCaregivers()
  }, [selectedUser])

  return (
    <>
      <ScreenLayout disableMargin backgroundSecondary={false}>
        <ScrollView className="p-6">
          <View className="mb-2">
            <View className="my-4 h-24 flex-col justify-between">
              <View>
                <View className="flex-row justify-between">
                  <Text className="text-[35px] font-semibold">
                    {t('screens.HomeScreen.hi')} {firstName}!
                  </Text>
                  <TouchableOpacity onPress={goToSettingsScreen}>
                    <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-secondary">
                      <Setting height={20} width={20} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {store?.profile?.type === 'therapist' && (
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setShowDropDown(true)
                      if (caregivers.length === 0)
                        toast({
                          message: t('screens.HomeScreen.noCaregivers'),
                          title: 'info',
                        })
                    }}
                  >
                    <View className="h-[40px] w-[55%] justify-center rounded-[10px] border-[0.5px] border-primary/10 bg-white shadow-md">
                      <View className="flex-row items-center justify-around  pl-2">
                        <User height={14} width={14} />
                        <Text className="text-left text-[15px] font-normal text-primary">
                          {selectedUser?.uid !== profile?.uid
                            ? selectedUser?.fullName
                            : t('screens.HomeScreen.selectPatient')}
                        </Text>

                        <DownSArr height={20} width={20} />
                      </View>
                    </View>
                  </TouchableOpacity>
                  <Menu
                    visible={showDropDown}
                    onDismiss={() => setShowDropDown(false)}
                    anchor={<View style={{ height: 1 }}>{/* Anchor view for the dropdown */}</View>}
                  >
                    {caregivers.length !== 0 && caregivers}
                  </Menu>
                </View>
              )}
            </View>
          </View>

          <View className="mb-6 w-full">
            <View>
              <View className="mb-6 w-full flex-col items-stretch">
                <TouchableOpacity
                  className="h-[111px] flex-row items-center justify-evenly rounded-[16px] bg-primary shadow shadow-slate-800/20"
                  onPress={goToAgendaScreen}
                >
                  <View className="flex-row ">
                    <AgendaW height={40} width={40} />
                    <View className="ml-3 h-[40px] flex-col">
                      <Text className="text-[20px] font-semibold text-white">
                        {t('screens.HomeScreen.agenda')} {selectedUser?.fullName}
                      </Text>
                      <Text className="text-[15px] font-normal text-white">{t('screens.HomeScreen.thisWeek')}</Text>
                    </View>
                  </View>
                  <RightArrW height={20} width={10} />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex flex-row items-center space-x-4">
              <View className="flex-1">
                <HotlinkCard title={t('components.nav.Cards')} icon={Cards} to="Cards" />
              </View>
              <View className="flex-1">
                <HotlinkCard title={t('components.nav.Sequences')} icon={Seque} to="Sequence" />
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenLayout>
    </>
  )
}

const HotlinkCard = ({ title, to, icon: Icon }: { title: string; to: string; icon: React.FC<SvgProps> }) => {
  const navigate = useNavigate()

  return (
    <TouchableOpacity
      className="h-36 items-center justify-evenly rounded-[16px] bg-secondary shadow shadow-slate-800/20"
      onPress={() => navigate.to(to)}
    >
      <Icon height={48} width={48} />
      <Text className="justify-evenly text-center text-[20px] font-semibold text-primary">{title}</Text>
    </TouchableOpacity>
  )
}

export default HomeScreen
