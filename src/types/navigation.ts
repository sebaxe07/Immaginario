import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'

export type RouteConfig = {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>
  protected?: boolean
  options?: BottomTabNavigationOptions | null
}

export type Routes = {
  [key: string]: RouteConfig
}

export type NavigationConfig = {
  routes: Routes
  therapistRoutes: Routes
}

export type RouteNames = keyof NavigationConfig['routes']
export type RootStackParamList = Record<RouteNames, undefined>
