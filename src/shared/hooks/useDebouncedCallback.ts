import { useCallback, useEffect, useRef } from 'react'

export function useDebouncedCallback<Arguments extends unknown[]>(
  callback: (...args: Arguments) => void,
  delay: number,
) {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const cancel = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const schedule = useCallback(
    (...args: Arguments) => {
      cancel()
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null
        callbackRef.current(...args)
      }, delay)
    },
    [cancel, delay],
  )

  useEffect(() => cancel, [cancel])

  return { cancel, schedule }
}
