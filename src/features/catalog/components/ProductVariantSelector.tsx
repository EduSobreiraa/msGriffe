import { useState } from 'react'
import type { ProductVariant } from '../domain/Product'

interface ProductVariantSelectorProps {
  variants: ProductVariant[]
}

function unique(values: string[]) {
  return [...new Set(values)]
}

export function ProductVariantSelector({ variants }: ProductVariantSelectorProps) {
  const firstAvailable = variants.find((variant) => variant.available) ?? variants[0]
  const [color, setColor] = useState(firstAvailable?.color ?? '')
  const [size, setSize] = useState(firstAvailable?.size ?? '')
  const colors = unique(variants.map((variant) => variant.color))
  const sizes = unique(variants.map((variant) => variant.size))
  const selectedVariant = variants.find(
    (variant) => variant.color === color && variant.size === size,
  )

  const selectColor = (nextColor: string) => {
    setColor(nextColor)
    const matchingVariant = variants.find(
      (variant) => variant.color === nextColor && variant.size === size && variant.available,
    ) ?? variants.find((variant) => variant.color === nextColor && variant.available)
    if (matchingVariant) setSize(matchingVariant.size)
  }

  return (
    <div className="product-variants">
      <fieldset>
        <legend>Cor: <strong>{color}</strong></legend>
        <div className="product-options">
          {colors.map((option) => (
            <button
              aria-pressed={color === option}
              className="product-option"
              key={option}
              onClick={() => selectColor(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Tamanho: <strong>{size}</strong></legend>
        <div className="product-options">
          {sizes.map((option) => {
            const available = variants.some(
              (variant) => variant.color === color && variant.size === option && variant.available,
            )
            return (
              <button
                aria-pressed={size === option}
                className="product-option product-option--size"
                disabled={!available}
                key={option}
                onClick={() => setSize(option)}
                type="button"
              >
                {option}
              </button>
            )
          })}
        </div>
      </fieldset>

      <p className="product-availability" aria-live="polite">
        {selectedVariant?.available ? 'Disponível' : 'Indisponível nesta combinação'}
      </p>
    </div>
  )
}
