import { useEffect } from 'react'

interface DocumentMetadata {
  title: string
  description: string
  noIndex?: boolean
}

function ensureMeta(name: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.append(element)
  }
  return element
}

function ensureCanonical() {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.rel = 'canonical'
    document.head.append(element)
  }
  return element
}

export function useDocumentMetadata({
  description,
  noIndex = false,
  title,
}: DocumentMetadata) {
  useEffect(() => {
    document.title = title
    ensureMeta('description').content = description
    ensureMeta('robots').content = noIndex ? 'noindex, nofollow' : 'index, follow'
    ensureCanonical().href = `${window.location.origin}${window.location.pathname}`
  }, [description, noIndex, title])
}
