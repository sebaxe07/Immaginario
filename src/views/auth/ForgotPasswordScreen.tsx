import Input from '@/components/input/FormInput'
import useNavigate from '@/hooks/useNavigate'
import { Connector } from '@/lib/connector'
import { useStore } from '@/providers/store-provider'
import { forgotPasswordSchema } from '@/schema/forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TouchableOpacity, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

const ForgotPasswordScreen = () => {
  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const navigate = useNavigate()

  const goToLogin = () => {
    navigate.to('Login')
    clearErrors()
  }

  const { control, handleSubmit, clearErrors } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const handleResetPassword = async (formData: z.infer<typeof forgotPasswordSchema>) => {
    const emailSent = await connector.auth.resetPassword(formData.email)
    if (!emailSent) return

    goToLogin()
  }

  return (
    <View className="flex-[1] px-3">
      <View className="flex-[1] flex-row items-center justify-center gap-3">
        <View className="h-12 w-12 rounded-xl bg-secondary"></View>
        <Text className="text-2xl font-normal text-primary">Immaginario</Text>
      </View>
      <View className="flex-[3]">
        <View className="mx-5 rounded-xl bg-secondary p-5 shadow shadow-slate-800/20">
          <Text className="mb-3 text-center text-xl text-primary">
            {t('screens.auth.forgotPasswordScreen.forgotP')}
          </Text>
          <View className="flex space-y-3">
            <Input name="email" control={control} label="Email" autoCapitalize="none" />
          </View>
          <View className="gap-2 pt-3">
            <TouchableOpacity onPress={handleSubmit(handleResetPassword)}>
              <Button
                mode="contained"
                className="rounded-xl py-3"
                labelStyle={{
                  fontSize: 18,
                }}
                loading={store.loading}
              >
                {t('screens.auth.forgotPasswordScreen.sendReset')}
              </Button>
            </TouchableOpacity>
            <Button onPress={goToLogin}>{t('screens.auth.forgotPasswordScreen.backTo')}</Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ForgotPasswordScreen
