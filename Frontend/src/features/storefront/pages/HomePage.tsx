import { BenefitStrip } from '../components/BenefitStrip'
import { FeaturedProductsSection } from '../components/FeaturedProductsSection'
import { HeroSection } from '../components/HeroSection'
import { primaryBenefits } from '../data/storefront'
import { useDocumentMetadata } from '../../../shared/hooks/useDocumentMetadata'

export function HomePage() {
  useDocumentMetadata({
    title: 'MS Griffe — Moda Masculina',
    description: 'Moda masculina com qualidade, estilo e atitude. Conheça os destaques da MS Griffe.',
  })

  return (
    <main id="conteudo-principal" tabIndex={-1}>
      <HeroSection />

      <BenefitStrip items={primaryBenefits} />
      <FeaturedProductsSection />
    </main>
  )
}
