import { useNavigation } from '@react-navigation/native'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ParamsType = { [key: string]: any }

const useNavigate = () => {
  const navigation = useNavigation()

  const to = (to: string, params?: ParamsType) => {
    // @ts-expect-error - React navigation has no concept of what the route structure actually looks like
    navigation.navigate(to, params)
  }

  return {
    to,
    goBack: navigation.canGoBack() ? navigation.goBack : () => {},
  }
}

export default useNavigate
