import { User } from 'firebase/auth'
import { atom } from 'jotai'

/**
 * The state belonging to the application
 **/

export const loadingState = atom(false)
export const errorState = atom(false)

/**
 * The state belonging to the user
 **/

export const userState = atom<User | boolean>(false)
export const profileState = atom<UserProfile | boolean>(false)

export const authState = atom((get) => get(userState) !== false)

export const cardState = atom<Card>(null)
export const sequenceState = atom<Sequence>(null)
