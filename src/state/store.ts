import { User } from 'firebase/auth'

/**
 * @class Store
 * This class is used to store the state of the application
 *
 *
 * @param user - UserCredential | boolean
 * @param setUser - (user: UserCredential | boolean) => void
 * @param loading - boolean
 * @param setLoading - (loading: boolean) => void
 * @param error - string
 * @param setError - (error: boolean) => void
 *
 */
export class Store {
  user: User
  setUser: (user: User | boolean) => void

  profile: UserProfile
  setProfile: (profile: UserProfile | boolean) => void

  loading: boolean
  setLoading: (loading: boolean) => void

  error: string
  setError: (error: boolean) => void

  card: Card
  setCard: (card: Card) => void

  sequence: Sequence
  setSequence: (sequence: Sequence) => void

  audio: Audio
  setAudio: (audio: Audio) => void

  constructor(
    [user, setUser],
    [profile, setProfile],
    [loading, setLoading],
    [error, setError],
    [card, setCard],
    [sequence, setSequence],
    [audio, setAudio],
  ) {
    this.user = user
    this.setUser = setUser

    this.profile = profile
    this.setProfile = setProfile

    this.loading = loading
    this.setLoading = setLoading

    this.error = error
    this.setError = setError

    this.card = card
    this.setCard = setCard

    this.sequence = sequence
    this.setSequence = setSequence

    this.audio = audio
    this.setAudio = setAudio
  }

  // Methods to update atoms
  updateUser(user: User | boolean) {
    this.setUser(user)
  }

  updateProfile(profile: UserProfile | boolean) {
    this.setProfile(profile)
  }

  updateLoading(loading: boolean) {
    this.setLoading(loading)
  }

  updateError(error: boolean) {
    this.setError(error)
  }

  userIsTherapist() {
    return this.profile?.type === 'therapist'
  }

  isSignedIn() {
    return typeof this.user !== 'boolean'
  }

  resetAudio() {
    this.setAudio({ uri: '', isPlaying: false })
  }
}
