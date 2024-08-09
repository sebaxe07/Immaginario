import { loadingState } from '@/state/signals'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

/**
 *
 * Custom hook for hooking into the loading state and disabling it
 *
 */
const useDisableLoading = () => {
  const [, setLoading] = useAtom(loadingState)

  useEffect(() => {
    setLoading(false)
  }, [])
}

export default useDisableLoading
