import { Icon } from '../../../shared/components/Icon'
import type { StoreBenefit } from '../types'

interface BenefitStripProps {
  items: StoreBenefit[]
}

export function BenefitStrip({ items }: BenefitStripProps) {
  const content = (
    <div className="benefit-strip__grid">
      {items.map((item) => (
        <article className="benefit" key={item.title}>
          <div className="benefit__icon">
            <Icon name={item.icon} />
          </div>
          <div>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </div>
        </article>
      ))}
    </div>
  )

  return (
    <section className="benefit-strip benefit-strip--full" aria-label="Benefícios da loja">
      <div className="container">{content}</div>
    </section>
  )
}
