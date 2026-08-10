import { Link } from 'wouter'
import { routes } from '../../../app/routes'

export function HeroSection() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow">Moda masculina</p>
          <h1 id="hero-title">
            Vista sua melhor <span>versão</span>
          </h1>
          <p className="hero__description">
            Qualidade, estilo e atitude em cada peça.
          </p>
          <Link className="button button--primary button--medium" href={routes.catalog}>
            VER PRODUTOS
          </Link>
        </div>
        <div className="hero__visual">
          <img
            src="/images/hero_products.png"
            alt="Camiseta e shorts masculinos em destaque"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
