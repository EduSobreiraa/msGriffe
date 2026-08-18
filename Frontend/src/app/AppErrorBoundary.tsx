import { Component, createRef, type PropsWithChildren } from 'react'
import { Link } from 'wouter'
import { routes } from './routes'

interface AppErrorBoundaryState {
  hasError: boolean
}

export class AppErrorBoundary extends Component<PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false }
  private readonly headingReference = createRef<HTMLHeadingElement>()

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch() {
    // Observabilidade será conectada ao Sentry no backend/produção.
    this.headingReference.current?.focus()
  }

  render() {
    if (this.state.hasError) {
      return <main className="app-error" id="conteudo-principal" tabIndex={-1}><section><p>MS Griffe</p><h1 ref={this.headingReference} tabIndex={-1}>Não foi possível abrir esta página</h1><span>Atualize ou tente novamente. Nenhum dado de pagamento foi processado.</span><div><button className="button button--primary button--medium" onClick={() => this.setState({ hasError: false })} type="button">Tentar novamente</button><Link className="button button--secondary button--medium" href={routes.home}>Ir para início</Link></div></section></main>
    }

    return this.props.children
  }
}
