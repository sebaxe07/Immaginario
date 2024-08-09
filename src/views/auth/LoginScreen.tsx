import Input from '@/components/input/FormInput'
import useNavigate from '@/hooks/useNavigate'
import { Connector } from '@/lib/connector'
import { useStore } from '@/providers/store-provider'
import { loginSchema } from '@/schema/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { z } from 'zod'
import { useIsFocused } from '@react-navigation/native'
import { useContext, useEffect } from 'react'
import AgendaContext from '@/context/AgendaContext'
import { useTranslation } from 'react-i18next'

const LoginScreen = () => {
  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const navigate = useNavigate()

  const { selectedUser, setSelectedUser } = useContext(AgendaContext)
  const isFocused = useIsFocused()
  useEffect(() => {
    if (!isFocused) return
    setSelectedUser(null)
  }, [isFocused])

  const goToRegister = () => {
    navigate.to('Register')
    clearErrors()
  }

  const goToForgotPassword = () => {
    navigate.to('ForgotPassword')
    clearErrors()
  }

  const { control, handleSubmit, clearErrors } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleSignIn = async (formData: z.infer<typeof loginSchema>) =>
    await connector.auth.signInUser(formData.email, formData.password)

  return (
    <View className="flex-[1] px-3">
      <View className="flex-[1] flex-row items-center justify-center gap-3">
        <View className="h-12 w-12 rounded-xl bg-secondary"></View>
        <Text className="text-2xl font-normal text-primary">Immaginario</Text>
      </View>
      <View className="flex-[3]">
        <View className="mx-5 rounded-xl bg-secondary p-5 shadow shadow-slate-800/20">
          <Text className="mb-3 text-center text-xl text-primary">{t('screens.auth.loginScreen.welcome')}</Text>
          <View className="flex space-y-3">
            <Input name="email" control={control} label="Email" autoCapitalize="none" />
            <Input name="password" control={control} label="Password" isPassword />
          </View>
          <View className="gap-2 pt-3">
            <TouchableOpacity onPress={handleSubmit(handleSignIn)}>
              <Button
                mode="contained"
                className="rounded-xl py-3"
                labelStyle={{
                  fontSize: 18,
                }}
                loading={store.loading}
              >
                Login
              </Button>
              <View className="mt-4 flex-row items-center justify-center">
                <TouchableOpacity onPress={goToForgotPassword}>
                  <Text className="text-primary underline">{t('screens.auth.loginScreen.forgotMyP')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            <Button onPress={goToRegister}>{t('screens.auth.loginScreen.dontHaveAccount')}</Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default LoginScreen
