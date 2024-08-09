import { atom } from 'jotai'

export const audioState = atom<Audio>({
  uri: '',
  sound: null,
  isPlaying: false,
})
