import React, { createContext, useContext } from 'react'
import { useAtom } from 'jotai'
import { cardState, errorState, loadingState, profileState, sequenceState, userState } from '@/state/signals'
import { Store } from '@/state/store'
import { audioState } from '@/state/audio'

export const StoreContext = createContext<Store | null>(null)

/**
 * @description StoreProvider is a wrapper component that provides the store to all its children.
 *
 * @param {React.ReactNode} children
 * @returns {React.ReactNode} children wrapped in StoreContext.Provider
 */
export const StoreProvider = ({ children }): React.JSX.Element => {
  // Create a new store instance that contains the user, loading, and error state.
  const store = new Store(
    useAtom(userState),
    useAtom(profileState),
    useAtom(loadingState),
    useAtom(errorState),
    useAtom(cardState),
    useAtom(sequenceState),
    useAtom(audioState),
  )

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
