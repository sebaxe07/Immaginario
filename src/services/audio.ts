import { Store } from '@/state/store'
import { Audio } from 'expo-av'

export class AudioService {
  private store: Store

  public sound: Audio.Sound

  constructor(store: Store) {
    this.store = store
  }

  public play = async () => {
    const { sound } = await Audio.Sound.createAsync({ uri: this.store.audio.uri }, { shouldPlay: true })

    sound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return

      this.store.setAudio({ ...this.store.audio, sound, isPlaying: status.isPlaying })
    })
  }

  public pause = async () => {
    await this.store.audio.sound?.pauseAsync()

    this.store.setAudio({ ...this.store.audio, isPlaying: false, sound: null })
  }
}
