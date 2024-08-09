import { Colors } from '#/colors'
import { CONTACT_EMAIL } from '@/consts'
import useNavigate from '@/hooks/useNavigate'
import { Linking, TouchableOpacity, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { auth } from '@/services/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { useStore } from '@/providers/store-provider'
import { Connector } from '@/lib/connector'
import { useTranslation } from 'react-i18next'

const LandingScreen = () => {
  const navigate = useNavigate()

  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  /**
   * Check if the user is already logged in
   * If so, set the user and profile objects in the store
   */
  onAuthStateChanged(auth, async (user) => {
    if (!user) return
    if (store.user || store.profile) return

    store.setLoading(true)

    store.setProfile({ uid: user.uid, ...(await connector.db.user.getUserById(user.uid)) })
    store.setUser(user)

    store.setLoading(false)
  })

  const handleContact = () => Linking.openURL(`mailto:${CONTACT_EMAIL}`)

  return (
    <View className="flex-1">
      <View className="flex-[1.1] items-center justify-center space-y-8">
        <View className="h-40 w-40 rounded-3xl bg-secondary"></View>
        <View className="text-center">
          <Text className="text-center text-4xl font-semibold">{t('screens.landingScreen.welcome')}</Text>
          <Text className="text-center text-xl">{t('screens.landingScreen.try')} Immaginario</Text>
        </View>
      </View>
      <View className=" flex-[1] items-center">
        <View className="w-[70%] flex-[1] space-y-8">
          <TouchableOpacity onPress={() => navigate.to('Register')}>
            <Button
              mode="contained"
              className="rounded-xl py-3"
              labelStyle={{
                fontSize: 18,
              }}
            >
              {t('screens.landingScreen.getStarted')}
            </Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigate.to('Login')}>
            <Button
              mode="contained"
              className="rounded-xl bg-secondary py-3 text-primary"
              labelStyle={{
                fontSize: 18,
                fontWeight: 'normal',
                color: Colors.primary,
              }}
            >
              {t('screens.landingScreen.alreadyHaveA')}
            </Button>
          </TouchableOpacity>
        </View>
        <View className="flex-[0.4] ">
          <TouchableOpacity onPress={handleContact}>
            <Text className="text-center text-primary/70">
              Do you need help?{' '}
              <Text className="text-primary/70 underline">{t('screens.landingScreen.contactUs')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default LandingScreen
