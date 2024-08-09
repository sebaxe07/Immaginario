import 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { MD3LightTheme as DefaultTheme, PaperProvider } from 'react-native-paper'
import { navigationConfig } from '@/config/navigation'
import { RootStackParamList, RouteConfig } from '@/types/navigation'
import { useAtom } from 'jotai'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Layout from '@/components/layout'
import { StoreProvider } from '@/providers/store-provider'
import { authState, profileState } from '@/state/signals'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Colors } from './colors'
import AgendaContext from '@/context/AgendaContext'
import { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'src/localization/i18n'

const Tab = createBottomTabNavigator<RootStackParamList>()

export default function App() {
  // Directly access the signed in state from the authState atom
  // as this is outside of the StoreProvider context
  const [isSignedIn] = useAtom(authState)
  const [profile] = useAtom(profileState)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  const routes = Object.values(navigationConfig.routes)

  const publicRoutes = routes.filter((route) => !route.protected)
  const protectedRoutes = routes.filter((route) => route.protected)

  const therapistRoutes = Object.values(navigationConfig.therapistRoutes)

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...Colors,
    },
  }

  const isTherapist = typeof profile !== 'boolean' && profile?.type === 'therapist'

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StoreProvider>
            <AgendaContext.Provider value={{ selectedUser, setSelectedUser, selectedDay, setSelectedDay }}>
              <NavigationContainer>
                <Tab.Navigator
                  screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                      display: 'none',
                    },
                  }}
                  backBehavior="history"
                >
                  {isSignedIn ? renderRoutes(protectedRoutes) : renderRoutes(publicRoutes)}
                  {isTherapist && renderRoutes(therapistRoutes)}
                </Tab.Navigator>
              </NavigationContainer>
            </AgendaContext.Provider>
          </StoreProvider>
        </GestureHandlerRootView>
      </PaperProvider>
    </SafeAreaProvider>
  )
}

/*
 * Helper functions that renders the provided routes
 *
 * @param {RouteConfig[]} routes - The routes to render
 */
const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map(({ name, component: Component, options }) => (
    <Tab.Screen key={name} name={name} options={options ?? {}}>
      {(props) => (
        <Layout>
          <Component {...props} />
        </Layout>
      )}
    </Tab.Screen>
  ))
}
