import { SafeAreaView } from 'react-native-safe-area-context'
import { useStore } from '@/providers/store-provider'
import { View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

/**
 * Layout component that wraps the children with padding
 *
 * @param {children}
 * @returns {JSX.Element}
 */
const Layout = ({ children }) => {
  const store = useStore()

  return (
    <>
      {store.loading && (
        <View className="absolute z-10 h-screen w-full justify-center bg-black/20">
          <ActivityIndicator size="large" animating />
        </View>
      )}
      <SafeAreaView className="flex-1 bg-white">{children}</SafeAreaView>
    </>
  )
}

export default Layout
