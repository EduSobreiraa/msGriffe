import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useDocumentMetadata } from './useDocumentMetadata'

describe('useDocumentMetadata', () => {
  it('atualiza título, descrição, canonical e indexação', () => {
    window.history.replaceState(null, '', '/produtos/camiseta-boss?origem=teste')

    renderHook(() =>
      useDocumentMetadata({
        description: 'Detalhe da camiseta.',
        noIndex: true,
        title: 'Camiseta Boss | MS Griffe',
      }),
    )

    expect(document.title).toBe('Camiseta Boss | MS Griffe')
    expect(document.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Detalhe da camiseta.',
    )
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${window.location.origin}/produtos/camiseta-boss`,
    )
  })
})
