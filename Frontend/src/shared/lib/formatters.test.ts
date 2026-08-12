import { describe, expect, it } from 'vitest'
import { formatCurrency } from './formatters'

describe('formatCurrency', () => {
  it('formata valores em reais usando a localidade brasileira', () => {
    expect(formatCurrency(89.9).replace(/\u00a0/g, ' ')).toBe('R$ 89,90')
  })
})
