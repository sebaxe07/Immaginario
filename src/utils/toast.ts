import { ToastAndroid, Platform, Alert } from 'react-native'

interface ToastProps {
  title: string
  message: string
}

/**
 * Display a toast message based on the platform operating system
 *
 * @param message - Message to be displayed
 */
export const toast = ({ title, message }: ToastProps) => {
  if (Platform.OS === 'android') {
    return ToastAndroid.show(message, ToastAndroid.SHORT)
  }

  Alert.alert(title, message)
}
