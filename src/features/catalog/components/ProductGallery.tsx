import { useState } from 'react'
import { ImageWithFallback } from '../../../shared/components/ImageWithFallback'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex] ?? images[0]

  return (
    <section className="product-gallery" aria-label={`Galeria de ${productName}`}>
      <div className="product-gallery__main">
        <ImageWithFallback src={selectedImage} alt={productName} />
      </div>

      {images.length > 1 && (
        <div className="product-gallery__thumbnails" aria-label="Escolher imagem">
          {images.map((image, index) => (
            <button
              aria-label={`Ver imagem ${index + 1} de ${productName}`}
              aria-pressed={selectedIndex === index}
              className="product-gallery__thumbnail"
              key={`${image}-${index}`}
              onClick={() => setSelectedIndex(index)}
              type="button"
            >
              <ImageWithFallback src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
