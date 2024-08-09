import ScreenLayout from '@/layout/ScreenLayout'
import { Avatar, IconButton, Text, TextInput } from 'react-native-paper'
import React, { useEffect, useState } from 'react'
import { useStore } from '@/providers/store-provider'
import { Connector } from '@/lib/connector'
import { ScrollView, View } from 'react-native'
import { Colors } from '#/colors'
import { toast } from '@/utils/toast'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

interface AssignTherapistScreenProps {}

const AssignTherapistScreen: React.FC<AssignTherapistScreenProps> = () => {
  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const isFocused = useIsFocused()

  const [searchInput, setSearchInput] = useState('')

  const [caregivers, setCaregivers] = useState<UserProfile[]>([])
  const [searchBackup, setSearchBackup] = useState<UserProfile[]>([])

  const getCaregivers = async () => {
    await connector.db.user.getAllCaregiversWithTherapist().then((caregivers) => {
      setCaregivers(caregivers)
      setSearchBackup(caregivers)

      if (searchInput === '') return
      handleSearch()
    })

    store.setLoading(false)
  }

  useEffect(() => {
    if (!isFocused) return
    store.setLoading(true)

    getCaregivers()
  }, [isFocused])

  const handleSearch = () => {
    const filteredCaregivers = searchBackup.filter((user) =>
      user.fullName.toLowerCase().includes(searchInput.toLowerCase()),
    )

    setCaregivers(filteredCaregivers)
  }

  useEffect(handleSearch, [searchInput])

  const handleResetSearch = () => {
    setSearchInput('')
    setCaregivers(searchBackup)
  }

  const handleAssignTherapist = async (uid: string) => {
    store.setLoading(true)

    connector.db.user
      .assignTherapistToCaregiver(uid, store.user.uid)
      .then(() => {
        toast({ title: 'Success', message: t('screens.therapist.assignTherapistScreen.yourselfAsTh') })
        getCaregivers()
      })
      .catch(() => toast({ title: 'Error', message: 'Something went wrong. Could not assign caregiver' }))
      .finally(() => store.setLoading(false))
  }

  return (
    <ScreenLayout title="Assign patient" backButton={true} tabBar={false}>
      <TextInput
        mode="outlined"
        label={t('standards.search')}
        left={<TextInput.Icon icon="magnify" />}
        right={
          searchInput && <TextInput.Icon icon="close-circle" color={Colors.dismissedOver} onPress={handleResetSearch} />
        }
        value={searchInput}
        onChangeText={setSearchInput}
        className="mb-2"
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {caregivers.map((user) => (
          <Profile {...user} handler={handleAssignTherapist} key={user?.uid} />
        ))}
      </ScrollView>
    </ScreenLayout>
  )
}

const Profile = ({ uid, fullName, email, therapistProfile, handler }: UserProfile & { handler: (e) => void }) => {
  const initials = fullName
    ?.split(' ')
    .map((name) => name[0])
    .join('')

  const hasTherapist = therapistProfile !== undefined

  return (
    <View className="my-1 min-h-[60px] flex-row items-center justify-between ">
      <View className="flex-row items-center space-x-2">
        <Avatar.Text size={48} label={initials} />
        <View className="justify-center">
          <Text className="text-lg font-semibold text-primary">{fullName}</Text>
          <Text className="text-overlayButton">{email}</Text>
          {hasTherapist && <Text>Therapist: {therapistProfile?.fullName}</Text>}
        </View>
      </View>
      {!hasTherapist && (
        <IconButton
          mode="contained"
          containerColor={Colors.primary}
          iconColor={Colors.white}
          size={16}
          onPress={() => handler(uid)}
          icon="account-plus"
        />
      )}
    </View>
  )
}

export default AssignTherapistScreen
