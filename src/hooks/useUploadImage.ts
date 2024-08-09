import { useState, useCallback } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as Linking from 'expo-linking'

const useUploadImages = () => {
  const [imageUri, setImageUri] = useState(null)
  const [cameraStatus, requestCameraPermission] = ImagePicker.useCameraPermissions()

  const handleLaunchCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      setImageUri(result.assets[0].uri)
      return result.assets[0].uri
    }
    return null
  }

  const handleCameraPermission = useCallback(async () => {
    const permission = await requestCameraPermission()
    if (permission.granted) {
      return handleLaunchCamera()
    } else if (cameraStatus.status === ImagePicker.PermissionStatus.DENIED) {
      await Linking.openSettings()
    }
    return null
  }, [cameraStatus, handleLaunchCamera, requestCameraPermission])

  const handleImageFromGallery = async () => {
    let result = null
    try {
      await ImagePicker.requestMediaLibraryPermissionsAsync()
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })
      if (!result.canceled) {
        setImageUri(result.assets[0].uri)
        return result.assets[0].uri
      }
    } catch (error) {
      console.log(error)
    }
  }

  return { imageUri, setImageUri, handleCameraPermission, handleImageFromGallery }
}

export default useUploadImages
