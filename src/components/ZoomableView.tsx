import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

interface ZoomableViewProps {
  minScale?: number
  maxScale?: number
  children: React.ReactNode
}

const ZoomableView = React.forwardRef((props: ZoomableViewProps, ref) => {
  const { minScale = 1, maxScale = 5, children } = props
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translationY = useSharedValue(0)
  const savedTranslationY = useSharedValue(0)
  const initialFocalY = useSharedValue(0)
  const focalYBuffer = useSharedValue<number[]>([])
  const MOVING_AVERAGE_WINDOW_SIZE = 10

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      initialFocalY.value = e.focalY
      focalYBuffer.value = [e.focalY]
    })
    .onUpdate((e) => {
      focalYBuffer.value.push(e.focalY)
      if (focalYBuffer.value.length > MOVING_AVERAGE_WINDOW_SIZE) {
        focalYBuffer.value.shift()
      }
      const smoothedFocalY =
        focalYBuffer.value.length < MOVING_AVERAGE_WINDOW_SIZE
          ? initialFocalY.value
          : focalYBuffer.value.reduce((acc, val) => acc + val, 0) / focalYBuffer.value.length
      // Use smoothedFocalY for translation calculation
      const delta = smoothedFocalY - initialFocalY.value
      const weightedDelta = (delta / scale.value) * 3
      const newTranslationY = Math.min(Math.max(savedTranslationY.value + weightedDelta, -250), 300)
      translationY.value = newTranslationY

      scale.value = Math.min(Math.max(savedScale.value * e.scale, minScale), maxScale)
    })
    .onEnd(() => {
      savedScale.value = Math.min(Math.max(scale.value, minScale), maxScale)
      savedTranslationY.value = translationY.value
      if (savedScale.value === 1) {
        translationY.value = withSpring(0)
        savedTranslationY.value = 0
      }
      focalYBuffer.value = []
    })

  const animatedStyle = useAnimatedStyle(() => ({
    flex: 1,
    width: '100%',
    zIndex: -1,
    transform: [{ scale: scale.value }, { translateY: translationY.value }],
  }))

  React.useImperativeHandle(ref, () => ({
    reset() {
      scale.value = 1
      savedScale.value = 1
      translationY.value = 0
      savedTranslationY.value = 0
    },
  }))

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View style={animatedStyle}>{children}</Animated.View>
    </GestureDetector>
  )
})

export default ZoomableView
