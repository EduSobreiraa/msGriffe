import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CheckoutProvider } from '../presentation/CheckoutProvider'
import { CheckoutPage } from './CheckoutPage'

function renderPage() {
  return render(
    <CheckoutProvider>
      <CheckoutPage />
    </CheckoutProvider>,
  )
}

describe('CheckoutPage', () => {
  it('mantém os dados de identificação em memória e informa os limites da simulação', () => {
    window.localStorage.clear()
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: 'Continuar para entrega' }))

    expect(screen.getAllByRole('alert')).toHaveLength(6)
    expect(screen.getByText(/somente em memória/i)).toBeInTheDocument()
    expect(document.title).toBe('Checkout | MS Griffe')
    expect(document.querySelector('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    )
    expect(window.localStorage).toHaveLength(0)
  })

  it('valida os dados exigidos antes de liberar a próxima etapa visual', () => {
    renderPage()

    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Maria Silva' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maria@exemplo.com' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(71) 99999-9999' } })
    fireEvent.change(screen.getByLabelText('Senha para criar conta'), { target: { value: 'senha-segura' } })
    fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '123.456.789-09' } })
    fireEvent.change(screen.getByLabelText('Data de nascimento'), { target: { value: '1990-01-20' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar para entrega' }))

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dados conferidos' })).toBeInTheDocument()
  })

  it('libera endereço e entrega somente após a identificação local', () => {
    renderPage()

    expect(screen.getByLabelText('CEP')).toBeDisabled()
    expect(screen.getByRole('radio', { name: /Entrega padrão/ })).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Maria Silva' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'maria@exemplo.com' } })
    fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(71) 99999-9999' } })
    fireEvent.change(screen.getByLabelText('Senha para criar conta'), { target: { value: 'senha-segura' } })
    fireEvent.change(screen.getByLabelText('CPF'), { target: { value: '123.456.789-09' } })
    fireEvent.change(screen.getByLabelText('Data de nascimento'), { target: { value: '1990-01-20' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar para entrega' }))

    fireEvent.change(screen.getByLabelText('CEP'), { target: { value: '40000-000' } })
    fireEvent.change(screen.getByLabelText('Endereço'), { target: { value: 'Rua das Flores' } })
    fireEvent.change(screen.getByLabelText('Número'), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText('Bairro'), { target: { value: 'Centro' } })
    fireEvent.change(screen.getByLabelText('Cidade'), { target: { value: 'Salvador' } })
    fireEvent.change(screen.getByLabelText('Estado (UF)'), { target: { value: 'ba' } })
    fireEvent.click(screen.getByRole('radio', { name: /Entrega expressa/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Continuar para revisão' }))

    expect(screen.getByRole('radio', { name: /Entrega expressa/ })).toBeChecked()
    expect(screen.getByRole('button', { name: 'Entrega conferida' })).toBeInTheDocument()
    expect(screen.getByText(/prazo e valor do frete serão validados pelo backend/i)).toBeInTheDocument()
  })
})
