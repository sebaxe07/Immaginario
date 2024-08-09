import React, { useEffect, useState } from 'react'
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Image } from 'expo-image'
import Aud from '#/assets/cardAssets/audio.svg'
import Opt from '#/assets/cardAssets/image.svg'
import Check from '#/assets/cardAssets/check.svg'
import Notcheck from '#/assets/cardAssets/notcheck.svg'
import ZoomIcon from '#/assets/cardAssets/zoom.svg'
import { Colors } from '#/colors'
import { Modal, Portal } from 'react-native-paper'
import { Connector } from '@/lib/connector'
import { useStore } from '@/providers/store-provider'

// Props for CardComp
interface CardCompProps {
  isChecked?: number
  link?: string
  audio?: string
  name?: string
  sublevel?: boolean
  disableOptions?: boolean
  onPressTasks?: () => void
}

// name: name of the card (string)
// link: link to the image (string)
// isChecked: 0 = default, 1 = checked, 2 = not checked, 3 = disabled (number)
// sublevel: true = has sublevel, false = no sublevel (boolean)

const CardComp: React.FC<CardCompProps> = ({
  name = 'NA',
  audio,
  link,
  isChecked = 0,
  disableOptions = false,
  sublevel = false,
  onPressTasks,
}) => {
  //////////////////////////////////////////////   STATES   //////////////////////////////////////////////

  // Overlay states for Opt (Done, Incomplete, Dismiss) buttons
  const [showOverlay, setShowOverlay] = useState(false)
  const [showOverlayDone, setShowOverlayDone] = useState(false)
  const [showOverlayIncomplete, setShowOverlayIncomplete] = useState(false)
  const [showOverlayDimiss, setShowOverlayDimiss] = useState(false)

  //useEffect to change the overlay based on isChecked prop
  useEffect(() => {
    // Initialize showOverlayDone based on isChecked prop
    if (isChecked === 1) return setShowOverlayDone(true)
    if (isChecked === 2) return setShowOverlayIncomplete(true)
    if (isChecked === 3) {
      startAnimation() // Trigger the card flip animation if isChecked is 3
      startShrinkAnimation()
    }
  }, [isChecked])

  // Flip animation for the card and shrink animation for the sublevel button
  const [isFlipped, setIsFlipped] = useState(false)
  const [animation] = useState(new Animated.Value(0))
  const [shrinkAnimation] = useState(new Animated.Value(1))

  const startAnimation = () => {
    setIsFlipped(!isFlipped)
    Animated.timing(animation, {
      toValue: isFlipped ? 0 : 180,
      duration: 400,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start()

    // Change card content after 0.210 seconds
    setTimeout(() => {
      setShowOverlayDimiss((prevState) => !prevState)
    }, 210)
  }
  const startShrinkAnimation = () => {
    // Shrink animation from left and right to the middle
    Animated.timing(shrinkAnimation, {
      toValue: 0, // Shrink to 0 (middle)
      duration: 200, // Adjust the duration
      useNativeDriver: true,
    }).start(() => {
      // Bounce back to the original form
      Animated.spring(shrinkAnimation, {
        toValue: 1, // Original size
        friction: 50, // Adjust the friction for the bounce effect
        tension: 50, // Adjust the tension for the bounce effect
        useNativeDriver: true,
      }).start()
    })
  }
  const frontInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  })
  const backInterpolate = animation.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  })

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  }
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  }

  // Change sublevel button style if sublevel is true
  const sublevelStyle = sublevel ? (
    <Animated.View
      style={[styles.buttonContainer, { transform: [{ scaleX: shrinkAnimation }, { scaleY: shrinkAnimation }] }]}
    >
      <TouchableOpacity
        className="absolute left-0 top-[160px] h-[36px] w-[181px] rounded-b-[15px] bg-accent"
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.27,
          shadowRadius: 4.65,
          elevation: 6,
        }}
        onPress={onPressTasks}
      ></TouchableOpacity>
    </Animated.View>
  ) : null

  //////////////////////////////////////////////   HANDLE PRESS   //////////////////////////////////////////////

  const store = useStore()
  const connector = new Connector(store)

  // Modify the Opt component to be touchable
  const handleOptPress = async () => {
    if (showOverlay) return setShowOverlay(false)

    setShowOverlay(true)
  }

  const [audioPressed, setAudioPressed] = useState(false)

  // Hacky solution to make sure the audio source has propagated properly
  useEffect(() => {
    if (!audioPressed) return
    ;(async () => {
      await connector.audio.play()
      setAudioPressed(false)
    })()
  }, [audioPressed])

  // Modify the Audio component to be touchable
  const handleAudPress = async () => {
    if (audio === undefined || audio === null || audio === '') return

    store.setAudio({ ...store.audio, uri: audio })
    setAudioPressed(true)
  }
  const handleZoomPress = () => showModal()

  const handleDonePress = () => {
    if (isFlipped) {
      startAnimation() // Trigger the card flip animation when Dismiss is pressed
      startShrinkAnimation()
      setTimeout(() => {
        setShowOverlayDone((prevState) => !prevState)
      }, 210)
    } else {
      setShowOverlayDone((prevState) => !prevState)
    }

    setShowOverlayIncomplete(false)
    setShowOverlay(false)
  }

  const handleIncompletePress = () => {
    if (isFlipped) {
      startAnimation() // Trigger the card flip animation when Dismiss is pressed
      startShrinkAnimation()
      setTimeout(() => {
        setShowOverlayIncomplete((prevState) => !prevState)
      }, 210)
    } else {
      setShowOverlayIncomplete((prevState) => !prevState)
    }
    setShowOverlayDone(false)
    setShowOverlay(false)
  }

  const handleDismissPress = () => {
    setTimeout(() => {
      setShowOverlayDone(false)
      setShowOverlayIncomplete(false)
    }, 210)

    setShowOverlay(false)
    startAnimation() // Trigger the card flip animation when Dismiss is pressed
    startShrinkAnimation()
  }

  const handleCardPress = () => {
    // Perform actions on Card press
    console.log('Card pressed!')
    // functionality here
  }

  //////////////////////////////////////////////   TOUCHABLES   //////////////////////////////////////////////

  // Wrap the Audio component with TouchableOpacity
  const AudioTouchable = (
    <TouchableOpacity className="absolute left-[154px] top-[43px] h-[16px] w-[14px]" onPress={handleAudPress}>
      <Aud />
    </TouchableOpacity>
  )

  // Wrap the Zoom component with TouchableOpacity
  const ZoomTouchable = (
    <TouchableOpacity className="absolute left-[154px] top-[16px] h-[16px] w-[14px]" onPress={handleZoomPress}>
      <ZoomIcon />
    </TouchableOpacity>
  )

  // Wrap the Options component with TouchableOpacity
  const OptTouchable = (
    <TouchableOpacity
      className="absolute left-[5px] top-[10px] flex h-[30px] w-[16px] items-center justify-center  px-[18px]"
      onPress={handleOptPress}
    >
      <Opt />
    </TouchableOpacity>
  )

  //////////////////////////////////////////////   STATES CHANGES  //////////////////////////////////////////////

  // Overlay for Opt (Done, Incomplete, Dismiss) buttons
  // Change overlay style if isChecked is 0 = default, 1 = checked, 2 = not checked, 3 = disabled
  let overlay = null
  let backOverlay = null

  if (showOverlayDone) {
    overlay = // Change overlay style if isChecked is 1 or when handleDonePress is called
      (
        <>
          <View
            style={{
              ...styles.overlay,
              borderColor: Colors.done,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Check width={80} height={80} style={{ bottom: 4 }} />
          </View>
        </>
      )
  } else if (showOverlayIncomplete) {
    overlay = // Change overlay style if isChecked is 2 or when handleIncompletePress is called
      (
        <>
          <View
            style={{
              ...styles.overlay,
              borderColor: Colors.incomplete,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Notcheck width={80} height={80} style={{ bottom: 4 }} />
          </View>
        </>
      )
  } else if (showOverlayDimiss) {
    backOverlay = (
      <View style={{ ...styles.overlay, borderColor: Colors.stroke, backgroundColor: Colors.dismissedOver }}>
        {OptTouchable}
      </View>
    )
  }

  // Overlay buttons for Opt
  const overlaybt = showOverlay ? (
    <TouchableOpacity
      className="  left-0 top-0 h-[182px] w-[183px] items-center justify-center rounded-[15px] border-[3px] border-stroke bg-overlay"
      style={{ transform: [{ rotateY: isFlipped ? '180deg' : '0deg' }] }}
      onPress={() => {
        setShowOverlay(false)
      }}
    >
      <TouchableOpacity
        className="left-0 top-0 m-1 flex-row items-center justify-center rounded-[25px] bg-overlayButton  px-[10px] py-[2px]"
        onPress={handleDonePress}
      >
        <View>
          <Text className="text-center text-[15px] font-medium tracking-tighter text-white">
            {showOverlayDone ? 'Default' : 'Done'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="left-0 top-0 m-1 flex-row items-center justify-center rounded-[25px] bg-overlayButton px-[10px] py-[2px]"
        onPress={handleDismissPress}
      >
        <View>
          <Text className="text-center text-[15px] font-medium tracking-tighter text-white">
            {isFlipped ? 'Default' : 'Dismiss'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        className="left-0 top-0 m-1 flex-row items-center justify-center rounded-[25px] bg-overlayButton px-[10px] py-[2px]"
        onPress={handleIncompletePress}
      >
        <View>
          <Text className="text-center text-[15px] font-medium tracking-tighter text-white">
            {showOverlayIncomplete ? 'Default' : 'Incomplete'}
          </Text>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  ) : null

  const [visible, setVisible] = React.useState(false)

  const showModal = () => {
    setVisible(true)
    if (Platform.OS !== 'android') return

    StatusBar.setBackgroundColor('#97A1AF')
  }
  const hideModal = () => {
    setVisible(false)
    if (Platform.OS !== 'android') return

    StatusBar.setBackgroundColor(Colors.secondary)
  }
  const containerStyle = { with: 100, height: 500, margin: 50, borderRadius: 30 }
  ///////////////////////   RETURN   ///////////////////////

  // change image source to file in the future
  return (
    <>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <View className=" flex-1 rounded-[30px] border-[2px] border-stroke bg-white">
            <Image source={{ uri: link }} className="flex-[2] rounded-t-[28px]" />
            <Text className="top-[50px]  flex-1	self-center  text-center text-[30px] font-medium leading-tight tracking-normal text-primary">
              {name}
            </Text>
          </View>
        </Modal>
      </Portal>
      <View className="m-3 flex-row justify-center rounded-[15px]">
        <View className="h-[204px] w-[181px]">
          <View className="h-[204px]">
            <TouchableWithoutFeedback onPress={handleCardPress}>
              <View>{sublevelStyle}</View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={handleCardPress}>
              <View className="absolute left-0 top-0 h-[181px] w-[181px]">
                <Animated.View
                  className="relative flex h-[181px] w-[183px] items-center justify-center"
                  style={frontAnimatedStyle}
                >
                  <View
                    className="absolute left-0 top-0 h-[181px] w-[181px] rounded-[15px] border-2 border-stroke bg-white"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 0,
                      },
                      shadowOpacity: 0.27,
                      shadowRadius: 4.65,
                      elevation: 7,
                    }}
                  >
                    <Text className="absolute left-[28px] top-[136px] h-[24px] w-[119px] text-center text-[16px] font-medium leading-tight tracking-normal text-primary">
                      {name}
                    </Text>
                    <Image
                      className="absolute left-[39px] top-[34px] h-[100px] w-[100px] rounded-[10px]"
                      source={{ uri: link }}
                      resizeMode="cover"
                    />
                  </View>
                  {overlay}
                  {audio && AudioTouchable}
                  {ZoomTouchable}
                  {!disableOptions && OptTouchable}
                  {backOverlay && (
                    <Animated.View style={[styles.imageBox, backAnimatedStyle, { ...styles.backCard }]}>
                      {backOverlay}
                    </Animated.View>
                  )}
                  {overlaybt}
                </Animated.View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.stroke,
  },
  backCard: {
    position: 'absolute',
    transform: [{ rotateY: '180deg' }],
  },
  imageBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 183,
    height: 181,
  },
  icon: {
    width: 2,
    height: 2,
    backgroundColor: 'tomato',
    position: 'absolute',
  },
  buttonContainer: {
    position: 'relative',
    width: 183,
    height: 204,
  },
})

export default CardComp
