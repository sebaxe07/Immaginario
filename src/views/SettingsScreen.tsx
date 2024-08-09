import { Alert, View } from 'react-native'
import { Colors } from '#/colors'
import { useStore } from '@/providers/store-provider'
import { Button } from 'react-native-paper'
import { Connector } from '@/lib/connector'
import { useState } from 'react'
import useNavigate from '@/hooks/useNavigate'
import ScreenLayout from '@/layout/ScreenLayout'
import { useTranslation } from 'react-i18next'

const SettingsScreen = () => {
  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const [isAdvancedSettings, setIsAdvancedSettings] = useState(false)
  const toggleAdvancedSettings = () => setIsAdvancedSettings((s) => !s)

  return (
    <ScreenLayout title="Settings">
      {isAdvancedSettings ? <AdvancedSettings connector={connector} /> : <DefaultSettings connector={connector} />}
      <Button mode="text" onPress={toggleAdvancedSettings}>
        {isAdvancedSettings ? t('screens.settingsScreen.backToSett') : t('screens.settingsScreen.advancedSett')}
      </Button>
    </ScreenLayout>
  )
}

const DefaultSettings = ({ connector }: { connector: Connector }) => {
  const handleSignOut = async () => await connector.auth.signOut()
  const { t, i18n } = useTranslation()
  return (
    <>
      <Button mode="contained" onPress={() => i18n.changeLanguage('en')} style={{ margin: 5 }}>
        English
      </Button>
      <Button mode="contained" onPress={() => i18n.changeLanguage('ita')} style={{ margin: 5 }}>
        Italiano
      </Button>
      <Button mode="contained" onPress={handleSignOut} style={{ margin: 40 }}>
        {t('screens.settingsScreen.signOut')}
      </Button>
    </>
  )
}

const AdvancedSettings = ({ connector }: { connector: Connector }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleDeleteAccount = async () => {
    Alert.alert(t('screens.settingsScreen.delAccount'), t('screens.settingsScreen.areYouSure'), [
      {
        text: t('standards.cancel'),
        style: 'cancel',
      },
      {
        text: t('standards.delete'),
        style: 'destructive',
        onPress: async () => await connector.auth.deleteAccount(),
      },
    ])
  }

  return (
    <View className="space-y-2">
      {connector.store.userIsTherapist() && (
        <Button mode="contained" onPress={() => navigate.to('AssignTherapist')}>
          {t('screens.settingsScreen.editPatients')}
        </Button>
      )}

      <Button
        mode="contained"
        buttonColor={Colors.incomplete}
        onPress={handleDeleteAccount}
        loading={connector.store.loading}
      >
        {t('screens.settingsScreen.delAccount')}
      </Button>
    </View>
  )
}

export default SettingsScreen
