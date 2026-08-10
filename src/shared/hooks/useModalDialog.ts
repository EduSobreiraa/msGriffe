import { useEffect, type RefObject } from 'react'

interface UseModalDialogOptions {
  containerRef: RefObject<HTMLElement | null>
  initialFocusRef: RefObject<HTMLElement | null>
  isOpen: boolean
  onClose(): void
  returnFocusRef: RefObject<HTMLElement | null>
}

const focusableSelector = [
  'a[href]',
  'button:not(:disabled)',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useModalDialog({
  containerRef,
  initialFocusRef,
  isOpen,
  onClose,
  returnFocusRef,
}: UseModalDialogOptions) {
  useEffect(() => {
    if (!isOpen) return

    const backgroundElements = [
      document.querySelector<HTMLElement>('.header'),
      document.querySelector<HTMLElement>('main'),
      document.querySelector<HTMLElement>('.whatsapp-link'),
    ].filter((element): element is HTMLElement => Boolean(element))
    const previouslyInert = backgroundElements.map((element) => ({
      element,
      inert: element.hasAttribute('inert'),
    }))

    backgroundElements.forEach((element) => element.setAttribute('inert', ''))
    document.body.classList.add('modal-open')
    const returnFocusElement = returnFocusRef.current
    const frame = window.requestAnimationFrame(() => initialFocusRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !containerRef.current) return
      const focusableElements = [
        ...containerRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      ]
      if (focusableElements.length === 0) {
        event.preventDefault()
        return
      }

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === containerRef.current)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
      previouslyInert.forEach(({ element, inert }) => {
        if (!inert) element.removeAttribute('inert')
      })
      window.requestAnimationFrame(() => returnFocusElement?.focus())
    }
  }, [containerRef, initialFocusRef, isOpen, onClose, returnFocusRef])
}
