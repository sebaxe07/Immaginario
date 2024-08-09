import { useStore } from '@/providers/store-provider'
import { TouchableOpacity, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import Input from '@/components/input/FormInput'
import { Connector } from '@/lib/connector'
import useNavigate from '@/hooks/useNavigate'
import { useContext, useEffect } from 'react'
import AgendaContext from '@/context/AgendaContext'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

const RegisterScreen = () => {
  const store = useStore()
  const connector = new Connector(store)
  const { t } = useTranslation()

  const navigate = useNavigate()

  const registerSchema = z
    .object({
      fullName: z
        .string()
        .min(2, { message: t('screens.auth.registerScreen.nameShort') })
        .max(100, { message: t('screens.auth.registerScreen.nameLong') }),
      email: z.string().email(),
      password: z
        .string()
        .min(6, {
          message: t('screens.auth.registerScreen.pass6Chars'),
        })
        .max(100, { message: t('screens.auth.registerScreen.passwordLong') }),
      confirmPassword: z
        .string()
        .min(6, {
          message: t('screens.auth.registerScreen.pass6Chars'),
        })
        .max(100, { message: t('screens.auth.registerScreen.passwordLong') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('screens.auth.registerScreen.passDontMatch'),
      path: ['confirmPassword'],
    })

  const { selectedUser, setSelectedUser } = useContext(AgendaContext)
  const isFocused = useIsFocused()
  useEffect(() => {
    if (!isFocused) return
    setSelectedUser(null)
  }, [isFocused])

  const goToLogin = () => {
    navigate.to('Login')
    clearErrors()
  }

  const { control, handleSubmit, clearErrors } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const handleRegister = async (formData: z.infer<typeof registerSchema>) => {
    const { fullName, email, password } = formData

    await connector.auth.registerUser(fullName, email, password)
  }

  return (
    <View className="flex-1 px-3">
      <View className="flex-[1] flex-row items-center justify-center gap-3">
        <View className="h-12 w-12 rounded-xl bg-secondary"></View>
        <Text className="text-2xl font-normal text-primary">Immaginario</Text>
      </View>
      <View className="flex-[3]">
        <View className="mx-5 rounded-xl bg-secondary p-5 shadow shadow-slate-800/20">
          <Text className="mb-3 text-center text-xl text-primary">{t('screens.auth.loginScreen.createAccount')}</Text>
          <View className="flex space-y-3">
            <Input name="fullName" control={control} label={t('screens.auth.registerScreen.fullName')} />
            <Input name="email" control={control} label="Email" autoCapitalize="none" />
            <Input name="password" control={control} label="Password" isPassword />
            <Input
              name="confirmPassword"
              control={control}
              label={t('screens.auth.registerScreen.confirmPass')}
              isPassword
            />
          </View>
          <View className="gap-2 pt-3">
            <TouchableOpacity onPress={handleSubmit(handleRegister)}>
              <Button
                mode="contained"
                className="rounded-xl py-3"
                labelStyle={{
                  fontSize: 18,
                }}
                loading={store.loading}
              >
                {t('screens.auth.registerScreen.register')}
              </Button>
            </TouchableOpacity>
            <Button onPress={goToLogin}>{t('screens.auth.loginScreen.alreadyHaveA')}</Button>
          </View>
        </View>
      </View>
    </View>
  )
}

export default RegisterScreen
